import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const cwd = fileURLToPath(new URL('../', import.meta.url));
for (const command of ['clean', 'build']) {
  const result = spawnSync('pebble', [command], {cwd, stdio:'inherit'});
  if (result.error) throw result.error;
  if (result.status) process.exit(result.status);
}
const pbw=path.join(cwd,'build',path.basename(path.resolve(cwd))+'.pbw');
const audit=spawnSync('python3',['scripts/package-watch.py',pbw],{cwd,stdio:'inherit'});
if(audit.error)throw audit.error;if(audit.status)process.exit(audit.status);
