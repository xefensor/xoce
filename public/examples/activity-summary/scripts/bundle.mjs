import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
if (process.argv.length !== 2) throw new Error('Usage: node scripts/bundle.mjs');
const resolveFromRoot = createRequire(path.join(root, 'package.json'));
const libraryRoot = path.dirname(resolveFromRoot.resolve('pebble-activities/package.json'));
const modules = [], ids = new Map();
function resolveRelative(request, parent) {
  const target = path.resolve(path.dirname(parent), request);
  const candidates = [target, target + '.cjs', target + '.js', target + '.json', path.join(target, 'index.js')];
  const found = candidates.find(file => fs.existsSync(file) && fs.statSync(file).isFile());
  if (!found) throw new Error('Cannot resolve ' + request + ' from ' + parent);
  return found;
}
function add(filename) {
  filename = fs.realpathSync(filename);
  if (ids.has(filename)) return ids.get(filename);
  const relativeSource = path.relative(path.join(root, 'src'), filename);
  const relativeLibrary = path.relative(libraryRoot, filename);
  if ((relativeSource.startsWith('..') || path.isAbsolute(relativeSource)) &&
      (relativeLibrary.startsWith('..') || path.isAbsolute(relativeLibrary))) {
    throw new Error('Module is outside the example source and pinned library: ' + filename);
  }
  const id = modules.length;
  ids.set(filename, id); modules.push(null);
  let source = fs.readFileSync(filename, 'utf8');
  if (filename.endsWith('.json')) source = 'module.exports=' + JSON.stringify(JSON.parse(source)) + ';';
  else {
    source = source.replace(/\brequire\s*\(\s*(['"])([^'"]+)\1\s*\)/g, (match, quote, request) => {
      let resolved;
      if (request.startsWith('./') || request.startsWith('../')) resolved = resolveRelative(request, filename);
      else if (request === 'pebble-activities/summary') resolved = resolveFromRoot.resolve(request);
      else throw new Error('Unsupported external require: ' + request);
      return '__require(' + add(resolved) + ')';
    });
    if (/\brequire\s*\(/.test(source)) throw new Error('Only literal CommonJS requires are supported: ' + filename);
  }
  const label = path.relative(root, filename).split(path.sep).join('/');
  modules[id] = '// ' + label + '\n' + id + ':function(module,exports,__require){\n' + source + '\n}';
  return id;
}
const entry = add(path.join(root, 'src/plugin.cjs'));
const output = '(function(){\n"use strict";\nvar __modules={\n' + modules.join(',\n') +
  '\n},__cache=Object.create(null);\nfunction __require(id){\n' +
  'if(Object.prototype.hasOwnProperty.call(__cache,id))return __cache[id].exports;\n' +
  'var module={exports:{}};__cache[id]=module;\n' +
  '__modules[id](module,module.exports,__require);return module.exports;\n}\n' +
  '__require(' + entry + ');\n})();\n';
const destination = path.join(root, 'build/plugin.js');
fs.mkdirSync(path.dirname(destination), {recursive: true});
fs.writeFileSync(destination, output);
console.log('Bundled ' + modules.length + ' CommonJS modules into ' + destination);
