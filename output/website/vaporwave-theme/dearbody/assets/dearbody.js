/* Native forms remain usable without JavaScript. Event delegation supports theme-editor section reloads. */
(() => {
  const variantsFor = (section) => {
    try { return JSON.parse(section.querySelector('[data-db-variants]')?.textContent || '[]'); }
    catch { return []; }
  };
  const selectMedia = (section, id) => {
    const target = document.getElementById(id);
    if (!target || !section.contains(target)) return;
    section.querySelectorAll('[data-db-media-panel]').forEach(panel => {
      panel.hidden = panel !== target;
      if (panel.hidden) panel.querySelectorAll('video').forEach(video => video.pause());
    });
    section.querySelectorAll('[data-db-media-target]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.dbMediaTarget === id));
    });
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
      menu.querySelector('summary').focus();
    });
  });
  document.addEventListener('change', event => {
    if (!event.target.matches('[data-db-variant]')) return;
    const section = event.target.closest('[data-db-product]');
    const variant = variantsFor(section).find(item => String(item.id) === event.target.value);
    const button = section.querySelector('[data-db-add]');
    if (!variant) { button.disabled = true; button.textContent = 'Unavailable'; return; }
    const purchasable = variant.available && variant.price > 0;
    button.disabled = !purchasable;
    button.textContent = variant.price <= 0 ? 'Available soon' : variant.available ? 'Add to bag' : 'Sold out';
    // Liquid-formatted prices preserve the active Shopify currency and merchant formatting.
    const priceMap = section.querySelector('[data-db-variant-prices]');
    let prices = {};
    try { prices = JSON.parse(priceMap?.textContent || '{}'); } catch { /* Keep server-rendered price on invalid data. */ }
    section.querySelector('[data-db-price]').textContent = variant.price <= 0 ? 'Available soon' : prices[String(variant.id)] || '';
    if (variant.featured_media?.id) {
      const panel = section.querySelector(`[data-db-media-id="${variant.featured_media.id}"]`);
      if (panel) selectMedia(section, panel.id);
    } else if (variant.featured_image?.id) {
      const panel = section.querySelector(`[data-db-media-id="${variant.featured_image.id}"]`);
      if (panel) selectMedia(section, panel.id);
    }
    const url = new URL(window.location.href);
    url.searchParams.set('variant', variant.id);
    window.history.replaceState({}, '', url);
  });
  document.addEventListener('submit', event => {
    const section = event.target.closest('[data-db-product]');
    if (!section || !event.target.querySelector('[data-db-add]')) return;
    const id = event.target.querySelector('[name="id"]')?.value;
    const variant = variantsFor(section).find(item => String(item.id) === id);
    if (!variant || !variant.available || variant.price <= 0) event.preventDefault();
  });
})();
