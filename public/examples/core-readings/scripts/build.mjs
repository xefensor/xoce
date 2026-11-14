import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const require=createRequire(import.meta.url),root=fileURLToPath(new URL('../',import.meta.url));
const {fixture,NOW}=require('../test/fixture.cjs');
await mkdir(path.join(root,'build'),{recursive:true});
const demo=fixture();demo.host.ready();demo.preferences();demo.source();
await writeFile(path.join(root,'build/reading.bin'),demo.packet());
const dependency=path.join(root,'node_modules/pebble-watchface-core');
const output=path.join(root,'build/core-host');
const compile=spawnSync(process.env.CC||'cc',['-std=c99','-Wall','-Wextra','-Werror',
  '-I'+path.join(dependency,'include'),path.join(root,'test/native-peer.c'),
  path.join(dependency,'src/c/readings.c'),'-lm','-o',output],{stdio:'inherit'});
if(compile.error)throw compile.error;if(compile.status)process.exit(compile.status);
const run=spawnSync(output,[path.join(root,'build/reading.bin'),String(NOW)],{stdio:'inherit'});
if(run.error)throw run.error;if(run.status)process.exit(run.status);
console.log('Built portable host fixture: build/core-host');
