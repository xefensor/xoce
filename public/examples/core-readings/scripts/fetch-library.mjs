import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const upstream = JSON.parse(await readFile(path.join(root, 'upstream.json'), 'utf8'));
const from = process.argv.indexOf('--from');
let bytes;
if (from >= 0) {
  if (!process.argv[from + 1]) throw Error('--from requires an archive path');
  bytes = await readFile(path.resolve(process.argv[from + 1]));
} else {
  const response = await fetch(upstream.url);
  if (!response.ok) throw Error(`Library download failed: ${response.status}`);
  bytes = Buffer.from(await response.arrayBuffer());
}
if (createHash('sha256').update(bytes).digest('hex') !== upstream.sha256) throw Error('Core archive checksum mismatch');
await mkdir(path.join(root, 'vendor'), {recursive:true});
await writeFile(path.join(root, 'vendor', upstream.archive), bytes);
console.log(`Verified ${upstream.archive}: ${upstream.sha256}`);
