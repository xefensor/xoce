#!/usr/bin/env node
// Real Chromium checks of the local site. No external account or device is used.
import assert from 'node:assert/strict';
import { basePath, sitePath, routePath } from '../src/lib/site.ts';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { projects } = await import(pathToFileURL(path.join(root, 'src/data/projects.ts')).href);
const products = projects.filter(project => project.kind !== 'library');
const catalogueProducts = products.filter(project => project.availability !== 'planned');
const previewApps = catalogueProducts.filter(project => project.previewType === 'watch');
const libraryCount = projects.length - products.length;
const mainSections = [
  { href:'/projects/', label:'Software' },
  { href:'/docs/', label:'Docs' },
  { href:'/about/', label:'About' },
];
const platformLinks = [{ href:'/pebble/', label:'PebbleOS' }];
const visualRoutes = ['/', '/projects/', '/projects/dynamic/', '/projects/dashboard/', '/projects/timer/',
  '/projects/open-activity/', '/projects/halftone/', '/projects/chmu-weather/', '/docs/pebble/halftone/', '/docs/pebble/chmu-weather/', '/projects/phone/', '/pebble/', '/docs/', '/docs/develop/building/',
  '/docs/design/principles/', '/about/', '/docs/pebble/setup/', '/docs/pebble/activities/', '/docs/design/visual-identity/'];
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
const base = new URL(process.env.XOCE_SITE_URL || 'http://127.0.0.1:4321' + basePath);
assert.ok(['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname), 'Browser checks are restricted to a local preview.');
assert.equal(base.pathname, basePath, 'Preview must exercise the published project base.');
const routeURL = route => new URL(sitePath(route), base);
const siteSelector = selector => selector.replace(/(\[href(?:\^)?=["'])(\/(?!\/)[^"']*)(["']\])/g,
  (_, start, href, end) => start + sitePath(href) + end);
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
  for (let step = 0; step < 600 && !fs.existsSync(portFile); step++) {
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
    try {
      if (await client.evaluate(expression)) return;
    } catch (error) {
      // Redirects can replace the execution context while readiness is polled.
      if (!/Execution context was destroyed|Cannot find context with specified id|Inspected target navigated or closed/.test(error.message)) throw error;
    }
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
  let target = routeURL(route);
  for (let step=0; step<10 && Object.hasOwn(redirects,routePath(target.pathname)); step++) {
    const fragment = target.hash.slice(1);
    const mapped = scripts && legacyFragments[routePath(target.pathname)]?.[fragment];
    target = routeURL(mapped || redirects[routePath(target.pathname)]);
  }
  return target;
}
async function navigate(route) {
  const target = resolvedTarget(route);
  const previousDocument = await client.evaluate('performance.timeOrigin');
  // Page.navigate supplies loaderId for a new document, but not a fragment jump:
  // https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-navigate
  const navigation = await client.send('Page.navigate', {url:routeURL(route).href});
  assert.equal(navigation.errorText, undefined, 'Navigation failed: '+route);
  const documentReady = navigation.loaderId ? `performance.timeOrigin!==${previousDocument}` : 'true';
  await until(`${documentReady} && location.pathname===${JSON.stringify(target.pathname)} && location.hash===${JSON.stringify(target.hash)} && document.readyState==='complete' && document.fonts.status==='loaded'`, 'page '+route);
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
  selector = siteSelector(selector);
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
  const watchDevices = await client.evaluate(`Array.from(document.querySelectorAll('[data-watch-device]')).map((el,index)=>el.getClientRects().length>0?index:null).filter(index=>index!==null)`);
  if (watchDevices.length) {
    const position = await client.evaluate('({left:scrollX,top:scrollY})');
    for (const index of watchDevices) {
      await client.evaluate(`document.querySelectorAll('[data-watch-device]')[${index}].scrollIntoView({block:'center',behavior:'instant'})`);
      await until(`Array.from(document.querySelectorAll('[data-watch-device]')[${index}].querySelectorAll('img')).every(img=>img.complete&&img.naturalWidth>0)`, 'scrolled watch preview loads at '+route);
    }
    await client.evaluate(`scrollTo({...${JSON.stringify(position)},behavior:'instant'})`);
  }
  await until(`Array.from(document.querySelectorAll('[data-watch-device]')).filter(el=>el.getClientRects().length>0).every(el=>Array.from(el.querySelectorAll('img')).every(img=>img.complete&&img.naturalWidth>0))`, 'frame and native screen load at '+route);
  const previews = await client.evaluate(`Array.from(document.querySelectorAll('[data-watch-device]')).filter(el=>el.getClientRects().length>0).map(el=>{
    const image=el.querySelector('.pebble-display img'),frame=el.querySelector('.pebble-frame');
    const device=el.getBoundingClientRect(),screen=image.getBoundingClientRect();
    const aperture=el.querySelector('.pebble-display'),bounds=aperture.getBoundingClientRect();
    return {platform:el.dataset.watchDevice,loaded:image.complete&&frame.complete,nativeWidth:image.naturalWidth,nativeHeight:image.naturalHeight,
      frameWidth:frame.naturalWidth,frameHeight:frame.naturalHeight,frameSource:frame.getAttribute('src'),
      ratio:screen.width/screen.height,frameRatio:device.width/device.height,
      aperture:{left:(bounds.left-device.left)/device.width,top:(bounds.top-device.top)/device.height,
        width:bounds.width/device.width,height:bounds.height/device.height,radius:getComputedStyle(aperture).borderRadius},
      contained:screen.left>=device.left&&screen.right<=device.right&&screen.top>=device.top&&screen.bottom<=device.bottom,
      decorative:frame.getAttribute('aria-hidden')==='true'&&frame.getAttribute('alt')===''};
  })`);
  for (const preview of previews) {
    assert.ok(['emery','gabbro'].includes(preview.platform),'Frame identifies its watch model at '+route);
    const round=preview.platform==='gabbro';
    const native=round?[260,260]:[200,228],frame=round?[502,700]:[488,700];
    assert.equal(preview.loaded,true,'Both frame and native screen load at '+route);
    assert.deepEqual([preview.nativeWidth,preview.nativeHeight],native);
    assert.deepEqual([preview.frameWidth,preview.frameHeight],frame);
    assert.equal(preview.frameSource,sitePath('/images/devices/pebble-'+(round?'round':'time')+'-2.png'));
    assert.ok(Math.abs(preview.ratio-native[0]/native[1])<.002,'Native screen keeps its aspect ratio at '+route);
    assert.ok(Math.abs(preview.frameRatio-frame[0]/frame[1])<.002,'Frame keeps its aspect ratio at '+route);
    const aperture=round?[83/502,182/700,337/502,337/700]:[.20287,.26857,.57582,.48286];
    for(const [index,key] of ['left','top','width','height'].entries())
      assert.ok(Math.abs(preview.aperture[key]-aperture[index])<.002,'Native screen aligns with the official '+preview.platform+' aperture at '+route);
    if(round) assert.equal(preview.aperture.radius,'50%','Round 2 screen stays circular at '+route);
    assert.ok(preview.contained&&preview.decorative,'Screen stays within the decorative frame at '+route);
  }
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

async function runChecks() {
  await launch();
  const productRoutes=catalogueProducts.map(p=>`/projects/${p.slug}/`);
  const policyRoutes=catalogueProducts.flatMap(p=>[`/projects/${p.slug}/support/`,`/projects/${p.slug}/privacy/`]);
  const routes=['/','/projects/',...productRoutes,'/pebble/','/docs/','/docs/pebble/setup/','/docs/pebble/activities/','/docs/pebble/halftone/','/docs/pebble/chmu-weather/',...policyRoutes];
  for(const width of [320,390,768,1440]) {
    await viewport(width,width===1440?1100:900,width<768);
    for(const color of ['light','dark']) {
      await media(color); await navigate('/'); await theme('system');
      for(const route of routes) {
        await navigate(route);await noOverflow(route,width);
        if([390,1440].includes(width)&&(!route.endsWith('/support/')&&!route.endsWith('/privacy/')||route==='/projects/timer/privacy/'||route==='/projects/chmu-weather/support/')) {
          await screenshot((route==='/'?'home':route.replace(/^\//,'').replace(/\/$/,'').replaceAll('/','-'))+'-'+width+'-'+color);
          const sections = route === '/' ? ['#watchfaces', '#watch-apps', '#weather', '.activity-showcase']
            : catalogueProducts.some(project => route === `/projects/${project.slug}/`) ? ['.product-story', '.activity-connection'] : [];
          for (const [index, selector] of sections.entries()) {
            assert.equal(await client.evaluate(`document.querySelectorAll(${JSON.stringify(selector)}).length`), 1, 'Product sections must be present exactly once');
            await client.evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'start',behavior:'instant'})`);
            await screenshot((route === '/' ? 'home' : route.replace(/^\//, '').replace(/\/$/, '').replaceAll('/', '-')) + '-section-' + (index + 1) + '-' + width + '-' + color);
          }
        }
        const watch=previewApps.find(project=>route===`/projects/${project.slug}/`);
        if(watch) {
          await click(`label[for="${watch.slug}-gabbro"]`);
          assert.ok(await client.evaluate(`document.querySelector('.stage-gabbro [data-watch-device="gabbro"]')?.getClientRects().length>0`),'Round 2 uses its official device frame');
          await noOverflow(route,width);
          if([390,1440].includes(width)) {
            await client.evaluate(`document.querySelector('.stage-gabbro').scrollIntoView({block:'center',behavior:'instant'})`);
            await screenshot(watch.slug+'-round2-'+width+'-'+color);
          }
        }
      }
    }
  }
  passed('Launch pages, both official watch frames, all twelve policy pages and guides fit desktop/tablet/mobile in both themes',{widths:[320,390,768,1440],routes:routes.length});
  await viewport(390,844,true);await media('light');await navigate('/');await theme('light');
  const namedPreviews=await client.evaluate(`Array.from(document.querySelectorAll('.hero-watch>a')).map(a=>({name:a.textContent,top:a.getBoundingClientRect().top,bottom:a.getBoundingClientRect().bottom}))`);
  assert.equal(namedPreviews.length,2);assert.ok(namedPreviews.every(p=>p.top>0&&p.bottom<844),'Both app names and watch models must be in the first mobile screen');
  await screenshot('home-390-first-screen');passed('Mobile homepage names both preview apps before the first scroll');
  assert.ok(await client.evaluate(`document.fonts.check('400 16px "Fira Sans"','ČHMÚ Weather')&&document.fonts.check('700 32px "Fira Sans Condensed"','XOCE')&&getComputedStyle(document.body).fontFamily.includes('Fira Sans')`),'Self-hosted reading/heading fonts must load, including Czech text');
  assert.ok(await client.evaluate(`!!document.querySelector('.brand-wordmark svg path')&&document.querySelector('link[rel="icon"]').href.endsWith('/images/identity/favicon.svg')`),'Outlined wordmark and matching favicon must be present');
  passed('Self-hosted Fira typography and outlined identity load correctly');
  await navigate('/projects/');
  assert.equal(await client.evaluate(`document.querySelectorAll('[data-project-card]').length`),6);
  assert.equal(await client.evaluate(`document.querySelectorAll('[data-project-kind="plugin"]').length`),1);
  assert.equal(await client.evaluate(`document.querySelectorAll('[data-project-kind="library"],[data-project-availability="planned"]').length`),0);
  for(const project of catalogueProducts) {
    const route=`/projects/${project.slug}/`;await navigate(route);
    assert.equal(await client.evaluate(`document.querySelector('[data-install-state]').dataset.installState`),project.publication==='published'?'published':'preview');
    if(project.publication==='preview')assert.equal(await client.evaluate(`Array.from(document.querySelectorAll('main a')).some(a=>/apps\.repebble\.com|\.pbw(?:$|[?#])/.test(a.href))`),false,'Preview must not offer invented Store or older PBW installation');
    for(const destination of [project.supportUrl,project.privacyUrl])assert.ok(await client.evaluate(`!!document.querySelector('main a[href='+${JSON.stringify(JSON.stringify(sitePath(destination)))}+']')`));
    if(project.previewType==='watch') {
      for(const shape of ['emery','gabbro']) {
        await click(`label[for="${project.slug}-${shape}"]`);
        const selector=`.stage-${shape} .pebble-display img`;
        await until(`(()=>{const i=document.querySelector(${JSON.stringify(selector)});return i&&i.getClientRects().length>0&&i.complete&&i.naturalWidth>0})()`,'native '+shape+' preview loads');
        const image=await client.evaluate(`(()=>{const i=document.querySelector(${JSON.stringify(selector)}),r=i.getBoundingClientRect();return {width:i.naturalWidth,height:i.naturalHeight,ratio:r.width/r.height,selected:document.getElementById('${project.slug}-${shape}').checked}})()`);
        assert.deepEqual([image.width,image.height],shape==='emery'?[200,228]:[260,260]);assert.ok(image.selected);assert.ok(Math.abs(image.ratio-image.width/image.height)<.002,'Native preview keeps its aspect ratio');
        await noOverflow(route,390);
      }
      await screenshot(project.slug+'-round2-390');
    }else assert.equal(await client.evaluate(`document.querySelectorAll('[data-watch-platform]').length`),0,'A phone plugin must have no invented watch screen');
  }
  passed('Six distinct products, honest preview installation states, direct support/privacy and both native watch shapes');
  for(const route of Object.keys(redirects)) {await navigate(route);const target=resolvedTarget(route);assert.equal(await client.evaluate('location.pathname+location.hash'),target.pathname+target.hash);}
  passed('All compatibility routes still resolve');
  await viewport(1440,1000);await navigate('/');await theme('dark');await navigate('/docs/');assert.equal(await client.evaluate('document.documentElement.dataset.theme'),'dark');
  const documentTime=await client.evaluate('performance.timeOrigin');await client.send('Page.reload');await until(`performance.timeOrigin!==${documentTime}&&document.readyState==='complete'`,'theme reload');assert.equal(await client.evaluate('document.documentElement.dataset.theme'),'dark');
  await theme('system');await media('light');await until(`document.documentElement.dataset.theme==='light'`,'system light');await media('dark');await until(`document.documentElement.dataset.theme==='dark'`,'system dark');
  passed('Theme preference survives navigation/reload and system mode follows OS changes');
  await navigate('/');await click('[data-search-open]');await until(`document.querySelector('[data-search-dialog]').open`,'search dialog opens');
  await client.evaluate(`(()=>{const i=document.querySelector('[data-search-input]');i.value='Halftone privacy';i.dispatchEvent(new Event('input',{bubbles:true}))})()`);
  await until(`!!document.querySelector('[data-search-results] a[href="${sitePath('/projects/halftone/privacy/')}"]')`,'search indexes product privacy');await key('Escape');
  passed('Search finds the new support/privacy routes');
  await viewport(390,900,true);await navigate('/');await click('[data-menu-toggle]');assert.equal(await client.evaluate(`document.querySelector('[data-menu-toggle]').getAttribute('aria-expanded')`),'true');await key('Escape');await until(`document.querySelector('[data-menu-toggle]').getAttribute('aria-expanded')==='false'`,'mobile navigation closes');
  assert.ok(await client.evaluate(`document.activeElement.matches('[data-menu-toggle]')`));
  await navigate('/projects/timer/');await client.evaluate(`document.getElementById('timer-emery').focus()`);await key('ArrowRight');assert.equal(await client.evaluate(`document.getElementById('timer-gabbro').checked`),true);
  passed('Keyboard controls work for mobile navigation and native shape radios');
  await media('light','reduce','reduce');await navigate('/');await noOverflow('/',390);await screenshot('home-reduced-motion-transparency');
  assert.equal(await client.evaluate(`matchMedia('(prefers-reduced-motion:reduce)').matches&&matchMedia('(prefers-reduced-transparency:reduce)').matches`),true);
  passed('Reduced motion/transparency render without layout loss');
  await client.send('Emulation.setScriptExecutionDisabled',{value:true});scriptingEnabled=false;
  for(const route of ['/','/projects/',...productRoutes,'/docs/','/projects/timer/privacy/']){await navigate(route);await noOverflow(route,390);}
  await navigate('/projects/timer/');await click('label[for="timer-gabbro"]');assert.equal(await client.evaluate(`document.getElementById('timer-gabbro').checked`),true);assert.ok(await client.evaluate(`document.querySelector('.stage-gabbro').getClientRects().length>0`));await screenshot('timer-round2-no-javascript');
  await navigate('/docs/');await guideContentsJump(false);passed('Navigation, reading and shape selection work without JavaScript');
  await media('dark','reduce','reduce');await navigate('/projects/halftone/');await noOverflow('/projects/halftone/',390);
  assert.equal(await client.evaluate("getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()"),'#171d21');await click('label[for="halftone-gabbro"]');await screenshot('halftone-round2-dark-no-javascript');passed('Dark appearance also works without JavaScript');
  await navigate('/docs/pebble/activities/');
  assert.equal(await client.evaluate("!!document.getElementById('try-a-timer-on-your-watchface')"),true);
  assert.ok(await client.evaluate("document.querySelector('article').innerText.includes('Timer still runs the countdown and handles the alarm.')"));
  await noOverflow('/docs/pebble/activities/',390);
  await screenshot('activities-guide-no-javascript');passed('Activities guide explains Timer ownership and stays readable without JavaScript');
  assert.deepEqual(exceptions,[]);assert.deepEqual(failedResponses,[]);passed('No browser exceptions or missing local resources');
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
