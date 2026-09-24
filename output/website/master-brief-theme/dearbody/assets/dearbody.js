/* Native product/cart forms remain usable without JavaScript. */
(() => {
  const readJSON = (section, selector, fallback) => {
    try { return JSON.parse(section.querySelector(selector)?.textContent || JSON.stringify(fallback)); }
    catch { return fallback; }
  };
  const variantsFor = (section) => readJSON(section, '[data-db-variants]', []);
  const quantityFor = (section, variant) => {
    const rule = readJSON(section, '[data-db-variant-rules]', {})[String(variant?.id)] || {};
    const step = Math.max(1, Number(rule.increment) || 1);
    const minimum = Math.max(1, Number(rule.min) || 1);
    const inCart = Math.max(0, Number(rule.in_cart) || 0);
    const min = inCart < minimum ? minimum - inCart : step - inCart % step;
    const max = rule.max == null ? null : Number(rule.max) - inCart;
    return {min, max, step, minimum, inCart, limitReached: max !== null && max < min};
  };
  const selectMedia = (section, id) => {
    if (!section) return;
    const target = document.getElementById(id);
    if (!target || !section.contains(target)) return;
    section.querySelectorAll('[data-db-media-panel]').forEach(panel => {
      panel.hidden = panel !== target;
      if (panel.hidden) {
        panel.querySelectorAll('video').forEach(video => video.pause());
        panel.querySelectorAll('iframe').forEach(frame => {
          // Shopify media_tag uses the standard YouTube/Vimeo player integrations.
          if (/youtube(?:-nocookie)?\.com/.test(frame.src)) frame.contentWindow?.postMessage(JSON.stringify({event: 'command', func: 'pauseVideo', args: []}), new URL(frame.src).origin);
          if (/player\.vimeo\.com/.test(frame.src)) frame.contentWindow?.postMessage(JSON.stringify({method: 'pause'}), new URL(frame.src).origin);
        });
      }
    });
    section.querySelectorAll('[data-db-media-target]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.dbMediaTarget === id)));
  };
  document.addEventListener('click', event => {
    const thumb = event.target.closest('[data-db-media-target]');
    if (thumb) selectMedia(thumb.closest('[data-db-product]'), thumb.dataset.dbMediaTarget);
    document.querySelectorAll('.db-mobile-menu[open]').forEach(menu => {
      if (!menu.contains(event.target) || event.target.closest('nav a')) menu.open = false;
    });
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    document.querySelectorAll('.db-mobile-menu[open]').forEach(menu => {
      menu.open = false;
      menu.querySelector('summary')?.focus();
    });
  });
  document.addEventListener('change', event => {
    if (!event.target.matches('[data-db-variant]')) return;
    const section = event.target.closest('[data-db-product]');
    if (!section) return;
    const variant = variantsFor(section).find(item => String(item.id) === event.target.value);
    const button = section.querySelector('[data-db-add]');
    const payment = section.querySelector('[data-db-payment]');
    const quantityRule = quantityFor(section, variant);
    const quantity = section.querySelector('[data-db-quantity]');
    if (quantity) {
      quantity.min = quantityRule.min;
      quantity.step = quantityRule.step;
      quantity.value = quantityRule.min;
      if (quantityRule.max === null) quantity.removeAttribute('max');
      else quantity.max = quantityRule.max;
    }
    const quantityText = section.querySelector('[data-db-quantity-rules]');
    if (quantityText) {
      quantityText.hidden = quantityRule.minimum === 1 && quantityRule.step === 1 && quantityRule.max === null;
      quantityText.textContent = `Minimum ${quantityRule.minimum}. Increments of ${quantityRule.step}.${quantityRule.max === null ? '' : ` Maximum ${quantityRule.max + quantityRule.inCart} per order.`}${quantityRule.inCart > 0 ? ` ${quantityRule.inCart} already in your bag.` : ''}`;
    }
    const purchasable = Boolean(variant?.available && variant.price > 0 && !quantityRule.limitReached);
    if (payment) payment.hidden = !purchasable;
    if (button) {
      button.disabled = !purchasable;
      button.textContent = !variant ? 'Unavailable' : variant.price <= 0 ? 'Available soon' : !variant.available ? 'Sold out' : quantityRule.limitReached ? 'Maximum quantity in bag' : 'Add to bag';
    }
    if (!variant) return;
    // Liquid formats each variant in the active currency; never calculate display prices in JS.
    const prices = readJSON(section, '[data-db-variant-prices]', {});
    const price = section.querySelector('[data-db-price]');
    if (price && variant.price <= 0) price.textContent = 'Available soon';
    else if (price && prices[String(variant.id)]) price.textContent = prices[String(variant.id)];
    const mediaId = variant.featured_media?.id || variant.featured_image?.id;
    if (mediaId) {
      const panel = section.querySelector(`[data-db-media-id="${mediaId}"]`);
      if (panel) selectMedia(section, panel.id);
    }
    const url = new URL(window.location.href);
    url.searchParams.set('variant', variant.id);
    window.history.replaceState({}, '', url);
  });
  const validateCartQuantity = input => {
    const quantity = Number(input.value);
    const minimum = Number(input.dataset.min) || 1;
    const step = Number(input.step) || 1;
    const maximum = input.hasAttribute('max') ? Number(input.max) : null;
    const invalid = !Number.isInteger(quantity) || quantity < 0 || (quantity !== 0 && (quantity < minimum || quantity % step !== 0 || (maximum !== null && quantity > maximum)));
    input.setCustomValidity(invalid ? `Enter 0 to remove, or at least ${minimum} in increments of ${step}${maximum === null ? '' : `, up to ${maximum}`}.` : '');
    return !invalid;
  };
  document.addEventListener('input', event => {
    if (event.target.matches('[data-db-cart-quantity]')) validateCartQuantity(event.target);
  });
  document.addEventListener('submit', event => {
    if (event.target.matches('.db-cart-form')) {
      const invalidInput = [...event.target.querySelectorAll('[data-db-cart-quantity]')].find(input => !validateCartQuantity(input));
      if (invalidInput) { event.preventDefault(); invalidInput.reportValidity(); }
      return;
    }
    const section = event.target.closest('[data-db-product]');
    if (!section || !event.target.querySelector('[data-db-add]')) return;
    const id = event.target.querySelector('[name="id"]')?.value;
    const variant = variantsFor(section).find(item => String(item.id) === id);
    const rule = quantityFor(section, variant);
    const quantityInput = event.target.querySelector('[name="quantity"]');
    const quantity = Number(quantityInput?.value || 1);
    const invalidQuantity = !Number.isInteger(quantity) || quantity < rule.min || (quantity - rule.min) % rule.step !== 0 || (rule.max !== null && quantity > rule.max);
    if (!variant || !variant.available || variant.price <= 0 || rule.limitReached || invalidQuantity) {
      event.preventDefault();
      quantityInput?.reportValidity();
    }
  });
})();
