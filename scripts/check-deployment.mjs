import { consumerProjects } from '../src/data/projects.ts';
import { verifyWebsiteDeployment } from './launch-readiness.mjs';
const checks=[];
for(const project of consumerProjects){
  const problems=await verifyWebsiteDeployment(project);
  checks.push({product:project.name,version:project.version,publication:project.publication,ready:problems.length===0,problems});
}
console.log(JSON.stringify({ready:checks.every(check=>check.ready),checks,scope:'Website deployment: preparation records have no installation links; published records require exact public Store/GitHub PBW verification. Does not publish apps.'},null,2));
if(checks.some(check=>!check.ready))process.exitCode=1;
