'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const {fixture,NOW,keys} = require('./fixture.cjs');
test('one host dispatcher reads the selected source and preserves callback ownership', () => {
  const demo=fixture();demo.host.ready();
  assert.equal(demo.subscriptions.filter(entry=>entry.request.category==='preferences').length,1);
  demo.preferences();demo.source();
  assert.equal(demo.host.status().ready,1);
  const before=demo.subscriptions.length;
  demo.host.appmessage({payload:{unrelated:1}});assert.equal(demo.subscriptions.length,before);
  demo.host.appmessage({payload:{[keys.REQUEST_READINGS]:1}});
  assert.equal(demo.subscriptions.filter(entry=>entry.request.category==='preferences'&&!entry.closed).length,1);
  assert.ok(demo.packets.every(payload=>Object.keys(payload).length===1));
});
test('actual JS coordinator bytes pass the actual Core native lifecycle', () => {
  const scratch=fs.mkdtempSync(path.join(os.tmpdir(),'xoce-core-example-'));
  try {
    const demo=fixture();demo.host.ready();demo.preferences();demo.source();
    const packet=path.join(scratch,'reading.bin');fs.writeFileSync(packet,demo.packet());
    const binary=path.join(scratch,'core-host');
    const root=path.resolve(__dirname,'..');
    const dependency=path.join(root,'node_modules/pebble-watchface-core');
    const compile=spawnSync(process.env.CC||'cc',['-std=c99','-Wall','-Wextra','-Werror',
      '-I'+path.join(dependency,'include'),path.join(root,'test/native-peer.c'),
      path.join(dependency,'src/c/readings.c'),'-lm','-o',binary],{encoding:'utf8'});
    assert.equal(compile.status,0,compile.error?.message||compile.stderr);
    const run=spawnSync(binary,[packet,String(NOW)],{encoding:'utf8'});
    assert.equal(run.status,0,run.stderr);assert.match(run.stdout,/PASS/);
  } finally {fs.rmSync(scratch,{recursive:true,force:true});}
});
