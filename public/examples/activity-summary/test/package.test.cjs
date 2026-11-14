'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {execFileSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');

test('the built phone-only PBW executes its actual bundle against the real SDK handler contract', async () => {
  execFileSync('python3', ['scripts/build.py'], {cwd: root});
  const files = JSON.parse(execFileSync('python3', ['-c',
    'import json,zipfile\nwith zipfile.ZipFile("build/Activity-Summary-Demo-0.1.0.pbw") as z: print(json.dumps({n:z.read(n).decode() for n in z.namelist()}))'],
  {cwd: root, encoding: 'utf8'}));
  assert.deepEqual(Object.keys(files).sort(), ['THIRD_PARTY.md', 'appinfo.json', 'config.html', 'licenses/Activities-LICENSE.txt', 'plugin.js']);
  const app = JSON.parse(files['appinfo.json']), pkg = require('../package.json');
  assert.equal(app.manifestVersion, 2); assert.equal(app.uuid, pkg.pebble.uuid);
  assert.deepEqual(app.plugin.sources, pkg.pebble.plugin.sources);
  assert.deepEqual(app.plugin.sources[0].items, ['summary']);
  assert.deepEqual(app.usesPermissions, []); assert.deepEqual(app.targetPlatforms, []);
  assert.equal(app.plugin.actions, undefined);
  assert.equal(files['config.html'], fs.readFileSync(path.join(root, 'config.html'), 'utf8'));
  assert.match(files['licenses/Activities-LICENSE.txt'], /PolyForm Noncommercial/);
  const values = new Map(), handlers = {};
  vm.runInNewContext(files['plugin.js'], {Promise,Date,Math,JSON,Number,
    localStorage: {getItem: key => values.has(key) ? values.get(key) : null, setItem: (key, value) => values.set(key, String(value))},
    Pebble: {registerSourceHandler: handler => {handlers.source = handler;}, registerConfigHandler: handler => {handlers.config = handler;}}});
  let saved, response;
  handlers.config({type: 'setDemo', action: 'message', text: 'Bundle works'}, value => {saved = value;});
  assert.equal(saved.ok, true);
  await handlers.source({category: 'activity', item: 'summary'}, {data: value => {response = value;}, error: code => {throw Error(code);}});
  const item = response.instances.find(instance => instance.instanceId === 'manual-demo-1');
  assert.equal(JSON.parse(item.properties.content.longText.text).headline.text, 'Bundle works');
});
