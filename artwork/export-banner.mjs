#!/usr/bin/env node
// Render an existing outlined SVG master into an isolated candidate PNG.
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2);
const options={};
for(let i=0;i<args.length;i+=2){
  if(!['--source','--output'].includes(args[i])||!args[i+1]||options[args[i]]) throw Error('Usage: node artwork/export-banner.mjs --source /path/to/banner.svg --output build/artwork/banner.png');
  options[args[i]]=args[i+1];
}
if(!options['--source']||!options['--output']) throw Error('Both --source and --output are required');
const source=path.resolve(options['--source']);
const output=path.resolve(options['--output']);
const build=path.join(root,'build');
if(!output.startsWith(build+path.sep)||path.extname(output)!=='.png') throw Error('Candidate output must be a PNG inside this checkout’s ignored build/ directory');
const record=output.replace(/\.png$/,'.json');
for(const file of [output,record]){
  try{await fs.access(file);throw Error('Refusing to replace an existing export: '+file);}catch(error){if(error.code!=='ENOENT')throw error;}
}
const svg=await fs.readFile(source);
const text=svg.toString('utf8');
if(path.extname(source)!=='.svg'||!/<svg\b/.test(text)) throw Error('Expected an SVG master');
// Current masters embed unchanged capture bytes and outline their typography.
// Network/file references and executable content are not part of this format.
if(/<(?:script|foreignObject|text)\b|<!DOCTYPE|<!ENTITY|@import|@font-face/i.test(text)) throw Error('Use a self-contained outlined SVG master');
for(const match of text.matchAll(/(?:href|xlink:href)\s*=\s*["']([^"']*)["']/gi)){
  if(!/^(?:#|data:image\/png;base64,)/.test(match[1])) throw Error('External SVG references are not supported');
}
for(const match of text.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/gi)){
  if(!match[1].startsWith('#')) throw Error('External SVG styles are not supported');
}
const png=await sharp(svg,{limitInputPixels:720*320}).png().toBuffer();
const metadata=await sharp(png).metadata();
if(metadata.width!==720||metadata.height!==320) throw Error('Expected a 720×320 banner master');
await fs.mkdir(path.dirname(output),{recursive:true});
const realParent=await fs.realpath(path.dirname(output));
const realBuild=await fs.realpath(build);
if(realParent!==realBuild&&!realParent.startsWith(realBuild+path.sep)) throw Error('Output directory resolves outside ignored build/');
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const provenance={schemaVersion:1,scope:'Candidate export from an existing outlined master; no app assets or release files changed.',source:path.relative(root,source),sourceSha256:digest(svg),output:path.relative(root,output),sha256:digest(png),dimensions:{width:metadata.width,height:metadata.height},renderer:sharp.versions,nativeCapturePolicy:'Embedded capture bytes remain unchanged in the SVG master. Rendering the promotional composition does not establish fresh native or physical-device evidence.'};
await fs.writeFile(output,png,{flag:'wx'});
await fs.writeFile(record,JSON.stringify(provenance,null,2)+'\n',{flag:'wx'});
console.log(JSON.stringify(provenance,null,2));
