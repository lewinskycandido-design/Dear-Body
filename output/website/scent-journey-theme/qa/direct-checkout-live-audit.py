#!/usr/bin/env python3
"""Read-only public verification of the direct-checkout release, after upload.

Only known page routes and observed public asset/source-map URLs are fetched.
No cookies, preview parameters, login, admin API, form submission, checkout
permalink request, cart mutation, or order creation. Importing this file is inert.
"""
import argparse
import concurrent.futures
import hashlib
import importlib.util
import json
import re
import urllib.parse
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('dearbody_public_helpers', ROOT / 'qa/verify-live-store.py')
http = importlib.util.module_from_spec(spec)
spec.loader.exec_module(http)
http.USE_COOKIES = False
HANDLES = ['mojito-metallique', 'amber-oud-silk', 'mistened-narcissus', 'charme-envoutant', 'oud-mirage', 'rtulle-satin']
PATHS = ['/', '/collections/all', '/collections/womens-perfume', '/collections/mens-perfume'] + [f'/products/{h}' for h in HANDLES] + ['/pages/our-story', '/pages/scent-finder', '/pages/faq', '/pages/shipping', '/pages/contact', '/policies/privacy-policy', '/search', '/cart']
REQUIRED_ADDRESS = ['first_name', 'last_name', 'address1', 'city', 'province', 'zip']
REQUIRED_SCRIPTS = ['sj-base.js', 'sj-commerce.js', 'sj-product.js', 'sj-finder.js']


def digest(data):
    return hashlib.sha256(data).hexdigest()


def filename(url):
    return urllib.parse.unquote(urllib.parse.urlparse(url).path.rsplit('/', 1)[-1])


def has_class(node, name):
    return name in node['attrs'].get('class', '').split()


def text(node):
    return ' '.join(' '.join(node['parts']).split())


class Elements(HTMLParser):
    """Small attribute/text tree for read-only checks; no JS or resource loading."""
    def __init__(self):
        super().__init__()
        self.nodes = []
        self.stack = []

    def handle_starttag(self, tag, attrs):
        node = {'tag': tag, 'attrs': dict(attrs), 'parents': self.stack.copy(), 'parts': []}
        self.nodes.append(node)
        if tag not in http.VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in http.VOID:
            self.handle_endtag(tag)

    def handle_endtag(self, tag):
        for index in range(len(self.stack) - 1, -1, -1):
            if self.stack[index]['tag'] == tag:
                del self.stack[index:]
                break

    def handle_data(self, data):
        for node in self.stack:
            node['parts'].append(data)


def descendants(tree, parent, tag=None, attr=None):
    return [n for n in tree.nodes if any(p is parent for p in n['parents']) and (not tag or n['tag'] == tag) and (not attr or attr in n['attrs'])]


def parse_html(url, response, body):
    html = body.decode('utf-8', errors='replace')
    doc = http.Document(response.get('finalUrl', url))
    doc.feed(html)
    tree = Elements()
    tree.feed(html)
    theme_match = re.search(r'Shopify\.theme\s*=\s*(\{[^\n;]+\})\s*;', html)
    theme = None
    if theme_match:
        try:
            theme = json.loads(theme_match.group(1))
        except ValueError:
            pass
    row = {**response, 'title': doc.title, 'h1': doc.h1, 'theme': theme,
           'liquidErrors': re.findall(r'(?:Liquid (?:error|syntax error)[^<\n]{0,250}|translation missing:[^<\n]{0,150})', html, re.I),
           'is404': '404' in doc.body.get('class', '') or doc.title == ['404 Not Found'],
           'galleryIds': doc.gallery_ids, 'autoplayControlCount': len(doc.gallery_buttons),
           'finderProfileCount': len(doc.finder_data), 'finderCardCount': len(doc.finder_cards), 'finderJSONErrors': doc.finder_errors,
           'stylesheets': sorted(set(doc.stylesheets)), 'scripts': sorted(set(doc.scripts)),
           'navigation': [link for link in doc.links if 'header' in link['regions'] or 'footer' in link['regions']]}
    headers = [n for n in tree.nodes if has_class(n, 'sj-header')]
    header_nodes = [n for n in tree.nodes if any(any(p is h for p in n['parents']) for h in headers)]
    row['header'] = {'count': len(headers), 'bagControls': len([n for n in header_nodes if 'data-sj-open-cart' in n['attrs'] or urllib.parse.urlparse(n['attrs'].get('href', '')).path.rstrip('/') == '/cart']),
                     'searchControls': len([n for n in header_nodes if 'data-sj-open-search' in n['attrs']]),
                     'themeControls': len([n for n in header_nodes if 'data-sj-theme-toggle' in n['attrs']])}
    forms = [n for n in tree.nodes if n['tag'] == 'form' and 'data-sj-checkout-form' in n['attrs']]
    row['checkoutForms'] = []
    for form in forms:
        nodes = descendants(tree, form)
        selects = [n for n in nodes if n['tag'] == 'select' and 'data-sj-variant' in n['attrs']]
        second = [n for n in nodes if n['tag'] == 'select' and 'data-sj-checkout-second' in n['attrs']]
        option_data = lambda select: [{'value': n['attrs'].get('value', ''), 'available': n['attrs'].get('data-available'), 'priceCents': n['attrs'].get('data-price-cents'), 'quantityMin': n['attrs'].get('data-quantity-min'), 'quantityIncrement': n['attrs'].get('data-quantity-step'), 'quantityMax': n['attrs'].get('data-quantity-max'), 'disabled': 'disabled' in n['attrs'], 'selected': 'selected' in n['attrs'], 'text': text(n)} for n in descendants(tree, select, tag='option')]
        buttons = [n for n in nodes if n['tag'] == 'button' and 'data-sj-add' in n['attrs']]
        row['checkoutForms'].append({'method': form['attrs'].get('method', '').lower(), 'action': form['attrs'].get('action'), 'base': form['attrs'].get('data-sj-checkout-base'),
            'fields': [{'name': n['attrs'].get('name'), 'type': n['attrs'].get('type'), 'required': 'required' in n['attrs'], 'value': n['attrs'].get('value', ''), 'pattern': n['attrs'].get('pattern')} for n in nodes if n['tag'] == 'input'],
            'variants': option_data(selects[0]) if len(selects) == 1 else [], 'secondSelectors': len(second), 'secondOptions': option_data(second[0]) if len(second) == 1 else [],
            'buttons': [{'label': text(n), 'disabled': 'disabled' in n['attrs'], 'type': n['attrs'].get('type')} for n in buttons],
            'summary': [{'currency': n['attrs'].get('data-currency'), 'singleShippingCents': n['attrs'].get('data-single-shipping'), 'text': text(n)} for n in nodes if 'data-sj-checkout-summary' in n['attrs']],
            'hasQuantityControl': any(n['attrs'].get('name') == 'quantity' and n['attrs'].get('type') != 'hidden' for n in nodes)})
    row['legacyPurchaseFormCount'] = len([n for n in tree.nodes if 'data-sj-product-form' in n['attrs']])
    reviews = [n for n in tree.nodes if has_class(n, 'sj-product-reviews')]
    row['reviews'] = {'sections': len(reviews), 'forms': sum(len(descendants(tree, n, tag='form')) for n in reviews),
                      'reviewCards': len([n for n in tree.nodes if has_class(n, 'sj-review-card')]),
                      'appBlocks': len([n for n in tree.nodes if has_class(n, 'sj-product-reviews__app')]),
                      'summaries': [text(n) for n in tree.nodes if has_class(n, 'sj-rating-summary') and any(any(p is r for p in n['parents']) for r in reviews)],
                      'emptyStates': [text(n) for n in tree.nodes if has_class(n, 'sj-product-reviews__empty')],
                      'submissionControls': [text(n) for n in tree.nodes if any(any(p is r for p in n['parents']) for r in reviews) and n['tag'] in ('input', 'textarea', 'select', 'button')]}
    finders = [n for n in tree.nodes if 'data-sj-finder' in n['attrs']]
    finder_nodes = [n for n in tree.nodes if any(any(p is f for p in n['parents']) for f in finders)]
    row['finder'] = {'autoAdvanceInstruction': any('straight to the next question' in text(n) for n in finder_nodes if has_class(n, 'sj-finder-instruction')),
                     'hasChoices': any('data-sj-finder-choices' in n['attrs'] for n in finder_nodes),
                     'hasBack': any('data-sj-finder-back' in n['attrs'] for n in finder_nodes),
                     'hasReset': any('data-sj-finder-reset' in n['attrs'] for n in finder_nodes),
                     'obsoleteContinueControls': [text(n) for n in finder_nodes if n['tag'] == 'button' and ('data-sj-finder-next' in n['attrs'] or text(n).lower() in ('continue', 'discover'))]}
    image_urls = {source['url'] for image in doc.images for source in image['sources']}
    return row, {'imageURLs': image_urls, 'inlineStyles': doc.inline_styles, 'elements': tree}


def inspect_page(url):
    response, body = http.fetch(url)
    return parse_html(url, response, body)


def check_script(url):
    row, body = http.fetch(url)
    local = ROOT / 'theme/assets' / filename(url)
    expected = digest(local.read_bytes())
    row.update(file=local.name, sha256=digest(body), expectedSHA256=expected, sourceMatchesExpected=digest(body) == expected)
    if row.get('status') == 200 and not row['sourceMatchesExpected']:
        match = re.search(r'(?://[#@]\s*sourceMappingURL=([^\s]+)|/\*[#@]\s*sourceMappingURL=([^\s*]+))', body.decode('utf-8', errors='replace'))
        if match:
            map_url = http.absolute(url, match.group(1) or match.group(2))
            if map_url:
                map_row, map_body = http.fetch(map_url)
                map_row['sha256'] = digest(map_body)
                try:
                    payload = json.loads(map_body)
                    sources = payload.get('sources', [])
                    map_row['sources'] = [{'source': sources[i] if i < len(sources) else None, 'bytes': len(source.encode()), 'sha256': digest(source.encode())} for i, source in enumerate(payload.get('sourcesContent', [])) if isinstance(source, str)]
                    row['sourceMatchesExpected'] = map_row.get('status') == 200 and any(x['sha256'] == expected for x in map_row['sources'])
                except (ValueError, AttributeError, TypeError) as exc:
                    map_row['parseError'] = str(exc)
                row['sourceMapVerification'] = map_row
    return row


def css_urls(base, css):
    values = set()
    for value in re.findall(r'url\(\s*["\x27]?([^\)"\x27]+)', css):
        value = re.sub(r'\\([0-9a-fA-F]{1,6})\s?', lambda m: chr(int(m.group(1), 16)), value.strip())
        value = re.sub(r'\\(.)', r'\1', value)
        url = http.absolute(base, value)
        if url:
            values.add(url)
    return values


def asset_manifest():
    gallery = json.loads((ROOT / 'qa/gallery-assets.json').read_text())
    assets = [{'file': x['asset'], 'sha256': x['sha256'], 'group': 'gallery'} for x in gallery]
    assets += [{'file': x['thumbnail'], 'sha256': x['thumbnail_sha256'], 'group': 'thumbnail'} for x in gallery]
    for manifest, group in [('campaign-assets.json', 'campaign'), ('product-banner-assets.json', 'product-banner'), ('home-feature-assets.json', 'home-feature'), ('customer-care-assets.json', 'customer-care'), ('gallery-frame-assets.json', 'gallery-frame'), ('font-assets.json', 'font')]:
        assets += [{'file': x['file'], 'sha256': x['sha256'], 'group': group} for x in json.loads((ROOT / 'qa' / manifest).read_text())]
    return assets


def main(*, page_extension=None, script_names=None, default_output=None, description=None, quantity_mode=False, cod_mode=False, report_extension=None):
    parser = argparse.ArgumentParser(description=description or __doc__)
    parser.add_argument('--theme-id', help='Expected published main theme ID; omit to record and consistently verify the homepage ID.')
    parser.add_argument('--output', default=str(default_output or ROOT / 'qa/direct-checkout-live-audit.json'))
    if cod_mode:
        parser.add_argument('--preview', action='store_true', help='Read only the explicit --theme-id draft through preview query parameters; never claim a public-main verification.')
    args = parser.parse_args()
    preview = cod_mode and args.preview
    if preview and not args.theme_id:
        parser.error('--preview requires --theme-id')
    http.USE_COOKIES = bool(preview)
    if preview:
        http.COOKIES = http.http.cookiejar.CookieJar()
    base = 'https://dearbody.ph'
    urls = [base + route for route in PATHS]
    if preview:
        query = urllib.parse.urlencode({'_ab': '0', '_fd': '0', '_sc': '1', 'preview_theme_id': args.theme_id})
        urls = [url + '?' + query for url in urls]
    scope = 'EXPLICIT THEME PREVIEW, read-only HTTP GETs using the requested theme query and a fresh preview-only cookie jar initialized from that public URL; no browser/admin authentication, forms, cart mutations, checkout navigation or orders.' if preview else 'PUBLIC MAIN, read-only HTTP GETs; no cookies, preview query, admin, forms, cart mutations, checkout navigation or orders.'
    report = {'startedAt': http.now(), 'scope': scope, 'expectedThemeId': args.theme_id, 'findings': [], 'pages': []}
    def issue(kind, detail, **extra):
        report['findings'].append({'kind': kind, 'detail': detail, **extra})
    first = [inspect_page(urls[0])] if preview else []
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
        parsed = first + list(pool.map(inspect_page, urls[1:] if preview else urls))
    report['pages'] = [row for row, _ in parsed]
    expected_id = args.theme_id or str((report['pages'][0].get('theme') or {}).get('id') or '')
    report['effectiveThemeId'] = expected_id
    if not expected_id:
        issue('theme-id', 'No public Shopify theme ID could be read.')
    for row in report['pages']:
        url = row['url']
        route = urllib.parse.urlparse(url).path
        if row.get('status') != 200 or row['is404']:
            issue('page-status', 'Expected a non-404 HTTP 200 page.', url=url, status=row.get('status'), error=row.get('requestError'))
        if row['liquidErrors']:
            issue('liquid-error', 'Liquid or translation error rendered.', url=url, errors=row['liquidErrors'])
        allowed_roles = ('main', 'unpublished') if preview else ('main',)
        if str((row.get('theme') or {}).get('id')) != expected_id or (row.get('theme') or {}).get('role') not in allowed_roles:
            issue('theme-id', 'Page does not expose the expected theme and permitted role for this audit scope.', url=url, theme=row.get('theme'))
        if len(row['h1']) != 1:
            issue('heading', 'Expected one H1.', url=url, h1=row['h1'])
        header = row['header']
        if header['count'] != 1 or header['bagControls'] or header['searchControls'] != 1 or header['themeControls'] != 1:
            issue('header', 'Expected search and mode switch, with no primary bag control.', url=url, header=header)
        required_navigation = {
            'header': {'/collections/womens-perfume', '/collections/mens-perfume', '/pages/scent-finder', '/pages/our-story'},
            'footer': {'/collections/womens-perfume', '/collections/mens-perfume', '/pages/scent-finder', '/pages/our-story', '/pages/faq', '/pages/shipping', '/pages/contact', '/policies/privacy-policy'}
        }
        for region, required in required_navigation.items():
            actual = {urllib.parse.urlparse(link['absoluteUrl'] or '').path.rstrip('/') for link in row['navigation'] if region in link['regions']}
            if required - actual:
                issue('navigation', 'Required shared navigation targets are missing.', url=url, region=region, missing=sorted(required - actual))
        for link in row['navigation']:
            target = urllib.parse.urlparse(link['absoluteUrl'] or '')
            if target.path == '/pages/terms':
                issue('navigation', 'Missing Terms page is still linked.', url=url, target=link['href'])
            if target.netloc == 'dearbody.ph' and target.path in PATHS:
                target_page = report['pages'][PATHS.index(target.path)]
                if target_page.get('status') != 200 or target_page['is404']:
                    issue('navigation', 'A known navigation target is unavailable.', url=url, target=target.path)
        if route.startswith('/products/'):
            if row['galleryIds'] != http.ORDER or row['autoplayControlCount']:
                issue('gallery', 'Expected 12 approved-order images and no Play/Pause control.', url=url)
            if len(row['checkoutForms']) != 1 or row['legacyPurchaseFormCount']:
                issue('checkout-form', 'Expected one direct checkout form and no Add to bag form.', url=url)
            for form in ([] if cod_mode else row['checkoutForms']):
                fields = {x['name']: x for x in form['fields']}
                missing = [key for key in REQUIRED_ADDRESS if not fields.get(f'checkout[shipping_address][{key}]', {}).get('required')]
                if missing or fields.get('checkout[shipping_address][country]', {}).get('value') != 'Philippines':
                    issue('checkout-address', 'Required Philippine address fields are missing.', url=url, missing=missing)
                if 'checkout[shipping_address][address2]' not in fields or fields['checkout[shipping_address][address2]']['required']:
                    issue('checkout-address', 'Apartment/unit field must remain optional.', url=url)
                if fields.get('checkout[shipping_address][zip]', {}).get('pattern') != '[0-9]{4}':
                    issue('checkout-address', 'Expected four-digit Philippine postal-code constraint.', url=url)
                action = urllib.parse.urlparse(http.absolute(url, form['action']) or '')
                action_pattern = r'/cart/\d+:[1-9]\d*' if quantity_mode else r'/cart/\d+:1'
                if form['method'] != 'get' or action.netloc != 'dearbody.ph' or not re.fullmatch(action_pattern, action.path):
                    issue('checkout-action', 'Native fallback must be a same-store single-variant GET permalink. It was not fetched.', url=url, action=form['action'])
                if form['hasQuantityControl'] and not quantity_mode:
                    issue('checkout-quantity', 'Removed quantity selector is present.', url=url)
                variants = form['variants']
                selected = next((x for x in variants if x['selected']), variants[0] if variants else {})
                expected_label = 'Check out' if selected.get('available') == 'true' else 'Sold out'
                if len(form['buttons']) != 1 or form['buttons'][0]['label'] != expected_label or form['buttons'][0]['disabled'] != (selected.get('available') != 'true'):
                    issue('checkout-button', 'Checkout button does not match native availability.', url=url, buttons=form['buttons'])
                options = [x for x in form['secondOptions'] if x['value']]
                if form['secondSelectors'] != 1 or len(options) != 6 or len({x['value'] for x in options}) != 6:
                    issue('second-scent', 'Expected six unique native fragrance options plus the empty choice.', url=url, optionCount=len(options))
                if not any(x['value'] == '' for x in form['secondOptions']) or any(not x['value'].isdigit() or x['available'] not in ('true', 'false') or x['disabled'] != (x['available'] != 'true') for x in options):
                    issue('second-scent', 'Optional blank choice or truthful variant availability is invalid.', url=url)
                if len(form['summary']) != 1 or form['summary'][0]['singleShippingCents'] != '8000':
                    issue('shipping-summary', 'Expected one summary using the confirmed 8000-cent base fee.', url=url)
            reviews = row['reviews']
            if reviews['sections'] != 1 or reviews['forms'] or reviews['submissionControls']:
                issue('reviews', 'Expected a display-only review section without submission controls.', url=url, reviews=reviews)
            if any('No reviews yet' not in value for value in reviews['emptyStates']):
                issue('reviews', 'Empty review state has unexpected copy.', url=url)
            if not reviews['reviewCards'] and not reviews['appBlocks'] and any('No reviews yet' in value for value in reviews['summaries']) and len(reviews['emptyStates']) != 1:
                issue('reviews', 'A product without review data must show one honest empty state.', url=url)
        if route == '/pages/scent-finder':
            if row['finderProfileCount'] != 6 or row['finderCardCount'] != 6 or row['finderJSONErrors']:
                issue('finder-data', 'Expected six native Finder profiles and card templates.', url=url)
            if not all(row['finder'][key] for key in ['autoAdvanceInstruction', 'hasChoices', 'hasBack', 'hasReset']) or row['finder']['obsoleteContinueControls']:
                issue('finder-auto-advance', 'Current auto-advance hooks or instructions are missing, or Continue remains.', url=url, finder=row['finder'])
    product_pages = [x for x in report['pages'] if '/products/' in urllib.parse.urlparse(x['url']).path]
    native_variants = {v['value']: v for page in product_pages for form in page['checkoutForms'] for v in form['variants']}
    for page in product_pages:
        for form in page['checkoutForms']:
            options = [x for x in form['secondOptions'] if x['value']]
            if {x['value'] for x in options} != set(native_variants) or any(x['available'] != native_variants.get(x['value'], {}).get('available') or x['priceCents'] != native_variants.get(x['value'], {}).get('priceCents') for x in options):
                issue('second-scent-source', 'Second options differ from variant IDs/prices/availability on the six native product pages.', url=page['url'])

    if page_extension:
        for row, extras in parsed:
            page_extension(row, extras, issue, report)

    required_scripts = script_names or REQUIRED_SCRIPTS
    script_urls = sorted({url for page in report['pages'] for url in page['scripts'] if filename(url) in required_scripts})
    report['scriptChecks'] = []
    for name in required_scripts:
        if not any(filename(url) == name for url in script_urls):
            issue('script-reference', 'Required current script is not referenced.', file=name)
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        report['scriptChecks'] = list(pool.map(check_script, script_urls))
    for script in report['scriptChecks']:
        if script.get('status') != 200 or not script['sourceMatchesExpected']:
            issue('script-source', 'Neither delivered JS nor its observed source map matches the current local source.', file=script['file'], url=script['url'], expected=script['expectedSHA256'], actual=script['sha256'])

    stylesheet_urls = sorted({url for page in report['pages'] for url in page['stylesheets']})
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
        stylesheets = list(pool.map(http.fetch, stylesheet_urls))
    report['stylesheets'] = [row for row, _ in stylesheets]
    for row, body in stylesheets:
        if row.get('status') != 200 or not body:
            issue('stylesheet', 'Expected non-empty stylesheet HTTP 200.', url=row['url'], status=row.get('status'))
    image_urls = {url for _, extras in parsed for url in extras['imageURLs']}
    referenced_urls = set(image_urls)
    for (page, extras) in parsed:
        for css in extras['inlineStyles']:
            referenced_urls.update(css_urls(page.get('finalUrl', page['url']), css))
    for row, body in stylesheets:
        referenced_urls.update(css_urls(row.get('finalUrl', row['url']), body.decode('utf-8', errors='replace')))
    referenced_urls = {url for url in referenced_urls if re.search(r'\.(?:jpe?g|png|webp|gif|svg|avif|woff2?|ttf|otf)(?:\?|$)', url, re.I)}
    byname = {}
    for url in referenced_urls:
        byname.setdefault(filename(url), []).append(url)
    expected_assets = asset_manifest()
    if len(expected_assets) != 174 or len({a['file'] for a in expected_assets}) != 174:
        issue('asset-manifest', 'Expected 100 artwork files, 72 thumbnails and two fonts.', count=len(expected_assets))
    for asset in expected_assets:
        asset['observedURLs'] = sorted(byname.get(asset['file'], []))
        if not asset['observedURLs']:
            issue('asset-reference', 'Locked asset is absent from observed HTML/CSS references.', file=asset['file'], group=asset['group'])
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        report['assetResponses'] = list(pool.map(http.inspect_asset, sorted(referenced_urls)))
    responses = {row['url']: row for row in report['assetResponses']}
    for row in report['assetResponses']:
        if row.get('status') != 200 or not row.get('bytes') or not row.get('signature') or row.get('decodeError'):
            issue('asset-response', 'Expected a non-empty decodable image/font response.', url=row['url'], status=row.get('status'), error=row.get('requestError') or row.get('decodeError'))
    for asset in expected_assets:
        checks = []
        for url in asset['observedURLs']:
            row = responses.get(url, {})
            comparison = row.get('packagedImageComparison') or {}
            exact = row.get('sha256') == asset['sha256']
            equivalent = asset['group'] != 'font' and comparison.get('dimensionsMatch') and comparison.get('perceptuallyEquivalent')
            checks.append({'url': url, 'exactSHA256': exact, 'contentEquivalent': bool(exact or equivalent), 'comparison': comparison})
        asset['checks'] = checks
        asset['contentMatches'] = bool(checks) and all(x['contentEquivalent'] for x in checks)
        if checks and not asset['contentMatches']:
            issue('asset-content', 'Font bytes or decoded image dimensions/content differ from the locked local asset.', file=asset['file'], checks=checks)
    report['expectedAssets'] = expected_assets
    if report_extension:
        report_extension(report, issue)
    report['limitations'] = ['No JavaScript execution or visual/browser interaction occurs. Exact live script/source-map comparison checks deployment; local runtime tests and a browser review establish behavior.', 'No address, payment, order or checkout permalink is submitted or requested. Checkout address acceptance, final shipping discounts and COD require separate authorized verification.', 'Public review markup proves display-only controls and empty state; it cannot independently establish the authenticity of future supplied customer reviews.', 'CDN image recompression is accepted only with matching dimensions and decoded RGB RMSE <= 8. Font and current JavaScript source hashes must match exactly.', 'Only the known routes listed in the report are requested. Navigation targets are recorded; arbitrary links and checkout form actions are never followed.']
    report['summary'] = {'status': 'PASS' if not report['findings'] else 'FINDINGS', 'themeId': expected_id, 'pages': len(report['pages']), 'productPages': len(product_pages), 'artworkFiles': sum(x['group'] not in ('thumbnail', 'font') for x in expected_assets), 'thumbnailFiles': sum(x['group'] == 'thumbnail' for x in expected_assets), 'fontFiles': sum(x['group'] == 'font' for x in expected_assets), 'assetContentMatches': sum(x['contentMatches'] for x in expected_assets), 'observedAssetRequests': len(report['assetResponses']), 'currentScriptSourcesMatched': sum(x['sourceMatchesExpected'] for x in report['scriptChecks']), 'findings': len(report['findings']), 'finishedAt': http.now()}
    if page_extension:
        report['summary']['collectionOrderPages'] = sum('collectionOrder' in page for page in report['pages'])
    if quantity_mode:
        report['summary']['quantityProductPages'] = sum('productQuantities' in page for page in report['pages'])
        report['summary']['howToOrderPages'] = sum('orderInstructions' in page for page in report['pages'])
    if cod_mode:
        report['summary']['codProductPages'] = sum('productCOD' in page for page in report['pages'])
        report['summary']['howToOrderPages'] = sum('orderInstructions' in page for page in report['pages'])
        report['summary']['easySellEmbedPages'] = sum(bool(page.get('codEmbed', {}).get('markers')) for page in report['pages'])
        report['summary']['vendorScriptResponses'] = len(report.get('vendorScriptChecks', []))
        report['limitations'][1] = 'No forms, carts or orders are submitted or mutated. Static app-embed/source verification does not prove popup behavior, delivery-field validation, final shipping or order creation. Those require separately authorized browser evidence.'
    out = Path(args.output)
    out.write_text(json.dumps(report, indent=2) + '\n')
    concise = [{key: item[key] for key in ('kind', 'detail', 'url', 'file', 'status') if key in item} for item in report['findings'][:20]]
    print(json.dumps({'output': str(out), **report['summary'], 'findings': concise, 'additionalFindingsInReport': max(0, len(report['findings']) - 20)}, indent=2))
    return 0 if not report['findings'] else 1


if __name__ == '__main__':
    raise SystemExit(main())
