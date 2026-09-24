#!/usr/bin/env python3
"""Read-only public COD release audit, run only after release-owner readiness.

Default scope is PUBLIC MAIN. --preview --theme-id ID explicitly checks that
preview instead with fresh cookies from the supplied public preview URL only.
Only known pages, observed artwork/script/source-map URLs and
HEAD requests to observed EasySell scripts are read. No app API, cart mutation,
form submission, checkout URL, order creation or cancellation is requested.
"""
import concurrent.futures
import importlib.util
import json
import re
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('dearbody_cod_collection_audit', ROOT / 'qa/collection-orders-live-audit.py')
collections = importlib.util.module_from_spec(spec)
spec.loader.exec_module(collections)
base = collections.base
COD_SCRIPTS = ['sj-cod-order.js', 'sj-cod-popup.js']
SCRIPTS = base.REQUIRED_SCRIPTS + ['sj-collection-order.js'] + COD_SCRIPTS


def quantity_rule(option):
    def integer(value, fallback=None):
        return int(str(value)) if value is not None and str(value).isdigit() else fallback
    return {'min': integer(option.get('quantityMin'), 1), 'increment': integer(option.get('quantityIncrement'), 1), 'max': integer(option.get('quantityMax'))}


def inspect_cod(row, extras, finding, report):
    collections.inspect_collection(row, extras, finding, report, quantities=True, cod=True)
    tree = extras['elements']
    nodes = tree.nodes
    route = urllib.parse.urlparse(row['url']).path
    product = route.startswith('/products/')
    collection = route in collections.COLLECTIONS
    hooks = lambda name: [n for n in nodes if name in n['attrs']]
    def check(ok, detail, **more):
        if not ok:
            finding('cod-contract', detail, url=row['url'], **more)

    scripts = [n for n in nodes if n['tag'] == 'script' and n['attrs'].get('src')]
    by_script = {name: [n for n in scripts if base.filename(n['attrs']['src']) == name] for name in ['sj-commerce.js'] + COD_SCRIPTS}
    check(all(len(by_script[name]) == 1 and 'defer' in by_script[name][0]['attrs'] for name in by_script), 'Expected one deferred commerce, cart-preparation and popup adapter script.')
    positions = {id(n): i for i, n in enumerate(nodes)}
    if all(len(by_script[name]) == 1 for name in by_script):
        check(positions[id(by_script['sj-commerce.js'][0])] < positions[id(by_script['sj-cod-order.js'][0])] < positions[id(by_script['sj-cod-popup.js'][0])], 'Shared preparation and popup adapter must follow commerce in dependency order.')

    vendor_nodes = [n for n in scripts if 'easysell-cod-form' in n['attrs']['src'].lower() or n['attrs'].get('id') == 'es-script']
    vendor_urls = sorted({base.http.absolute(row['url'], n['attrs']['src']) for n in vendor_nodes})
    markers = [{'id': n['attrs'].get('id'), 'src': base.http.absolute(row['url'], n['attrs']['src'])} for n in vendor_nodes]
    row['codEmbed'] = {'markers': markers, 'observedScriptURLs': vendor_urls, 'verification': 'HTML script reference only; runtime popup and order creation require separate browser evidence.'}
    if product or collection:
        check(any(n['attrs'].get('id') == 'es-script' and base.filename(n['attrs']['src']) == 'easysell.js' for n in vendor_nodes), 'EasySell official es-script embed is absent from this order-capable page.')
        class_name = 'sj-product__order-instructions' if product else 'sj-collection__order-instructions'
        paragraphs = [n for n in nodes if base.has_class(n, class_name)]
        check(len(paragraphs) == 1, 'Expected one current How to order paragraph.')
        if len(paragraphs) == 1:
            copy = base.text(paragraphs[0])
            check(all(phrase in copy for phrase in ['How to order:', 'Add to order', 'quantities', 'Check out', 'delivery', 'cash-on-delivery']), 'Ordering instructions must describe the current COD flow.', text=copy)
            anchor = hooks('data-sj-product-order-open' if product else 'data-sj-order-grid')
            if len(anchor) == 1:
                check((positions[id(paragraphs[0])] > positions[id(anchor[0])]) == product, 'Ordering instructions are not in their expected position.')
            row['orderInstructions'] = {'text': copy, 'location': 'below initial PDP action' if product else 'above collection grid'}

    native_quantity = hooks('data-sj-cod-native-quantity')
    if not product:
        check(not native_quantity, 'Conventional PDP quantity hook leaked outside product pages.')
    if collection:
        catalog = row.get('collectionOrder', {}).get('catalog', [])
        native = {v['value']: v for p in report['pages'] for f in p['checkoutForms'] for v in f['variants']}
        for item in catalog:
            check(all(k in item for k in ['quantityMin', 'quantityMax', 'quantityIncrement']) and quantity_rule(item) == quantity_rule(native.get(str(item.get('id')), {})), 'Collection native quantity rules do not match the PDP variant.', variant=item.get('id'))
        check(len(hooks('data-sj-order-quantity')) == 1 and len(hooks('data-sj-order-step')) == 2, 'Selected-line template must retain quantity input and two step buttons.')
        return
    if not product:
        return

    row['productCOD'] = {'nativeQuantityHooks': len(native_quantity), 'mainQuantityInputs': len(hooks('data-sj-checkout-quantity')), 'secondQuantityInputs': len(hooks('data-sj-checkout-second-quantity')), 'nativeDeliveryFieldsets': len(hooks('data-sj-native-delivery'))}
    check(len(native_quantity) == 1, 'PDP must expose exactly one conventional native quantity for the app opener.')
    if len(native_quantity) == 1:
        attrs = native_quantity[0]['attrs']
        check(attrs.get('name') == 'quantity' and attrs.get('type') == 'hidden' and attrs.get('value') == '1' and 'disabled' in attrs, 'Native app quantity hook must be hidden/disabled initially; the verified adapter supplies the coalesced current quantity.')
        check(not any(p['tag'] == 'form' for p in native_quantity[0]['parents']), 'App quantity hook must not become an accidental native GET query field.')
    forms = hooks('data-sj-checkout-form')
    panels = hooks('data-sj-product-order-panel')
    starters = hooks('data-sj-product-order-open')
    check(len(forms) == len(panels) == len(starters) == 1, 'PDP selection form, order panel or initial action is missing/duplicated.')
    if len(forms) != 1 or len(row['checkoutForms']) != 1:
        return
    form = forms[0]
    metadata = row['checkoutForms'][0]
    variants = metadata['variants']
    selected = next((v for v in variants if v['selected']), variants[0] if variants else {})
    available = selected.get('available') == 'true'
    buttons = metadata['buttons']
    check(len(buttons) == 1 and buttons[0]['label'] == ('Check out' if available else 'Sold out') and buttons[0]['disabled'] == (not available), 'PDP final action must retain truthful native availability.')
    if len(starters) == 1:
        check(base.text(starters[0]) == ('Add to order' if available else 'Sold out') and starters[0]['attrs'].get('type') == 'button', 'Initial PDP action changed or submits prematurely.')
    for name in ['data-sj-checkout-quantity', 'data-sj-checkout-second-quantity']:
        inputs = hooks(name)
        check(len(inputs) == 1, 'Expected one ' + name + ' input.')
        if len(inputs) == 1:
            attrs = inputs[0]['attrs']
            check(attrs.get('type') == 'number' and not attrs.get('name') and 'disabled' in attrs and 'required' in attrs and any(p is form for p in inputs[0]['parents']), 'Editable quantities must remain unnamed progressive inputs in the selection form.')
    options = [o for o in metadata['secondOptions'] if o['value']]
    check(metadata['secondSelectors'] == 1 and len(options) == 6 and len({o['value'] for o in options}) == 6 and any(not o['value'] for o in metadata['secondOptions']), 'Optional second scent needs the six native variants and an empty choice.')
    check(all(o['available'] in ('true', 'false') and o['disabled'] == (o['available'] != 'true') for o in options), 'Second-scent options must expose actual availability.')
    for option in variants + options:
        rule = quantity_rule(option)
        check(all(option.get(k) is not None for k in ['quantityMin', 'quantityIncrement', 'quantityMax']) and rule['min'] >= 1 and rule['increment'] >= 1 and (rule['max'] is None or rule['max'] >= rule['min']), 'Native option quantity rules are missing or invalid.', variant=option.get('value'))
    check(len(metadata['summary']) == 1 and metadata['summary'][0]['singleShippingCents'] == '8000', 'PDP estimate must retain the confirmed PHP80 single-item base fee.')
    deliveries = hooks('data-sj-native-delivery')
    check(len(deliveries) == 1 and deliveries[0]['tag'] == 'fieldset', 'No-JavaScript native delivery fields must remain grouped for the COD script to disable.')
    if len(deliveries) == 1:
        contact_fields = [n for n in base.descendants(tree, form, tag='input') if n['attrs'].get('name', '').startswith('checkout[')]
        check(all(any(p is deliveries[0] for p in n['parents']) for n in contact_fields), 'Contact fields escaped the native-only fieldset.')
    row['productCOD']['scopeNote'] = 'Exact deployed scripts establish COD handoff code. HTTP cannot prove that JavaScript hides/disables fallback fields or that the app preserves quantities.'


def vendor_head(url):
    row = {'url': url, 'method': 'HEAD', 'checkedAt': base.http.now()}
    try:
        request = urllib.request.Request(url, method='HEAD', headers={'User-Agent': 'Mozilla/5.0 (compatible; DearBodyPublicQA/1.0)'})
        try:
            response = urllib.request.build_opener().open(request, timeout=30)
        except urllib.error.HTTPError as error:
            response = error
        with response:
            row.update(status=response.status, finalUrl=response.url, contentType=response.headers.get('Content-Type', ''), contentLength=response.headers.get('Content-Length'), bodyRead=False)
    except Exception as error:
        row['requestError'] = type(error).__name__ + ': ' + str(error)
    return row


def finalize(report, finding):
    settings = json.loads((ROOT / 'theme/config/settings_data.json').read_text())
    embeds = [b for b in settings.get('current', {}).get('blocks', {}).values() if '/easysell-cod-form/blocks/app-embed/' in b.get('type', '') and b.get('disabled') is False]
    report['localEmbedConfiguration'] = {'enabledMatchingBlocks': len(embeds), 'types': [b['type'] for b in embeds], 'scope': 'Local uploaded configuration; live evidence is recorded separately per page.'}
    if len(embeds) != 1:
        finding('cod-configuration', 'Expected exactly one enabled EasySell app embed in the current theme source.')
    urls = sorted({url for page in report['pages'] for url in page.get('codEmbed', {}).get('observedScriptURLs', []) if url and urllib.parse.urlparse(url).hostname == 'cdn.shopify.com' and urllib.parse.urlparse(url).path.endswith('.js')})
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        report['vendorScriptChecks'] = list(pool.map(vendor_head, urls))
    for row in report['vendorScriptChecks']:
        if row.get('status') != 200 or row.get('contentLength') == '0':
            finding('cod-vendor-script', 'Observed public app script did not answer HEAD with HTTP200/nonzero content.', url=row['url'], status=row.get('status'))
    if not urls:
        finding('cod-vendor-script', 'No observed public Shopify CDN EasySell script URL was available to verify.')
    report['vendorVerification'] = 'HEAD availability only; app script bodies, dynamic app endpoints and private APIs are not requested.'


if __name__ == '__main__':
    raise SystemExit(base.main(page_extension=inspect_cod, script_names=SCRIPTS,
        default_output=ROOT / 'qa/cod-live-audit.json', description=__doc__, cod_mode=True, report_extension=finalize))
