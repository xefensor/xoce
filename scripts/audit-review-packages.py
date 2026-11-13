#!/usr/bin/env python3
"""Read checked PBWs and compare real package identities to launch metadata."""
from pathlib import Path
import argparse,hashlib,json,zipfile
ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--bundle',type=Path,required=True)
parser.add_argument('--weather-pbw',type=Path,help='Separate public Weather PBW for older five-native-app bundles')
parser.add_argument('--output',type=Path)
args=parser.parse_args()
text=(ROOT/'src/data/projects.ts').read_text().split('export const projects: Project[] = ',1)[1]
projects=json.JSONDecoder().raw_decode(text)[0]
projects={p['name']:p for p in projects if p.get('publication')}
manifest=json.loads((args.bundle/'manifest.json').read_text())
inputs=[(r['product'].replace('Open-Activity','Open Activity'),args.bundle/r['file'],r['sourceCommit'])for r in manifest['products']]
if args.weather_pbw:
 inputs.append(('ČHMÚ Weather',args.weather_pbw,None))
assert len(inputs)==len(projects) and {name for name,_,_ in inputs}==set(projects),'Bundle must identify each of the six public products exactly once'
records=[]
for name,path,commit in inputs:
 project=projects[name]
 with zipfile.ZipFile(path)as archive:
  info=json.loads(archive.read('appinfo.json'))
  assert info['versionLabel']==project['version'],f'{name}: actual PBW version {info["versionLabel"]} differs from website {project["version"]}'
  assert info['uuid'].lower()==project['uuid'].lower(),f'{name}: UUID differs'
  platforms=sorted(n.split('/')[0]for n in archive.namelist()if n.endswith('/pebble-app.bin'))
  assert platforms==sorted(project['watchPlatforms']),f'{name}: native platforms differ'
  if project['kind']=='plugin':
   assert info.get('projectType')=='plugin' or info.get('plugin'),f'{name}: missing plugin manifest'
   assert b'chmu.rails.cz' not in archive.read('plugin.js'),'Personal service leaked into public package'
 digest=hashlib.sha256(path.read_bytes()).hexdigest()
 assert digest==project['artifactSha256'],f'{name}: website does not identify these exact reviewed bytes'
 records.append({'product':name,'version':info['versionLabel'],'uuid':info['uuid'],'watchPlatforms':platforms,'sha256':digest,'sourceCommit':commit,'sourceFile':path.name})
result=json.dumps({'scope':'Actual checked package manifests and bytes; not Store publication or hardware verification.','artifacts':records},ensure_ascii=False,indent=2)+'\n'
if args.output:args.output.write_text(result)
else:print(result,end='')
