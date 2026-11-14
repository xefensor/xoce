// A capture keeps its real version. Reuse is bound to a specific verified PBW.
export function representsRelease(capture, version, artifactSha256, readProof) {
  if (!capture) return false;
  if (capture.capture_version === version && capture.source_pbw_sha256 === artifactSha256) return true;
  if (capture.represented_release !== version || capture.represented_pbw_sha256 !== artifactSha256 || !capture.release_reuse_proof) return false;
  const proof = readProof(capture.release_reuse_proof);
  if (!proof || proof.result !== 'PASS' || proof.version !== version || proof.pbwSha256 !== artifactSha256) return false;
  const verifiedSource = proof.previousPbwSha256 === capture.source_pbw_sha256 || proof.additionalVerifiedCapturePbws?.includes(capture.source_pbw_sha256);
  if (!verifiedSource) return false;
  if (capture.evidence_type === 'packaged-settings-browser-preview') return proof.pluginRuntimeAndSettingsUnchanged === true;
  if (capture.evidence_type !== 'native-emulator-screenshot') return false;
  return proof.compatibilityMethod === 'exact-native-body-and-non-icon-resources' && proof.freshCaptureClaimed === false && proof.nativePixelsModified === false && ['emery','gabbro'].every(platform => {
    const result = proof.platforms?.[platform];
    return /^[a-f0-9]{64}$/.test(result?.normalizedNativeSha256 ?? '') && Object.keys(result?.nonIconResources ?? {}).length > 0;
  });
}
