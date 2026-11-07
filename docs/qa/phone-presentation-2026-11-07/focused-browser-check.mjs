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
  { href: '/projects/', label: 'Apps' },
  { href: '/docs/', label: 'Docs' },
  { href: '/about/', label: 'About' },
];
const platformLinks = [{ href: '/android/', label: 'Android' }, { href: '/pebble/', label: 'PebbleOS' }];
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
    '--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--disable-features=PaintHolding',
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
  const image = await client.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false, fromSurface: false });
  fs.writeFileSync(path.join(output, name + '.png'), Buffer.from(image.data, 'base64'));
  screenshots.push(name + '.png');
  console.log(JSON.stringify({ screenshot: path.join(output, name + '.png') }));
}

function passed(name, extra = {}) { checks.push({ name, passed: true, ...extra }); }



const observations=[];
try {
 await launch();
 for (const [width,appearance,scripts] of [[1440,'light',true],[360,'light',true],[320,'dark',true],[360,'light',false]]) {
  await client.send('Emulation.setScriptExecutionDisabled',{value:!scripts});
  await viewport(width,width>1000?1000:850,width<1000);await media(appearance);
  await navigate('/');
  const home=await client.evaluate(`({phoneCards:document.querySelectorAll('.phone-next').length,planLinks:document.querySelectorAll('main a[href="/projects/phone/"]').length,stages:document.querySelectorAll('.project-direction li').length,overflow:document.documentElement.scrollWidth-innerWidth})`);
  assert.equal(home.phoneCards,0);assert.equal(home.planLinks,0);assert.equal(home.stages,3);assert.ok(home.overflow<=1);
  await client.evaluate("document.querySelector('.project-direction').scrollIntoView({block:'center',behavior:'instant'})");
  await screenshot('home-direction-'+width+'-'+appearance+(scripts?'':'-no-js'));
  await navigate('/projects/?platform=Android');
  const catalogue=await client.evaluate(`({cards:[...document.querySelectorAll('[data-project-card]')].filter(el=>el.getClientRects().length).map(el=>el.querySelector('h3 a').getAttribute('href')),plans:document.querySelectorAll('[data-project-card][data-project-availability="planned"]').length,filters:document.querySelectorAll('[data-project-filter]').length,count:document.querySelector('[data-project-count]').textContent.trim(),overflow:document.documentElement.scrollWidth-innerWidth})`);
  assert.deepEqual(catalogue.cards,['/projects/dynamic/','/projects/dashboard/','/projects/timer/','/projects/open-activity/']);assert.equal(catalogue.plans,0);assert.equal(catalogue.filters,0);assert.equal(catalogue.count,'4 downloads');assert.ok(catalogue.overflow<=1);
  await screenshot('software-'+width+'-'+appearance+(scripts?'':'-no-js'));
  if(scripts&&width===1440){
   await click('[data-search-open]');
   await client.evaluate(`(()=>{const input=document.querySelector('[data-search-input]');input.value='Phone';input.dispatchEvent(new Event('input',{bubbles:true}));})()`);
   await until(`!!document.querySelector('[data-search-results] a[href="/about/#phone-plan"]')`,'Phone plan found within About');
   await click('[data-search-results] a[href="/about/#phone-plan"]');
   await until(`location.pathname==='/about/'&&location.hash==='#phone-plan'&&document.readyState==='complete'`,'Phone search opens contextual About paragraph');
   await settleHash();
  } else {await navigate('/about/#phone-plan');}
  assert.ok(await client.evaluate(`document.getElementById('phone-plan').tagName==='P'&&!!document.querySelector('#phone-plan a[href="/projects/phone/"]')`));
  observations.push({width,appearance,scripts,home,catalogue});
 }
 assert.deepEqual(exceptions,[]);assert.deepEqual(failedResponses,[]);
 fs.writeFileSync(path.join(output,'focused-report.json'),JSON.stringify({passed:true,url:base.href,observations,screenshots,exceptions,failedResponses},null,2)+'\n');
 console.log(JSON.stringify({passed:true,cases:observations.length,screenshots:screenshots.length}));
} finally { await stopBrowser(); }
