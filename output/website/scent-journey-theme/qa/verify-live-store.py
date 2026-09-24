#!/usr/bin/env python3
"""Bounded, read-only public HTML/asset verification after an explicitly ready launch.

Requires the published theme ID and exact Privacy URL. Terms is optional when
an actual populated Terms page exists; otherwise its missing old link is checked.
Never logs in,
submits a form, changes a cart, or calls an admin API. URLs are supplied routes,
observed HTML/CSS references, or filenames on an observed public theme asset path.
"""
import argparse
import concurrent.futures
import datetime
import hashlib
import http.cookiejar
import io
import math
import json
import re
import urllib.error
import urllib.parse
import urllib.request
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from PIL import Image, ImageChops, ImageStat

ROOT = Path(__file__).resolve().parents[1]
COOKIES = http.cookiejar.CookieJar()
USE_COOKIES = False
VOID = {'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
ORDER = ['studio-' + str(n).zfill(2) for n in [1,11,12,8,9,5,6,7,2,3,4,10]]

def now():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()

def absolute(base, value):
    value = (value or '').strip()
    if not value or value.startswith(('data:', 'blob:', '#', 'javascript:', 'mailto:', 'tel:')):
        return None
    result = urllib.parse.urljoin(base, value)
    return result if urllib.parse.urlparse(result).scheme in ('http', 'https') else None

def fetch(url):
    row = {'url': url, 'checkedAt': now()}
    try:
        req = urllib.request.Request(url, headers={'User-Agent':'Mozilla/5.0 (compatible; DearBodyPublicQA/1.0)', 'Accept':'*/*'})
        try:
            opener=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(COOKIES)) if USE_COOKIES else urllib.request.build_opener()
            response = opener.open(req, timeout=40)
        except urllib.error.HTTPError as exc:
            response = exc
        with response:
            body = response.read()
            row.update(status=response.status, finalUrl=response.url, contentType=response.headers.get('Content-Type',''), bytes=len(body))
        return row, body
    except Exception as exc:
        row['requestError'] = type(exc).__name__ + ': ' + str(exc)
        return row, b''

class Document(HTMLParser):
    def __init__(self, url):
        super().__init__()
        self.url=url; self.stack=[]; self.texts=[]; self.title=[]; self.h1=[]; self.h2=[]
        self.links=[]; self.images=[]; self.stylesheets=[]; self.scripts=[]; self.inline_styles=[]; self.body={}
        self.script=None; self.finder_data=[]; self.finder_errors=[]; self.finder_cards=[]
        self.gallery_ids=[]; self.gallery_buttons=[]; self.sections=[]
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        if tag=='body': self.body=attrs
        if attrs.get('id','').startswith('shopify-section'): self.sections.append(attrs['id'])
        if 'data-sj-media' in attrs: self.gallery_ids.append(attrs['data-sj-media'])
        if 'data-sj-gallery-autoplay' in attrs: self.gallery_buttons.append(attrs)
        if 'data-sj-finder-product' in attrs: self.finder_cards.append(attrs['data-sj-finder-product'])
        if tag in ('title','h1','h2','a','style'):
            self.texts.append({'tag':tag,'parts':[],'attrs':attrs,'regions':[x for x in self.stack if x in ('header','main','footer','nav')]})
        if tag=='script':
            self.script={'attrs':attrs,'parts':[]}
            src=absolute(self.url,attrs.get('src'))
            if src: self.scripts.append(src)
        if tag=='img':
            sources=[]
            for key in ('src','data-src','data-light-src','data-dark-src'):
                url=absolute(self.url,attrs.get(key))
                if url: sources.append({'attribute':key,'url':url})
            for key in ('srcset','data-srcset'):
                for candidate in attrs.get(key,'').split(','):
                    url=absolute(self.url,candidate.strip().split(' ')[0])
                    if url: sources.append({'attribute':key,'url':url})
            self.images.append({'alt':attrs.get('alt'), 'sources':sources, 'regions':[x for x in self.stack if x in ('header','main','footer')]})
        if tag=='link' and attrs.get('rel')=='stylesheet':
            url=absolute(self.url,attrs.get('href'))
            if url: self.stylesheets.append(url)
        if tag not in VOID: self.stack.append(tag)
    def handle_endtag(self, tag):
        if tag=='script' and self.script:
            if 'data-sj-finder-data' in self.script['attrs']:
                try: self.finder_data.extend(json.loads(''.join(self.script['parts'])))
                except Exception as exc: self.finder_errors.append(str(exc))
            self.script=None
        if tag in ('title','h1','h2','a','style'):
            for pos in range(len(self.texts)-1,-1,-1):
                if self.texts[pos]['tag']==tag:
                    item=self.texts.pop(pos); text=' '.join(' '.join(item['parts']).split())
                    if tag=='a': self.links.append({'text':text,'href':item['attrs'].get('href',''),'absoluteUrl':absolute(self.url,item['attrs'].get('href')),'regions':item['regions']})
                    elif tag=='style': self.inline_styles.append(''.join(item['parts']))
                    else: getattr(self,tag).append(text)
                    break
        if tag in self.stack:
            del self.stack[len(self.stack)-1-self.stack[::-1].index(tag):]
    def handle_data(self, text):
        if self.script: self.script['parts'].append(text)
        else:
            for item in self.texts: item['parts'].append(text)

def inspect_page(url):
    row, body=fetch(url)
    html=body.decode('utf-8', errors='replace')
    doc=Document(row.get('finalUrl',url)); doc.feed(html)
    match=re.search(r'Shopify\.theme\s*=\s*(\{[^\n;]+\})\s*;',html)
    theme=None
    if match:
        try: theme=json.loads(match.group(1))
        except ValueError: theme={'raw':match.group(1)}
    row.update(title=doc.title,h1=doc.h1,h2=doc.h2,theme=theme,bodyAttributes=doc.body,sectionIds=doc.sections,
        liquidErrors=re.findall(r'(?:Liquid (?:error|syntax error)[^<\n]{0,500}|translation missing:[^<\n]{0,300})',html,re.I),
        links=doc.links,images=doc.images,stylesheets=list(dict.fromkeys(doc.stylesheets)),scripts=list(dict.fromkeys(doc.scripts)),
        finderData=doc.finder_data,finderJSONErrors=doc.finder_errors,finderCardIds=doc.finder_cards,
        galleryIds=doc.gallery_ids,autoplayControlCount=len(doc.gallery_buttons))
    return row,doc.inline_styles

def signature(body):
    if body.startswith(b'\xff\xd8\xff'): return 'jpeg'
    if body.startswith(b'\x89PNG\r\n\x1a\n'): return 'png'
    if body.startswith((b'GIF87a',b'GIF89a')): return 'gif'
    if body.startswith(b'RIFF') and body[8:12]==b'WEBP': return 'webp'
    if b'<svg' in body[:2000].lower(): return 'svg'
    if body[:4]==b'wOF2': return 'woff2'
    if body[:4]==b'wOFF': return 'woff'
    if body[:4]==b'\x00\x01\x00\x00': return 'ttf'
    if body[:4]==b'OTTO': return 'otf'
    if body[4:12] in (b'ftypavif',b'ftypavis'): return 'avif'
    return None

def inspect_asset(url):
    row,body=fetch(url)
    row.update(sha256=hashlib.sha256(body).hexdigest(),signature=signature(body))
    if row['signature'] in ('jpeg','png','gif','webp','avif'):
        try:
            actual=Image.open(io.BytesIO(body));actual.load();row['decodedDimensions']=list(actual.size)
            filename=urllib.parse.unquote(urllib.parse.urlparse(url).path.rsplit('/',1)[-1])
            local=ROOT/'theme/assets'/filename
            if local.is_file():
                source=Image.open(local);source.load()
                comparison={'packagedDimensions':list(source.size),'dimensionsMatch':source.size==actual.size}
                if comparison['dimensionsMatch']:
                    delta=ImageChops.difference(actual.convert('RGB'),source.convert('RGB'))
                    rms=math.sqrt(sum(v*v for v in ImageStat.Stat(delta).rms)/3)
                    comparison.update(rgbRMSE=round(rms,5),maxAllowedRGBRMSE=8,perceptuallyEquivalent=rms<=8)
                row['packagedImageComparison']=comparison
        except Exception as exc: row['decodeError']=str(exc)
    return row

def main():
    global USE_COOKIES
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--theme-id',required=True)
    parser.add_argument('--privacy-url',required=True,help='Exact confirmed public Privacy URL/path')
    parser.add_argument('--terms-url',help='Exact confirmed populated Terms URL/path; omit when the missing Terms link was removed')
    parser.add_argument('--preview-url',help='Observed public draft preview URL; its query is preserved on every HTML route')
    parser.add_argument('--commerce-sha',help='Expected exact SHA-256 for sj-commerce.js; also verifies read-only cart drawer section responses')
    args=parser.parse_args()
    USE_COOKIES=bool(args.preview_url)
    base='https://dearbody.ph'
    gallery=json.loads((ROOT/'qa/gallery-assets.json').read_text())
    handles=list(dict.fromkeys(x['handle'] for x in gallery))
    paths=['/','/collections/womens-perfume','/collections/mens-perfume']+['/products/'+h for h in handles]+['/pages/our-story','/pages/scent-finder','/pages/faq','/pages/shipping','/pages/contact',args.privacy_url,'/search','/cart']
    if args.terms_url: paths.append(args.terms_url)
    urls=list(dict.fromkeys(absolute(base,path) for path in paths))
    scope='UNPUBLISHED SHOPIFY DRAFT PREVIEW' if args.preview_url else 'PUBLIC LIVE STOREFRONT'
    output_name='shopify-draft-verification.json' if args.preview_url else 'live-store-verification.json'
    if args.preview_url:
        supplied=urllib.parse.urlparse(args.preview_url)
        query=urllib.parse.parse_qs(supplied.query)
        if supplied.scheme!='https' or supplied.netloc!='dearbody.ph' or query.get('preview_theme_id')!=[args.theme_id]:
            parser.error('Preview URL must be the observed dearbody.ph URL with the expected preview_theme_id.')
        urls=[urllib.parse.urlunparse(urllib.parse.urlparse(url)._replace(query=urllib.parse.urlencode({**urllib.parse.parse_qs(urllib.parse.urlparse(url).query),**query},doseq=True))) for url in urls]
    report={'startedAt':now(),'verificationTarget':scope,'expectedThemeId':args.theme_id,'previewURL':args.preview_url,'cookieHandlerUsed':USE_COOKIES,'publicationPerformed':False,'scope':'Read-only HTML GETs and observed public image/font asset GETs. '+('Draft preview parameters are preserved on all HTML requests, with response cookies carried between requests.' if USE_COOKIES else 'Public MAIN check: no preview parameters and no cookies or cookie handler on any request.')+' No browser, cart/form submissions, login, admin API or publication.','pages':[],'findings':[]}
    findings=report['findings']
    def finding(kind,detail,**extra): findings.append({'kind':kind,'detail':detail,**extra})
    if args.preview_url:
        preflight,_=inspect_page(urls[0]);report['previewPreflight']=preflight
        if str((preflight.get('theme') or {}).get('id'))!=args.theme_id:
            finding('preview-unavailable','Direct public HTTP preview did not expose the expected draft theme; remaining checks were not attempted.',url=urls[0],theme=preflight.get('theme'),status=preflight.get('status'))
            report['summary']={'status':'BLOCKED','pages':0,'artworkCount':0,'findings':len(findings),'finishedAt':now()}
            out=ROOT/'qa'/output_name;out.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'output':str(out),**report['summary'],'findings':findings},indent=2));return 1
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool: parsed=list(pool.map(inspect_page,urls))
    report['pages']=[row for row,_ in parsed]
    for row in report['pages']:
        if row.get('status')!=200: finding('page-status','Expected HTTP 200',url=row['url'],status=row.get('status'),error=row.get('requestError'))
        if '404' in row.get('bodyAttributes',{}).get('class','') or row.get('title')==['404 Not Found']: finding('native-404','Shopify 404 template returned',url=row['url'])
        if row['liquidErrors']: finding('liquid-errors','Liquid/translation errors rendered',url=row['url'],errors=row['liquidErrors'])
        if str((row.get('theme') or {}).get('id'))!=args.theme_id: finding('theme-id','Unexpected public theme ID',url=row['url'],theme=row.get('theme'))
        if len(row['h1'])!=1: finding('heading','Expected one H1',url=row['url'],h1=row['h1'])
        if not args.terms_url and any(urllib.parse.urlparse(x['absoluteUrl'] or '').path=='/pages/terms' for x in row['links']): finding('missing-legal-link','Unpublished Terms page is still linked',url=row['url'])
        if '/products/' in urllib.parse.urlparse(row['url']).path:
            if row['galleryIds']!=ORDER: finding('gallery-order','Expected all 12 bundled gallery frames in approved order',url=row['url'],galleryIds=row['galleryIds'])
            if row['autoplayControlCount']: finding('gallery-controls','Removed Play/Pause control present',url=row['url'])
        if urllib.parse.urlparse(row['url']).path=='/pages/scent-finder':
            if len(row['finderData'])!=6 or len(row['finderCardIds'])!=6 or row['finderJSONErrors']: finding('finder-data','Expected six native Finder profiles and card templates',url=row['url'],profiles=len(row['finderData']),cards=len(row['finderCardIds']),jsonErrors=row['finderJSONErrors'])
    if args.commerce_sha:
        script_urls=sorted(set(url for row in report['pages'] for url in row['scripts'] if urllib.parse.urlparse(url).path.endswith('/sj-commerce.js')))
        report['commerceScriptChecks']=[]
        if not script_urls: finding('commerce-script','No sj-commerce.js URL found in fresh public HTML')
        for url in script_urls:
            script,body=fetch(url);script['sha256']=hashlib.sha256(body).hexdigest();script['expectedSHA256']=args.commerce_sha;script['hashMatches']=script['sha256']==args.commerce_sha
            script['sourceMatchesExpected']=script['hashMatches']
            if not script['hashMatches']:
                source_map=re.search(r'//# sourceMappingURL=(\S+)',body.decode('utf-8',errors='replace'))
                if source_map:
                    map_url=absolute(url,source_map.group(1));map_row,map_body=fetch(map_url)
                    map_row['sha256']=hashlib.sha256(map_body).hexdigest()
                    try:
                        data=json.loads(map_body)
                        map_row['sources']=[{'source':data.get('sources',[])[i],'bytes':len(source.encode()),'sha256':hashlib.sha256(source.encode()).hexdigest()} for i,source in enumerate(data.get('sourcesContent',[]))]
                        script['sourceMatchesExpected']=any(x['sha256']==args.commerce_sha for x in map_row['sources'])
                    except Exception as exc: map_row['parseError']=str(exc)
                    script['sourceMapVerification']=map_row
            report['commerceScriptChecks'].append(script)
            if script.get('status')!=200 or not script['sourceMatchesExpected']: finding('commerce-script','Neither delivered JS nor its explicitly referenced source map matches the approved source',url=url,status=script.get('status'),expected=args.commerce_sha,actual=script['sha256'])
        report['cartDrawerSectionChecks']=[]
        for url in ['https://dearbody.ph/?sections=sj-cart-drawer','https://dearbody.ph/cart?sections=sj-cart-drawer']:
            section,body=fetch(url);section['requestAccept']='*/* (fetch default equivalent)'
            try:
                payload=json.loads(body);html=payload.get('sj-cart-drawer');section.update(jsonValid=True,drawerHTMLPresent=isinstance(html,str) and bool(html.strip()),drawerRootPresent=isinstance(html,str) and 'sj-cart-drawer' in html,drawerHTMLLength=len(html) if isinstance(html,str) else 0)
            except Exception as exc: section.update(jsonValid=False,parseError=str(exc))
            report['cartDrawerSectionChecks'].append(section)
            if section.get('status')!=200 or not section.get('drawerHTMLPresent') or not section.get('drawerRootPresent'): finding('cart-section','Expected non-empty sj-cart-drawer HTML in section-rendering JSON',url=url,response=section)
    art=[{'file':x['asset'],'sha256':x['sha256'],'group':'gallery'} for x in gallery]
    for file,group in [('campaign-assets.json','campaign'),('product-banner-assets.json','product-banner'),('home-feature-assets.json','home-feature'),('customer-care-assets.json','customer-care')]:
        art.extend({'file':x['file'],'sha256':x['sha256'],'group':group} for x in json.loads((ROOT/'qa'/file).read_text()))
    if len(art)!=99 or len(set(x['file'] for x in art))!=99: finding('manifest-count','Expected 99 unique current artwork files',count=len(art),unique=len(set(x['file'] for x in art)))
    image_urls=sorted(set(s['url'] for row in report['pages'] for img in row['images'] for s in img['sources']))
    byname={}
    for url in image_urls: byname.setdefault(urllib.parse.unquote(urllib.parse.urlparse(url).path.rsplit('/',1)[-1]),[]).append(url)
    observed_prefixes=Counter(url.split('/assets/')[0]+'/assets/' for url in image_urls if '/assets/' in url and '/cdn/shop/t/' in url)
    prefix=observed_prefixes.most_common(1)[0][0] if observed_prefixes else None
    report['observedThemeAssetPrefixes']=dict(observed_prefixes)
    for item in art:
        item['observedUrls']=byname.get(item['file'],[])
        item['referencedInHTML']=bool(item['observedUrls'])
        item['validationUrl']=item['observedUrls'][0] if item['observedUrls'] else prefix+urllib.parse.quote(item['file']) if prefix else None
        if not item['referencedInHTML']: finding('artwork-reference','Manifest artwork absent from observed img/srcset/theme-mode references',file=item['file'])
    css_urls=sorted(set(url for row in report['pages'] for url in row['stylesheets']))
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool: css_results=list(pool.map(fetch,css_urls))
    report['stylesheets']=[r for r,_ in css_results]
    font_urls=set()
    style_sources=[(row['finalUrl'],style) for row,styles in parsed for style in styles]+[(r.get('finalUrl',r['url']),body.decode('utf-8',errors='replace')) for r,body in css_results]
    for source,css in style_sources:
        for val in re.findall(r'url\(\s*[\"\x27]?([^\)\"\x27]+)',css):
            # CSS string escapes (for example \/ from Liquid's JSON filter) are
            # interpreted by browsers before URL resolution.
            val=re.sub(r'\\([0-9a-fA-F]{1,6})\s?',lambda m:chr(int(m.group(1),16)),val.strip())
            val=re.sub(r'\\(.)',r'\1',val)
            url=absolute(source,val)
            if url and re.search(r'\.(?:woff2?|ttf|otf)(?:\?|$)',url,re.I): font_urls.add(url)
    asset_urls=sorted(set(image_urls)|font_urls|set(x['validationUrl'] for x in art if x['validationUrl']))
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool: report['assets']=list(pool.map(inspect_asset,asset_urls))
    assets_by_url={x['url']:x for x in report['assets']}
    for row in report['assets']:
        if row.get('status')!=200 or not row.get('bytes') or not row.get('signature'): finding('asset-response','Expected non-empty recognised image/font HTTP 200',url=row['url'],status=row.get('status'),contentType=row.get('contentType'),signature=row.get('signature'),error=row.get('requestError'))
        if row.get('decodeError'): finding('image-decode','Image could not be decoded',url=row['url'],error=row['decodeError'])
    for item in art:
        row=assets_by_url.get(item['validationUrl'],{})
        item['liveSHA256']=row.get('sha256'); item['hashMatchesManifest']=row.get('sha256')==item['sha256']
        item['decodedComparison']=row.get('packagedImageComparison')
        item['contentMatchesPackagedImage']=item['hashMatchesManifest'] or bool((item['decodedComparison'] or {}).get('dimensionsMatch') and (item['decodedComparison'] or {}).get('perceptuallyEquivalent'))
        if not item['contentMatchesPackagedImage']: finding('artwork-content','CDN image dimensions or decoded content differs from packaged image',file=item['file'],comparison=item['decodedComparison'])
    report['artwork']=art
    report['fontURLs']=sorted(font_urls)
    report['summary']={'status':'PASS' if not findings else 'FINDINGS','pages':len(report['pages']),'imageURLCount':len(image_urls),'assetRequests':len(report['assets']),'artworkCount':len(art),'artworkReferenced':sum(x['referencedInHTML'] for x in art),'artworkHashesMatching':sum(x['hashMatchesManifest'] for x in art),'artworkContentMatching':sum(x['contentMatchesPackagedImage'] for x in art),'cdnOptimisedArtwork':sum(not x['hashMatchesManifest'] and x['contentMatchesPackagedImage'] for x in art),'maximumArtworkRGBRMSE':max((x.get('decodedComparison') or {}).get('rgbRMSE',0) for x in art),'nativeFinderProfiles':next((len(x['finderData']) for x in report['pages'] if urllib.parse.urlparse(x['url']).path=='/pages/scent-finder'),None),'findings':len(findings),'finishedAt':now()}
    report['limitations']=['HTTP validates native rendered HTML and response bytes. Root owns interactive browser behavior, visual crops, checkout and admin checks.','No additional linked page was fetched unless it was in the confirmed requested route set. All discovered header/main/footer links are retained per page.','An asset fetched from an observed CDN prefix but not directly referenced remains a missing-reference finding.','Shopify CDN JPEG optimisation can change byte hashes. Artwork is checked against the packaged source for equal decoded dimensions and RGB root-mean-square error <= 8 on the 0–255 scale; exact byte hashes are retained separately and are not required for CDN copies.']
    out=ROOT/'qa'/output_name;out.write_text(json.dumps(report,indent=2)+'\n')
    print(json.dumps({'output':str(out),**report['summary'],'findings':findings},indent=2))
    return 0 if not findings else 1

if __name__=='__main__':
    raise SystemExit(main())
