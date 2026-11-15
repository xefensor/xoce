#!/usr/bin/env node
// Audit the generated site, including links that only exist on secondary pages.
import assert from 'node:assert/strict';
import { basePath, sitePath, routePath } from '../src/lib/site.ts';
import { rankSearchEntries } from '../src/lib/search.mjs';
import { readImageDimensions } from './image-dimensions.mjs';
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
// Downloadable plugin sources are audited as examples, not dressed as website pages.
// Keep this explicit: other HTML still needs the complete website contract.
const sourceExampleHtml = new Map([
  ['/examples/activity-summary/', 'examples/activity-summary/index.html'],
  ['/examples/activity-summary/config.html', 'examples/activity-summary/config.html'],
  ['/examples/core-readings/', 'examples/core-readings/index.html'],
]);
const generatedExampleFiles = files.map(filename => path.relative(dist, filename).split(path.sep).join('/')).filter(relative => {
  if (!/^examples\/(?:activity-summary|core-readings)\//.test(relative)) return false;
  const directories = relative.split('/').slice(2, -1);
  return directories.some(directory => ['node_modules', 'vendor', 'build'].includes(directory)) || /\.(?:tgz|pbw|o)$/i.test(relative);
});
if (generatedExampleFiles.length) problems.push(`Downloadable source examples contain ${generatedExampleFiles.length} generated dependency/build file(s): ${generatedExampleFiles.slice(0, 5).join(', ')}${generatedExampleFiles.length > 5 ? ', …' : ''}`);

for (const filename of files.filter((file) => file.endsWith('.html'))) {
  const html = fs.readFileSync(filename, 'utf8');
  const route = pageRoute(filename);
  const sourceExample = sourceExampleHtml.has(route);
  const ids = [...html.matchAll(/\sid\s*=\s*(["'])(.*?)\1/g)].map((match) => decode(match[2]));
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length) problems.push(`${route}: duplicate IDs: ${[...new Set(duplicateIds)].join(', ')}`);
  if ((html.match(/<h1(?:\s|>)/g) || []).length !== 1) problems.push(`${route}: expected one main heading`);
  if (sourceExample) {
    if (!/<title>[^<]*\S[^<]*<\/title>/i.test(html)) problems.push(`${route}: source example needs a meaningful title`);
  } else {
    if (!/<title>[^<]*XOCE[^<]*<\/title>/i.test(html)) problems.push(`${route}: missing meaningful XOCE title`);
    if (!/<main(?:\s|>)/i.test(html)) problems.push(`${route}: missing main landmark`);
    if ((html.match(/<link\b[^>]*rel="canonical"/g) || []).length !== 1) problems.push(`${route}: expected one canonical URL`);
  }
  pages.set(route, { filename, html, ids: new Set(ids), references: references(html), sourceExample });
}
for (const [route, relative] of sourceExampleHtml) {
  const original = path.join(root, 'public', relative);
  const built = path.join(dist, relative);
  if (!pages.has(route) || !fs.existsSync(original)) problems.push(`Missing downloadable example HTML: ${route}`);
  else if (!fs.readFileSync(original).equals(fs.readFileSync(built))) problems.push(`${route}: downloadable source HTML must remain unchanged in the built site`);
}
const exampleManifest = path.join(dist, 'examples/activity-summary/package.json');
if (!fs.existsSync(exampleManifest)) problems.push('Missing activity-summary example package manifest');
else {
  try {
    const example = JSON.parse(fs.readFileSync(exampleManifest, 'utf8'));
    if (example.pebble?.projectType !== 'plugin' || example.pebble.configPage !== 'config.html' || example.pebble.plugin?.script !== 'plugin.js' || example.pebble.watchapp || example.pebble.targetPlatforms) {
      problems.push('Activity-summary example must remain a phone plugin with its packaged config page and no watch app');
    }
    if (!example.pebble?.plugin?.sources?.some(source => source.category === 'activity' && source.items?.includes('summary'))) problems.push('Activity-summary example must declare its activity/summary source');
    if (!/^file:vendor\//.test(example.dependencies?.['pebble-activities'] ?? '')) problems.push('Activity-summary example must use its checked local library archive');
    for (const script of ['fetch:library', 'manifest:check', 'test', 'build']) if (typeof example.scripts?.[script] !== 'string') problems.push(`Activity-summary example is missing its ${script} command`);
  } catch (error) { problems.push('Invalid activity-summary example package manifest: ' + error.message); }
}
const coreExampleManifest = path.join(dist, 'examples/core-readings/package.json');
if (!fs.existsSync(coreExampleManifest)) problems.push('Missing core-readings example package manifest');
else {
  try {
    const example = JSON.parse(fs.readFileSync(coreExampleManifest, 'utf8'));
    if (example.pebble?.projectType !== 'native' || example.pebble.watchapp?.watchface !== false || JSON.stringify(example.pebble.targetPlatforms) !== JSON.stringify(['emery'])) {
      problems.push('Core-readings example must retain its declared native Emery host contract');
    }
    if (!/^file:vendor\//.test(example.dependencies?.['pebble-watchface-core'] ?? '')) problems.push('Core-readings example must use its checked local library archive');
    for (const script of ['fetch:library', 'test', 'build', 'build:watch']) if (typeof example.scripts?.[script] !== 'string') problems.push(`Core-readings example is missing its ${script} command`);
  } catch (error) { problems.push('Invalid core-readings example package manifest: ' + error.message); }
}

const mainRoutes = ['/android/', '/pebble/', '/projects/', '/docs/', '/about/'];
const retiredPortals = ['/users/', '/developers/', '/design/'];
const legacyRoutes = ['/docs/getting-started/', '/docs/pebble/setup/', '/docs/pebble/controls/',
  '/docs/pebble/troubleshooting/', '/docs/project/licensing/', '/docs/develop/activities/', '/docs/develop/core/'];
const platformGuides = ['/docs/android/phone/', '/docs/pebble/phone-connection/'];
const developerRoutes = ['/docs/develop/', '/docs/develop/building/', '/docs/develop/ui/'];
const designRoutes = ['/docs/design/', '/docs/design/principles/', '/docs/design/visual-identity/',
  '/docs/design/pebble-ui-system/', '/docs/design/ui-patterns/', '/docs/design/interaction/'];
const historicalRoutes = ['/docs/history/pebble-ui-system/', '/docs/history/ui-patterns/', '/docs/history/interaction/'];
for (const route of ['/', ...mainRoutes, ...retiredPortals, ...legacyRoutes, ...platformGuides, ...developerRoutes, ...designRoutes, ...historicalRoutes]) {
  if (!pages.has(route)) problems.push(`Required page is missing: ${route}`);
}
for (const [route, page] of pages) {
  if (route.startsWith('/lab/')) problems.push(`Removed Lab route is still published: ${route}`);
  if (page.references.some((reference) => /^\/lab(?:\/|#|$)/.test(reference))) {
    problems.push(`${route}: still links to the removed Lab`);
  }
  if (/\bdata-workspace(?:[-\s=>])/.test(page.html)) problems.push(`${route}: still includes the removed workspace demo`);
  if (page.sourceExample) continue;
  const navigation = page.html.match(/<nav\b(?=[^>]*\bdata-site-nav\b)[^>]*>([\s\S]*?)<\/nav>/i)?.[1];
  if (navigation && references(navigation).some(href => retiredPortals.includes(href))) problems.push(route + ': retired documentation portals must not remain in main navigation');
  if (!navigation || JSON.stringify(references(navigation)) !== JSON.stringify(['/projects/', '/docs/', '/about/'])) {
    problems.push(`${route}: global navigation must link directly to Software, Docs and About`);
  }
  const footer = page.html.match(/<footer\b[^>]*>([\s\S]*?)<\/footer>/i)?.[1] ?? '';
  if (['/projects/', '/pebble/', '/docs/develop/', '/docs/design/'].some(destination => !references(footer).includes(destination))) {
    problems.push(`${route}: footer must retain direct software, developer and design destinations`);
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
  '/developers/': '/docs/develop/',
  '/design/': '/docs/design/',
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
function elementBlock(markup, tag, matches) {
  const tokens = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'gi');
  let opening;
  while ((opening = tokens.exec(markup))) {
    if (opening[0].startsWith('</') || !matches(opening[0])) continue;
    let depth = 1, token;
    while ((token = tokens.exec(markup))) {
      depth += token[0].startsWith('</') ? -1 : 1;
      if (!depth) return { html: markup.slice(opening.index, tokens.lastIndex), start: opening.index, end: tokens.lastIndex };
    }
    break;
  }
  return undefined;
}
function needsLink(route, destination, purpose) {
  if (!references(mainMarkup(route)).includes(destination)) problems.push(`${route}: missing ${purpose} link to ${destination}`);
}
for (const guide of docs) {
  const page = pages.get(guide.href);
  if (!page || !/<article\b[^>]*class="[^"]*prose/.test(page.html)) problems.push(`${guide.href}: documented guide must be a real article`);
  if (!pages.get('/docs/')?.references.includes(guide.href)) problems.push('/docs/ sidebar is missing ' + guide.href);
  if (!page) continue;
  const historyNote = page.html.match(/<aside\b(?=[^>]*\bdata-doc-status="historical")[^>]*>([\s\S]*?)<\/aside>/i)?.[1];
  if (guide.status === 'historical') {
    const current = docs.find(doc => doc.href === guide.currentGuide);
    if (!current || current.status === 'historical') problems.push(`${guide.href}: historical guide must identify a maintained current reference`);
    if (!historyNote || !/historical|archiv/i.test(visibleText(historyNote)) || !references(historyNote).includes(guide.currentGuide)) {
      problems.push(`${guide.href}: historical article must visibly link to its current reference in a separate notice`);
    }
  } else {
    if (historyNote) problems.push(`${guide.href}: current guide must not display the historical notice`);
    const pagination = page.html.match(/<nav\b(?=[^>]*\baria-label="Previous and next guides")[^>]*>([\s\S]*?)<\/nav>/i)?.[1];
    if (!pagination) problems.push(`${guide.href}: missing guide navigation`);
    if (references(pagination ?? '').some(href => docs.some(doc => doc.href === href && doc.status === 'historical'))) {
      problems.push(`${guide.href}: current guide pagination must not lead into historical studies`);
    }
  }
}
const overviewTasks = {
  '/docs/develop/': ['/docs/develop/building/', '/docs/develop/activities/', '/docs/develop/core/', '/docs/develop/ui/'],
  '/docs/design/': ['/docs/design/principles/', '/docs/design/visual-identity/', '/docs/design/pebble-ui-system/', '/docs/design/ui-patterns/', '/docs/design/interaction/'],
};
for (const [route, destinations] of Object.entries(overviewTasks)) {
  const article = mainMarkup(route).match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)?.[1] ?? '';
  for (const destination of destinations) if (!references(article).includes(destination)) problems.push(`${route}: overview article must offer the task link ${destination}`);
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
for (const route of ['/', '/projects/']) {
  const main = mainMarkup(route);
  const comparison = elementBlock(main, 'details', tag => /\bdata-watchface-comparison(?:[\s=>])/.test(tag))?.html ?? '';
  const summary = comparison.match(/<summary\b[^>]*>([\s\S]*?)<\/summary>/i)?.[1] ?? '';
  if (!comparison || (main.match(/\bdata-watchface-comparison(?:[\s=>])/g) ?? []).length !== 1 || !visibleText(summary) || !/<caption\b/.test(comparison)) {
    problems.push(`${route}: provide one native watchface comparison with a readable summary and table caption`);
  }
  for (const watchface of catalogueProducts.filter(project => project.kind === 'watchface')) {
    for (const destination of [`/projects/${watchface.slug}/`, watchface.guide]) if (!references(comparison).includes(destination)) problems.push(`${route}: comparison is missing the ${watchface.name} product or setup link`);
    if (!visibleText(comparison).includes(`v${watchface.version}`)) problems.push(`${route}: comparison must identify the current ${watchface.name} version`);
  }
}
const { highlightsForProject } = await import(pathToFileURL(path.join(root, 'src/data/release-highlights.ts')).href);
for (const project of catalogueProducts.filter(project => project.publication === 'published')) {
  const route = `/projects/${project.slug}/`, main = mainMarkup(route);
  const block = elementBlock(main, 'section', tag => tag.includes(`data-release-highlights="${project.slug}"`));
  let highlights;
  try { highlights = highlightsForProject(project); }
  catch (error) { problems.push(error.message); continue; }
  if (!block || (main.match(/\bdata-release-highlights=/g) ?? []).length !== 1) { problems.push(`${route}: provide one current release-highlights section`); continue; }
  if (!block.html.includes(`data-release-tag="${project.tag}"`) || !visibleText(block.html.match(/<h2\b[^>]*>[\s\S]*?<\/h2>/i)?.[0] ?? '').includes(`v${project.version}`)) problems.push(`${route}: release-highlight heading/tag differs from the catalogue`);
  if (!references(block.html).includes(highlights.source)) problems.push(`${route}: highlights must link to their exact reviewed release`);
  const changes = [...block.html.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi)].map(match => visibleText(match[1]));
  if (JSON.stringify(changes) !== JSON.stringify(highlights.changes) || changes.length < 2 || changes.length > 3) problems.push(`${route}: release highlights differ from the reviewed concise changes`);
  const hero = elementBlock(main, 'section', tag => tag.includes('aria-labelledby="product-title"'));
  const story = main.indexOf('id="story-title"');
  if (!hero || block.start < hero.end || story < block.end) problems.push(`${route}: release highlights must follow the hero and precede the detailed story`);
}
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
  } else if (project.kind !== 'library' && project.publication !== 'preview') problems.push(`${route}: published app is missing a download`);
  if (project.publication === 'published') { needsLink(route, project.storeUrl, 'public Store listing'); if (!main.includes('data-install-state="published"')) problems.push(`${route}: published installation action missing`); }
  if (project.publication === 'preview' && (project.download || project.storeUrl)) problems.push(`${route}: preview advertises an unverified install`);
  if (project.publication === 'preview' && !main.includes('data-install-state="preview"')) problems.push(`${route}: release preparation must be visible`);
  if (project.kind !== 'library') {
    needsLink(route, project.supportUrl, 'product support'); needsLink(route, project.privacyUrl, 'product privacy');
    for (const suffix of ['privacy','support']) if (!pages.has(`/projects/${project.slug}/${suffix}/`)) problems.push(`${route}: missing ${suffix} page`);
    if (project.previewType === 'watch') for (const shape of ['emery','gabbro']) {
      const image=project.previews?.[shape];
      if (!image || !links.includes(image.image)) problems.push(`${route}: missing ${shape} preview`);
    }
  }
  if (project.licence) needsLink(route, project.licence.url, 'project licence');
  if (project.image && !links.includes(project.image)) problems.push(`${route}: missing the native product capture`);
}
const policies=JSON.parse(fs.readFileSync(path.join(root,'docs/policy-provenance.json'),'utf8'));
for (const record of policies.filter(r=>r.kind==='privacy')) {
  const source=fs.readFileSync(path.join(root,'src/pages/projects',record.project,'privacy.md'),'utf8').replace(/^---[\s\S]*?---\n\n/,'');
  if (createHash('sha256').update(source).digest('hex')!==record.source_body_sha256) problems.push(record.project+': privacy text differs from app-owned policy');
}
const reviewed=JSON.parse(fs.readFileSync(path.join(root,'docs/reviewed-artifacts.json'),'utf8'));
for (const project of catalogueProducts) {
  const artifact=reviewed.artifacts.find(a=>a.product===project.name);
  if (!artifact || artifact.version!==project.version || artifact.uuid.toLowerCase()!==project.uuid?.toLowerCase() || artifact.sha256!==project.artifactSha256 || JSON.stringify(artifact.watchPlatforms)!==JSON.stringify([...(project.watchPlatforms??[])].sort())) problems.push(project.name+': website differs from the inspected PBW');
}
const provenance = JSON.parse(fs.readFileSync(path.join(root, 'docs/asset-provenance.json'), 'utf8'));
const fonts=JSON.parse(fs.readFileSync(path.join(root,'public/fonts/xoce/provenance.json'),'utf8'));
for(const font of fonts.exports){
  const file=path.join(root,'public/fonts/xoce',font.file),built=path.join(dist,'fonts/xoce',font.file);
  if(!fs.existsSync(file)||!fs.existsSync(built)||fs.readFileSync(file).toString('ascii',0,4)!=='wOFF'||createHash('sha256').update(fs.readFileSync(file)).digest('hex')!==font.sha256||createHash('sha256').update(fs.readFileSync(built)).digest('hex')!==font.sha256) problems.push('Pinned self-hosted font differs: '+font.file);
}
for (const entry of [provenance.device_presentation, ...(provenance.additional_device_presentations ?? []), ...provenance.images]) {
  const filename = path.join(root, 'public', entry.site_path);
  if (!fs.existsSync(filename)) { problems.push('Missing native capture ' + entry.site_path); continue; }
  const bytes = fs.readFileSync(filename);
  const published = path.join(dist, entry.site_path);
  if (!fs.existsSync(published) || createHash('sha256').update(fs.readFileSync(published)).digest('hex') !== entry.sha256) problems.push('Published asset differs from provenance: ' + entry.site_path);
  if (createHash('sha256').update(bytes).digest('hex') !== entry.sha256) problems.push('Native capture pixels changed: ' + entry.site_path);
  if (entry.site_path.endsWith('.svg')) {
    const svg = bytes.toString('utf8').match(/<svg\b[^>]*>/i)?.[0] ?? '';
    const width = Number(svg.match(/\bwidth="([\d.]+)(?:px)?"/)?.[1]);
    const height = Number(svg.match(/\bheight="([\d.]+)(?:px)?"/)?.[1]);
    if (entry.evidence_type !== 'original-xoce-product-mark' || width !== entry.width || height !== entry.height) problems.push('Vector artwork dimensions or classification changed: ' + entry.site_path);
  } else {
    try {
      const dimensions = readImageDimensions(bytes, { allowJpeg: entry.evidence_type === 'packaged-settings-browser-preview' });
      const expectedFormat = /\.jpe?g$/i.test(entry.site_path) ? 'jpeg' : 'png';
      if (dimensions.format !== expectedFormat || dimensions.width !== entry.width || dimensions.height !== entry.height) problems.push('Capture format or dimensions changed: ' + entry.site_path);
    } catch (error) { problems.push(`${entry.site_path}: ${error.message}`); }
  }
}
const { representsRelease: checkedCaptureReuse } = await import('./capture-provenance.mjs');
function representsRelease(capture, version, artifactSha256) {
  return checkedCaptureReuse(capture, version, artifactSha256, proofPath => {
    const file = path.join(root, 'public', proofPath);
    return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : undefined;
  });
}

const setupRoute = '/docs/pebble/setup/';
const setupMain = mainMarkup(setupRoute);
const walkthrough = elementBlock(setupMain, 'section', tag => /\bdata-setup-walkthrough(?:[\s=>])/.test(tag))?.html ?? '';
const { setupExamples } = await import(pathToFileURL(path.join(root, 'src/data/setup.ts')).href);
const choice = walkthrough.match(/<fieldset\b[^>]*>([\s\S]*?)<\/fieldset>/i)?.[1] ?? '';
const radios = [...choice.matchAll(/<input\b[^>]*>/gi)].map(match => match[0]);
function attributeValue(tag, name) { return decode(tag.match(new RegExp(`\\s${name}="([^"]*)"`, 'i'))?.[1] ?? ''); }
if (!walkthrough || !visibleText(choice.match(/<legend\b[^>]*>([\s\S]*?)<\/legend>/i)?.[1] ?? '') || radios.length !== setupExamples.length || radios.filter(tag => /\schecked(?:[\s=>])/.test(tag)).length !== 1) {
  problems.push(`${setupRoute}: illustrated setup needs a labelled native watchface radio group with one initial choice`);
}
const builtCss = files.filter(filename => filename.endsWith('.css')).map(filename => fs.readFileSync(filename, 'utf8')).join('\n');
const visibilityRules = [...builtCss.matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter(match => /display\s*:\s*none\b/.test(match[2])).map(match => match[1]);
let publicCaptures = [];
try { publicCaptures = JSON.parse(fs.readFileSync(path.join(dist, 'preview-provenance.json'), 'utf8')).images ?? []; }
catch (error) { problems.push('Could not read public capture provenance: ' + error.message); }
for (const example of setupExamples) {
  const slug = example.project.slug;
  const face = elementBlock(walkthrough, 'section', tag => tag.includes(`data-setup-face="${slug}"`))?.html ?? '';
  const radio = radios.find(tag => attributeValue(tag, 'value') === slug) ?? '';
  const radioId = attributeValue(radio, 'id');
  if (attributeValue(radio, 'type') !== 'radio' || attributeValue(radio, 'name') !== 'setup-watchface' || !radioId || /\sdisabled(?:[\s=>])/.test(radio) || !face) problems.push(`${setupRoute}: ${slug} must remain selectable with a native radio and readable setup section`);
  for (const other of setupExamples.filter(item => item.project.slug !== slug)) {
    if (!visibilityRules.some(selectors => selectors.split(',').some(selector => selector.includes(`:has(#${radioId}:checked)`) && selector.includes(`.setup-face-${other.project.slug}`)))) problems.push(`${setupRoute}: the ${slug} radio must switch the alternate setup using CSS without JavaScript`);
  }
  if (!visibleText(face.match(/<h3\b[^>]*>([\s\S]*?)<\/h3>/i)?.[1] ?? '').includes(`${example.project.name} · v${example.project.version}`)) problems.push(`${setupRoute}: ${slug} setup must identify its current settings version`);
  const anchors = [...face.matchAll(/<a\b[^>]*>/gi)].flatMap(match => references(match[0]));
  const images = [...face.matchAll(/<img\b[^>]*>/gi)].flatMap(match => references(match[0]));
  const figures = [...face.matchAll(/<figure\b[^>]*>[\s\S]*?<\/figure>/gi)].map(match => match[0]);
  for (const image of [example.landing, example.priority, example.save, example.watch]) {
    const capture = provenance.images.find(entry => entry.site_path === image.image);
    const kind = image === example.watch ? 'native-emulator-screenshot' : 'packaged-settings-browser-preview';
    if (!capture || capture.evidence_type !== kind || capture.capture_version !== image.version || capture.width !== image.width || capture.height !== image.height || !representsRelease(capture, example.project.version, example.project.artifactSha256)) problems.push(`${setupRoute}: ${slug} illustrated capture differs from its version, dimensions or checked PBW: ${image.image}`);
    if (image === example.priority || image === example.save) {
      const crop = capture?.display_crop, viewport = capture?.source_viewport;
      if (!crop || !['x', 'y', 'width', 'height'].every(key => Number.isInteger(crop[key])) || crop.x < 0 || crop.y < 0 || crop.width <= 0 || crop.height <= 0 || crop.x + crop.width > image.width || crop.y + crop.height > image.height || crop.width !== image.displayWidth || crop.height !== image.displayHeight || viewport?.width !== image.width || viewport?.height !== image.height) problems.push(`${setupRoute}: ${slug} settings crop must fit its unchanged full browser capture and match the displayed pane`);
    }
    if (!anchors.includes(image.image) || !images.includes(image.image)) problems.push(`${setupRoute}: each ${slug} setup image must link to its unchanged full capture: ${image.image}`);
    const caption = figures.filter(figure => references(figure).includes(image.image)).map(figure => visibleText(figure.match(/<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/i)?.[1] ?? '')).find(text => text.includes(`v${image.version}`));
    if (!caption || (image.version !== example.project.version && (!caption.includes(`v${example.project.version}`) || !/reus|represent/i.test(caption)))) problems.push(`${setupRoute}: ${slug} setup captions must retain actual capture and represented versions`);
    const mirrored = publicCaptures.find(entry => entry.site_path === image.image);
    if (!capture || !mirrored || ['sha256', 'capture_version', 'source_pbw_sha256', 'evidence_type', 'width', 'height', 'represented_release', 'represented_pbw_sha256', 'release_reuse_proof'].some(key => capture[key] !== mirrored[key]) || ['display_crop', 'source_viewport'].some(key => ['x', 'y', 'width', 'height'].some(dimension => capture?.[key]?.[dimension] !== mirrored?.[key]?.[dimension]))) problems.push(`${setupRoute}: ${slug} setup capture must have matching public provenance: ${image.image}`);
  }
  for (const destination of ['/docs/pebble/troubleshooting/#settings-seem-not-to-save', '/docs/pebble/troubleshooting/#an-activity-is-missing']) if (!anchors.includes(destination)) problems.push(`${setupRoute}: ${slug} illustrated setup must offer recovery at ${destination}`);
}
for (const destination of ['#timer', '#enable-shared-information', '#before-installing', '/preview-provenance.json']) if (!references(walkthrough).includes(destination)) problems.push(`${setupRoute}: illustrated setup is missing its prerequisite, full-instruction or evidence link ${destination}`);
for (const route of ['/docs/', '/docs/getting-started/', '/docs/pebble/activities/']) needsLink(route, `${setupRoute}#illustrated-first-setup`, 'illustrated first setup');

for (const project of products.filter(project => project.image)) {
  const capture = provenance.images.find(entry => entry.site_path === project.image);
  if ((!capture || capture.capture_version !== project.imageVersion)) problems.push(`${project.slug}: screenshot version/provenance differs`);
  if (!mainMarkup(`/projects/${project.slug}/`).includes(`${project.name} v${project.imageVersion}`)) problems.push(`${project.slug}: screenshot version caption is missing`);
}
for (const project of catalogueProducts) {
  if (!project.storeArtwork || !provenance.images.some(entry=>entry.site_path===project.storeArtwork.mark&&entry.evidence_type==='original-xoce-product-mark') || !provenance.images.some(entry=>entry.site_path===project.storeArtwork.shareImage&&entry.width===720&&entry.height===320&&entry.original_artwork===true)) problems.push(project.name+': missing coordinated artwork provenance');
  const markup=pages.get(`/projects/${project.slug}/`)?.html??'';
  if (!markup.includes('property="og:image"') || !markup.includes(sitePath(project.storeArtwork?.shareImage??''))) problems.push(project.name+': missing family share image');
}
const { screenshotGalleries } = await import(pathToFileURL(path.join(root, 'src/data/screenshots.ts')).href);
for (const [slug, screenshots] of Object.entries(screenshotGalleries)) {
  const project = projects.find(project => project.slug === slug);
  const markup = mainMarkup(`/projects/${slug}/`);
  if (!project || !markup.includes('id="screenshots"')) problems.push(`${slug}: gallery is missing`);
  if (!project?.showcase || !screenshots.some(screenshot => screenshot.image === project.showcase.image)) problems.push(`${slug}: illustrated feature must use a capture from its verified gallery`);
  if (!markup.includes('id="story-title"') || !markup.includes('id="connection-title"')) problems.push(`${slug}: illustrated features or product connections are missing`);
  for (const screenshot of screenshots) {
    const capture = provenance.images.find(entry => entry.site_path === screenshot.image);
    const expectedEvidence = screenshot.kind === 'watch' ? 'native-emulator-screenshot' : 'packaged-settings-browser-preview';
    if (!capture || capture.evidence_type !== expectedEvidence || capture.capture_version !== screenshot.version || !representsRelease(capture, project?.version, project?.artifactSha256) || (screenshot.representedReleaseVersion ?? screenshot.version) !== project?.version || (capture.source_url ?? '/preview-provenance.json') !== screenshot.source) problems.push(`${slug}: screenshot release, source or evidence classification differs: ${screenshot.image}`);
    if (!capture || capture.width !== screenshot.width || capture.height !== screenshot.height) problems.push(`${slug}: gallery dimensions differ: ${screenshot.image}`);
    if (!references(markup).includes(screenshot.image) || !references(markup).includes(screenshot.source)) problems.push(`${slug}: screenshot or source link missing: ${screenshot.image}`);
    if (screenshot.kind === 'watch' && (screenshot.width !== (screenshot.platform==='gabbro'?260:200) || screenshot.height !== (screenshot.platform==='gabbro'?260:228))) problems.push(`${slug}: native watch capture proportions differ`);
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
    for (const guide of docs.filter(doc => doc.status === 'historical')) {
      const entry = entries.find(item => routePath(item.href) === guide.href);
      if (!entry || entry.status !== 'historical' || !/history|historical|archiv/i.test(entry.section) || !/historical|archiv/i.test(entry.title)) {
        problems.push(`Search must distinguish the historical guide ${guide.href}`);
      }
    }
    if (!rankSearchEntries(entries, 'UI').slice(0, 3).some(entry => routePath(entry.href) === '/docs/develop/ui/')) {
      problems.push('Search must surface the current UI integration guide ahead of incidental article matches');
    }
    const buildEntry = entries.find(entry => routePath(entry.href) === '/docs/develop/building/');
    for (const project of catalogueProducts) if (!buildEntry?.text?.includes(`${project.name} ${project.version}`)) problems.push(`Build-guide search text is missing the current ${project.name} version`);
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
