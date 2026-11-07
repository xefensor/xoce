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


try {
 await launch(); await viewport(360,800,true); await media('light');
 for(const [route,name,footer] of [['/projects/open-activity/','extra-open-activity-mobile-light',false],['/projects/activities/','extra-activities-mobile-light',false],['/about/','extra-about-footer-mobile-light',true]]) {
  await client.send('Page.navigate',{url:new URL(route,base).href});
  await until(`document.readyState==='complete'&&location.pathname===${JSON.stringify(route)}`,'page');
  await client.evaluate('document.fonts.ready.then(()=>true)');
  if(footer) await client.evaluate(`document.querySelector('footer').scrollIntoView({block:'start',behavior:'instant'})`);
  await client.evaluate('new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))');
  const shot=await client.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
  fs.writeFileSync(path.join(output,name+'.png'),Buffer.from(shot.data,'base64')); console.log(name);
 }
} finally { await stopBrowser(); }
