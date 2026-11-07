#!/usr/bin/env node
// Real Chromium checks of the local site. No external account or device is used.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = '/home/xela/Projekty/Pebble/xoce';
const { projects } = await import(pathToFileURL(path.join(root, 'src/data/projects.ts')).href);
const products = projects.filter((project) => project.kind !== 'library');
const productCount = products.length;
const libraryCount = projects.length - productCount;
const mainSections = [
  { href: '/docs/', label: 'Docs' },
  { href: '/about/', label: 'About' },
];
const platformLinks = [{ href: '/android/', label: 'Android' }, { href: '/pebble/', label: 'PebbleOS' }, { href: '/projects/', label: 'All apps' }];
const visualRoutes = ['/', '/projects/', '/projects/dynamic/', '/projects/phone/',
  '/android/', '/pebble/', '/docs/', '/docs/develop/building/', '/docs/design/principles/', '/about/',
  '/docs/pebble/setup/', '/docs/develop/activities/', '/docs/design/visual-identity/', '/docs/android/phone/'];
const retiredPortals = { '/users/': '/docs/', '/developers/': '/docs/develop/activities/', '/design/': '/docs/design/principles/' };
const legacyFragments = { '/users/': { pebble: '/docs/pebble/setup/', android: '/docs/android/phone/', apps: '/docs/#choose-what-you-need' }, '/developers/': { build: '/docs/develop/building/#build-and-test', android: '/docs/develop/building/#android-scope', libraries: '/docs/develop/building/#libraries-and-consumers' }, '/design/': { 'android-design-scope': '/docs/design/principles/' } };
const isArticle = route => route.startsWith('/docs/');
const guideContents = 'details[data-guide-contents]';
const designGuides = ['/docs/design/principles/', '/docs/design/visual-identity/',
  '/docs/design/ui-patterns/', '/docs/design/interaction/'];
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
  const redirect = retiredPortals[url.pathname];
  const target = redirect ? new URL(legacyFragments[url.pathname]?.[url.hash.slice(1)] ? legacyFragments[url.pathname][url.hash.slice(1)] : redirect, base) : url;
  await until(`location.pathname===${JSON.stringify(target.pathname)} && location.hash===${JSON.stringify(target.hash)} && document.readyState==='complete'`, 'page ' + route);
  await client.evaluate('document.fonts.ready.then(()=>true)');
  await settleHash();
}

async function settleHash() {
  const fragment = await client.evaluate('location.hash');
  if (!fragment) return;
  const identifier = decodeURIComponent(fragment.slice(1));
  let previous, stable = 0;
  for (let step = 0; step < 100; step++) {
    const state = await client.evaluate(`(()=>{const target=document.getElementById(${JSON.stringify(identifier)});if(!target)return null;return{scroll:scrollY,top:target.getBoundingClientRect().top,header:Math.max(0,document.querySelector('.site-header').getBoundingClientRect().bottom),height:innerHeight};})()`);
    assert.ok(state, 'Fragment has a real destination: ' + fragment);
    stable = previous !== undefined && Math.abs(state.scroll - previous) < .5 ? stable + 1 : 0;
    if (stable >= 3) {
      assert.ok(state.top >= state.header - 1 && state.top < state.height - 44, 'Fragment destination is visible after scrolling settles: ' + JSON.stringify(state));
      return;
    }
    previous = state.scroll;
    await delay(40);
  }
  throw Error('Fragment scroll did not settle: ' + fragment);
}

async function click(selector) {
  const point = await client.evaluate(`(()=>{const element=Array.from(document.querySelectorAll(${JSON.stringify(selector)})).find(el=>el.getClientRects().length>0&&getComputedStyle(el).visibility!=='hidden');
    if(!element)throw Error('Missing '+${JSON.stringify(selector)});element.scrollIntoView({block:'center',behavior:'instant'});
    const box=element.getBoundingClientRect();if(!box.width||!box.height)throw Error('Hidden '+${JSON.stringify(selector)});
    return{x:box.x+box.width/2,y:box.y+box.height/2};})()`);
  await client.send('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, ...point });
  await client.send('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, ...point });
}

async function key(key, code = key, modifiers = 0, text) {
  const virtualKeys = { Escape: 27, Tab: 9, Enter: 13, ArrowLeft: 37, ArrowUp: 38, ArrowRight: 39, ArrowDown: 40, KeyK: 75, Slash: 191 };
  const windowsVirtualKeyCode = virtualKeys[code];
  const keyboard = { key, code, modifiers, ...(windowsVirtualKeyCode ? { windowsVirtualKeyCode } : {}) };
  // Chromium needs Enter's character to perform native summary/button activation.
  // Keyboard shortcuts keep their original keyDown semantics without text.
  const character = text ?? (key === 'Enter' && modifiers === 0 ? '\r' : undefined);
  await client.send('Input.dispatchKeyEvent', { type: 'keyDown', ...keyboard, ...(character ? { text: character, unmodifiedText: character } : {}) });
  await client.send('Input.dispatchKeyEvent', { type: 'keyUp', ...keyboard });
}

async function screenshot(name) {
  await settleHash();
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
    headings:document.querySelectorAll('h1').length,main:!!document.querySelector('main'),title:document.title,route:location.pathname,ui:document.documentElement.dataset.ui})`);
  assert.ok(state.scroll <= state.width + 1, `${route} overflows at ${width}px: ${JSON.stringify(state)}`);
  assert.equal(state.headings, 1, route + ' needs one main heading');
  assert.ok(state.main && state.title.includes('XOCE'), route + ' lacks accessible page structure');
  assert.equal(state.ui, 'material', route + ' must use the shared website style');
}

async function headerFits(width) {
  await viewport(width, 1000);
  await navigate('/');
  await noOverflow('/', width);
  const collisions = await client.evaluate(`(()=>{
    const elements=[...document.querySelectorAll('.site-header a,.site-header button,.site-header select,.site-header summary')]
      .filter(el=>el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden')
      .map(el=>({label:el.getAttribute('aria-label')||el.textContent.trim(),rect:el.getBoundingClientRect()}));
    return elements.flatMap((a,i)=>elements.slice(i+1).filter(b=>
      Math.min(a.rect.right,b.rect.right)-Math.max(a.rect.left,b.rect.left)>1&&
      Math.min(a.rect.bottom,b.rect.bottom)-Math.max(a.rect.top,b.rect.top)>1
    ).map(b=>[a.label,b.label]));})()`);
  assert.deepEqual(collisions, [], 'Header controls overlap at ' + width + 'px');
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
  return walk(dist).filter((file) => file.endsWith('index.html') || path.basename(file) === '404.html').map((file) => {
    const relative = path.relative(dist, file).split(path.sep).join('/');
    if (relative === '404.html') return '/404.html';
    return relative === 'index.html' ? '/' : '/' + relative.replace(/index\.html$/, '');
  });
}

async function guideContentsJump(scripting = true) {
  assert.equal(await client.evaluate(`document.querySelector(${JSON.stringify(guideContents)})?.tagName`), 'DETAILS', 'Guide contents use a native disclosure.');
  assert.equal(await client.evaluate(`document.querySelector(${JSON.stringify(guideContents)}).open`), false, 'Guide contents start closed.');
  await client.evaluate(`document.querySelector(${JSON.stringify(guideContents + ' summary')}).focus({preventScroll:true})`);
  await key('Enter', 'Enter');
  await until(`document.querySelector(${JSON.stringify(guideContents)}).open`, 'keyboard opens guide contents');
  const destination = await client.evaluate(`(()=>{const links=Array.from(document.querySelectorAll(${JSON.stringify(guideContents + ' a[href^="#"]')})).map(a=>({href:a.getAttribute('href'),target:document.getElementById(decodeURIComponent(a.hash.slice(1)))})).filter(item=>item.target);return(links.find(item=>item.target.getBoundingClientRect().top>innerHeight)||links.at(-1))?.href;})()`);
  assert.ok(destination, 'Contents must link to a real article heading.');
  await click(guideContents + ' a[href=' + JSON.stringify(destination) + ']');
  const heading = `document.getElementById(${JSON.stringify(decodeURIComponent(destination.slice(1)))})`;
  await until(`location.hash===${JSON.stringify(destination)}&&${heading}.getBoundingClientRect().top>=Math.max(0,document.querySelector('.site-header').getBoundingClientRect().bottom)-1&&${heading}.getBoundingClientRect().bottom<=innerHeight`, 'guide anchor remains visible below the actual header');
  if (scripting) await client.evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
  const result = await client.evaluate(`({fragment:location.hash,headingTop:${heading}.getBoundingClientRect().top,headerBottom:document.querySelector('.site-header').getBoundingClientRect().bottom,viewport:innerHeight})`);
  assert.ok(result.headingTop >= Math.max(0, result.headerBottom) - 1, 'The destination must stay on screen and clear any visible header.');
  return { scripting, ...result };
}

async function checkWebsiteDesign() {
  const samples = [], articlePositions = [], jumps = [];
  for (const appearance of ['light', 'dark']) {
    await media(appearance);
    await theme('system');
    for (const width of [1440, 360]) {
      await viewport(width, width === 360 ? 800 : 1000, width === 360);
      for (const route of visualRoutes) {
        await navigate(route);
        await noOverflow(route, width);
        const sample = await client.evaluate(`({background:getComputedStyle(document.documentElement).backgroundColor,headingFont:getComputedStyle(document.querySelector('h1')).fontFamily,interLoaded:document.fonts.check('650 24px "Inter Variable"')})`);
        assert.equal(sample.background, appearance === 'light' ? 'rgb(217, 221, 224)' : 'rgb(22, 26, 28)', 'Every page uses the agreed website palette.');
        assert.match(sample.headingFont, /Inter/);
        assert.doesNotMatch(sample.headingFont, /Space Grotesk/);
        assert.equal(sample.interLoaded, true);
        samples.push({ route, width, appearance, ...sample });
        if (route === '/') {
          const home = await client.evaluate(`({text:document.querySelector('main').innerText,links:Array.from(document.querySelectorAll('main a')).map(a=>({href:a.getAttribute('href'),disabled:a.getAttribute('aria-disabled')}))})`);
          const downloadable = products.filter(project => project.download);
          for (const project of downloadable) assert.ok(home.links.some(link => link.href === project.download && link.disabled !== 'true'), project.name + ' download is directly reachable from home.');
          const knownDownloads = new Set(downloadable.map(project => project.download));
          assert.ok(home.links.filter(link => /\.pbw(?:$|[?#])/i.test(link.href)).every(link => knownDownloads.has(link.href)), 'Home does not invent downloads for planned projects.');
          assert.match(home.text, /\bPhone\b/);
          assert.match(home.text, /\bplanned\b/i);
        } else if (isArticle(route) && width === 360) {
          const reading = await client.evaluate(`({articleTop:document.querySelector('article.prose').getBoundingClientRect().top,viewport:innerHeight,scroll:scrollY,closed:Array.from(document.querySelectorAll('.docs-mobile-nav,[data-guide-contents],[data-apps-menu]')).every(details=>!details.open),text:document.querySelector('article.prose').innerText.trim()})`);
          assert.equal(reading.scroll, 0, 'Opening a guide must not jump the page.');
          assert.equal(reading.closed, true, 'Navigation and contents disclosures are quiet by default.');
          assert.ok(reading.articleTop < reading.viewport - 80, 'Useful article content begins in the first mobile viewport.');
          assert.ok(reading.text.length > 100);
          articlePositions.push({ route, appearance, articleTop: reading.articleTop, viewport: reading.viewport });
        }
        await screenshot('site-' + (route === '/' ? 'home' : route.replace(/^\//, '').replace(/\/$/, '').replaceAll('/', '-').replaceAll('#', '-')) + '-' + (width === 360 ? 'mobile' : 'desktop') + '-' + appearance);
        if (isArticle(route) && width === 360) jumps.push({ route, ...await guideContentsJump() });
      }
    }
  }
  await media('light', 'reduce');
  for (const route of visualRoutes) {
    await navigate(route);
    const motion = await client.evaluate(`Array.from(document.querySelectorAll('*')).filter(el=>el.getClientRects().length>0).filter(el=>{const style=getComputedStyle(el);return [...style.animationDuration.split(','),...style.transitionDuration.split(',')].some(value=>(parseFloat(value)||0)>.1);}).map(el=>({tag:el.tagName,class:el.className}))`);
    assert.deepEqual(motion, [], 'The website respects reduced motion.');
  }
  passed('Whole-site design preserves downloads, planned availability, early mobile reading, native contents, consistent typography/palette and reduced motion', { samples, articlePositions, jumps });
}


const observations=[];
try {
 await launch();
 await viewport(1440,1000);
 for (const appearance of ['light','dark']) {
  await media(appearance);
  await navigate('/');
  await theme('system');
  const point=await client.evaluate(`(()=>{const b=document.querySelector('.featured-download');b.scrollIntoView({block:'center',behavior:'instant'});const r=b.getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};})()`);
  const resting=await client.evaluate(`({shadow:getComputedStyle(document.querySelector('.featured-download')).boxShadow,transform:getComputedStyle(document.querySelector('.featured-download')).transform})`);
  await client.send('Input.dispatchMouseEvent',{type:'mouseMoved',...point});
  await client.send('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...point});
  await delay(100);
  const pressed=await client.evaluate(`({shadow:getComputedStyle(document.querySelector('.featured-download')).boxShadow,transform:getComputedStyle(document.querySelector('.featured-download')).transform})`);
  assert.notEqual(pressed.shadow,resting.shadow,'ABS cap changes from raised contact to pressed inset');
  assert.notEqual(pressed.transform,'none','ABS cap physically depresses');
  await screenshot('abs-pressed-'+appearance);
  await client.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:1400,y:80});
  await client.send('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,x:1400,y:80});
  await navigate('/docs/');
  const materials=await client.evaluate(`({wallpaper:getComputedStyle(document.body,'::before').backgroundImage,animation:getComputedStyle(document.body,'::before').animationName,glassBlur:getComputedStyle(document.querySelector('.docs-sidebar')).backdropFilter,glassBackground:getComputedStyle(document.querySelector('.docs-sidebar')).backgroundColor,abs:getComputedStyle(document.querySelector('.reading-surface')).backgroundImage,well:getComputedStyle(document.querySelector('.document-content')).backgroundColor,wellBlur:getComputedStyle(document.querySelector('.document-content')).backdropFilter})`);
  assert.match(materials.wallpaper,/spatial-silk/);
  assert.equal(materials.animation,'none');
  assert.match(materials.glassBlur,/blur/);
  assert.notEqual(materials.abs,'none');
  assert.equal(materials.wellBlur,'none');
  await client.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-color-scheme',value:appearance},{name:'prefers-reduced-transparency',value:'reduce'}]});
  await client.evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
  const fallback=await client.evaluate(`({requested:matchMedia('(prefers-reduced-transparency:reduce)').matches,blur:getComputedStyle(document.querySelector('.docs-sidebar')).backdropFilter,background:getComputedStyle(document.querySelector('.docs-sidebar')).backgroundColor})`);
  assert.equal(fallback.requested,true);

  assert.equal(fallback.blur,'none');
  await screenshot('reduced-transparency-'+appearance);
  observations.push({appearance,resting,pressed,materials,fallback});
 }
 assert.deepEqual(exceptions,[]);
 assert.deepEqual(failedResponses,[]);
 fs.writeFileSync(path.join(output,'materials-report.json'),JSON.stringify({passed:true,checkedAt:new Date().toISOString(),scope:'Automated Chromium material states and reduced-transparency fallback; screenshots reviewed separately.',observations,screenshots,exceptions,failedResponses},null,2)+'\n');
 console.log(JSON.stringify({passed:true,observations:observations.length,screenshots:screenshots.length}));
} finally { await stopBrowser(); }
