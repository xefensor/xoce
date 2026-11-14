#!/usr/bin/env python3
"""Build the phone-only example from its verified pinned library, without an SDK."""
from pathlib import Path, PurePosixPath
import base64
import hashlib
import json
import subprocess
import tarfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]
VERSION = '0.4.4'
SHA256 = 'dffec3e05041515fbf9385a641adf6b40aedda7e8460c0d11ecb4ed019cd5abe'

def require(condition, message):
    if not condition:
        raise ValueError(message)

def main():
    package = json.loads((ROOT / 'package.json').read_text())
    upstream = json.loads((ROOT / 'upstream.json').read_text())
    require(upstream['version'] == VERSION and upstream['sha256'] == SHA256 and
            upstream['archive'] == 'pebble-activities-0.4.4.tgz', 'Upstream lock differs from the reviewed archive.')
    archive = ROOT / 'vendor' / upstream['archive']
    content = archive.read_bytes()
    require(hashlib.sha256(content).hexdigest() == SHA256, 'Upstream archive checksum differs.')
    dependency = 'file:vendor/' + upstream['archive']
    require(package.get('dependencies') == {'pebble-activities': dependency}, 'Unexpected runtime dependencies.')
    lock = json.loads((ROOT / 'package-lock.json').read_text())
    require(lock['packages']['']['dependencies'] == package['dependencies'], 'Root dependency lock is stale.')
    locked = lock['packages']['node_modules/pebble-activities']
    integrity = 'sha512-' + base64.b64encode(hashlib.sha512(content).digest()).decode()
    require(locked['version'] == VERSION and locked['integrity'] == integrity and
            locked['resolved'] == dependency, 'Installed dependency lock differs from the verified archive.')
    installed = ROOT / 'node_modules/pebble-activities'
    with tarfile.open(archive) as source:
        for member in source.getmembers():
            name = PurePosixPath(member.name)
            require(member.isfile() and not name.is_absolute() and '..' not in name.parts and
                    name.parts[0] == 'package', 'Unsafe upstream archive entry.')
            target = installed.joinpath(*name.parts[1:])
            require(target.is_file() and not target.is_symlink() and
                    target.read_bytes() == source.extractfile(member).read(), 'Installed library differs: ' + str(name))
    require(json.loads((installed / 'package.json').read_text())['version'] == VERSION, 'Installed library version differs.')
    subprocess.run(['node', 'scripts/manifest.cjs', '--check'], cwd=ROOT, check=True)
    subprocess.run(['node', 'scripts/bundle.mjs'], cwd=ROOT, check=True)
    pebble = package['pebble']
    require(pebble.get('targetPlatforms', []) == [] and pebble.get('usesPermissions', []) == [] and
            not pebble.get('watchapp', {}).get('watchface', False) and
            pebble.get('resources', {'media': []}).get('media') == [],
            'The example must remain phone-only with no network or other permissions.')
    plugin = pebble['plugin']
    require(plugin.get('script') == 'plugin.js' and plugin.get('actions', []) == [] and
            len(plugin.get('sources', [])) == 1 and plugin['sources'][0]['category'] == 'activity' and
            plugin['sources'][0]['items'] == ['summary'], 'Only the declared summary source is allowed.')
    require(pebble.get('configPage') == 'config.html', 'Configuration page must be local.')
    info = dict(pebble)
    info['manifestVersion'] = 2
    info['versionLabel'] = package['version']
    info['longName'] = info.get('displayName', package['name'])
    info['shortName'] = info.get('displayName', package['name'])
    info['companyName'] = package.get('author', '')
    info['sdkVersion'] = '3'
    info['targetPlatforms'] = []
    info['resources'] = {'media': []}
    info['watchapp'] = {'watchface': False}
    info['usesPermissions'] = []
    files = {'appinfo.json': (json.dumps(info, indent=2) + '\n').encode(),
             'config.html': (ROOT / 'config.html').read_bytes(),
             'plugin.js': (ROOT / 'build/plugin.js').read_bytes(),
             'THIRD_PARTY.md': (ROOT / 'THIRD_PARTY.md').read_bytes(),
             'licenses/Activities-LICENSE.txt': (installed / 'LICENSE').read_bytes()}
    destination = ROOT / 'build' / ('Activity-Summary-Demo-' + package['version'] + '.pbw')
    with zipfile.ZipFile(destination, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as output:
        for name, data in sorted(files.items()):
            item = zipfile.ZipInfo(name, (1980, 1, 1, 0, 0, 0))
            item.compress_type = zipfile.ZIP_DEFLATED
            item.external_attr = 0o100644 << 16
            output.writestr(item, data)
    print(destination)
    print('SHA256 ' + hashlib.sha256(destination.read_bytes()).hexdigest())

if __name__ == '__main__':
    main()
