#!/usr/bin/env node
// Audit the generated site, including links that only exist on secondary pages.
import assert from 'node:assert/strict';
import { basePath, sitePath, routePath } from '../src/lib/site.ts';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
assert.ok(fs.existsSync(dist), 'Build the site before checking its routes.');

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filename = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(filename) : [filename];
  });
}

function decode(value) {
  return value.replace(/&(?:amp|quot|apos|lt|gt|#\d+|#x[\da-f]+);/gi, (entity) => {
    const names = { '&amp;': '&', '&quot;': '"', '&apos;': "'", '&lt;': '<', '&gt;': '>' };
    if (names[entity]) return names[entity];
    if (/^&#x/i.test(entity)) return String.fromCodePoint(parseInt(entity.slice(3, -1), 16));
    if (/^&#/.test(entity)) return String.fromCodePoint(parseInt(entity.slice(2, -1), 10));
    return entity;
  });
}

function pageRoute(filename) {
  const relative = path.relative(dist, filename).split(path.sep).join('/');
  return relative === 'index.html' ? '/' : '/' + relative.replace(/index\.html$/, '');
}

function references(html, canonical = true) {
  const markup = html.replace(/(<(?:script|style)\b[^>]*>)[\s\S]*?<\/(?:script|style)>/gi, '$1</script>');
  const values = [];
  for (const tag of markup.match(/<[a-z][^>]*>/gi) || []) {
    for (const match of tag.matchAll(/\s(href|src|srcset)\s*=\s*(["'])(.*?)\2/gi)) {
      if (match[1].toLowerCase() === 'srcset') {
        if (!match[3].startsWith('data:')) {
          for (const image of match[3].split(',')) values.push(decode(image.trim().split(/\s+/)[0]));
        }
      } else values.push(decode(match[3]));
    }
  }
  return canonical ? values.map(routePath) : values;
}

const files = walk(dist);
const pages = new Map();
const problems = [];
let checkedReferences = 0;
let checkedAnchors = 0;
const checkedAssets = new Set();

for (const filename of files.filter((file) => file.endsWith('.html'))) {
  const html = fs.readFileSync(filename, 'utf8');
  const route = pageRoute(filename);
  const ids = [...html.matchAll(/\sid\s*=\s*(["'])(.*?)\1/g)].map((match) => decode(match[2]));
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length) problems.push(`${route}: duplicate IDs: ${[...new Set(duplicateIds)].join(', ')}`);
  if ((html.match(/<h1(?:\s|>)/g) || []).length !== 1) problems.push(`${route}: expected one main heading`);
  if (!/<title>[^<]*XOCE[^<]*<\/title>/i.test(html)) problems.push(`${route}: missing meaningful XOCE title`);
  if (!/<main(?:\s|>)/i.test(html)) problems.push(`${route}: missing main landmark`);
  pages.set(route, { filename, html, ids: new Set(ids), references: references(html) });
}

const mainRoutes = ['/android/', '/pebble/', '/projects/', '/docs/', '/about/'];
const retiredPortals = ['/users/', '/developers/', '/design/'];
const legacyRoutes = ['/docs/getting-started/', '/docs/pebble/setup/', '/docs/pebble/controls/',
  '/docs/pebble/troubleshooting/', '/docs/project/licensing/', '/docs/develop/activities/', '/docs/develop/core/'];
const platformGuides = ['/docs/android/phone/', '/docs/pebble/phone-connection/'];
const designRoutes = ['/docs/design/principles/', '/docs/design/visual-identity/',
  '/docs/design/ui-patterns/', '/docs/design/interaction/'];
for (const route of ['/', ...mainRoutes, ...retiredPortals, ...legacyRoutes, ...platformGuides, ...designRoutes]) {
  if (!pages.has(route)) problems.push(`Required page is missing: ${route}`);
}
for (const [route, page] of pages) {
  if (route.startsWith('/lab/')) problems.push(`Removed Lab route is still published: ${route}`);
  if (page.references.some((reference) => /^\/lab(?:\/|#|$)/.test(reference))) {
    problems.push(`${route}: still links to the removed Lab`);
  }
  if (/\bdata-workspace(?:[-\s=>])/.test(page.html)) problems.push(`${route}: still includes the removed workspace demo`);
  const navigation = page.html.match(/<nav\b(?=[^>]*\bdata-site-nav\b)[^>]*>([\s\S]*?)<\/nav>/i)?.[1];
  if (navigation && references(navigation).some(href => retiredPortals.includes(href))) problems.push(route + ': retired documentation portals must not remain in main navigation');
  if (!navigation || JSON.stringify(references(navigation)) !== JSON.stringify(['/projects/', '/docs/', '/about/'])) {
    problems.push(`${route}: global navigation must link directly to Software, Docs and About`);
  }
  const footer = page.html.match(/<footer\b[^>]*>([\s\S]*?)<\/footer>/i)?.[1] ?? '';
  if (['/projects/', '/pebble/'].some(destination => !references(footer).includes(destination))) {
    problems.push(`${route}: footer must retain direct Software and PebbleOS routes`);
  }
}

function checkReference(value, from) {
  if (!value) {
    problems.push(`${from}: empty href/src`);
    return;
  }
  if (/^(?:mailto:|tel:|data:|blob:)/i.test(value)) return;
  if (/^(?:javascript:|file:)/i.test(value)) {
    problems.push(`${from}: nonportable link ${value}`);
    return;
  }
  let url;
  try { url = new URL(value, 'https://xoce.invalid' + sitePath(from)); }
  catch { problems.push(`${from}: malformed URL ${value}`); return; }
  if (url.origin !== 'https://xoce.invalid') return;
  checkedReferences++;
  let pathname;
  try { pathname = decodeURIComponent(url.pathname); }
  catch { problems.push(`${from}: invalid URL encoding ${value}`); return; }
  if (!pathname.startsWith(basePath)) {
    problems.push(`${from}: reference escapes the GitHub Pages base: ${value}`);
    return;
  }
  pathname = routePath(pathname);
  let destination = path.resolve(dist, '.' + pathname);
  if (destination !== dist && !destination.startsWith(dist + path.sep)) {
    problems.push(`${from}: path leaves the site ${value}`);
    return;
  }
  if (fs.existsSync(destination) && fs.statSync(destination).isDirectory()) destination = path.join(destination, 'index.html');
  if (!fs.existsSync(destination)) {
    problems.push(`${from}: missing ${value}`);
    return;
  }
  if (!destination.endsWith('.html')) checkedAssets.add(destination);
  if (url.hash && destination.endsWith('.html')) {
    const destinationPage = pages.get(pageRoute(destination));
    let id;
    try { id = decodeURIComponent(url.hash.slice(1)); }
    catch { problems.push(`${from}: malformed anchor ${value}`); return; }
    if (id && !destinationPage?.ids.has(id)) problems.push(`${from}: missing anchor ${value}`);
    else checkedAnchors++;
  }
}

for (const [route, page] of pages) {
  for (const reference of references(page.html, false)) checkReference(reference, route);
}
const redirects = {
  '/users/': '/docs/',
  '/developers/': '/docs/develop/activities/',
  '/design/': '/docs/design/principles/',
  '/android/': '/projects/phone/#android-app',
  '/projects/pebble-phone/': '/projects/phone/#pebble-companion',
  '/docs/android/phone/': '/projects/phone/',
  '/docs/pebble/phone-connection/': '/projects/phone/#pebble-companion',
};
for (const [route, destination] of Object.entries(redirects)) {
  const html = pages.get(route)?.html ?? '';
  if (!/<meta\b[^>]*http-equiv="refresh"/i.test(html) || !references(html).includes(destination)) {
    problems.push(`${route}: compatibility route must redirect directly, with a visible link and no-JavaScript fallback`);
  }
  if (!html.includes(`content="0;url=${sitePath(destination)}"`)) problems.push(`${route}: refresh must use the project base`);
  checkReference(sitePath(destination), route);
  for (const match of html.matchAll(/\bdata-fragments="([^"]*)"/g)) {
    try { for (const target of Object.values(JSON.parse(decode(match[1])))) checkReference(target, route); }
    catch { problems.push(`${route}: invalid compatibility fragment mapping`); }
  }
}
const docsHome = pages.get('/docs/')?.html ?? '';
if (!/<article\b[^>]*class="[^"]*prose/.test(docsHome) || !/<h1[^>]*>Getting started<\/h1>/.test(docsHome)) problems.push('/docs/ must open the Getting started article directly');
if (/documentation-hub|docs-section-overview/.test(docsHome)) problems.push('/docs/ must not contain an intermediate hub');
for (const section of ['Guides', 'Developers', 'Design']) if (!docsHome.includes('data-docs-section="' + section + '"')) problems.push('/docs/: missing documentation section ' + section);

for (const filename of files.filter((file) => file.endsWith('.css'))) {
  const source = '/' + path.relative(dist, filename).split(path.sep).join('/');
  const css = fs.readFileSync(filename, 'utf8');
  for (const match of css.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/g)) checkReference(match[2], source);
}

const { projects } = await import(pathToFileURL(path.join(root, 'src/data/projects.ts')).href);
const { docs } = await import(pathToFileURL(path.join(root, 'src/data/docs.ts')).href);
const products = projects.filter(project => project.kind !== 'library');
const catalogueProducts = products.filter(project => project.availability !== 'planned');
const libraries = projects.filter(project => project.kind === 'library');
const planned = catalogueProducts.filter(project => project.availability === 'planned');
const knownSlugs = new Set(projects.map(project => project.slug));
function mainMarkup(route) { return pages.get(route)?.html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? ''; }
function visibleText(markup) { return decode(markup.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim(); }
function needsLink(route, destination, purpose) {
  if (!references(mainMarkup(route)).includes(destination)) problems.push(`${route}: missing ${purpose} link to ${destination}`);
}
for (const guide of docs) {
  const page = pages.get(guide.href);
  if (!page || !/<article\b[^>]*class="[^"]*prose/.test(page.html)) problems.push(`${guide.href}: documented guide must be a real article`);
  if (!pages.get('/docs/')?.references.includes(guide.href)) problems.push('/docs/ sidebar is missing ' + guide.href);
}
for (const route of ['/docs/android/phone/', '/docs/pebble/phone-connection/']) {
  if (docs.some(doc => doc.href === route)) problems.push(`${route}: moved plans must not remain duplicate documentation articles`);
}
for (const library of libraries) {
  needsLink('/docs/develop/building/', `/projects/${library.slug}/`, 'developer library');
  needsLink('/docs/develop/building/', library.guide, 'integration guide');
}
const catalogueCards = [...mainMarkup('/projects/').matchAll(/<article\b[^>]*\bdata-project-card\b[^>]*>[\s\S]*?<\/article>/gi)].map(match => match[0]);
if (catalogueCards.length !== catalogueProducts.length) problems.push('Software catalogue must show available apps, without planned-product or library cards');
for (const product of catalogueProducts) {
  const card = catalogueCards.find(markup => references(markup).includes(`/projects/${product.slug}/`));
  if (!card) { problems.push(`Software catalogue is missing ${product.name}`); continue; }
  const platforms = card.match(/data-project-platform="([^"]*)"/)?.[1].split(' ') ?? [];
  if (!platforms.includes(product.platform)) problems.push(`Software catalogue has the wrong platform for ${product.name}`);
  if (product.download && !references(card).includes(product.download)) problems.push(`Software catalogue lost the exact ${product.name} download`);
}
if (catalogueCards.some(markup => /data-project-kind="library"|data-project-availability="planned"/.test(markup))) problems.push('Developer libraries and plans must not appear as consumer app cards');
const cataloguePlatforms = [...new Set(catalogueProducts.map(project => project.platform))];
if (cataloguePlatforms.length > 1) {
  for (const filter of ['all', ...cataloguePlatforms]) if (!mainMarkup('/projects/').includes(`data-project-filter="${filter}"`)) problems.push(`Missing available-platform filter: ${filter}`);
} else if (/data-project-filter=/.test(mainMarkup('/projects/'))) problems.push('A single-platform catalogue must not show redundant or empty platform filters');
if (references(mainMarkup('/')).includes('/projects/phone/')) problems.push('Home must not promote the Phone plan as a featured product');
needsLink('/about/', '/projects/phone/', 'contextual future Phone plan');
if (!pages.get('/about/')?.ids.has('phone-plan')) problems.push('About must provide the contextual future Phone direction');
for (const project of projects) {
  const route = `/projects/${project.slug}/`;
  const page = pages.get(route);
  if (!page) { problems.push(`Missing project page: ${route}`); continue; }
  for (const field of ['requires', 'optionalConnections', 'consumers']) {
    for (const slug of project[field] ?? []) if (!knownSlugs.has(slug)) problems.push(`${route}: unknown ${field} project ${slug}`);
  }
  if ((project.requires ?? []).some(slug => project.optionalConnections?.includes(slug))) problems.push(`${route}: one connection cannot be both required and optional`);
  if (project.slug === 'pebble-phone') continue; // Its canonical plan is checked below.
  const main = mainMarkup(route), text = visibleText(main), links = references(main);
  if (project.availability === 'planned') {
    if (!/planned/i.test(text) || /\bundefined\b|\bnull\b/.test(text)) problems.push(`${route}: planned availability must be clear and have no placeholders`);
    if (project.download || links.some(href => /\.pbw(?:$|[?#])|\/releases\//i.test(href))) problems.push(`${route}: planned project advertises an unavailable release`);
    if (/<img\b/.test(main)) problems.push(`${route}: planned project uses an invented interface preview`);
    for (const id of ['android-app', 'pebble-companion']) if (!page.ids.has(id)) problems.push(`${route}: missing canonical ${id} section`);
    if (!/optional/i.test(text) || !/require/i.test(text)) problems.push(`${route}: Android independence and the companion’s requirement must remain explicit`);
    continue;
  }
  needsLink(route, project.guide, project.kind === 'library' ? 'integration guide' : 'current guide');
  if (project.kind !== 'library') needsLink(route, '/docs/develop/building/', 'build instructions');
  if (project.developerGuide) needsLink(route, project.developerGuide, 'specific integration guide');
  for (const slug of project.requires ?? []) {
    needsLink(route, `/projects/${slug}/`, 'required app');
    if (!/requires?/i.test(text)) problems.push(`${route}: the required app must be identified as required`);
  }
  if (project.kind === 'library') {
    const actualConsumers = [...new Set(links.filter(href => /^\/projects\/[^/]+\/$/.test(href)))].sort();
    const expectedConsumers = (project.consumers ?? []).map(slug => `/projects/${slug}/`).sort();
    if (JSON.stringify(actualConsumers) !== JSON.stringify(expectedConsumers)) problems.push(`${route}: consumer links differ from the explicit supported apps`);
  }
  if (project.download) {
    if (!project.repo || !project.version || project.tag !== 'v' + project.version) problems.push(`${route}: release is missing its exact source/version/tag`);
    if (!project.download.startsWith(project.repo?.replace(/\/$/, '') + '/releases/download/' + project.tag + '/')) problems.push(`${route}: download is not pinned to its declared repository and release`);
    if (project.kind !== 'library' && !project.download.endsWith('-' + project.version + '.pbw')) problems.push(`${route}: PBW filename/version differ`);
    needsLink(route, project.download, 'exact released download');
  } else if (project.kind !== 'library') problems.push(`${route}: available watch app is missing a download`);
  if (project.licence) needsLink(route, project.licence.url, 'project licence');
  if (project.image && !links.includes(project.image)) problems.push(`${route}: missing the native product capture`);
}
const provenance = JSON.parse(fs.readFileSync(path.join(root, 'docs/asset-provenance.json'), 'utf8'));
for (const entry of [provenance.device_presentation, ...provenance.images]) {
  const filename = path.join(root, 'public', entry.site_path);
  if (!fs.existsSync(filename)) { problems.push('Missing native capture ' + entry.site_path); continue; }
  const bytes = fs.readFileSync(filename);
  const published = path.join(dist, entry.site_path);
  if (!fs.existsSync(published) || createHash('sha256').update(fs.readFileSync(published)).digest('hex') !== entry.sha256) problems.push('Published asset differs from provenance: ' + entry.site_path);
  if (createHash('sha256').update(bytes).digest('hex') !== entry.sha256) problems.push('Native capture pixels changed: ' + entry.site_path);
  if (bytes.readUInt32BE(16) !== entry.width || bytes.readUInt32BE(20) !== entry.height) problems.push('Native capture dimensions changed: ' + entry.site_path);
}
for (const project of products.filter(project => project.image)) {
  const capture = provenance.images.find(entry => entry.site_path === project.image);
  if (!capture || capture.capture_version !== project.imageVersion) problems.push(`${project.slug}: screenshot version/provenance differs`);
  if (!mainMarkup(`/projects/${project.slug}/`).includes(`${project.name} v${project.imageVersion}`)) problems.push(`${project.slug}: screenshot version caption is missing`);
}
const { screenshotGalleries } = await import(pathToFileURL(path.join(root, 'src/data/screenshots.ts')).href);
for (const [slug, screenshots] of Object.entries(screenshotGalleries)) {
  const project = projects.find(project => project.slug === slug);
  const markup = mainMarkup(`/projects/${slug}/`);
  if (!project || !markup.includes('id="screenshots"')) problems.push(`${slug}: gallery is missing`);
  for (const screenshot of screenshots) {
    const capture = provenance.images.find(entry => entry.site_path === screenshot.image);
    const expectedEvidence = screenshot.kind === 'watch' ? 'native-emulator-screenshot' : 'packaged-settings-browser-preview';
    if (!capture || capture.evidence_type !== expectedEvidence || capture.capture_version !== project?.version || screenshot.version !== project?.version || capture.source_url !== screenshot.source) problems.push(`${slug}: screenshot release, source or evidence classification differs: ${screenshot.image}`);
    if (!capture || capture.width !== screenshot.width || capture.height !== screenshot.height) problems.push(`${slug}: gallery dimensions differ: ${screenshot.image}`);
    if (!references(markup).includes(screenshot.image) || !references(markup).includes(screenshot.source)) problems.push(`${slug}: screenshot or source link missing: ${screenshot.image}`);
    if (screenshot.kind === 'watch' && (screenshot.width !== 200 || screenshot.height !== 228)) problems.push(`${slug}: native watch capture proportions differ`);
  }
}
const searchPath = path.join(dist, 'search.json');
if (!fs.existsSync(searchPath)) problems.push('Missing local search index');
else {
  const entries = JSON.parse(fs.readFileSync(searchPath, 'utf8'));
  if (!Array.isArray(entries)) problems.push('Search index must be an array');
  else {
    const destinations = entries.map(entry => routePath(entry.href));
    if (new Set(destinations).size !== destinations.length) problems.push('Duplicate search destinations');
    for (const entry of entries) {
      if (typeof entry.href !== 'string' || !entry.title || !entry.description) { problems.push('Incomplete search entry'); continue; }
      if (entry.href.startsWith('/lab/') || Object.hasOwn(redirects, routePath(entry.href))) problems.push('Search advertises a removed page or alias: ' + entry.href);
      checkReference(entry.href, '/search.json');
    }
    if (products.filter(project => project.availability === 'planned').some(project => destinations.includes(`/projects/${project.slug}/`))) problems.push('Search must present future Phone work in About, rather than as available software');
    const phoneDirection = entries.find(entry => routePath(entry.href) === '/about/#phone-plan');
    if (!phoneDirection || !/planned/i.test([phoneDirection.description, phoneDirection.text, phoneDirection.section].join(' '))) problems.push('Search must identify the contextual Android/Phone direction as planned');
    const expected = ['/projects/', '/pebble/', '/docs/', '/about/', '/about/#phone-plan', ...docs.map(doc => doc.href === '/docs/getting-started/' ? '/docs/' : doc.href), ...projects.filter(project => project.availability !== 'planned').map(project => `/projects/${project.slug}/`)];
    for (const route of expected) if (!destinations.includes(route)) problems.push('Search is missing ' + route);
  }
}
if (problems.length) {
  console.error(problems.join('\n'));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ passed:true, base:basePath, pages:pages.size, internalReferences:checkedReferences,
    anchors:checkedAnchors, referencedAssets:checkedAssets.size, catalogueProducts:catalogueProducts.length,
    downloadableApps:catalogueProducts.filter(project => project.download).length, plannedProjects:planned.length,
    libraries:libraries.length, guides:docs.length, preservedNativeCaptures:provenance.images.filter(entry => !entry.current_release_capture).length,
    currentNativeCaptures:provenance.images.filter(entry => entry.current_release_capture && entry.evidence_type === 'native-emulator-screenshot').length,
    galleryScreenshots:Object.values(screenshotGalleries).flat().length,
    phoneSettingsPreviews:provenance.images.filter(entry => entry.evidence_type === 'packaged-settings-browser-preview').length,
    pluginIcons:provenance.images.filter(entry => entry.evidence_type === 'original-plugin-icon').length }, null, 2));
}
