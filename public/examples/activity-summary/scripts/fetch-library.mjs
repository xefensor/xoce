import {readFile, writeFile, mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const expectedVersion = '0.4.4';
const expectedSha = 'dffec3e05041515fbf9385a641adf6b40aedda7e8460c0d11ecb4ed019cd5abe';
const args = process.argv.slice(2);
let from, check = false;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--check') check = true;
  else if (args[i] === '--from' && args[i + 1]) from = path.resolve(args[++i]);
  else throw new Error('Usage: node scripts/fetch-library.mjs [--from PATH | --check]');
}
if (from && check) throw new Error('--from and --check are separate operations.');
const upstream = JSON.parse(await readFile(path.join(root, 'upstream.json'), 'utf8'));
if (upstream.version !== expectedVersion || upstream.sha256 !== expectedSha ||
    upstream.archive !== 'pebble-activities-0.4.4.tgz' || !upstream.url?.startsWith('https://')) {
  throw new Error('upstream.json does not match the reviewed Activities 0.4.4 archive.');
}
const destination = path.join(root, 'vendor', upstream.archive);
function verify(bytes) {
  if (createHash('sha256').update(bytes).digest('hex') !== expectedSha) {
    throw new Error('Archive checksum differs. Existing archives are never replaced.');
  }
}
let existing;
try { existing = await readFile(destination); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
if (existing) {
  verify(existing);
  console.log('Verified ' + destination);
} else {
  if (check) throw new Error('Archive is missing. Run fetch:library first, optionally with --from PATH.');
  let bytes;
  if (from) bytes = await readFile(from);
  else {
    const response = await fetch(upstream.url, {signal: AbortSignal.timeout(30000)});
    if (!response.ok) throw new Error('Archive download failed: HTTP ' + response.status);
    bytes = Buffer.from(await response.arrayBuffer());
  }
  verify(bytes);
  await mkdir(path.dirname(destination), {recursive: true});
  await writeFile(destination, bytes, {flag: 'wx'});
  console.log('Verified and saved ' + destination);
}
