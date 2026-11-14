// Read-only release verification. This module never logs in, uploads or publishes.
import { createHash } from 'node:crypto';
export const digest = bytes => createHash('sha256').update(bytes).digest('hex');
export function metadataProblems(project) {
  const errors=[];
  if(project.publication!=='published')errors.push('release is still a launch preview');
  if(!/^https:\/\/apps\.repebble\.com\/[a-f\d]{24}$/.test(project.storeUrl??''))errors.push('verified Pebble Store listing URL is missing');
  if(!project.uuid)errors.push('UUID is missing');
  if(!/^\d+(?:\.\d+)*$/.test(project.version??'')||project.tag!=='v'+project.version)errors.push('matching numeric version/tag is missing');
  if(!project.download?.startsWith(project.repo+'/releases/download/'+project.tag+'/')||!project.download?.endsWith('-'+project.version+'.pbw'))errors.push('matching versioned GitHub PBW is missing');
  if(!/^[a-f\d]{64}$/.test(project.artifactSha256??''))errors.push('checked PBW SHA256 is missing');
  return errors;
}
export function listingProblems(project, app) {
  const errors=[];
  if(!app||app.uuid?.toLowerCase()!==project.uuid.toLowerCase())return ['Store UUID differs'];
  if(project.storeUrl!=='https://apps.repebble.com/'+app.id)errors.push('Store URL does not identify this app');
  if(app.visible===false||!app.latest_release?.published_date)errors.push('Store release is not public');
  if(app.latest_release?.version!==project.version)errors.push('Store version differs');
  const actual=(app.hardware_platforms??[]).map(p=>p.name).sort();
  if(JSON.stringify(actual)!==JSON.stringify([...(project.watchPlatforms??[])].sort()))errors.push('Store watch platforms differ');
  if(project.kind==='plugin'&&!app.plugin)errors.push('phone plugin listing is missing its plugin declaration');
  return errors;
}
export async function verifyRelease(project, request=fetch) {
  const errors=metadataProblems(project);if(errors.length)return errors;
  async function read(url,json=true) {
    const response=await request(url,{signal:AbortSignal.timeout(20000),headers:{Accept:json?'application/json':'application/octet-stream','User-Agent':'XOCE-launch-readiness'}});
    if(!response.ok)throw Error('HTTP '+response.status+' at '+url);
    return json?response.json():Buffer.from(await response.arrayBuffer());
  }
  try {
    const response=await read('https://appstore-api.repebble.com/api/v1/apps/uuid/'+project.uuid);
    const app=response.data?.find(a=>a.uuid?.toLowerCase()===project.uuid.toLowerCase());
    errors.push(...listingProblems(project,app));if(errors.length)return errors;
    const release=await read('https://api.github.com/repos/'+new URL(project.repo).pathname.slice(1)+'/releases/tags/'+project.tag);
    if(release.draft||release.prerelease!==false||release.tag_name!==project.tag||!release.assets?.some(a=>a.browser_download_url===project.download))return ['GitHub release must be public and stable with the exact PBW asset'];
    const storePbw=app.latest_release.pbw_file;
    const host=new URL(storePbw).hostname;
    if(!['appstore-api.repebble.com','assets.repebble.com'].includes(host)||new URL(storePbw).protocol!=='https:')return ['Unexpected Store artifact origin'];
    const github=await read(project.download,false),store=await read(storePbw,false);
    if(digest(github)!==project.artifactSha256||digest(store)!==project.artifactSha256)errors.push('Store/GitHub bytes do not match the checked PBW');
  }catch(error){errors.push(error.message);}
  return errors;
}

// Website preparation pages may go live before the associated app release.
// A published app claim still requires complete public artifact verification.
export async function verifyWebsiteDeployment(project, request=fetch) {
  if(project.publication==='published')return verifyRelease(project,request);
  if(project.publication!=='preview')return ['publication must be preview or published'];
  const errors=[];
  if(project.download||project.storeUrl)errors.push('preparation pages must not advertise installation links');
  if(!/^\d+\.\d+\.\d+$/.test(project.version??''))errors.push('prepared numeric version is missing');
  if(!/^[a-f\d]{8}-(?:[a-f\d]{4}-){3}[a-f\d]{12}$/i.test(project.uuid??''))errors.push('prepared UUID is missing');
  if(!/^[a-f\d]{64}$/.test(project.artifactSha256??''))errors.push('prepared PBW SHA256 is missing');
  return errors;
}
