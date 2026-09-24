from pathlib import Path
from PIL import Image,ImageDraw,ImageFont,ImageCms
import json,os
ROOT=Path(__file__).resolve().parent
S=2048
SELECTED={int(x) for x in os.environ.get('FRAMES','').split(',') if x}
CREAM='#F4E3CB';BURGUNDY='#5C0006';INK='#361018';MUTED='#704849';LIGHT='#F8EEDF'
REG='/System/Library/Fonts/Supplemental/Arial.ttf';BOLD='/System/Library/Fonts/Supplemental/Arial Bold.ttf'
ICC=ImageCms.ImageCmsProfile(ImageCms.createProfile('sRGB')).tobytes()
DATA={
'mistened-narcissus':dict(name='MISTENED NARCISSUS',title='MISTENED\nNARCISSUS',accent='#B5A4CB',code='P11438',barcode='5056795407376',liquid='Clear liquid',pack='Pale lavender canister',description='Juicy berries softened by a smooth, sweet finish.',fit='For someone drawn to juicy brightness, smooth sweetness, and an easy, playful finish.',traits=['JUICY','SMOOTH','PLAYFUL'],ingredients=['Alcohol','Water (Aqua)','Fragrance (Parfum)','PEG-40 Hydrogenated Castor Oil','Propylene Glycol','Benzyl Salicylate','Hexyl Cinnamal','Limonene','Linalool','Citronellol','Alpha-Isomethyl Ionone'],care='FLAMMABLE'),
'charme-envoutant':dict(name='CHARME ENVOÛTANT',title='CHARME\nENVOÛTANT',accent='#D46601',code='P10738',barcode='5056795407307',liquid='Amber-orange liquid',pack='Vivid orange canister',description='Rich, spiced sweetness that feels deep and indulgent.',fit='For someone drawn to rich spice, deep sweetness, and an indulgent finish.',traits=['RICH','SPICED','INDULGENT'],ingredients=['Alcohol','Water (Aqua)','Fragrance (Parfum)','PEG-40 Hydrogenated Castor Oil','Propylene Glycol','Coumarin','Limonene','Linalool','Cinnamal','Eugenol','Benzyl Benzoate'],care='FLAMMABLE\nKeep away from heat and open flame.')
}
roles={1:'featured-packshot',2:'spray-in-motion',3:'packaging-reveal',4:'magnetic-cap',5:'lifestyle-hero',6:'lifestyle-handheld',7:'lifestyle-editorial',8:'product-profile-infographic',9:'ingredients-and-care-infographic',10:'closing-hero',11:'scent-description-infographic',12:'who-it-fits-infographic'}
layout_audit=[]
def font(size,bold=False):return ImageFont.truetype(BOLD if bold else REG,size)
def canvas(color=CREAM):return Image.new('RGB',(S,S),color)
def text(im,value,x,y,width,size=56,bold=False,color=BURGUNDY,leading=None,max_bottom=1950):
 d=ImageDraw.Draw(im);f=font(size,bold);leading=leading or int(size*1.24);lines=[]
 for paragraph in value.split('\n'):
  line=''
  for word in paragraph.split(' '):
   proposal=(line+' '+word).strip()
   if line and d.textlength(proposal,font=f)>width:lines.append(line);line=word
   else:line=proposal
  lines.append(line)
 for line in lines:
  if d.textlength(line,font=f)>width+1:raise ValueError(('Line exceeds width',line,width,size))
  if y+size>max_bottom:raise ValueError(('Text exceeds frame',line,y,size))
  d.text((x,y),line,font=f,fill=color,stroke_width=0);y+=leading
 layout_audit.append({'text':value,'font_size':size,'line_count':len(lines),'ending_y':y})
 return y

def photo(handle,n):
 folder=ROOT/handle/'working';rev=folder/f'{n:02d}-native-r2.png';p=rev if rev.exists() else folder/f'{n:02d}-native.png'
 return Image.open(p).convert('RGB').resize((S,S),Image.Resampling.LANCZOS)
def inset(im,source,x,y,size):im.paste(source.resize((size,size),Image.Resampling.LANCZOS),(x,y))
def rule(im,x,y,w,color=BURGUNDY,h=3):ImageDraw.Draw(im).rectangle((x,y,x+w,y+h),fill=color)
def footer(im,n,color=BURGUNDY):
 rule(im,96,1918,1856,color,2);text(im,'A SCENT JOURNEY',96,1950,1400,28,True,color,max_bottom=2030);text(im,f'{n:02d} / 12',1800,1950,152,28,True,color,max_bottom=2030)
def save(im,handle,n):
 if SELECTED and n not in SELECTED:return
 dest=ROOT/handle/'final'/f'{n:02d}-{roles[n]}.png';im.save(dest,icc_profile=ICC,optimize=True)
 im.resize((1200,1200),Image.Resampling.LANCZOS).save(ROOT/handle/'final-web'/f'{n:02d}.jpg',quality=88,optimize=True,progressive=True,icc_profile=ICC)

for handle,d in DATA.items():
 for n in [1,2,3,4,5,6,7,10]:
  im=photo(handle,n)
  if n==4:
   text(im,'MAGNETIC\nCAP',108,136,900,87,True,leading=97)
   rule(im,110,385,182,d['accent'],8)
  if n==10:
   text(im,'DEARBODY PHILIPPINES',108,100,930,31,True)
   text(im,'A SCENT\nJOURNEY',101,174,1000,125,True,leading=133)
  save(im,handle,n)
 # 08 — profile, exact facts left and a newly generated photo right.
 im=canvas();dr=ImageDraw.Draw(im);dr.rectangle((1010,0,2048,2048),fill=d['accent'])
 text(im,'PRODUCT PROFILE',96,110,850,34,True)
 text(im,d['title'],92,200,915,99,True,leading=112)
 rule(im,96,474,200,d['accent'],10)
 text(im,'VOLUME',96,569,860,31,True,color=MUTED)
 text(im,'50 ml',93,622,860,122,True)
 text(im,'1.69 fl. oz.',99,767,800,44)
 facts=[('BOTTLE','Clear cylindrical glass'),('CAP','Glossy black magnetic cap'),('LIQUID',d['liquid']),('PRODUCT CODE',d['code'])]
 yy=925
 for label,value in facts:
  text(im,label,99,yy,840,29,True,color=MUTED);text(im,value,98,yy+46,850,60,False);yy+=194
 inset(im,photo(handle,1),1046,519,966)
 text(im,d['pack'],1070,1570,870,52,True,color=INK)
 text(im,'PARFUM LONDON',1070,1643,870,38,True,color=INK)
 footer(im,8,INK);save(im,handle,8)
 # 09 — product left, complete ordered ingredients on cream right.
 im=canvas();dr=ImageDraw.Draw(im);dr.rectangle((0,0,738,2048),fill=BURGUNDY)
 text(im,d['title'],70,120,615,64,True,color=CREAM,leading=66)
 inset(im,photo(handle,2),50,375,638)
 text(im,'50 ml',69,1120,590,100,True,color=CREAM)
 text(im,'1.69 fl. oz.',73,1246,590,45,color=CREAM)
 text(im,'PRODUCT CODE',73,1400,600,29,True,color=CREAM)
 text(im,d['code'],70,1448,590,58,True,color=CREAM)
 text(im,'BARCODE',73,1570,590,29,True,color=CREAM)
 text(im,d['barcode'],70,1620,590,49,True,color=CREAM)
 x=822
 text(im,'INGREDIENTS\n& CARE',x,112,1100,84,True,leading=93)
 rule(im,x,346,190,d['accent'],9)
 text(im,'AS PRINTED ON THE PACKAGE',x,404,1100,28,True,color=MUTED)
 yy=483
 for ingredient in d['ingredients']:
  yy=text(im,ingredient,x,yy,1100,64,leading=82)+14
 rule(im,x,yy+14,1100,'#BA9B8E',2)
 yy=text(im,'FLAMMABLE',x,yy+66,1100,60,True)
 if handle=='charme-envoutant':text(im,'Keep away from heat and open flame.',x,yy+25,1080,48,leading=60)
 text(im,'09 / 12',1795,1950,160,28,True,max_bottom=2030)
 save(im,handle,9)
 # 11 — exact owner-approved scent sentence, not an inferred note pyramid.
 im=canvas(BURGUNDY)
 text(im,d['name'],96,111,1790,39,True,color=CREAM)
 text(im,'THE SCENT',94,211,1650,108,True,color=CREAM)
 rule(im,98,359,190,d['accent'],10)
 text(im,'“'+d['description']+'”',94,498,850,94,False,color=CREAM,leading=118,max_bottom=1760)
 inset(im,photo(handle,3),1015,593,960)
 footer(im,11,CREAM);save(im,handle,11)
 # 12 — one inclusive interpretation, <=3 source-supported traits, zero faces.
 im=canvas();text(im,d['name'],96,112,1790,39,True)
 text(im,'WHO IT FITS',93,212,1800,129,True)
 rule(im,98,383,190,d['accent'],10)
 inset(im,photo(handle,7),80,588,940)
 yy=text(im,d['fit'],1100,582,849,77,False,leading=98,max_bottom=1680)
 rule(im,1104,yy+80,780,d['accent'],7)
 yy+=139
 for trait in d['traits']:text(im,trait,1105,yy,780,40,True);yy+=62
 footer(im,12);save(im,handle,12)
 (ROOT/handle/'deterministic-copy.json').write_text(json.dumps(d,indent=2,ensure_ascii=False)+'\n')
 (ROOT/handle/'EXPORT-NOTES.md').write_text('''# Export notes\n\nAll photographic sources were newly generated for this request using the built-in ImageGen tool. No legacy gallery images were reused. Native ImageGen returned 1254×1254 despite the 2048 request and exposes no size argument; original native sources are preserved in `working/`. Final photography is transparently resampled with Lanczos to the required 2048×2048 sRGB PNG. All deterministic type is rendered directly at 2048×2048. Fonts: system Arial / Arial Bold, explicitly a fallback, not supplied official brand font binaries.\n\nFrames 08/09/11/12 are fresh deterministic layouts using only newly generated photographic material from this gallery and exact verified copy. Frame04 caption and frame10 heading are deterministic. Optimized website derivatives are 1200×1200 progressive JPEG quality88.\n''')
(ROOT/'mistened-charme-layout-audit.json').write_text(json.dumps(layout_audit,indent=2,ensure_ascii=False)+'\n')
print('Exported 24 new 2048 PNG frames and 24 optimized 1200 JPEG derivatives; typography bounds passed.')
