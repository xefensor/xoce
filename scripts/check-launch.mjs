import { consumerProjects } from '../src/data/projects.ts';
import { verifyRelease } from './launch-readiness.mjs';
const results=[];
for(const project of consumerProjects){const problems=await verifyRelease(project);results.push({product:project.name,version:project.version,ready:!problems.length,problems});}
console.log(JSON.stringify({ready:results.every(r=>r.ready),checks:results,scope:'Public Store UUID/version/platforms and exact matching GitHub/Store PBW bytes. No upload or publication.'},null,2));
if(results.some(r=>!r.ready))process.exitCode=1;
