#!/usr/bin/env node
// Audit the generated site, including links that only exist on secondary pages.
import assert from 'node:assert/strict';
import fs from 'node:fs';
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

function references(html) {
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
  return values;
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

for (const route of ['/', '/projects/', '/docs/', '/lab/', '/about/']) {
  if (!pages.has(route)) problems.push(`Required page is missing: ${route}`);
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
  try { url = new URL(value, 'https://xoce.invalid' + from); }
  catch { problems.push(`${from}: malformed URL ${value}`); return; }
  if (url.origin !== 'https://xoce.invalid') return;
  checkedReferences++;
  let pathname;
  try { pathname = decodeURIComponent(url.pathname); }
  catch { problems.push(`${from}: invalid URL encoding ${value}`); return; }
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
  for (const reference of page.references) checkReference(reference, route);
}
for (const filename of files.filter((file) => file.endsWith('.css'))) {
  const source = '/' + path.relative(dist, filename).split(path.sep).join('/');
  const css = fs.readFileSync(filename, 'utf8');
  for (const match of css.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/g)) checkReference(match[2], source);
}

const { projects } = await import(pathToFileURL(path.join(root, 'src/data/projects.ts')).href);
for (const slug of ['dynamic', 'dashboard', 'timer', 'open-activity', 'activities', 'core']) {
  assert.ok(projects.some((project) => project.slug === slug), `The current Pebble collection is missing ${slug}.`);
}
const products = projects.filter((project) => project.kind !== 'library');
for (const project of projects) {
  const route = `/projects/${project.slug}/`;
  const page = pages.get(route);
  if (!page) { problems.push(`Missing project page: ${route}`); continue; }
  if (project.tag !== 'v' + project.version) problems.push(`${route}: release tag does not match its version`);
  if (project.kind !== 'library') {
    if (!project.download) { problems.push(`${route}: missing PBW download`); continue; }
    const repository = project.repo.startsWith('https://') ? project.repo : 'https://github.com/' + project.repo;
    if (!project.download.startsWith(repository.replace(/\/$/, '') + '/releases/download/' + project.tag + '/')) {
      problems.push(`${route}: download is not pinned to the declared repository and release`);
    }
    if (!project.download.endsWith('-' + project.version + '.pbw')) problems.push(`${route}: PBW filename/version differ`);
    if (!page.references.includes(project.download)) problems.push(`${route}: declared PBW download is not linked`);
  }
}

if (problems.length) {
  console.error(problems.join('\n'));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ passed: true, pages: pages.size, internalReferences: checkedReferences,
    anchors: checkedAnchors, referencedAssets: checkedAssets.size, products: products.length,
    libraries: projects.length - products.length }, null, 2));
}
