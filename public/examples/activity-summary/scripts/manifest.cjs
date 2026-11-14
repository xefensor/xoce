'use strict';

const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const check = process.argv.slice(2);
if (check.some(argument => argument !== '--check')) throw Error('Usage: node scripts/manifest.cjs [--check]');
const {createProvider, UUID} = require(path.join(root, 'src/provider.cjs'));
const values = new Map();
const storage = {getItem(key) {return values.has(key) ? values.get(key) : null;},
  setItem(key, value) {values.set(key, String(value));}};
const sources = [JSON.parse(JSON.stringify(createProvider(storage).sourceDeclaration))];
const filename = path.join(root, 'package.json');
const metadata = JSON.parse(fs.readFileSync(filename, 'utf8'));
if (!metadata.pebble || metadata.pebble.uuid !== UUID || !metadata.pebble.plugin) {
  throw Error('Provider UUID and package.pebble.uuid must agree.');
}
if (check.length) {
  if (JSON.stringify(metadata.pebble.plugin.sources) !== JSON.stringify(sources)) {
    throw Error('Plugin source declaration is stale; run npm run manifest.');
  }
  console.log('Plugin source declaration matches the installed library.');
} else {
  metadata.pebble.plugin.sources = sources;
  fs.writeFileSync(filename, JSON.stringify(metadata, null, 2) + '\n');
  console.log('Updated package.pebble.plugin.sources from the installed library.');
}
