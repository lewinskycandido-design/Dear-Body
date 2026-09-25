// In-memory preview only: never contacts Shopify or creates an order.
export async function readCartBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 1048576) throw new Error('Preview request is too large.');
    chunks.push(chunk);
  }
  const body = Buffer.concat(chunks);
  if ((req.headers['content-type'] || '').includes('application/json')) return JSON.parse(body.toString());
  const request = new Request('http://localhost/cart', { method: 'POST', headers: { 'Content-Type': req.headers['content-type'] || 'application/x-www-form-urlencoded' }, body });
  return Object.fromEntries(await request.formData());
}

export function updatePreviewCart(cart, products, path, data) {
  if (path === '/cart/add.js') {
    const product = products.find(p => p.variants.some(v => String(v.id) === String(data.id)));
    const variant = product?.variants.find(v => String(v.id) === String(data.id));
    const quantity = Number(data.quantity || 1);
    if (!variant?.available || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 99) throw new Error('Choose an available perfume and a quantity from 1 to 99.');
    let item = cart.items.find(row => String(row.variant_id) === String(variant.id));
    if (item) item.quantity += quantity;
    else cart.items.push({ id: variant.id, variant_id: variant.id, key: `${variant.id}:preview`, product, variant, product_id: product.id, product_title: product.title, title: product.title, image: product.featured_image, url: product.url, quantity, original_price: variant.price, final_price: variant.price, price: variant.price, properties: [], line_level_discount_allocations: [], url_to_remove: `/cart/change?id=${variant.id}:preview&quantity=0` });
  } else if (path === '/cart/change.js') {
    const item = cart.items.find(row => row.key === String(data.id));
    const quantity = Number(data.quantity);
    if (!item || !Number.isSafeInteger(quantity) || quantity < 0 || quantity > 99) throw new Error('Choose a valid cart quantity.');
    item.quantity = quantity;
    cart.items = cart.items.filter(row => row.quantity > 0);
  } else if (path === '/cart/update.js') {
    if (typeof data.note === 'string') cart.note = data.note;
    // Live promotional rules are owned by Shopify, not this offline demo.
    if (typeof data.discount === 'string') cart.discount_codes = data.discount.split(',').filter(Boolean).map(code => ({ code, applicable: false }));
  }
  for (const item of cart.items) item.original_line_price = item.final_line_price = item.line_price = item.final_price * item.quantity;
  cart.item_count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  cart.original_total_price = cart.items_subtotal_price = cart.total_price = cart.items.reduce((sum, item) => sum + item.final_line_price, 0);
  return cart;
}
