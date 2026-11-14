#!/usr/bin/env node
// Explicit integration check: first use downloads two checksum-pinned releases.
// Work copies, archives, dependencies and binaries stay outside Astro public/.
import { cp, mkdir, readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root=fileURLToPath(new URL('../',import.meta.url));
const output=path.join(root,'build/qa/developer-examples');
const cache=path.join(root,'build/qa/developer-example-cache');
let upstreamDir,watch=false;
for(let i=2;i<process.argv.length;i++) {
  if(process.argv[i]==='--upstream-dir'&&process.argv[i+1])upstreamDir=path.resolve(process.argv[++i]);
  else if(process.argv[i]==='--watch')watch=true;
  else throw Error('Usage: node scripts/check-developer-examples.mjs [--upstream-dir DIR] [--watch]');
}
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
async function sourceInventory(directory) {
  const result={};
  async function visit(current) {
    for(const item of await readdir(current,{withFileTypes:true})) {
      const filename=path.join(current,item.name),relative=path.relative(directory,filename);
      if(item.isDirectory()) {
        if(['node_modules','vendor','build','__pycache__'].includes(item.name))throw Error('Generated directory in public example: '+relative);
        await visit(filename);
      } else if(item.isFile()) {
        const bytes=await readFile(filename);
        if(/\.(?:pbw|tgz|zip|pyc|bin|elf)$/i.test(filename)||bytes.includes(0))throw Error('Non-source artifact in public example: '+relative);
        result[relative]=digest(bytes);
      } else throw Error('Unexpected public example entry: '+relative);
    }
  }
  await visit(directory);return result;
}
function run(cwd,command,args) {
  const result=spawnSync(command,args,{cwd,encoding:'utf8',maxBuffer:8*1024*1024});
  if(result.stdout)process.stdout.write(result.stdout);
  if(result.stderr)process.stderr.write(result.stderr);
  if(result.error)throw result.error;
  if(result.status!==0)throw Error(`${command} ${args.join(' ')} failed (${result.status})`);
}
await mkdir(output,{recursive:true});await mkdir(cache,{recursive:true});
const reports=[];
for(const name of ['activity-summary','core-readings']) {
  const source=path.join(root,'public/examples',name),before=await sourceInventory(source);
  const upstream=JSON.parse(await readFile(path.join(source,'upstream.json'),'utf8'));
  if(!/^[a-f0-9]{64}$/.test(upstream.sha256))throw Error('Missing upstream digest: '+name);
  const cached=path.join(cache,upstream.archive);
  let archive;
  if(upstreamDir)archive=await readFile(path.join(upstreamDir,upstream.archive));
  else {
    try {archive=await readFile(cached);} catch(error) {if(error.code!=='ENOENT')throw error;}
    if(!archive) {
      const response=await fetch(upstream.url,{signal:AbortSignal.timeout(45000)});
      if(!response.ok)throw Error(`Upstream download failed (${response.status}): ${upstream.url}`);
      archive=Buffer.from(await response.arrayBuffer());
    }
  }
  if(digest(archive)!==upstream.sha256)throw Error('Upstream archive differs: '+name);
  await writeFile(cached,archive);
  // A fresh directory makes reruns independent of old build/test results.
  const scratch=path.join(output,name+'-'+Date.now());
  await cp(source,scratch,{recursive:true,errorOnExist:true,force:false});
  console.log(`\nChecking ${name} with ${upstream.package}@${upstream.version}`);
  run(scratch,process.execPath,['scripts/fetch-library.mjs','--from',cached]);
  run(scratch,'npm',['ci','--ignore-scripts','--offline','--no-audit','--no-fund']);
  if(name==='activity-summary')run(scratch,'npm',['run','manifest:check']);
  run(scratch,'npm',['test']);run(scratch,'npm',['run','build']);
  if(watch&&name==='core-readings')run(scratch,'npm',['run','build:watch']);
  if(JSON.stringify(before)!==JSON.stringify(await sourceInventory(source)))throw Error('Public source changed during checks: '+name);
  reports.push({name,upstream:{package:upstream.package,version:upstream.version,sha256:upstream.sha256},
    sourceFiles:before,workDirectory:path.relative(root,scratch),tests:'passed',build:'passed',
    nativeSdkBuild:name==='core-readings'&&watch?'passed':'not requested'});
}
const report={result:'PASS',scope:'Actual pinned-library tests with simulated sources/bridge; Core portable JS/C lifecycle. No browser, emulator or physical-device test.',examples:reports};
await writeFile(path.join(output,'report.json'),JSON.stringify(report,null,2)+'\n');
console.log('\nDeveloper examples PASS. Report: '+path.relative(root,path.join(output,'report.json')));
