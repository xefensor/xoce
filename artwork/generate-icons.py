"""Create original monochrome XOCE icon candidates without applying them.

Python 3 + Pillow 13.0.0. Each PNG is drawn directly at its target size into a
binary mask. SVG masters are smooth geometric sources, not enlarged pixel art.
Optional 25px launcher assets are candidates, not integrated release resources.
Derived from the reviewed 2026-11-14 generator; geometry/rasterization preserved.
Outputs are confined to ignored build/ and an existing export is never replaced.
"""
from pathlib import Path
from PIL import Image, ImageDraw
import hashlib
import json
import math
import argparse

HERE=Path(__file__).resolve().parent
parser=argparse.ArgumentParser(description="Export XOCE icon candidates; never change app assets.")
parser.add_argument('--product', choices=['all','dynamic','halftone','timer','dashboard','open-activity','chmu-weather'], default='all')
parser.add_argument('--output', type=Path, default=HERE.parent/'build/artwork/icons')
args=parser.parse_args()
OUT=args.output.resolve()
if not OUT.is_relative_to((HERE.parent/'build').resolve()):
 parser.error('Candidate output must be inside this checkout’s ignored build/ directory')
if OUT.exists() and any(OUT.iterdir()):
 parser.error('Output is not empty; choose a new build/ directory')
PRODUCTS={
 'dynamic':('Dynamic','watchface','Clock and live-reading bars'),
 'halftone':('Halftone','watchface','Clock with a dithered dot bezel'),
 'timer':('Timer','watchapp','Hourglass with visible sand and open negative spaces'),
 'dashboard':('Dashboard','watchapp','One tall information pane and two distinct panels'),
 'open-activity':('Open Activity','watchapp','Open doorway with a clear directional arrow'),
 'chmu-weather':('ČHMÚ Weather','plugin','Distinct sun, outlined cloud and three rain strokes'),
}

def circle(x,y,r,fill=True,stroke=7):return {'type':'circle','x':x,'y':y,'r':r,'fill':fill,'stroke':stroke}
def line(points,width=7):return {'type':'path','commands':[('M',*points[0])]+[('L',*p) for p in points[1:]],'fill':False,'stroke':width}
def path(commands,fill=False,stroke=7):return {'type':'path','commands':commands,'fill':fill,'stroke':stroke}
def rect(x,y,w,h,fill=False,stroke=7,r=2):return {'type':'rect','x':x,'y':y,'w':w,'h':h,'fill':fill,'stroke':stroke,'r':r}

def scene(slug,size=144):
 small=size==25
 if slug=='timer':
  # Strong rims, curved waist and two separate sand piles.
  return [line([(22,13),(78,13)],8),line([(22,87),(78,87)],8),
   path([('M',29,22),('C',31,35,47,41,47,50),('C',47,59,31,65,29,78)],stroke=7.5),
   path([('M',71,22),('C',69,35,53,41,53,50),('C',53,59,69,65,71,78)],stroke=7.5),
   path([('M',36,25),('L',64,25),('L',50,41),('Z',)],fill=True,stroke=0),
   path([('M',50,62),('L',65,77),('L',35,77),('Z',)],fill=True,stroke=0)]
 if slug=='dashboard':
  result=[rect(12,14,38,72,stroke=7.5,r=3),rect(60,14,28,31,fill=True,r=3),rect(60,56,28,30,stroke=7.5,r=3),line([(24,32),(37,32)],6)]
  if not small:result+=[line([(24,48),(37,48)],6),line([(24,64),(33,64)],6)]
  return result
 if slug=='open-activity':
  return [line([(59,14),(84,14),(84,86),(59,86)],9),
    path([('M',13,45),('L',48,45),('L',36,33),('L',43,26),('L',68,50),('L',43,74),('L',36,67),('L',48,55),('L',13,55),('Z',)],fill=True,stroke=0)]
 if slug=='dynamic':
  return [circle(45,37,26,False,7),line([(45,23),(45,38),(58,45)],6.5),
   line([(20,75),(84,75)],7.5),line([(20,89),(65,89)],7.5)]
 if slug=='halftone':
  result=[circle(50,50,22,False,6.5),line([(50,37),(50,51),(62,57)],6)]
  if small:
   for i in range(12):
    a=2*math.pi*i/12
    result.append(circle(50+39*math.cos(a),50+39*math.sin(a),3.2 if i%2==0 else 2.6))
  else:
   for count,radius,dot_radius,role in [(20,35,3.0,'inner'),(24,44,2.1,'outer')]:
    for i in range(count):
     a=2*math.pi*i/count
     dot=circle(50+radius*math.cos(a),50+radius*math.sin(a),dot_radius)
     dot['opticalDot']=role
     result.append(dot)
  return result
 # Weather: filled sunshine separated from an outlined cloud, with distinct rain.
 result=[circle(25,22,8.5),line([(25,5),(25,9)],4.8),line([(8,22),(12,22)],4.8),line([(12,9),(15,12)],4.8),line([(38,9),(41,6)],4.8),
  path([('M',24,65),('C',10,65,9,46,23,43),('C',25,28,45,28,51,41),('C',59,35,74,39,75,49),('C',91,47,94,66,80,67),('L',24,67),('Z',)],False,7),
  line([(32,78),(27,89)],6),line([(53,78),(48,89)],6),line([(74,78),(69,89)],6)]
 if small:
  result=[x for i,x in enumerate(result) if i not in (2,4)] # fewer rays, same weather silhouette
 return result

def svg_shape(s):
 fill='currentColor' if s['fill'] else 'none'
 stroke='none' if s['fill'] or not s['stroke'] else 'currentColor'
 common=f'fill="{fill}" stroke="{stroke}" stroke-width="{s["stroke"]}" stroke-linecap="round" stroke-linejoin="round"'
 if s['type']=='circle':return f'<circle cx="{s["x"]}" cy="{s["y"]}" r="{s["r"]}" {common}/>'
 if s['type']=='rect':return f'<rect x="{s["x"]}" y="{s["y"]}" width="{s["w"]}" height="{s["h"]}" rx="{s["r"]}" {common}/>'
 d=' '.join(c[0]+' '.join(str(x) for x in c[1:]) for c in s['commands'])
 return f'<path d="{d}" {common}/>'

def points(commands):
 out=[];here=(0,0);first=None
 for c in commands:
  if c[0]=='M':here=(c[1],c[2]);first=here;out.append(here)
  elif c[0]=='L':here=(c[1],c[2]);out.append(here)
  elif c[0]=='C':
   p0=here;p1=(c[1],c[2]);p2=(c[3],c[4]);p3=(c[5],c[6])
   for step in range(1,33):
    t=step/32;u=1-t
    out.append((u*u*u*p0[0]+3*u*u*t*p1[0]+3*u*t*t*p2[0]+t*t*t*p3[0],u*u*u*p0[1]+3*u*u*t*p1[1]+3*u*t*t*p2[1]+t*t*t*p3[1]))
   here=p3
  elif c[0]=='Z':out.append(first);here=first
 return out

def mask(slug,size):
 im=Image.new('L',(size,size),0);draw=ImageDraw.Draw(im)
 def q(x):return round(x*size/100)
 for shape in scene(slug,size):
  st=max(1,q(shape['stroke']))
  if shape['type']=='circle':
   x,y,r=shape['x'],shape['y'],shape['r'];inset=0 if shape['fill'] else st/2
   if shape.get('opticalDot'):
    # Uniform odd-pixel circles avoid angle-dependent diamond/square quantization.
    radius=(3 if shape['opticalDot']=='inner' else 2) if size==80 else (4 if shape['opticalDot']=='inner' else 3)
    cx,cy=q(x),q(y);box=(cx-radius,cy-radius,cx+radius,cy+radius)
   else:box=(round(q(x-r)-inset),round(q(y-r)-inset),round(q(x+r)+inset),round(q(y+r)+inset))
   draw.ellipse(box,fill=255 if shape['fill'] else None,outline=None if shape['fill'] else 255,width=st)
  elif shape['type']=='rect':
   x,y,w,h=shape['x'],shape['y'],shape['w'],shape['h'];inset=0 if shape['fill'] else st/2
   box=(round(q(x)-inset),round(q(y)-inset),round(q(x+w)+inset),round(q(y+h)+inset))
   draw.rounded_rectangle(box,radius=max(1,q(shape['r'])),fill=255 if shape['fill'] else None,outline=None if shape['fill'] else 255,width=st)
  else:
   pts=[(q(x),q(y)) for x,y in points(shape['commands'])]
   if shape['fill']:draw.polygon(pts,fill=255)
   else:
    draw.line(pts,fill=255,width=st,joint='curve')
    # Rounded ends match the scalable master; unioned into the same binary mask.
    r=st/2
    for x,y in [pts[0],pts[-1]]:draw.ellipse((round(x-r),round(y-r),round(x+r),round(y+r)),fill=255)
 return im

def export_png(slug,size,path,white=False):
 alpha=mask(slug,size)
 assert set(alpha.get_flattened_data())=={0,255}
 img=Image.new('RGBA',(size,size),(255,255,255,0) if white else (0,0,0,0));img.putalpha(alpha);img.save(path)
 assert not any(img.getpixel(p)[3] for p in [(0,0),(0,size-1),(size-1,0),(size-1,size-1)])
 return img

def digest(path):return hashlib.sha256(path.read_bytes()).hexdigest()

records=[]
for slug,(name,kind,meaning) in PRODUCTS.items():
 if args.product not in ('all',slug):continue
 folder=OUT/slug;folder.mkdir(parents=True,exist_ok=True)
 source='<svg xmlns="http://www.w3.org/2000/svg" width="144" height="144" viewBox="0 0 100 100" color="#000" role="img"><title>'+name+' — '+meaning+'</title>'+''.join(svg_shape(s) for s in scene(slug))+'</svg>\n'
 (folder/'product-mark.svg').write_text(source)
 export_png(slug,144,folder/'product-mark-144.png')
 if kind in ['watchapp','plugin']:
  (folder/'icon-source.svg').write_text(source)
  export_png(slug,80,folder/'icon-small-80.png')
  export_png(slug,144,folder/'icon-large-144.png')
 else:export_png(slug,80,folder/'preview-small-80.png')
 if kind!='plugin':
  export_png(slug,25,folder/'launcher-white-25.png',white=True)
  export_png(slug,25,folder/'launcher-black-25.png')
 files={p.name:digest(p) for p in sorted(folder.iterdir()) if p.suffix in ['.svg','.png']}
 record={'product':name,'slug':slug,'kind':kind,'meaning':meaning,'originalArtwork':True,'family':'XOCE geometric icons 2026-11-14','vectorMaster':'100×100 smooth geometric shapes; no baked background','rasterPolicy':'Direct target-size optical rasterization into one-bit alpha masks; no antialiasing or image-resize interpolation. Twenty-five-pixel details are simplified for legibility.','storePolicy':'Watchapp/plugin icons are 80×80 and 144×144 black on transparent, suitable for icon_tintable. Watchfaces export website marks only.','launcherPolicy':'Optional 25×25 candidates for supported emery/gabbro: white on transparent for dark surfaces, black inverse for light. No automatic inversion is assumed; these files are not integrated into app resources or PBWs.','files':files}
 (folder/'provenance.json').write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n');records.append(record)
 print(name,'exported')
