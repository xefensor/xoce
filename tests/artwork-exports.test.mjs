import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
fs.mkdirSync(path.join(root,'build'),{recursive:true});
const run=(command,args)=>spawnSync(command,args,{cwd:root,encoding:'utf8',timeout:30000});
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const temp=()=>fs.mkdtempSync(path.join(root,'build/artwork-test-'));
const exportBanner=(source,output)=>run(process.execPath,['artwork/export-banner.mjs','--source',source,'--output',output]);

test('icon candidates reproduce the 24 checked-in family masters and rasters',()=>{
  const folder=temp();
  try{
    const output=path.join(folder,'icons');
    const result=run('python3',['artwork/generate-icons.py','--product','all','--output',output]);
    assert.equal(result.status,0,result.stderr);
    const baseline=JSON.parse(fs.readFileSync(path.join(root,'artwork/icon-baseline.json'),'utf8'));
    let checked=0;
    for(const product of baseline.products)for(const [name,digest]of Object.entries(product.files)){
      assert.equal(hash(fs.readFileSync(path.join(output,product.slug,name))),digest,product.slug+'/'+name);
      checked++;
    }
    assert.equal(checked,24);
    const before=fs.readFileSync(path.join(output,'timer/icon-small-80.png'));
    assert.notEqual(run('python3',['artwork/generate-icons.py','--product','timer','--output',output]).status,0);
    assert.deepEqual(fs.readFileSync(path.join(output,'timer/icon-small-80.png')),before);
  }finally{fs.rmSync(folder,{recursive:true,force:true});}
});

test('banner export records its source, dimensions and renderer without replacing an existing file',()=>{
  const folder=temp();
  try{
    const source=path.join(folder,'master.svg');
    const output=path.join(folder,'banner.png');
    fs.writeFileSync(source,'<svg xmlns="http://www.w3.org/2000/svg" width="720" height="320"><rect width="720" height="320" fill="#3667ff"/></svg>');
    const result=exportBanner(source,output);
    assert.equal(result.status,0,result.stderr);
    const before=fs.readFileSync(output);
    assert.equal(before.readUInt32BE(16),720);
    assert.equal(before.readUInt32BE(20),320);
    const record=JSON.parse(fs.readFileSync(output.replace(/\.png$/,'.json'),'utf8'));
    assert.equal(record.sourceSha256,hash(fs.readFileSync(source)));
    assert.equal(record.sha256,hash(before));
    assert.equal(record.renderer.sharp,'0.35.5');
    assert.notEqual(exportBanner(source,output).status,0);
    assert.deepEqual(fs.readFileSync(output),before);
  }finally{fs.rmSync(folder,{recursive:true,force:true});}
});

test('candidate tools reject outputs outside ignored build and banners with external references',()=>{
  const folder=temp();
  const outside=fs.mkdtempSync(path.join(os.tmpdir(),'xoce-artwork-test-'));
  try{
    const source=path.join(folder,'master.svg');
    fs.writeFileSync(source,'<svg xmlns="http://www.w3.org/2000/svg" width="720" height="320"><image href="https://example.invalid/watch.png"/></svg>');
    const output=path.join(folder,'banner.png');
    assert.notEqual(exportBanner(source,output).status,0);
    assert.equal(fs.existsSync(output),false);
    assert.notEqual(exportBanner(source,path.join(outside,'banner.png')).status,0);
    assert.notEqual(run('python3',['artwork/generate-icons.py','--output',path.join(outside,'icons')]).status,0);
    assert.deepEqual(fs.readdirSync(outside),[]);
  }finally{fs.rmSync(folder,{recursive:true,force:true});fs.rmSync(outside,{recursive:true,force:true});}
});
