import test from 'node:test';
import assert from 'node:assert/strict';
import { representsRelease } from '../scripts/capture-provenance.mjs';
const hash='a'.repeat(64), old='b'.repeat(64);
const capture={capture_version:'1.0.0',source_pbw_sha256:old,represented_release:'1.0.2',represented_pbw_sha256:hash,release_reuse_proof:'/proof.json',evidence_type:'native-emulator-screenshot'};
const platform={normalizedNativeSha256:'c'.repeat(64),nonIconResources:{1:'d'.repeat(64)}};
const proof={result:'PASS',version:'1.0.2',pbwSha256:hash,previousPbwSha256:old,compatibilityMethod:'exact-native-body-and-non-icon-resources',freshCaptureClaimed:false,nativePixelsModified:false,platforms:{emery:platform,gabbro:platform}};
test('explicit native reuse preserves the original capture version',()=>{assert.equal(representsRelease(capture,'1.0.2',hash,()=>proof),true);assert.equal(capture.capture_version,'1.0.0');});
test('wrong target, missing proof, unverified source or incomplete platform proof fails',()=>{
 for(const changed of [{version:'1.0.3'},{pbwSha256:old},{previousPbwSha256:hash},{freshCaptureClaimed:true},{nativePixelsModified:true},{platforms:{emery:platform}}])assert.equal(representsRelease(capture,'1.0.2',hash,()=>({...proof,...changed})),false);
 assert.equal(representsRelease(capture,'1.0.2',hash,()=>undefined),false);
});
test('native compatibility cannot relabel changed phone settings',()=>assert.equal(representsRelease({...capture,evidence_type:'packaged-settings-browser-preview'},'1.0.2',hash,()=>proof),false));
test('fresh captures require the exact source PBW',()=>{assert.equal(representsRelease({...capture,capture_version:'1.0.2',source_pbw_sha256:hash},'1.0.2',hash,()=>undefined),true);assert.equal(representsRelease({...capture,capture_version:'1.0.2',release_reuse_proof:undefined},'1.0.2',hash,()=>undefined),false);});
