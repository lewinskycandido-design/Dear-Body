(() => {
  const initialize = () => document.querySelectorAll('[data-sj-order-cross-select], [data-sj-checkout-second], [data-sj-variant]').forEach(select => {
    if (select.dataset.imagePickerReady) return;
    select.dataset.imagePickerReady = 'true';
    const picker = document.createElement('details');
    picker.className = 'sj-scent-picker';
    const summary = document.createElement('summary');
    const label = document.querySelector(`label[for="${select.id}"]`);
    summary.id = `${select.id}-picker`;
    if (label) { label.id ||= `${select.id}-label`; summary.setAttribute('aria-describedby', label.id); }
    const options = document.createElement('div');
    options.className = 'sj-scent-picker__options';
    options.setAttribute('role', 'group');
    options.setAttribute('aria-label', label?.textContent.trim() || 'Choose a fragrance');
    let catalog = [];
    try { catalog = JSON.parse(select.closest('[data-sj-collection-order]')?.querySelector('[data-sj-order-catalog]')?.textContent || '[]'); } catch {}
    const buttons = [...select.options].map(option => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'sj-scent-picker__option';
      const source = option.dataset.image || catalog.find(item => String(item.id) === option.value)?.image || (select.matches('[data-sj-variant]') ? select.closest('sj-product')?.querySelector('.sj-product__photo-frame img')?.src : '');
      if (source) {
        const image = document.createElement('img');
        image.src = source; image.alt = ''; image.width = 64; image.height = 64; image.loading = 'lazy';
        button.append(image);
      }
      const text = document.createElement('span'); text.className = 'sj-scent-picker__copy'; text.textContent = option.textContent;
      button.append(text); options.append(button);
      button.addEventListener('click', () => {
        if (select.disabled || option.disabled) return;
        select.value = option.value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        picker.open = false; sync(); summary.focus({ preventScroll: true });
      });
      return { button, option };
    });
    const sync = () => {
      summary.textContent = `${select.selectedOptions[0]?.textContent || 'Choose a fragrance'} ▾`;
      summary.setAttribute('aria-disabled', String(select.disabled));
      buttons.forEach(({ button, option }) => { button.disabled = select.disabled || option.disabled; button.setAttribute('aria-pressed', String(option.selected)); });
      if (select.disabled) picker.open = false;
    };
    summary.addEventListener('click', event => { if (select.disabled) event.preventDefault(); });
    picker.addEventListener('keydown', event => { if (event.key === 'Escape') { picker.open = false; summary.focus(); } });
    select.addEventListener('change', sync);
    new MutationObserver(sync).observe(select, { attributes: true, subtree: true, attributeFilter: ['disabled'] });
    picker.append(summary, options); select.after(picker); select.hidden = true;
    label?.addEventListener('click', event => { event.preventDefault(); summary.focus(); });
    sync();
  });
  initialize();
  document.addEventListener('shopify:section:load', initialize);
})();
