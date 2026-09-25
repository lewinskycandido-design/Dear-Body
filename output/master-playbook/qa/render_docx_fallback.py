from pathlib import Path
from lxml import etree
import zipfile, html, base64, json, re

ROOT=Path(__file__).resolve().parents[3]
OUT=Path(__file__).parent
DOC=OUT.parent/'Dear-Body-Master-Playbook.docx'
NS={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main','a':'http://schemas.openxmlformats.org/drawingml/2006/main','wp':'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing','r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}
def v(el,name,default=''):
    return el.get('{'+NS['w']+'}'+name,default) if el is not None else default
with zipfile.ZipFile(DOC) as z:
    files={n:z.read(n) for n in z.namelist()}
    body=etree.fromstring(files['word/document.xml']).find('w:body',NS)
    relroot=etree.fromstring(files['word/_rels/document.xml.rels'])
    rels={x.get('Id'):x.get('Target') for x in relroot}
    styles=etree.fromstring(files['word/styles.xml'])
    stylemap={x.get('{'+NS['w']+'}styleId'):x for x in styles}

def rcss(rpr):
    if rpr is None:return ''
    css=[]
    sz=rpr.find('w:sz',NS)
    if sz is not None:css.append(f'font-size:{int(v(sz,"val"))/2}pt')
    color=rpr.find('w:color',NS)
    if color is not None and v(color,'val')!='auto':css.append('color:#'+v(color,'val'))
    font=rpr.find('w:rFonts',NS)
    if font is not None:css.append('font-family:"'+v(font,'ascii')+'"')
    if rpr.find('w:b',NS) is not None:css.append('font-weight:bold')
    if rpr.find('w:i',NS) is not None:css.append('font-style:italic')
    return ';'.join(css)

def pcss(pr):
    if pr is None:return ''
    css=[]
    s=pr.find('w:spacing',NS)
    if s is not None:
        for a,prop in [('before','margin-top'),('after','margin-bottom')]:
            if v(s,a):css.append(f'{prop}:{int(v(s,a))/20}pt')
        if v(s,'line'):
            line=int(v(s,'line')); rule=v(s,'lineRule','auto')
            css.append('line-height:'+ (f'{line/20}pt' if rule=='exact' else str(line/240)))
    align=pr.find('w:jc',NS)
    if align is not None:css.append('text-align:'+v(align,'val'))
    ind=pr.find('w:ind',NS)
    if ind is not None:
        if v(ind,'left'):css.append(f'margin-left:{int(v(ind,"left"))/20}pt')
        if v(ind,'hanging'):css.append(f'text-indent:-{int(v(ind,"hanging"))/20}pt')
    return ';'.join(css)

def para(p):
    pr=p.find('w:pPr',NS); style=v(pr.find('w:pStyle',NS),'val','Normal') if pr is not None else 'Normal'
    s=stylemap.get(style); css=''
    if s is not None:css=rcss(s.find('w:rPr',NS))+';'+pcss(s.find('w:pPr',NS))
    css+=';'+pcss(pr)
    chunks=[]
    for r in p.iter('{'+NS['w']+'}r'):
        contents=[]
        for ch in r:
            tag=etree.QName(ch).localname
            if tag=='t':contents.append(html.escape(ch.text or '').replace('\n','<br>'))
            elif tag=='br': contents.append('<br>')
            elif tag=='drawing':
                ext=ch.find('.//wp:extent',NS); blip=ch.find('.//a:blip',NS)
                if ext is not None and blip is not None:
                    target=rels[blip.get('{'+NS['r']+'}embed')]; b64=base64.b64encode(files['word/'+target]).decode()
                    contents.append(f'<img src="data:image/png;base64,{b64}" style="width:{int(ext.get("cx"))/914400}in;height:{int(ext.get("cy"))/914400}in">')
        chunks.append('<span style="'+html.escape(rcss(r.find('w:rPr',NS)),quote=True)+'">'+''.join(contents)+'</span>')
    if style=='ListBullet':chunks.insert(0,'• ')
    if not chunks: chunks=['&nbsp;']
    return '<p class="'+style+'" style="'+html.escape(css,quote=True)+'">'+''.join(chunks)+'</p>'

def table(t):
    rows=[]
    for tr in t.findall('w:tr',NS):
        cells=[]
        for tc in tr.findall('w:tc',NS):
            pr=tc.find('w:tcPr',NS); w=pr.find('w:tcW',NS); sh=pr.find('w:shd',NS)
            css=''
            if w is not None:css+=f'width:{int(v(w,"w"))/1440}in;'
            if sh is not None:css+='background:#'+v(sh,'fill')+';'
            cells.append('<td style="'+css+'">'+''.join(para(x) for x in tc.findall('w:p',NS))+'</td>')
        rows.append('<tr>'+''.join(cells)+'</tr>')
    return '<table>'+''.join(rows)+'</table>'

pages=[[]]
for el in body:
    tag=etree.QName(el).localname
    if tag=='p':
        if el.find('.//w:br[@w:type="page"]',NS) is not None:pages.append([])
        else:pages[-1].append(para(el))
    elif tag=='tbl':pages[-1].append(table(el))
fonts=''
for family,folder,file in [('Cenzo Flare','CenzoFlare-Bold','CenzoFlare-Bold.ttf'),('Helvetica Now Text','HelveticaNowText-Regular','HelveticaNowText-Regular.ttf'),('Helvetica Now Display','HelveticaNowDisplay-Light','HelveticaNowDisplay-Light.ttf')]:
    path=ROOT/'output/website/scent-journey-theme/source-assets/fonts'/folder/file
    fonts+='@font-face{font-family:"'+family+'";src:url(data:font/ttf;base64,'+base64.b64encode(path.read_bytes()).decode()+');font-weight:100 900;}'
css=fonts+'body{margin:0;background:#aaa}*{box-sizing:border-box}.page{width:8.27in;height:11.69in;background:white;position:relative;margin:16px auto;padding:.58in .8in .60in;overflow:visible}.content{height:10.51in}p{font:10pt/14pt "Helvetica Now Text";margin:0 0 7pt;white-space:normal}img{vertical-align:bottom}table{border-collapse:collapse;table-layout:fixed;width:6.55in;margin:0 auto}td{padding:3.75pt;border:.5pt solid #d9d9d9;vertical-align:middle}td p{margin:0}footer{position:absolute;bottom:.28in;right:.8in;font:8pt "Helvetica Now Text";color:#555}.Caption{font-size:8pt;line-height:10pt;color:#535353}.page p:empty{min-height:4pt}'
markup='<!doctype html><html><head><meta charset="utf-8"><style>'+css+'</style></head><body>'
for i,content in enumerate(pages):markup+=f'<article class="page" id="page-{i+1}"><div class="content">'+''.join(content)+f'</div><footer>DEAR BODY · MASTER PLAYBOOK · {i+1}</footer></article>'
markup+='</body></html>'
(OUT/'docx-preview.html').write_text(markup,encoding='utf-8')
print(json.dumps({'pages':len(pages),'method':'OOXML browser preview, not native Word pagination'}))
