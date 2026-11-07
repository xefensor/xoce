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
const products = projects.filter(project => project.kind !== 'library');
const catalogueProducts = products.filter(project => project.availability !== 'planned');
const availableApps = products.filter(project => project.download);
const libraryCount = projects.length - products.length;
const mainSections = [
  { href:'/projects/', label:'Software' },
  { href:'/docs/', label:'Docs' },
  { href:'/about/', label:'About' },
];
const platformLinks = [{ href:'/pebble/', label:'PebbleOS' }];
const visualRoutes = ['/', '/projects/', '/projects/dynamic/', '/projects/dashboard/', '/projects/timer/',
  '/projects/open-activity/', '/projects/phone/', '/pebble/', '/docs/', '/docs/develop/building/',
  '/docs/design/principles/', '/about/', '/docs/pebble/setup/', '/docs/design/visual-identity/'];
const redirects = {
  '/users/':'/docs/', '/developers/':'/docs/develop/activities/', '/design/':'/docs/design/principles/',
  '/android/':'/projects/phone/#android-app', '/projects/pebble-phone/':'/projects/phone/#pebble-companion',
  '/docs/android/phone/':'/projects/phone/', '/docs/pebble/phone-connection/':'/projects/phone/#pebble-companion',
};
const legacyFragments = {
  '/users/':{pebble:'/docs/pebble/setup/',android:'/docs/android/phone/',apps:'/docs/#choose-what-you-need'},
  '/developers/':{build:'/docs/develop/building/#build-and-test',android:'/docs/develop/building/#android-scope',libraries:'/docs/develop/building/#libraries-and-consumers'},
  '/design/':{'android-design-scope':'/docs/design/principles/'},
  '/docs/android/phone/':{'with-or-without-a-watch':'/projects/phone/#android-app',availability:'/projects/phone/#plan-unknowns-title','if-you-also-use-a-pebble':'/projects/phone/#pebble-companion'},
  '/docs/pebble/phone-connection/':{'what-you-would-need':'/projects/phone/#pebble-companion','availability-and-setup':'/projects/phone/#plan-unknowns-title'},
};
const isArticle = route => route.startsWith('/docs/') && !Object.hasOwn(redirects, route);
const guideContents = 'details[data-guide-contents]';
const designGuides = ['/docs/design/principles/', '/docs/design/visual-identity/', '/docs/design/ui-patterns/', '/docs/design/interaction/'];
let scriptingEnabled = true;
const base = new URL(process.env.XOCE_SITE_URL || 'http://127.0.0.1:4321/');
assert.ok(['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname), 'Browser checks are restricted to a local preview.');
const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const output = path.resolve(process.env.XOCE_QA_OUTPUT || path.join(root, 'build/qa', 'browser-' + stamp));
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

async function media(color = 'light', motion = 'no-preference', transparency = 'no-preference') {
  await client.send('Emulation.setEmulatedMedia', { features: [
    { name: 'prefers-color-scheme', value: color },
    { name: 'prefers-reduced-motion', value: motion },
    { name: 'prefers-reduced-transparency', value: transparency },
  ] });
}

function resolvedTarget(route, scripts = scriptingEnabled) {
  let target = new URL(route, base);
  for (let step=0; step<10 && Object.hasOwn(redirects,target.pathname); step++) {
    const fragment = target.hash.slice(1);
    const mapped = scripts && legacyFragments[target.pathname]?.[fragment];
    target = new URL(mapped || redirects[target.pathname], base);
  }
  return target;
}
async function navigate(route) {
  const target = resolvedTarget(route);
  await client.send('Page.navigate', {url:new URL(route,base).href});
  await until(`location.pathname===${JSON.stringify(target.pathname)} && location.hash===${JSON.stringify(target.hash)} && document.readyState==='complete'`, 'page '+route);
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

async function checkHomeOverview() {
  const state = await client.evaluate(`(()=>{
    const main=document.querySelector('main'),intro=main.querySelector('.home-intro');
    return {text:main.innerText,intro:intro?.innerText??'',title:intro?.querySelector('h1')?.textContent??'',
      links:Array.from(main.querySelectorAll('a[href]')).map(a=>a.getAttribute('href')),
      previews:Array.from(main.querySelectorAll('input[name="watch-preview"]')).map(input=>({value:input.value,label:input.getAttribute('aria-label')}))};
  })()`);
  for (const device of ['desktop','phone','watch']) assert.ok(state.intro.includes(device),'The introduction explains the '+device+' scope.');
  for (const href of ['/projects/','/docs/','/docs/develop/building/','/about/']) assert.ok(state.links.includes(href),'Home has a direct path to '+href);
  assert.deepEqual(state.previews.map(item=>item.value),availableApps.map(project=>project.slug),'Visitors can explore every current watch app.');
  assert.ok(state.previews.every(item=>item.label?.length),'Watch preview choices have accessible names.');
  assert.match(state.text,/future goal|working towards/i,'The connected-device experience remains identifiable as future work.');
  assert.equal(state.links.includes('/projects/phone/'),false,'Home does not feature the planned Phone app.');
}

async function checkWatchSelection(slug) {
  const project = availableApps.find(item=>item.slug===slug);
  await until(`(()=>{const stage=Array.from(document.querySelectorAll('[data-watch-preview]')).find(el=>el.getClientRects().length>0);const img=stage?.querySelector('img');return stage?.dataset.watchPreview===${JSON.stringify(slug)}&&img?.complete&&img?.naturalWidth===200;})()`, 'visible '+project.name+' watch screen');
  const state = await client.evaluate(`(()=>{const stages=Array.from(document.querySelectorAll('[data-watch-preview]')).filter(el=>el.getClientRects().length>0);const stage=stages[0],img=stage?.querySelector('img');return{selected:document.querySelector('input[name="watch-preview"]:checked')?.value,visible:stages.length,screen:img?.getAttribute('src'),width:img?.naturalWidth,height:img?.naturalHeight,link:stage?.querySelector('a')?.getAttribute('href')};})()`);
  assert.equal(state.selected,slug);
  assert.equal(state.visible,1,'Only the chosen app screen is presented.');
  assert.equal(state.screen,project.image,'Show the real native capture for '+project.name);
  assert.equal(state.width,200); assert.equal(state.height,228);
  assert.equal(state.link,`/projects/${slug}/`,'The selected screen links to its own product.');
}
async function checkWatchShowcase(scripts=true) {
  await navigate('/');
  await checkWatchSelection('dynamic');
  for (const project of availableApps) {
    await click(`.watch-choices label[for="preview-${project.slug}"]`);
    await checkWatchSelection(project.slug);
  }
  await click('.watch-choices label[for="preview-dynamic"]');
  await client.evaluate(`document.getElementById('preview-dynamic').focus({preventScroll:true})`);
  await key('ArrowRight','ArrowRight');
  await checkWatchSelection('dashboard');
  assert.equal(await client.evaluate(`document.activeElement.id`),'preview-dashboard','Native radio keyboard navigation keeps focus with the selected choice.');
  const outline=await client.evaluate(`getComputedStyle(document.querySelector('.watch-choices label[for="preview-dashboard"]')).outlineStyle`);
  assert.notEqual(outline,'none','Keyboard selection has visible focus.');
  await key('ArrowLeft','ArrowLeft');
  await checkWatchSelection('dynamic');
  await screenshot('watch-showcase-'+(scripts?'keyboard':'no-javascript'));
  passed('Watch previews use real screens and support pointer, keyboard and visible focus'+(scripts?'':' without JavaScript'));
}
async function followHomeToDownloads() {
  await checkHomeOverview();
  await click('.intro-actions a[href="/projects/"]');
  await until(`location.pathname==='/projects/'&&document.readyState==='complete'`,'Home reaches Software');
  const links=await client.evaluate(`Array.from(document.querySelectorAll('[data-project-group="available"] a')).filter(a=>a.getClientRects().length>0).map(a=>a.getAttribute('href'))`);
  for (const project of availableApps) assert.ok(links.includes(project.download),'The Software journey exposes the exact '+project.name+' download.');
  const known=new Set(availableApps.map(project=>project.download));
  assert.ok(links.filter(href=>/\.pbw(?:$|[?#])/i.test(href)).every(href=>known.has(href)),'No invented watch downloads.');
}

async function checkWebsiteDesign() {
  const samples=[], articlePositions=[], jumps=[];
  for (const appearance of ['light','dark']) {
    await media(appearance);
    await theme('system');
    for (const width of [1440,360]) {
      await viewport(width,width===360?800:1000,width===360);
      for (const route of visualRoutes) {
        await navigate(route);
        await noOverflow(route,width);
        const sample=await client.evaluate(`({background:getComputedStyle(document.documentElement).backgroundColor,headingFont:getComputedStyle(document.querySelector('h1')).fontFamily,interLoaded:document.fonts.check('600 24px "Inter Variable"'),theme:document.documentElement.dataset.theme})`);
        assert.equal(sample.theme,appearance,'Every page follows the selected appearance.');
        assert.match(sample.headingFont,/Inter/); assert.equal(sample.interLoaded,true);
        samples.push({route,width,appearance,...sample});
        if (isArticle(route)&&width===360) {
          const reading=await client.evaluate(`({articleTop:document.querySelector('article.prose').getBoundingClientRect().top,viewport:innerHeight,scroll:scrollY,closed:Array.from(document.querySelectorAll('.docs-mobile-nav,[data-guide-contents]')).every(details=>!details.open),menuClosed:document.querySelector('[data-menu-toggle]').getAttribute('aria-expanded')==='false'})`);
          assert.equal(reading.scroll,0,'Opening an article does not jump the page.');
          assert.equal(reading.closed,true,'Reading begins with navigation disclosures closed.');
          assert.equal(reading.menuClosed,true);
          assert.ok(reading.articleTop<reading.viewport-80,'Useful article content starts in the first mobile viewport.');
          articlePositions.push({route,appearance,...reading});
        }
        await screenshot('site-'+(route==='/'?'home':route.replace(/^\//,'').replace(/\/$/,'').replaceAll('/','-'))+'-'+(width===360?'mobile':'desktop')+'-'+appearance);
        if (isArticle(route)&&width===360) jumps.push({route,...await guideContentsJump()});
      }
    }
  }
  for (const route of visualRoutes) {
    const light=samples.find(item=>item.route===route&&item.appearance==='light');
    const dark=samples.find(item=>item.route===route&&item.appearance==='dark');
    assert.notEqual(light.background,dark.background,'Light and dark appearances remain distinct on '+route);
  }
  passed('Whole-site desktop/mobile reading, typography, theme and native contents navigation',{samples,articlePositions,jumps});
  await viewport(1440,1000);
  await media('light','reduce');
  for (const route of visualRoutes) {
    await navigate(route);
    const motion=await client.evaluate(`Array.from(document.querySelectorAll('*')).filter(el=>el.getClientRects().length>0).filter(el=>{const s=getComputedStyle(el);return [...s.animationDuration.split(','),...s.transitionDuration.split(',')].some(value=>(parseFloat(value)||0)>.1);}).map(el=>({tag:el.tagName,class:el.className}))`);
    assert.deepEqual(motion,[],'Reduced-motion preference on '+route);
  }
  await screenshot('site-reduced-motion');
  passed('Reduced motion across all representative page types');
  await media('light','no-preference','reduce');
  for (const route of ['/','/projects/','/projects/dynamic/','/projects/phone/','/pebble/','/docs/','/about/']) {
    await navigate(route);
    assert.equal(await client.evaluate(`matchMedia('(prefers-reduced-transparency:reduce)').matches`),true);
    const blurred=await client.evaluate(`Array.from(document.querySelectorAll('*')).filter(el=>el.getClientRects().length>0&&getComputedStyle(el).backdropFilter!=='none').map(el=>({tag:el.tagName,class:el.className}))`);
    assert.deepEqual(blurred,[],'Reduced transparency disables background blur on '+route);
    const transparent=await client.evaluate(`Array.from(document.querySelectorAll('.glass,.site-header,.available-group,.product-preview,.phone-plan,.watch-requirements,.product-guides,.reading-surface')).filter(el=>el.getClientRects().length>0).filter(el=>{const c=getComputedStyle(el).backgroundColor;return c==='transparent'||(/^rgba\\(/.test(c)&&Number(c.slice(c.lastIndexOf(',')+1,-1))<.99);}).map(el=>({class:el.className,color:getComputedStyle(el).backgroundColor}))`);
    assert.deepEqual(transparent,[],'Reading surfaces become opaque on '+route);
  }
  await screenshot('site-reduced-transparency');
  passed('Reduced transparency supplies opaque surfaces and disables blur');
  await media('light');
}

async function runChecks() {
  assert.equal((await fetch(base)).status,200,'Start the local dev or preview server first.');
  await launch();
  await viewport(1440,1000); await media('light'); await navigate('/');
  await until(`document.documentElement.dataset.theme==='light'`,'system light theme');
  assert.equal(await client.evaluate(`localStorage.getItem('xoce-theme')`),null);
  assert.equal(await client.evaluate(`document.activeElement.matches('input,textarea')`),false,'Page load does not focus a text field.');
  await screenshot('home-desktop-light');
  await viewport(360,800,true); await noOverflow('/',360); await screenshot('home-mobile-light');
  await viewport(1440,1000);
  passed('System appearance and initial focus');

  const navigation=await client.evaluate(`Array.from(document.querySelectorAll('[data-site-nav] > a')).map(a=>({href:a.getAttribute('href'),label:a.textContent.trim()}))`);
  assert.deepEqual(navigation,mainSections,'Software, Docs and About are direct links.');
  for (const item of platformLinks) assert.ok(await client.evaluate(`Array.from(document.querySelectorAll('.site-footer a')).some(a=>a.getAttribute('href')===${JSON.stringify(item.href)}&&a.textContent.includes(${JSON.stringify(item.label)}))`),'Footer retains '+item.label);
  await client.evaluate(`document.querySelector('[data-site-nav] > a[href="/projects/"]').focus({preventScroll:true})`);
  await key('Tab','Tab'); assert.equal(await client.evaluate(`document.activeElement.getAttribute('href')`),'/docs/');
  await key('Tab','Tab',8); assert.equal(await client.evaluate(`document.activeElement.getAttribute('href')`),'/projects/');
  await key('Enter','Enter'); await until(`location.pathname==='/projects/'&&document.readyState==='complete'`,'keyboard follows Software');
  assert.equal(await client.evaluate(`document.querySelector('[data-site-nav] > a[href="/projects/"]').getAttribute('aria-current')`),'page');
  passed('Direct navigation supports keyboard links and platform access');
  await navigate('/'); await followHomeToDownloads();
  passed('Homepage reaches all exact current downloads');
  await checkWatchShowcase();

  const index=await(await fetch(new URL('/search.json',base))).json();
  const aliases=Object.keys(redirects);
  for (const href of ['/projects/','/pebble/','/docs/','/about/','/about/#phone-plan','/docs/develop/building/',...designGuides,...projects.filter(project=>project.availability!=='planned').map(project=>`/projects/${project.slug}/`)]) assert.ok(index.some(entry=>entry.href===href),'Search includes '+href);
  assert.equal(index.some(entry=>products.filter(project=>project.availability==='planned').some(project=>entry.href===`/projects/${project.slug}/`)),false,'Plans are discoverable as project direction, rather than software listings.');
  assert.equal(index.some(entry=>aliases.includes(entry.href)||entry.href.startsWith('/lab/')),false,'Search uses canonical destinations.');
  const bookmarks=[...Object.keys(redirects),'/users/#android','/users/#apps','/developers/#build','/developers/#android','/docs/android/phone/#with-or-without-a-watch','/docs/android/phone/#if-you-also-use-a-pebble','/docs/pebble/phone-connection/#availability-and-setup'];
  for (const route of bookmarks) {
    await navigate(route);
    const target=resolvedTarget(route);
    assert.equal(await client.evaluate('location.pathname+location.hash'),target.pathname+target.hash,'Old bookmarks reach the relevant canonical content.');
  }
  passed('Former portals, Phone plans and legacy fragment bookmarks resolve directly');

  await navigate('/'); await click('#main a[href="/docs/"]');
  await until(`location.pathname==='/docs/'&&document.readyState==='complete'`,'Home opens actual Docs');
  assert.ok(await client.evaluate(`!!document.querySelector('main article.prose')&&document.querySelector('main h1').textContent==='Getting started'&&!document.querySelector('.documentation-hub,.docs-section-overview')`),'Docs opens an article.');
  await click('main a[href="/docs/pebble/controls/"]');
  await until(`location.pathname==='/docs/pebble/controls/'&&!!document.getElementById('timer')&&document.readyState==='complete'`,'user reaches Timer controls');
  await click('.site-footer a[href="/pebble/"]'); await until(`location.pathname==='/pebble/'&&document.readyState==='complete'`,'footer reaches Pebble');
  await click('main a[href="/projects/timer/"]'); await until(`location.pathname==='/projects/timer/'&&document.readyState==='complete'`,'Pebble reaches Timer');
  const timer=projects.find(project=>project.slug==='timer');
  await click(`main a[href="${timer.guide}"]`); await until(`location.pathname===${JSON.stringify(timer.guide.split('#')[0])}&&document.readyState==='complete'`,'Timer controls guide'); await settleHash();
  await click('[data-site-nav] a[href="/docs/"]'); await until(`location.pathname==='/docs/'&&document.readyState==='complete'`,'Docs from a guide');
  await click('.docs-sidebar [data-docs-section="Developers"] > summary'); await click('.docs-sidebar a[href="/docs/develop/activities/"]');
  await until(`location.pathname==='/docs/develop/activities/'&&document.readyState==='complete'`,'developer reference');
  assert.deepEqual(await client.evaluate(`Array.from(document.querySelectorAll('.docs-sidebar [data-docs-section]')).map(el=>({section:el.dataset.docsSection,open:el.open}))`),[{section:'Guides',open:false},{section:'Developers',open:true},{section:'Design',open:false}]);
  await click('.docs-sidebar [data-docs-section="Design"] > summary'); await click('.docs-sidebar a[href="/docs/design/principles/"]');
  await until(`location.pathname==='/docs/design/principles/'&&document.readyState==='complete'`,'design reference');
  for (const width of [768,900,1024,1440]) await headerFits(width);
  passed('Actual user, developer and design articles share direct Docs navigation; headers fit intermediate widths');

  await theme('dark'); await until(`document.documentElement.dataset.theme==='dark'`,'manual dark');
  assert.equal(await client.evaluate(`localStorage.getItem('xoce-theme')`),'dark');
  await navigate('/docs/'); assert.equal(await client.evaluate('document.documentElement.dataset.theme'),'dark');
  const priorDocument=await client.evaluate('performance.timeOrigin'); await client.send('Page.reload');
  await until(`performance.timeOrigin!==${priorDocument}&&document.readyState==='complete'&&document.documentElement.dataset.theme==='dark'`,'actual document reload retains theme');
  await stopBrowser(); await launch(); await viewport(1440,1000); await media('light'); await navigate('/');
  assert.equal(await client.evaluate('document.documentElement.dataset.theme'),'dark','Closing and restarting Chromium retains the manual choice.');
  passed('Manual appearance persists across routes, reload and browser restart');
  await theme('system'); await until(`document.documentElement.dataset.theme==='light'`,'system appearance');
  assert.equal(await client.evaluate(`localStorage.getItem('xoce-theme')`),null);
  await media('dark'); await until(`document.documentElement.dataset.theme==='dark'`,'changed system dark');
  await media('light'); await until(`document.documentElement.dataset.theme==='light'`,'changed system light');
  passed('System choice removes override and follows OS appearance');

  await navigate('/projects/');
  const visibleCards=`Array.from(document.querySelectorAll('[data-project-card]')).filter(el=>el.getClientRects().length>0).map(el=>({href:el.querySelector('a').getAttribute('href'),kind:el.dataset.projectKind,platform:el.dataset.projectPlatform,availability:el.dataset.projectAvailability}))`;
  const currentPlatforms=[...new Set(catalogueProducts.map(project=>project.platform))];
  const expectedRoutes=catalogueProducts.map(project=>`/projects/${project.slug}/`).sort();
  assert.deepEqual((await client.evaluate(visibleCards)).map(card=>card.href).sort(),expectedRoutes);
  assert.ok((await client.evaluate(visibleCards)).every(card=>card.availability!=='planned'&&card.kind!=='library'),'The software list contains available apps only.');
  if (currentPlatforms.length>1) {
    for (const platform of [...currentPlatforms,'all']) {
      await click(`[data-project-filter="${platform}"]`);
      const cards=await client.evaluate(visibleCards);
      const expected=catalogueProducts.filter(project=>platform==='all'||project.platform===platform);
      assert.deepEqual(cards.map(card=>card.href).sort(),expected.map(project=>`/projects/${project.slug}/`).sort());
      assert.equal(await client.evaluate(`document.querySelectorAll('[data-project-filter][aria-pressed="true"]').length`),1);
      assert.equal(await client.evaluate(`document.querySelector('[data-project-count]').textContent.trim()`),`${expected.length} downloads`);
    }
    await click(`[data-project-filter="${currentPlatforms[0]}"]`);
    const filteredDocument=await client.evaluate('performance.timeOrigin'); await client.send('Page.reload');
    await until(`performance.timeOrigin!==${filteredDocument}&&document.readyState==='complete'`,'reload available-platform catalogue');
    assert.deepEqual((await client.evaluate(visibleCards)).map(card=>card.href).sort(),catalogueProducts.filter(project=>project.platform===currentPlatforms[0]).map(project=>`/projects/${project.slug}/`).sort(),'Reload preserves an available platform selection.');
    await click('[data-project-filter="all"]');
  } else {
    assert.equal(await client.evaluate(`document.querySelectorAll('[data-project-filter]').length`),0,'A single-platform catalogue does not offer redundant or empty filters.');
    await navigate('/projects/?platform=Android');
    assert.deepEqual((await client.evaluate(visibleCards)).map(card=>card.href).sort(),expectedRoutes,'Old planned-platform URLs do not lead to an empty software list.');
    const catalogueDocument=await client.evaluate('performance.timeOrigin'); await client.send('Page.reload');
    await until(`performance.timeOrigin!==${catalogueDocument}&&document.readyState==='complete'`,'reload available software');
    assert.deepEqual((await client.evaluate(visibleCards)).map(card=>card.href).sort(),expectedRoutes,'All available software remains visible after reopening an old filter URL.');
    assert.equal(await client.evaluate(`document.querySelector('[data-project-count]').textContent.trim()`),`${catalogueProducts.length} downloads`);
  }
  assert.equal(await client.evaluate(`document.querySelectorAll('[data-project-group="planned"]').length`),0,'Plans are not promoted as software groups.');
  for (const library of projects.filter(project=>project.kind==='library')) assert.ok(await client.evaluate(`Array.from(document.querySelectorAll('main a')).some(a=>a.getAttribute('href')===${JSON.stringify(library.guide)})`),'Direct '+library.name+' integration path');
  passed('Available software, exact counts and reload remain usable without empty platform choices',{catalogueProducts:catalogueProducts.length,downloadableApps:availableApps.length,plannedProjects:0,libraries:libraryCount});

  await navigate('/');
  await client.send('Network.setCacheDisabled',{cacheDisabled:true});
  await client.send('Network.setBlockedURLs',{urls:[new URL('/search.json',base).href+'*']});
  await click('[data-search-open]');
  await until(`/could not load/i.test(document.querySelector('[data-search-status]').textContent)`,'search shows a recoverable load error');
  assert.equal(await client.evaluate(`document.querySelectorAll('[data-search-results] a').length`),0);
  await key('Escape','Escape'); await until(`!document.querySelector('[data-search-dialog]').open`,'close failed search');
  await client.send('Network.setBlockedURLs',{urls:[]});
  await click('[data-search-open]'); await until(`document.querySelectorAll('[data-search-results] a').length>0`,'reopening retries search successfully');
  await key('Escape','Escape');
  passed('Search network failure has feedback and recovers after reopening');

  await client.evaluate('document.activeElement.blur()'); await key('k','KeyK',2);
  await until(`document.querySelector('[data-search-dialog]').open&&document.activeElement===document.querySelector('[data-search-input]')`,'requested keyboard search');
  await until(`document.querySelectorAll('[data-search-results] a').length>0`,'initial search places');
  const initialResults=await client.evaluate(`Array.from(document.querySelectorAll('[data-search-results] a')).map(a=>a.getAttribute('href'))`);
  const queries=[['timer','/projects/timer/'],['registerSourceHandler','/docs/develop/activities/'],['visual identity','/docs/design/visual-identity/'],['Phone','/about/#phone-plan']];
  for (const [query,destination] of queries) {
    if (await client.evaluate(`!document.querySelector('[data-search-clear]').hidden`)) await click('[data-search-clear]');
    await client.send('Input.insertText',{text:query});
    await until(`Array.from(document.querySelectorAll('[data-search-results] a')).some(a=>a.getAttribute('href')===${JSON.stringify(destination)})`,'search '+query);
    if (query==='Phone') assert.match(await client.evaluate(`Array.from(document.querySelectorAll('[data-search-results] a')).find(a=>a.getAttribute('href')==='/about/#phone-plan').textContent`),/planned/i);
  }
  await click('[data-search-clear]'); await client.send('Input.insertText',{text:'zz-no-such-xoce-guide-zz'});
  await until(`document.querySelectorAll('[data-search-results] a').length===0`,'no search results');
  assert.match(await client.evaluate(`document.querySelector('[data-search-status]').textContent`),/no results/i);
  await click('[data-search-clear]'); assert.equal(await client.evaluate(`document.querySelector('[data-search-input]').value`),'');
  assert.deepEqual(await client.evaluate(`Array.from(document.querySelectorAll('[data-search-results] a')).map(a=>a.getAttribute('href'))`),initialResults);
  await key('Escape','Escape'); await click('[data-search-open]'); await key('Escape','Escape');
  await until(`!document.querySelector('[data-search-dialog]').open`,'Escape closes search');
  assert.equal(await client.evaluate(`document.activeElement.matches('[data-search-open]')`),true,'Search restores focus to its opener.');
  await key('/','Slash',0,'/'); await until(`document.querySelector('[data-search-dialog]').open`,'slash search');
  await client.send('Input.insertText',{text:'timer'}); await until(`document.querySelectorAll('[data-search-results] a').length>0`,'search before navigation');
  const destination=await client.evaluate(`document.querySelector('[data-search-results] a').getAttribute('href')`);
  await click('[data-search-results] a'); await until(`location.pathname===${JSON.stringify(destination.split('#')[0])}&&document.readyState==='complete'`,'follow search result');
  passed('Search keyboard shortcuts, full-text APIs, design and planned work, empty results, clearing, focus and actual navigation');

  for (const project of projects.filter(item=>item.slug!=='pebble-phone')) {
    await navigate(`/projects/${project.slug}/`);
    const links=await client.evaluate(`Array.from(document.querySelectorAll('main a')).map(a=>a.getAttribute('href'))`);
    if (project.availability==='planned') {
      const state=await client.evaluate(`({text:document.querySelector('main').innerText,images:document.querySelectorAll('main img').length,parts:['android-app','pebble-companion'].every(id=>!!document.getElementById(id))})`);
      assert.match(state.text,/planned/i); assert.match(state.text,/optional/i); assert.match(state.text,/require/i);
      assert.doesNotMatch(state.text,/\bundefined\b|\bnull\b/); assert.equal(state.images,0); assert.equal(state.parts,true);
      assert.equal(links.some(href=>/\.pbw(?:$|[?#])|\/releases\//i.test(href)),false,'Phone does not advertise an unavailable build.');
    } else {
      assert.ok(links.includes(project.guide),project.name+' retains its current guide.');
      assert.ok(links.includes(project.download),project.name+' retains the exact download.');
      if (project.licence) assert.ok(links.includes(project.licence.url));
      if (project.kind!=='library') assert.ok(links.includes('/docs/develop/building/'));
      if (project.developerGuide) assert.ok(links.includes(project.developerGuide));
      for (const slug of project.requires??[]) {assert.ok(links.includes(`/projects/${slug}/`));assert.match(await client.evaluate(`document.querySelector('main').innerText`),/requires/i);}
      if (project.kind==='library') {
        const actual=await client.evaluate(`Array.from(document.querySelectorAll('[aria-labelledby="project-consumers"] a[href^="/projects/"]')).map(a=>a.getAttribute('href'))`);
        assert.deepEqual(actual.sort(),(project.consumers??[]).map(slug=>`/projects/${slug}/`).sort());
      }
    }
    if (project.image) assert.ok((await client.evaluate(`document.querySelector('.preview-caption').textContent`)).includes(project.name+' v'+project.imageVersion), 'Visible screenshot version for '+project.name);
    const current=project.kind==='library'?'/docs/':'/projects/';
    assert.equal(await client.evaluate(`document.querySelector('[data-site-nav] > a[href="${current}"]').getAttribute('aria-current')`),'true');
  }
  await navigate('/android/'); assert.equal(await client.evaluate('location.pathname+location.hash'),'/projects/phone/#android-app');
  await navigate('/projects/pebble-phone/'); assert.equal(await client.evaluate('location.pathname+location.hash'),'/projects/phone/#pebble-companion');
  passed('Product downloads, licences, guides, library consumers and one honest canonical Phone plan');

  const routes=routesFromBuild();
  for (const width of [1440,320,360]) {
    await viewport(width,width<=360?800:1000,width<=360);
    for (const route of routes) {await navigate(route);await noOverflow(route,width);}
  }
  passed('Every generated route renders without horizontal page overflow',{routes:routes.length,widths:[1440,320,360]});
  await navigate('/'); await click('[data-menu-toggle]');
  assert.equal(await client.evaluate(`document.querySelector('[data-menu-toggle]').getAttribute('aria-expanded')`),'true');
  assert.ok(await client.evaluate(`document.querySelector('[data-site-nav]').getClientRects().length>0`));
  assert.deepEqual(await client.evaluate(`Array.from(document.querySelectorAll('[data-site-nav] > a')).map(a=>({href:a.getAttribute('href'),label:a.textContent.trim()}))`),mainSections);
  await screenshot('navigation-mobile-light'); await key('Escape','Escape');
  await until(`document.querySelector('[data-menu-toggle]').getAttribute('aria-expanded')==='false'`,'Escape closes mobile navigation');
  assert.equal(await client.evaluate(`document.activeElement.matches('[data-menu-toggle]')`),true);
  assert.equal(await client.evaluate(`document.querySelector('[data-site-nav]').getClientRects().length>0`),false);
  await click('[data-menu-toggle]'); await click('[data-site-nav] > a[href="/docs/"]');
  await until(`location.pathname==='/docs/'&&document.readyState==='complete'`,'mobile menu opens Docs');
  assert.equal(await client.evaluate(`document.querySelector('[data-menu-toggle]').getAttribute('aria-expanded')`),'false');
  await navigate('/'); await click('[data-menu-toggle]'); await click('[data-site-nav] > a[href="/projects/"]');
  await until(`location.pathname==='/projects/'&&document.readyState==='complete'`,'mobile Software');
  assert.deepEqual((await client.evaluate(visibleCards)).map(card=>card.href).sort(),catalogueProducts.map(project=>`/projects/${project.slug}/`).sort());
  await click('[data-menu-toggle]'); await click('[data-site-nav] > a[href="/about/"]');
  await until(`location.pathname==='/about/'&&document.readyState==='complete'`,'mobile project direction');
  await click('main a[href="/projects/phone/"]'); await until(`location.pathname==='/projects/phone/'&&document.readyState==='complete'`,'contextual Phone plan from About');
  passed('Mobile menu opens, closes, restores focus and follows Software, Docs and contextual project information');
  await checkWebsiteDesign();

  scriptingEnabled=false; await client.send('Emulation.setScriptExecutionDisabled',{value:true});
  for (const route of Object.keys(redirects)) {
    await navigate(route); const target=resolvedTarget(route,false);
    assert.equal(await client.evaluate('location.pathname+location.hash'),target.pathname+target.hash,'Direct compatibility fallback works without JavaScript.');
  }
  await viewport(360,800,true); await checkWatchShowcase(false);
  await navigate('/'); await followHomeToDownloads();
  assert.equal((await client.evaluate(visibleCards)).length,catalogueProducts.length,'All software remains available without filters.');
  assert.equal(await client.evaluate(`Array.from(document.querySelectorAll('[data-project-group]')).filter(el=>el.getClientRects().length>0).length`),1);
  assert.equal(await client.evaluate(`Array.from(document.querySelectorAll('[data-project-filter],[data-search-open]')).some(el=>el.getClientRects().length>0)`),false,'Unavailable scripted controls are hidden.');
  await click('[data-site-nav] a[href="/about/"]'); await until(`location.pathname==='/about/'&&document.readyState==='complete'`,'About without JavaScript');
  await click('main a[href="/projects/phone/"]'); await until(`location.pathname==='/projects/phone/'&&document.readyState==='complete'`,'contextual Phone plan without JavaScript');
  assert.equal(await client.evaluate(`document.querySelectorAll('main img').length`),0);
  await click('[data-site-nav] a[href="/docs/"]'); await until(`location.pathname==='/docs/'&&document.readyState==='complete'`,'Docs without JavaScript');
  assert.ok(await client.evaluate(`!!document.querySelector('main article.prose')&&document.querySelector('main h1').textContent==='Getting started'`));
  assert.ok(await client.evaluate(`document.querySelector('[data-site-nav]').getClientRects().length>0`),'Navigation is available without JavaScript.');
  await click('.docs-mobile-nav > summary'); await click('.docs-mobile-nav a[href="/docs/pebble/setup/"]');
  await until(`location.pathname==='/docs/pebble/setup/'&&document.readyState==='complete'`,'native setup navigation');
  const nativeContents=await guideContentsJump(false); await screenshot('docs-mobile-no-javascript');
  passed('Guide contents navigate natively and leave the target visible below the header',nativeContents);
  await click('.docs-mobile-nav > summary'); await click('.docs-mobile-nav [data-docs-section="Developers"] > summary'); await click('.docs-mobile-nav a[href="/docs/develop/activities/"]');
  await until(`location.pathname==='/docs/develop/activities/'&&document.readyState==='complete'`,'native developer article');
  await click('.docs-mobile-nav > summary'); await click('.docs-mobile-nav [data-docs-section="Design"] > summary'); await click('.docs-mobile-nav a[href="/docs/design/principles/"]');
  await until(`location.pathname==='/docs/design/principles/'&&document.readyState==='complete'`,'native design article');
  await noOverflow('/docs/design/principles/',360); await screenshot('design-mobile-no-javascript');
  scriptingEnabled=true; await client.send('Emulation.setScriptExecutionDisabled',{value:false});
  passed('Downloads, platform aliases, actual Docs articles and unified navigation work without JavaScript');
  assert.deepEqual(exceptions,[],'Unexpected browser JavaScript errors');
  assert.deepEqual(failedResponses,[],'Missing local pages or assets');
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
