#!/usr/bin/env node
// Real Chromium checks of the local site. No external account or device is used.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { projects } = await import(pathToFileURL(path.join(root, 'src/data/projects.ts')).href);
const productCount = projects.filter((project) => project.kind !== 'library').length;
const libraryCount = projects.length - productCount;
const base = new URL(process.env.XOCE_SITE_URL || 'http://127.0.0.1:4321/');
assert.ok(['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname), 'Browser checks are restricted to a local preview.');
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const output = path.resolve(process.env.XOCE_QA_OUTPUT || path.join(root, 'docs/qa', 'browser-' + stamp));
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'xoce-browser-'));
fs.mkdirSync(output, { recursive: true });
const browserLog = path.join(output, 'chromium.log');
const checks = [];
const screenshots = [];
const exceptions = [];
const failedResponses = [];
const browserVersions = [];
let browser;
let client;
let debuggingPort;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class Protocol {
  constructor(socket) {
    this.socket = socket;
    this.pending = new Map();
    this.sequence = 0;
    socket.onmessage = ({ data }) => {
      const message = JSON.parse(data);
      if (message.id) {
        const request = this.pending.get(message.id);
        if (!request) return;
        clearTimeout(request.timer);
        this.pending.delete(message.id);
        if (message.error) request.reject(Error(JSON.stringify(message.error)));
        else request.resolve(message.result);
      } else if (message.method === 'Runtime.exceptionThrown') {
        exceptions.push(message.params.exceptionDetails);
      } else if (message.method === 'Network.responseReceived') {
        const response = message.params.response;
        if (response.url.startsWith(base.origin) && response.status >= 400) {
          failedResponses.push({ url: response.url, status: response.status });
        }
      }
    };
    socket.onclose = () => {
      for (const request of this.pending.values()) {
        clearTimeout(request.timer);
        request.reject(Error('Chromium debugging connection closed'));
      }
      this.pending.clear();
    };
  }
  send(method, params = {}) {
    const id = ++this.sequence;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => { this.pending.delete(id); reject(Error('CDP timeout: ' + method)); }, 15000);
      this.pending.set(id, { resolve, reject, timer });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }
  async evaluate(expression) {
    const response = await this.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    assert.equal(response.exceptionDetails, undefined, JSON.stringify(response.exceptionDetails));
    return response.result.value;
  }
  close() { this.socket.close(); }
}

async function launch() {
  const portFile = path.join(profile, 'DevToolsActivePort');
  fs.rmSync(portFile, { force: true });
  const log = fs.openSync(browserLog, 'a');
  browser = spawn(process.env.CHROMIUM_BINARY || '/usr/bin/chromium', [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage',
    '--disable-background-networking', '--no-first-run', '--remote-debugging-port=0',
    '--user-data-dir=' + profile, 'about:blank',
  ], { stdio: ['ignore', log, log], detached: true });
  fs.closeSync(log);
  let spawnFailure;
  browser.once('error', (error) => { spawnFailure = error; });
  for (let step = 0; step < 200 && !fs.existsSync(portFile); step++) {
    if (spawnFailure) throw spawnFailure;
    if (browser.exitCode !== null) throw Error(fs.readFileSync(browserLog, 'utf8').slice(-2200));
    await delay(50);
  }
  assert.ok(fs.existsSync(portFile), 'Chromium debugging socket unavailable; inspect chromium.log.');
  debuggingPort = fs.readFileSync(portFile, 'utf8').split('\n')[0];
  const tabs = await (await fetch('http://127.0.0.1:' + debuggingPort + '/json')).json();
  const socket = new WebSocket(tabs.find((tab) => tab.type === 'page').webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  client = new Protocol(socket);
  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('Network.enable');
  browserVersions.push(await client.send('Browser.getVersion'));
}

async function stopBrowser() {
  if (!browser) return;
  try { await client?.send('Browser.close'); } catch { /* Closing Chromium also closes CDP. */ }
  for (let step = 0; step < 100 && browser.exitCode === null; step++) await delay(25);
  if (browser.exitCode === null) {
    try { process.kill(-browser.pid, 'SIGTERM'); } catch { browser.kill('SIGTERM'); }
  }
  client?.close();
}

async function until(expression, name) {
  for (let step = 0; step < 150; step++) {
    if (await client.evaluate(expression)) return;
    await delay(40);
  }
  throw Error('Timed out: ' + name);
}

async function viewport(width, height, mobile = false) {
  await client.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
  await client.send('Emulation.setTouchEmulationEnabled', { enabled: mobile });
}

async function media(color = 'light', motion = 'no-preference') {
  await client.send('Emulation.setEmulatedMedia', { features: [
    { name: 'prefers-color-scheme', value: color },
    { name: 'prefers-reduced-motion', value: motion },
  ] });
}

async function navigate(route) {
  const url = new URL(route, base);
  await client.send('Page.navigate', { url: url.href });
  await until(`location.pathname===${JSON.stringify(url.pathname)} && document.readyState==='complete'`, 'page ' + route);
  await client.evaluate('document.fonts.ready.then(()=>true)');
}

async function click(selector) {
  const point = await client.evaluate(`(()=>{const element=Array.from(document.querySelectorAll(${JSON.stringify(selector)})).find(el=>el.getClientRects().length>0&&getComputedStyle(el).visibility!=='hidden');
    if(!element)throw Error('Missing '+${JSON.stringify(selector)});element.scrollIntoView({block:'center'});
    const box=element.getBoundingClientRect();if(!box.width||!box.height)throw Error('Hidden '+${JSON.stringify(selector)});
    return{x:box.x+box.width/2,y:box.y+box.height/2};})()`);
  await client.send('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...point });
  await client.send('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, ...point });
}

async function key(key, code = key, modifiers = 0, text) {
  const virtualKeys = { Escape: 27, Tab: 9, Enter: 13, ArrowLeft: 37, ArrowUp: 38, ArrowRight: 39, ArrowDown: 40, KeyK: 75, Slash: 191 };
  const windowsVirtualKeyCode = virtualKeys[code];
  const keyboard = { key, code, modifiers, ...(windowsVirtualKeyCode ? { windowsVirtualKeyCode } : {}) };
  await client.send('Input.dispatchKeyEvent', { type: 'keyDown', ...keyboard, ...(text ? { text } : {}) });
  await client.send('Input.dispatchKeyEvent', { type: 'keyUp', ...keyboard });
}

async function screenshot(name) {
  const image = await client.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  fs.writeFileSync(path.join(output, name + '.png'), Buffer.from(image.data, 'base64'));
  screenshots.push(name + '.png');
  console.log(JSON.stringify({ screenshot: path.join(output, name + '.png') }));
}

function passed(name, extra = {}) { checks.push({ name, passed: true, ...extra }); }

async function theme(value) {
  await client.evaluate(`(()=>{const select=document.querySelector('[data-theme-select]');
    if(!select)throw Error('Missing theme control');select.value=${JSON.stringify(value)};
    select.dispatchEvent(new Event('change',{bubbles:true}));return true;})()`);
}

async function noOverflow(route, width) {
  const state = await client.evaluate(`({width:innerWidth,scroll:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth),
    headings:document.querySelectorAll('h1').length,main:!!document.querySelector('main'),title:document.title})`);
  assert.ok(state.scroll <= state.width + 1, `${route} overflows at ${width}px: ${JSON.stringify(state)}`);
  assert.equal(state.headings, 1, route + ' needs one main heading');
  assert.ok(state.main && state.title.includes('XOCE'), route + ' lacks accessible page structure');
}

function routesFromBuild() {
  function walk(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      const filename = path.join(directory, entry.name);
      return entry.isDirectory() ? walk(filename) : [filename];
    });
  }
  const dist = path.join(root, 'dist');
  assert.ok(fs.existsSync(dist), 'Build the site before browser QA.');
  return walk(dist).filter((file) => file.endsWith('index.html')).map((file) => {
    const relative = path.relative(dist, file).split(path.sep).join('/');
    return relative === 'index.html' ? '/' : '/' + relative.replace(/index\.html$/, '');
  });
}

async function runChecks() {
  const response = await fetch(base);
  assert.equal(response.status, 200, 'Start npm run dev or npm run preview first.');
  await launch();
  await viewport(1440, 1000);
  await media('light');
  await navigate('/');
  await until(`document.documentElement.dataset.theme==='light'`, 'system light theme');
  assert.equal(await client.evaluate(`localStorage.getItem('xoce-theme')`), null);
  assert.equal(await client.evaluate(`document.activeElement.matches('input,textarea')`), false, 'Do not focus a text field on page load.');
  await screenshot('home-desktop-light');
  await viewport(360, 800, true);
  await noOverflow('/', 360);
  await screenshot('home-mobile-light');
  await viewport(1440, 1000);
  passed('System appearance and initial focus');

  await theme('dark');
  await until(`document.documentElement.dataset.theme==='dark'`, 'manual dark theme');
  assert.equal(await client.evaluate(`localStorage.getItem('xoce-theme')`), 'dark');
  await navigate('/docs/');
  assert.equal(await client.evaluate('document.documentElement.dataset.theme'), 'dark');
  await client.send('Page.reload');
  await until(`document.readyState==='complete' && document.documentElement.dataset.theme==='dark'`, 'saved theme after reload');
  await screenshot('docs-desktop-dark');
  await stopBrowser();
  await launch();
  await viewport(1440, 1000);
  await media('light');
  await navigate('/');
  assert.equal(await client.evaluate('document.documentElement.dataset.theme'), 'dark', 'Manual theme must survive closing and reopening Chromium.');
  passed('Manual appearance persists across routes, reload and browser restart');

  await theme('system');
  await until(`document.documentElement.dataset.theme==='light'`, 'restore system appearance');
  assert.equal(await client.evaluate(`localStorage.getItem('xoce-theme')`), null);
  await media('dark');
  await until(`document.documentElement.dataset.theme==='dark'`, 'follow changed system appearance');
  await media('light');
  await until(`document.documentElement.dataset.theme==='light'`, 'follow light system appearance');
  passed('System choice removes manual override and follows OS appearance');

  await navigate('/projects/');
  const visibleKinds = `Array.from(document.querySelectorAll('[data-project-card]')).filter(el=>el.getClientRects().length>0).map(el=>el.dataset.projectKind)`;
  assert.equal((await client.evaluate(visibleKinds)).length, projects.length);
  await click('[data-project-filter="apps"]');
  const appKinds = await client.evaluate(visibleKinds);
  assert.equal(appKinds.length, productCount);
  assert.ok(appKinds.every((kind) => kind === 'app' || kind === 'watchface'));
  assert.equal(await client.evaluate(`document.querySelector('[data-project-filter="apps"]').getAttribute('aria-pressed')`), 'true');
  await click('[data-project-filter="libraries"]');
  assert.deepEqual(await client.evaluate(visibleKinds), Array(libraryCount).fill('library'));
  await click('[data-project-filter="all"]');
  assert.equal((await client.evaluate(visibleKinds)).length, projects.length);
  assert.ok(new RegExp('\\b' + projects.length + '\\b').test(await client.evaluate(`document.querySelector('[data-project-count]').textContent`)));
  await screenshot('projects-desktop-light');
  passed('Project filters distinguish installable products from libraries', { products: productCount, libraries: libraryCount });

  await client.evaluate('document.activeElement.blur()');
  await key('k', 'KeyK', 2);
  await until(`document.querySelector('[data-search-dialog]').open`, 'keyboard search');
  await until(`document.activeElement===document.querySelector('[data-search-input]')`, 'requested search focus');
  await until(`document.querySelectorAll('[data-search-results] a').length>0`, 'initial search places');
  const initialResults = await client.evaluate(`Array.from(document.querySelectorAll('[data-search-results] a')).map(a=>a.getAttribute('href'))`);
  await client.send('Input.insertText', { text: 'timer' });
  await until(`document.querySelectorAll('[data-search-results] a').length>0`, 'Timer search results');
  const results = await client.evaluate(`Array.from(document.querySelectorAll('[data-search-results] a')).map(a=>({href:a.getAttribute('href'),text:a.textContent}))`);
  assert.ok(results.every((result) => result.href.startsWith('/docs/') || result.href.startsWith('/projects/')));
  await click('[data-search-clear]');
  await client.send('Input.insertText', { text: 'registerSourceHandler' });
  await until(`Array.from(document.querySelectorAll('[data-search-results] a')).some(a=>a.getAttribute('href')==='/docs/develop/activities/')`, 'full-text API search');
  await click('[data-search-clear]');
  await client.send('Input.insertText', { text: 'zz-no-such-xoce-guide-zz' });
  await until(`document.querySelectorAll('[data-search-results] a').length===0`, 'empty search result');
  assert.ok((await client.evaluate(`document.querySelector('[data-search-status]').textContent.trim()`)).length > 0);
  await click('[data-search-clear]');
  assert.equal(await client.evaluate(`document.querySelector('[data-search-input]').value`), '');
  assert.deepEqual(await client.evaluate(`Array.from(document.querySelectorAll('[data-search-results] a')).map(a=>a.getAttribute('href'))`), initialResults);
  await key('Escape', 'Escape');
  await until(`!document.querySelector('[data-search-dialog]').open`, 'Escape closes search');
  await click('[data-search-open]');
  await key('Escape', 'Escape');
  await until(`!document.querySelector('[data-search-dialog]').open`, 'Escape closes button-opened search');
  assert.ok(await client.evaluate(`document.activeElement.matches('[data-search-open]')`), 'Return focus to the search opener.');
  await key('/', 'Slash', 0, '/');
  await until(`document.querySelector('[data-search-dialog]').open`, 'slash opens search');
  assert.equal(await client.evaluate(`document.querySelector('[data-search-input]').value`), '');
  await client.send('Input.insertText', { text: 'timer' });
  await until(`document.querySelectorAll('[data-search-results] a').length>0`, 'search before navigation');
  const destination = await client.evaluate(`document.querySelector('[data-search-results] a').getAttribute('href')`);
  await click('[data-search-results] a');
  await until(`location.pathname===${JSON.stringify(destination.split('#')[0])} && document.readyState==='complete'`, 'search result navigation');
  passed('Search shortcut, full-text API lookup, no-results state, clear, Escape and actual navigation', { timerResults: results.length });

  await navigate('/projects/dynamic/');
  await screenshot('project-dynamic-desktop-light');
  await navigate('/docs/pebble/setup/');
  await screenshot('setup-guide-desktop-light');

  const routes = routesFromBuild();
  for (const width of [1440, 360]) {
    await viewport(width, width === 360 ? 800 : 1000, width === 360);
    for (const route of routes) {
      await navigate(route);
      await noOverflow(route, width);
    }
  }
  passed('Every generated route renders without horizontal page overflow', { routes: routes.length, widths: [1440, 360] });

  await navigate('/');
  await click('[data-menu-toggle]');
  assert.equal(await client.evaluate(`document.querySelector('[data-menu-toggle]').getAttribute('aria-expanded')`), 'true');
  assert.ok(await client.evaluate(`(()=>{const nav=document.querySelector('[data-site-nav]');const style=getComputedStyle(nav);return nav.getClientRects().length>0&&style.visibility!=='hidden'&&style.display!=='none';})()`));
  await key('Escape', 'Escape');
  await until(`document.querySelector('[data-menu-toggle]').getAttribute('aria-expanded')==='false'`, 'Escape closes mobile menu');
  await click('[data-menu-toggle]');
  await click('[data-site-nav] a[href="/projects/"]');
  await until(`location.pathname==='/projects/' && document.readyState==='complete'`, 'mobile menu navigation');
  assert.equal(await client.evaluate(`document.querySelector('[data-menu-toggle]').getAttribute('aria-expanded')`), 'false');
  await navigate('/');
  await media('dark');
  await screenshot('home-mobile-dark');
  await click('[data-search-open]');
  await client.send('Input.insertText', { text: 'timer' });
  await screenshot('search-mobile-dark');
  await key('Escape', 'Escape');
  passed('Mobile navigation opens, closes and reaches its destination');

  await viewport(1440, 1000);
  await media('light', 'reduce');
  await navigate('/lab/');
  await until(`!!document.querySelector('[data-window="notes"]')?.style.left`, 'workspace initial layout');
  const position = `(()=>{const window=document.querySelector('[data-window="notes"]');return{x:parseFloat(window.style.left),y:parseFloat(window.style.top)};})()`;
  const initialPosition = await client.evaluate(position);
  await client.evaluate(`document.querySelector('[data-window="notes"]').focus()`);
  await key('ArrowRight', 'ArrowRight');
  await key('ArrowDown', 'ArrowDown');
  assert.deepEqual(await client.evaluate(position), { x: initialPosition.x + 12, y: initialPosition.y + 12 });
  await click('[data-workspace-reset]');
  assert.deepEqual(await client.evaluate(position), initialPosition);
  const drag = await client.evaluate(`(()=>{const title=document.querySelector('[data-window="notes"] .window-title');title.scrollIntoView({block:'center'});const box=title.getBoundingClientRect();return{x:box.left+30,y:box.top+box.height/2};})()`);
  await client.send('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...drag });
  await client.send('Input.dispatchMouseEvent', { type: 'mouseMoved', button: 'left', buttons: 1, x: drag.x + 30, y: drag.y + 24 });
  await client.send('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, x: drag.x + 30, y: drag.y + 24 });
  assert.deepEqual(await client.evaluate(position), { x: initialPosition.x + 30, y: initialPosition.y + 24 });
  await click('[data-workspace-reset]');
  assert.deepEqual(await client.evaluate(position), initialPosition);
  const unboundedWindows = await client.evaluate(`Array.from(document.querySelectorAll('[data-window]')).filter(el=>{const canvas=el.closest('[data-workspace-canvas]');const x=parseFloat(el.style.left),y=parseFloat(el.style.top);return x<0||y<0||x+el.offsetWidth>canvas.clientWidth+1||y+el.offsetHeight>canvas.clientHeight+1;}).map(el=>el.dataset.window)`);
  assert.deepEqual(unboundedWindows, []);
  passed('Workspace study supports keyboard movement, pointer drag and reset within its bounds');
  const motion = await client.evaluate(`Array.from(document.querySelectorAll('*')).filter(el=>el.getClientRects().length>0).flatMap(el=>{
    const style=getComputedStyle(el);const durations=[...style.animationDuration.split(','),...style.transitionDuration.split(',')].map(x=>parseFloat(x)||0);
    return Math.max(...durations)>.1?[{tag:el.tagName,class:el.className,durations}]:[];})`);
  assert.deepEqual(motion, [], 'Respect reduced motion for animations and transitions.');
  await screenshot('lab-desktop-reduced-motion');
  passed('Reduced-motion preference');

  await client.send('Emulation.setScriptExecutionDisabled', { value: true });
  for (const route of ['/', '/projects/', '/docs/']) {
    await navigate(route);
    assert.ok(await client.evaluate(`document.querySelector('main').innerText.trim().length>100`), 'Primary content must exist without client JavaScript.');
  }
  await viewport(360, 800, true);
  await navigate('/docs/getting-started/');
  assert.ok(await client.evaluate(`(()=>{const nav=document.querySelector('[data-site-nav]');const style=getComputedStyle(nav);return nav.getClientRects().length>0&&style.visibility!=='hidden'&&style.display!=='none';})()`), 'Global navigation must remain available without JavaScript.');
  await click('.docs-mobile-nav summary');
  assert.ok(await client.evaluate(`document.querySelector('.docs-mobile-nav').open`));
  await screenshot('docs-mobile-no-javascript');
  await click('.docs-mobile-nav a[href="/docs/pebble/setup/"]');
  await until(`location.pathname==='/docs/pebble/setup/'&&document.readyState==='complete'`, 'native documentation navigation');
  await click('[data-site-nav] a[href="/projects/"]');
  await until(`location.pathname==='/projects/'&&document.readyState==='complete'`, 'global navigation without JavaScript');
  await noOverflow('/projects/', 360);
  assert.equal((await client.evaluate(visibleKinds)).length, projects.length);
  assert.ok(await client.evaluate(`Array.from(document.querySelectorAll('[data-project-filter],[data-search-open]')).every(el=>!el.getClientRects().length||getComputedStyle(el).display==='none')`), 'Hide controls that require JavaScript when scripting is disabled.');
  await navigate('/lab/');
  await noOverflow('/lab/', 360);
  const staticWindows = await client.evaluate(`Array.from(document.querySelectorAll('[data-window]')).map(el=>{const rect=el.getBoundingClientRect();return{top:rect.top,bottom:rect.bottom};}).sort((a,b)=>a.top-b.top)`);
  assert.equal(staticWindows.length, 3);
  assert.ok(staticWindows.every((rect, index) => index === 0 || rect.top >= staticWindows[index - 1].bottom - 1), 'Mobile study content must stack without JavaScript.');
  await screenshot('lab-mobile-no-javascript');
  await client.send('Emulation.setScriptExecutionDisabled', { value: false });
  passed('Core content, mobile navigation and static Lab remain usable without browser JavaScript');
  assert.deepEqual(exceptions, [], 'Unexpected browser JavaScript errors');
  assert.deepEqual(failedResponses, [], 'Missing local pages or assets');
  passed('No browser exceptions or local HTTP failures');
}

let failure;
try { await runChecks(); }
catch (error) {
  failure = error;
  try { if (client) await screenshot('failure'); } catch { /* Chromium may not have started. */ }
} finally {
  await stopBrowser();
  const report = { passed: !failure, checkedAt: new Date().toISOString(), url: base.href,
    evidence: 'Automated Chromium desktop/mobile viewport checks; no physical-device testing.',
    browserProfile: profile, browserVersions, checks, screenshots, exceptions, failedResponses,
    ...(failure ? { error: failure.stack } : {}) };
  fs.writeFileSync(path.join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ passed: !failure, checks: checks.length, screenshots: screenshots.length, output }, null, 2));
  if (failure) { console.error(failure.stack); process.exitCode = 1; }
}
