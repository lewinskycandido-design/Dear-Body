#!/usr/bin/env python3
"""Read-only public audit of Order Quantities after confirmed publication.

Checks PDP/collection quantity controls, native rule metadata, Add to order and
final Check out, all current scripts, routes and locked artwork. Never submits
forms, requests checkout permalinks, changes a cart or places an order.
"""
import importlib.util
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('dearbody_collection_audit', ROOT / 'qa/collection-orders-live-audit.py')
collections = importlib.util.module_from_spec(spec)
spec.loader.exec_module(collections)
base = collections.base


def integer(value, default=None):
    if value is None or value == '':
        return default
    value = str(value)
    return int(value) if value.isdigit() else None


def rule(option):
    return {'min': integer(option.get('quantityMin'), 1), 'increment': integer(option.get('quantityIncrement'), 1), 'max': integer(option.get('quantityMax'))}


def valid_rule(value):
    return value['min'] is not None and value['min'] >= 1 and value['increment'] is not None and value['increment'] >= 1 and (value['max'] is None or value['max'] >= value['min'])


def inspect_quantities(row, extras, finding, report):
    collections.inspect_collection(row, extras, finding, report, quantities=True)
    tree = extras['elements']
    nodes = tree.nodes
    route = urllib.parse.urlparse(row['url']).path
    hooked = lambda name: [node for node in nodes if name in node['attrs']]
    native_variants = {v['value']: v for page in report['pages'] for form in page['checkoutForms'] for v in form['variants']}
    def check(ok, detail, **more):
        if not ok:
            finding('order-quantities', detail, url=row['url'], **more)
    def instructions(class_name, anchor_attr, before):
        paragraphs = [node for node in nodes if base.has_class(node, class_name)]
        anchors = hooked(anchor_attr)
        check(len(paragraphs) == len(anchors) == 1, 'Expected one How to order paragraph and its layout anchor.')
        if len(paragraphs) != 1 or len(anchors) != 1:
            return
        copy = base.text(paragraphs[0])
        check(all(phrase in copy for phrase in ['How to order:', 'Add to order', 'quantities', 'delivery address', 'Check out']), 'How to order must explain selection, quantities, address and final checkout.', text=copy)
        positions = {id(node): position for position, node in enumerate(nodes)}
        placed_before = positions[id(paragraphs[0])] < positions[id(anchors[0])]
        check(placed_before == before, 'How to order paragraph is not in its intended location.')
        row['orderInstructions'] = {'text': copy, 'location': 'above collection grid' if before else 'below initial Add to order button'}

    if route in collections.COLLECTIONS:
        evidence = row.get('collectionOrder', {})
        evidence['quantityMode'] = 'One line per native variant with editable units; shipping runtime must count the sum of units.'
        catalog = evidence.get('catalog', [])
        for item in catalog:
            native = native_variants.get(str(item.get('id')), {})
            actual = rule(item)
            check(all(key in item for key in ['quantityMin', 'quantityMax', 'quantityIncrement']) and valid_rule(actual), 'Collection catalog must expose valid native min/increment/optional max.', variant=item.get('id'))
            check(actual == rule(native), 'Collection quantity rules must match the same native variant on its PDP.', variant=item.get('id'), collectionRule=actual, productRule=rule(native))
        inputs = hooked('data-sj-order-quantity')
        templates = hooked('data-sj-order-line-template')
        check(len(inputs) == len(templates) == 1, 'Expected one repeatable line template containing its quantity input.')
        if len(inputs) == len(templates) == 1:
            attrs = inputs[0]['attrs']
            check(any(p is templates[0] for p in inputs[0]['parents']), 'Quantity input must belong to the line template, not an unrelated order field.')
            check(inputs[0]['tag'] == 'input' and attrs.get('type') == 'text' and attrs.get('inputmode') == 'numeric' and attrs.get('pattern') == '[0-9]+' and not attrs.get('name') and 'required' in attrs, 'Line quantities must use an unnamed required whole-number input.')
            check(bool(attrs.get('aria-label')), 'Quantity input needs an accessible name before JavaScript customizes it.')
            steps = base.descendants(tree, templates[0], attr='data-sj-order-step')
            check(len(steps) == 2 and {n['attrs'].get('data-sj-order-step') for n in steps} == {'-1', '1'} and all(n['tag'] == 'button' and n['attrs'].get('type') == 'button' and n['attrs'].get('aria-label') for n in steps), 'Each selected-line template needs accessible minus/plus buttons that do not submit checkout.')
            check(len(base.descendants(tree, templates[0], attr='data-sj-order-quantity-rules')) == 1, 'Selected-line rule/error text hook is missing.')
        catalog_by_id = {str(item.get('id')): item for item in catalog}
        for button in hooked('data-sj-collection-add'):
            available = catalog_by_id.get(button['attrs'].get('value'), {}).get('available')
            check(base.text(button) == ('Add to order' if available else 'Sold out'), 'Initial collection action must say Add to order while keeping native unavailable states.')
        evidence['quantityInputTemplates'] = len(inputs)
        evidence['quantityStepButtons'] = len(hooked('data-sj-order-step'))
        instructions('sj-collection__order-instructions', 'data-sj-order-grid', True)
        return

    if not route.startswith('/products/'):
        check(not hooked('data-sj-checkout-quantity') and not hooked('data-sj-checkout-second-quantity') and not hooked('data-sj-product-order-open'), 'PDP quantity/order controls leaked into an unrelated page.')
        return
    evidence = {'mainQuantityControls': len(hooked('data-sj-checkout-quantity')), 'secondQuantityControls': len(hooked('data-sj-checkout-second-quantity')), 'initialOrderButtons': len(hooked('data-sj-product-order-open')), 'rules': []}
    row['productQuantities'] = evidence
    forms = hooked('data-sj-checkout-form')
    panels = hooked('data-sj-product-order-panel')
    starters = hooked('data-sj-product-order-open')
    main_inputs = hooked('data-sj-checkout-quantity')
    second_inputs = hooked('data-sj-checkout-second-quantity')
    check(len(forms) == len(panels) == len(starters) == len(main_inputs) == len(second_inputs) == 1, 'Expected one PDP form, order panel, initial action and both quantity controls.')
    if not all(len(group) == 1 for group in [forms, panels, starters, main_inputs, second_inputs]):
        return
    form, panel, starter = forms[0], panels[0], starters[0]
    metadata = row['checkoutForms'][0]
    variant = next((v for v in metadata['variants'] if v['selected']), metadata['variants'][0] if metadata['variants'] else {})
    available = variant.get('available') == 'true'
    expected_rule = rule(variant)
    evidence['selectedRule'] = expected_rule
    evidence['selectedVariant'] = variant.get('value')
    check(valid_rule(expected_rule), 'Selected native variant exposes invalid quantity rules.')
    check(starter['tag'] == 'button' and starter['attrs'].get('type') == 'button' and 'hidden' in starter['attrs'] and starter['attrs'].get('aria-expanded') == 'false' and starter['attrs'].get('aria-controls') == panel['attrs'].get('id'), 'Initial Add to order button must progressively control the correct panel without submitting.')
    check(base.text(starter) == ('Add to order' if available else 'Sold out') and ('disabled' in starter['attrs']) == (not available), 'Initial PDP action must match native stock and the requested Add to order label.')
    check(any(p is form for p in panel['parents']) and len(base.descendants(tree, panel, attr='data-sj-product-order-heading')) == 1, 'PDP order panel must stay in its existing form and have the focus target.')
    for input_node, kind in [(main_inputs[0], 'main'), (second_inputs[0], 'second')]:
        attrs = input_node['attrs']
        check(input_node['tag'] == 'input' and attrs.get('type') == 'number' and attrs.get('inputmode') == 'numeric' and 'required' in attrs and 'disabled' in attrs and not attrs.get('name'), 'PDP quantities must be unnamed required numeric controls disabled until JavaScript.', quantity=kind)
        check(any(n['tag'] == 'label' and n['attrs'].get('for') == attrs.get('id') for n in nodes), 'PDP quantity control has no associated label.', quantity=kind)
        check(any(n['attrs'].get('id') == attrs.get('aria-describedby') for n in nodes), 'PDP quantity rule description target is missing.', quantity=kind)
        check(any(p is panel for p in input_node['parents']), 'Quantity input must stay inside the same order panel.', quantity=kind)
        steps = [n for n in base.descendants(tree, form, attr='data-sj-quantity-change') if n['attrs'].get('data-sj-quantity-for') == kind]
        check(len(steps) == 2 and {n['attrs'].get('data-sj-quantity-change') for n in steps} == {'-1', '1'} and all(n['tag'] == 'button' and n['attrs'].get('type') == 'button' and n['attrs'].get('aria-label') for n in steps), 'PDP quantity must have named minus/plus controls that do not submit checkout.', quantity=kind)
    attrs = main_inputs[0]['attrs']
    actual_rule = {'min': integer(attrs.get('min')), 'increment': integer(attrs.get('step')), 'max': integer(attrs.get('max'))}
    check(actual_rule == expected_rule, 'Initial main quantity input must reflect the selected native rule, without inventing a cap.', inputRule=actual_rule, nativeRule=expected_rule)
    initial = integer(attrs.get('value'))
    valid_initial = valid_rule(expected_rule) and initial is not None and initial >= expected_rule['min'] and (initial - expected_rule['min']) % expected_rule['increment'] == 0 and (expected_rule['max'] is None or initial <= expected_rule['max'])
    check(valid_initial, 'Initial quantity must satisfy its native rule.')
    action = urllib.parse.urlparse(metadata.get('action') or '').path
    check(action.endswith(f"/cart/{variant.get('value')}:{initial}"), 'No-JavaScript permalink must encode the selected variant and its actual initial quantity; it is not requested.')
    for option in metadata['variants'] + [x for x in metadata['secondOptions'] if x['value']]:
        current_rule = rule(option)
        native = native_variants.get(option['value'], {})
        check(all(option.get(key) is not None for key in ['quantityMin', 'quantityIncrement', 'quantityMax']) and valid_rule(current_rule), 'Variant options must expose explicit valid native quantity metadata.', variant=option['value'])
        check(current_rule == rule(native), 'Optional-second quantity rules must match native PDP rules.', variant=option['value'])
        evidence['rules'].append({'variant': option['value'], **current_rule})
    evidence['shippingVerification'] = 'HTTP verifies hooks and exact deployed source. Runtime/native-checkout tests must verify total unit count, including multiple bottles of one scent.'
    instructions('sj-product__order-instructions', 'data-sj-product-order-open', False)


if __name__ == '__main__':
    raise SystemExit(base.main(page_extension=inspect_quantities,
        script_names=base.REQUIRED_SCRIPTS + ['sj-collection-order.js'],
        default_output=ROOT / 'qa/order-quantities-live-audit.json', description=__doc__, quantity_mode=True))
