import test from 'node:test';
import assert from 'node:assert/strict';
import { digest, metadataProblems, listingProblems, verifyRelease, verifyWebsiteDeployment } from '../scripts/launch-readiness.mjs';
const bytes=Buffer.from('checked release bytes');
const project={name:'Timer',kind:'app',publication:'published',uuid:'00000000-0000-4000-8000-000000000001',version:'1.2.3',tag:'v1.2.3',repo:'https://github.com/example/timer',download:'https://github.com/example/timer/releases/download/v1.2.3/Timer-1.2.3.pbw',storeUrl:'https://apps.repebble.com/0123456789abcdef01234567',watchPlatforms:['emery','gabbro'],artifactSha256:digest(bytes)};
const listing={id:'0123456789abcdef01234567',uuid:project.uuid,visible:true,hardware_platforms:[{name:'emery'},{name:'gabbro'}],latest_release:{version:'1.2.3',published_date:'2026-11-13',pbw_file:'https://assets.repebble.com/checked.pbw'}};
function response(data){return {ok:true,status:200,json:async()=>data,arrayBuffer:async()=>data};}
function fixture(override={}){return async url=>{
 if(url.includes('/apps/uuid/'))return response({data:[{...listing,...override}]});
 if(url.includes('api.github.com'))return response({draft:false,prerelease:false,tag_name:project.tag,assets:[{browser_download_url:project.download}]});
 return response(bytes);
};}
test('a preview never reaches the network or advertises an invented release',async()=>{
 let calls=0;const errors=await verifyRelease({...project,publication:'preview',storeUrl:undefined,tag:undefined,download:undefined},async()=>{calls++;});
 assert.equal(calls,0);assert.ok(errors.some(e=>e.includes('preview')));assert.ok(errors.some(e=>e.includes('Store')));
});
test('only the exact checked public release passes',async()=>assert.deepEqual(await verifyRelease(project,fixture()),[]));
test('wrong UUID, old Store version, hidden release and missing Round 2 fail',()=>{
 for(const app of [{...listing,uuid:'different'},{...listing,latest_release:{...listing.latest_release,version:'1.2.2'}},{...listing,visible:false},{...listing,hardware_platforms:[{name:'emery'}]}])assert.ok(listingProblems(project,app).length);
});
test('a mismatched artifact fails even when both release pages exist',async()=>{
 const request=fixture();const errors=await verifyRelease(project,async url=>url===project.download?response(Buffer.from('older bytes')):request(url));assert.ok(errors.some(e=>e.includes('bytes')));
});
test('a plugin has no invented watch platform',()=>{
 const plugin={...project,kind:'plugin',watchPlatforms:[]};assert.deepEqual(listingProblems(plugin,{...listing,plugin:{},hardware_platforms:[]}),[]);assert.ok(listingProblems(plugin,listing).length);
});
test('wrong release URLs, unavailable assets and API failures stop publication',async()=>{
 assert.ok(metadataProblems({...project,download:project.download.replace('v1.2.3','latest')} ).length);
 assert.ok(metadataProblems({...project,storeUrl:'https://apps.repebble.com/placeholder'}).length);
 assert.ok((await verifyRelease(project,async()=>({ok:false,status:404}))).length);
 const request=fixture();assert.ok((await verifyRelease(project,async url=>url.includes('api.github.com')?response({draft:true,tag_name:project.tag,assets:[]}):request(url))).length);
});
test('a GitHub prerelease cannot activate the stable Store launch',async()=>{
 const request=fixture();
 const errors=await verifyRelease(project,async url=>url.includes('api.github.com')
   ? response({draft:false,prerelease:true,tag_name:project.tag,assets:[{browser_download_url:project.download}]})
   : request(url));
 assert.ok(errors.some(error=>error.includes('stable')));
});
test('website preparation pages deploy without claiming an app release',async()=>{
  const preview={...project,publication:'preview',storeUrl:undefined,tag:undefined,download:undefined};let calls=0;
  assert.deepEqual(await verifyWebsiteDeployment(preview,async()=>{calls++;}),[]);
  assert.equal(calls,0);
  assert.ok((await verifyRelease(preview,async()=>{calls++;})).some(error=>error.includes('preview')));
  assert.equal(calls,0);
});
test('preparation deployment rejects installation links and unidentified packages',async()=>{
  const preview={...project,publication:'preview',storeUrl:undefined,download:undefined};
  for(const invalid of [{storeUrl:project.storeUrl},{download:project.download},{uuid:''},{artifactSha256:''},{version:''},{publication:undefined}]){
    assert.ok((await verifyWebsiteDeployment({...preview,...invalid},async()=>{throw Error('Unexpected preview network request');})).length);
  }
});
test('published deployment retains complete release and PBW verification',async()=>{
  assert.deepEqual(await verifyWebsiteDeployment(project,fixture()),[]);
  assert.ok((await verifyWebsiteDeployment(project,fixture({latest_release:{...listing.latest_release,version:'1.2.2'}}))).some(error=>error.includes('version')));
  const request=fixture();assert.ok((await verifyWebsiteDeployment(project,async url=>url===project.download?response(Buffer.from('different PBW')):request(url))).some(error=>error.includes('bytes')));
});
