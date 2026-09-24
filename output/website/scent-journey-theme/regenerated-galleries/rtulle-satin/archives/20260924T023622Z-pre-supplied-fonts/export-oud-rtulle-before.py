#!/usr/bin/env python3
"""Deterministic typography and requested size/colour exports; photos remain new imagegen originals."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageCms
import json, hashlib
ROOT=Path(__file__).parent
FONT='/System/Library/Fonts/HelveticaNeue.ttc'
INK='#211816'; BURGUNDY='#5c0006'; CREAM='#f4e3cb'
ICC=ImageCms.ImageCmsProfile(ImageCms.createProfile('sRGB')).tobytes()
COMMON=['Alcohol','Water (Aqua)','Fragrance (Parfum)','PEG-40 Hydrogenated Castor Oil','Propylene Glycol']
ING={
'oud-mirage':COMMON+['Benzyl Salicylate','Linalool','Benzyl Benzoate','Citronellol','Geraniol','Coumarin','Benzyl Alcohol','Limonene'],
'rtulle-satin':COMMON+['Linalool','Alpha-Isomethyl Ionone','Citronellol','Geraniol','Coumarin','Benzyl Benzoate','Benzyl Alcohol','Limonene','Citral','Eugenol']}
def font(s,b=False): return ImageFont.truetype(FONT,s,index=1 if b else 0)
def text(draw,s,x,y,w,size=64,bold=False,color=INK,leading=1.18):
    f=font(size,bold); lines=[]
    for para in s.split('\n'):
        line=''
        for word in para.split():
            test=(line+' '+word).strip()
            if draw.textlength(test,font=f)>w and line: lines.append(line); line=word
            else: line=test
        lines.append(line)
    for i,line in enumerate(lines): draw.text((x,y+i*size*leading),line,font=f,fill=color,anchor='lt')
    return y+len(lines)*size*leading
def line(d,x,y,w=170): d.rectangle((x,y,x+w,y+6),fill=BURGUNDY)
NAMES={1:'featured-packshot',2:'spray-in-motion',3:'packaging-reveal',4:'magnetic-cap-detail',5:'lifestyle-hero',6:'handheld-lifestyle',7:'personal-context',8:'product-profile-infographic',9:'ingredients-and-care-infographic',10:'closing-hero',11:'scent-description-infographic',12:'who-it-fits-infographic'}
for slug in ['oud-mirage','rtulle-satin']:
    root=ROOT/slug; facts=json.loads((root/'FACTS-AND-PLAN.json').read_text()); rows=[]
    for n in range(1,13):
        choices=sorted((root/'working').glob(f'{n:02d}-*.png'))
        source=next((p for p in choices if 'corrected' in p.name),choices[0])
        im=Image.open(source).convert('RGB').resize((2048,2048),Image.Resampling.LANCZOS)
        d=ImageDraw.Draw(im)
        name=facts['name']
        if n==4:
            text(d,'MAGNETIC\nCAP',110,300,700,93,True,BURGUNDY,1.04)
            line(d,110,535)
        if n==8:
            text(d,name,110,165,800,43,True,BURGUNDY)
            text(d,'PRODUCT\nPROFILE',110,270,810,104,True,BURGUNDY,1.04)
            line(d,110,525)
            text(d,'50 ML / 1.69 FL. OZ.',110,625,810,55,True)
            text(d,"MEN’S LINE",110,725,790,50,True)
            details='Clear glass bottle\nGlossy black magnetic cap\nBlack front label\n'+('Blue liquid\nBlue canister' if slug=='oud-mirage' else 'Aqua liquid\nAqua canister')
            text(d,details,110,880,790,48,False,INK,1.5)
            text(d,'PRODUCT CODE',110,1420,750,36,True,BURGUNDY)
            text(d,facts['code'],110,1490,750,57,True)
        if n==9:
            x=990; w=970
            text(d,name,x,110,w,40,True,BURGUNDY)
            text(d,'INGREDIENTS',x,205,w,76,True,BURGUNDY)
            line(d,x,312)
            y=390
            for ingredient in ING[slug]:
                y=text(d,ingredient,x,y,w,52,False,INK,1.18)+10
            y=max(y+48,1510)
            text(d,'50 ML / 1.69 FL. OZ.',x,y,w,43,True); y+=72
            text(d,'PRODUCT CODE  '+facts['code'],x,y,w,39,True); y+=65
            text(d,'BARCODE  '+facts['barcode'],x,y,w,39,True); y+=92
            text(d,'FLAMMABLE',x,y,w,45,True,BURGUNDY); y+=70
            text(d,'Keep away from heat and open flame.',x,y,w,43)
        if n==10:
            text(d,'A SCENT JOURNEY',115,155,1730,126,True,BURGUNDY)
            text(d,name,120,350,1400,52,True,BURGUNDY)
            line(d,120,460)
        if n==11:
            text(d,name,110,180,840,43,True,BURGUNDY)
            text(d,'SCENT\nDESCRIPTION',110,290,850,96,True,BURGUNDY,1.06)
            line(d,110,555)
            text(d,facts['description'],110,710,800,93,False,INK,1.24)
        if n==12:
            text(d,name,110,180,800,43,True,BURGUNDY)
            text(d,'WHO\nIT FITS',110,305,800,124,True,BURGUNDY,1.03)
            line(d,110,630)
            text(d,facts['fit'],110,800,780,75,False,INK,1.3)
        out=root/'final'/f'{n:02d}-{NAMES[n]}.png'
        im.save(out,icc_profile=ICC,optimize=True)
        web=root/'final-web'/f'{n:02d}.jpg'
        im.resize((1200,1200),Image.Resampling.LANCZOS).save(web,quality=91,subsampling=0,optimize=True,icc_profile=ICC)
        rows.append({'frame':n,'source':source.name,'source_size':list(Image.open(source).size),'final':out.name,'web':web.name,'final_size':[2048,2048],'web_size':[1200,1200],'sha256':hashlib.sha256(out.read_bytes()).hexdigest()})
    (root/'EXPORT-MANIFEST.json').write_text(json.dumps({'colour':'sRGB embedded ICC','photos':'New imagegen native1254 square photographs normalized/upscaled to2048; web1200 downsampled','type':'Helvetica Neue and Helvetica Neue Bold fallback; licensed Cenzo/Helvetica Now unavailable','files':rows},indent=2))
    print(slug,'exported',len(rows))

