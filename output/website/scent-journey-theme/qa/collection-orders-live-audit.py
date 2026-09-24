#!/usr/bin/env python3
"""Read-only public audit of Collection Orders after upload/publication.

Extends the direct-checkout audit with Women/Men collection-only order panels,
mixed-collection native catalog checks and the current collection script hash.
No cookies, admin access, form submissions, checkout requests or orders.
"""
import importlib.util
import json
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('dearbody_direct_audit', ROOT / 'qa/direct-checkout-live-audit.py')
base = importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)
COLLECTIONS = {'/collections/womens-perfume': 'women', '/collections/mens-perfume': 'men'}
WOMEN = {'mojito-metallique', 'amber-oud-silk', 'mistened-narcissus'}
MEN = {'charme-envoutant', 'oud-mirage', 'rtulle-satin'}


def inspect_collection(row, extras, finding, report, *, quantities=False, cod=False):
    tree = extras['elements']
    route = urllib.parse.urlparse(row['url']).path
    nodes = tree.nodes
    hooked = lambda name: [node for node in nodes if name in node['attrs']]
    roots = hooked('data-sj-collection-order')
    forms = hooked('data-sj-order-form')
    panels = hooked('data-sj-order-panel')
    buttons = hooked('data-sj-collection-add')
    actual_scripts = [url for url in row['scripts'] if base.filename(url) == 'sj-collection-order.js']
    if route not in COLLECTIONS:
        if roots or forms or panels or buttons or actual_scripts:
            finding('collection-scope', 'Collection ordering leaked outside Women/Men; PDP, Finder, search and Shop all must retain their own behavior.', url=row['url'])
        return
    evidence = {'collection': COLLECTIONS[route], 'rootCount': len(roots), 'formCount': len(forms), 'panelCount': len(panels), 'cardButtonCount': len(buttons), 'catalog': [], 'fields': [], 'oppositeOptions': []}
    row['collectionOrder'] = evidence
    def check(ok, detail, **more):
        if not ok:
            finding('collection-order', detail, url=row['url'], **more)
    check(len(roots) == len(forms) == len(panels) == 1, 'Expected one isolated collection controller, order form and hidden panel.')
    check(len(actual_scripts) == 1 and any(base.filename(url) == 'sj-collection-order.css' for url in row['stylesheets']), 'Expected the collection-specific script and stylesheet.')
    if not (len(roots) == len(forms) == len(panels) == 1):
        return
    root, form, panel = roots[0], forms[0], panels[0]
    scoped = base.descendants(tree, root)
    form_nodes = base.descendants(tree, form)
    check(any(p is root for p in form['parents']) and any(p is panel for p in form['parents']), 'The order form must belong to its own collection panel/controller.')
    check(root['attrs'].get('data-collection') == COLLECTIONS[route], 'The collection controller has the wrong collection identity.')
    check('hidden' in panel['attrs'] and panel['attrs'].get('aria-labelledby'), 'Panel must start hidden and have an accessible heading.')
    panel_id = panel['attrs'].get('id')
    check(bool(panel_id) and len([n for n in nodes if n['attrs'].get('id') == panel_id]) == 1, 'Panel ID must be unique.')
    ids = [n['attrs']['id'] for n in nodes if n['attrs'].get('id')]
    check(len(ids) == len(set(ids)), 'Collection page contains duplicate IDs.')
    nested = [n for n in nodes if n['tag'] == 'form' and any(p['tag'] == 'form' for p in n['parents'])]
    filters = [n for n in scoped if n['tag'] == 'form' and base.has_class(n, 'sj-filters__form')]
    check(not nested and len(filters) == 1 and filters[0] is not form, 'Filter/sort form and checkout form must remain separate without nesting.')
    if filters:
        check(filters[0]['attrs'].get('method', '').lower() == 'get' and urllib.parse.urlparse(filters[0]['attrs'].get('action', '')).path == route, 'Filter/sort must keep its native collection GET action.')
    check(not any('data-sj-checkout-form' in n['attrs'] or 'data-sj-product-form' in n['attrs'] for n in scoped), 'Collection must not use the PDP or cart-add form hooks.')
    fallback_path = route if cod else '/cart'
    check(form['tag'] == 'form' and form['attrs'].get('method', '').lower() == 'get' and urllib.parse.urlparse(form['attrs'].get('action', '')).path == fallback_path, 'Initial collection form must use its safe same-store fallback; its action is never requested by this audit.')
    check(form['attrs'].get('data-single-shipping') == '8000', 'Shipping estimate must use the verified 8000-cent base fee.')
    catalogs = hooked('data-sj-order-catalog')
    try:
        catalog = json.loads(''.join(catalogs[0]['parts'])) if len(catalogs) == 1 else []
    except (ValueError, TypeError) as exc:
        catalog = []
        finding('collection-catalog', 'Native collection catalog JSON could not be parsed.', url=row['url'], error=str(exc))
    if not isinstance(catalog, list):
        catalog = []
    if any(not isinstance(item, dict) for item in catalog):
        check(False, 'Native catalog contains a non-object entry.')
        catalog = [item for item in catalog if isinstance(item, dict)]
    evidence['catalog'] = catalog
    expected_handles = WOMEN | MEN
    check(len(catalog) == 6 and {item.get('handle') for item in catalog} == expected_handles, 'Expected exactly the six priority fragrance handles in the mixed collection catalog.')
    catalog_by_id = {str(item.get('id')): item for item in catalog}
    native_variants = {v['value']: v for page in report['pages'] for checkout in page['checkoutForms'] for v in checkout['variants']}
    check(len(catalog_by_id) == 6 and set(catalog_by_id) == set(native_variants), 'Collection catalog IDs must match native variants on all six product pages.')
    for variant_id, item in catalog_by_id.items():
        native = native_variants.get(variant_id, {})
        expected_collection = 'women' if item.get('handle') in WOMEN else 'men'
        valid_price = isinstance(item.get('priceCents'), int) and not isinstance(item.get('priceCents'), bool) and item['priceCents'] >= 0
        check(variant_id.isdigit() and isinstance(item.get('available'), bool) and valid_price, 'Catalog contains an invalid variant ID, price or availability.', variant=variant_id)
        check(str(item.get('available')).lower() == native.get('available') and str(item.get('priceCents')) == native.get('priceCents'), 'Catalog availability/price must match current native product data.', variant=variant_id)
        check(item.get('collection') == expected_collection, 'Catalog collection identity does not match the approved scent handle.', variant=variant_id)
        check(urllib.parse.urlparse(item.get('url', '')).path == '/products/' + item.get('handle', ''), 'Catalog product link points to the wrong scent.', variant=variant_id)
    expected_card_ids = {key for key, item in catalog_by_id.items() if item.get('collection') == COLLECTIONS[route]}
    check(len(buttons) == 3 and {n['attrs'].get('value') for n in buttons} == expected_card_ids, 'Default collection must expose three Order controls for its own native fragrances.')
    cards = hooked('data-sj-order-card')
    check(len(cards) == 3, 'Expected three collection-specific card wrappers.')
    for button in buttons:
        attrs = button['attrs']
        check(button['tag'] == 'button' and attrs.get('type') == 'button' and 'hidden' in attrs and 'disabled' in attrs, 'Enhanced Order buttons must start hidden/disabled until successful initialization.')
        check(attrs.get('aria-controls') == panel_id and attrs.get('aria-expanded') == 'false', 'Order button must reference the initially hidden panel.')
        check(not any(p['tag'] in ('a', 'form') for p in button['parents']), 'Order button must not be nested inside a product link or another form.')
    fallbacks = hooked('data-sj-collection-order-fallback')
    check(len(fallbacks) == 3 and all(n['tag'] == 'a' and urllib.parse.urlparse(n['attrs'].get('href', '')).path.startswith('/products/') for n in fallbacks), 'Each card must retain its no-JavaScript product-page fallback link.')
    cross_selects = hooked('data-sj-order-cross-select')
    opposite = 'men' if COLLECTIONS[route] == 'women' else 'women'
    expected_cross_ids = {key for key, item in catalog_by_id.items() if item.get('collection') == opposite}
    check(len(cross_selects) == 1, 'Expected one opposite-collection selector.')
    if cross_selects:
        cross_options = [{'id': n['attrs'].get('value', ''), 'available': n['attrs'].get('data-available'), 'disabled': 'disabled' in n['attrs']} for n in base.descendants(tree, cross_selects[0], tag='option')]
        evidence['oppositeOptions'] = cross_options
        choices = [x for x in cross_options if x['id']]
        check(len(choices) == 3 and {x['id'] for x in choices} == expected_cross_ids and any(not x['id'] for x in cross_options), 'Opposite selector must contain its three native fragrances plus a blank prompt.')
        check(all(x['disabled'] == (x['available'] != 'true') and x['available'] == str(catalog_by_id.get(x['id'], {}).get('available')).lower() for x in choices), 'Opposite options must preserve native sold-out state.')
    fields = {n['attrs'].get('name'): n['attrs'] for n in form_nodes if n['tag'] == 'input' and (not quantities or n['attrs'].get('name'))}
    evidence['fields'] = [{'name': name, 'required': 'required' in attrs, 'type': attrs.get('type')} for name, attrs in fields.items()]
    if cod:
        check(not fields and form['attrs'].get('data-country') == 'PH', 'COD collection selection must contain no named contact/query fields; delivery is handled by the app.')
        check(any(base.has_class(n, 'sj-collection-order__cod-intro') for n in form_nodes), 'COD handoff explanation is missing.')
    else:
        expected_names = {f'checkout[shipping_address][{key}]' for key in base.REQUIRED_ADDRESS + ['address2', 'country']}
        check(set(fields) == expected_names, 'Only the eight documented address fields may be named query fields; quantities belong in the permalink path.')
        check(all('required' in fields.get(f'checkout[shipping_address][{key}]', {}) for key in base.REQUIRED_ADDRESS), 'Required address fields are incomplete.')
        check('required' not in fields.get('checkout[shipping_address][address2]', {}) and fields.get('checkout[shipping_address][country]', {}).get('value') == 'Philippines' and fields.get('checkout[shipping_address][zip]', {}).get('pattern') == '[0-9]{4}', 'Optional unit, Philippine country or postal-code rules changed.')
    submits = hooked('data-sj-order-submit')
    check(len(submits) == 1 and base.text(submits[0]) == 'Check out' and submits[0]['attrs'].get('type') == 'submit' and 'disabled' in submits[0]['attrs'], 'Empty initial selection must keep Check out disabled.')
    for hook in ['data-sj-order-lines', 'data-sj-order-line-template', 'data-sj-order-subtotal', 'data-sj-order-shipping', 'data-sj-order-total', 'data-sj-order-error', 'data-sj-order-status']:
        check(len(hooked(hook)) == 1, 'Expected one ' + hook + ' hook.')


if __name__ == '__main__':
    raise SystemExit(base.main(page_extension=inspect_collection,
        script_names=base.REQUIRED_SCRIPTS + ['sj-collection-order.js'],
        default_output=ROOT / 'qa/collection-orders-live-audit.json', description=__doc__))
