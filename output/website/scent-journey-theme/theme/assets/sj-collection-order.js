(() => {
  'use strict';
  if (window.SJCollectionOrder) return;
  const controllers = new WeakMap();
  const cents = value => /^\d+$/.test(String(value)) && Number.isSafeInteger(Number(value)) ? Number(value) : null;

  class CollectionOrder {
    constructor(root) {
      this.root = root;
      this.form = root.querySelector('[data-sj-order-form]');
      this.panel = root.querySelector('[data-sj-order-panel]');
      this.grid = root.querySelector('[data-sj-order-grid]');
      this.lines = root.querySelector('[data-sj-order-lines]');
      this.template = root.querySelector('[data-sj-order-line-template]');
      this.submit = root.querySelector('[data-sj-order-submit]');
      this.cross = root.querySelector('[data-sj-order-cross-select]');
      this.status = root.querySelector('[data-sj-order-status]');
      this.error = root.querySelector('[data-sj-order-error]');
      if (!this.form || !this.panel || !this.grid || !this.lines || !this.template || !this.submit) throw new Error('Order form is incomplete.');
      const catalog = JSON.parse(root.querySelector('[data-sj-order-catalog]')?.textContent || '[]');
      if (!Array.isArray(catalog)) throw new Error('Order catalog is unavailable.');
      this.catalog = new Map(catalog.filter(item => item && /^\d+$/.test(String(item.id)) && typeof item.handle === 'string' && item.handle && typeof item.available === 'boolean').map(item => [String(item.id), { ...item, id: String(item.id) }]));
      if (!this.catalog.size) throw new Error('Order catalog is unavailable.');
      this.selected = new Map();
      this.checkoutGeneration = 0;
      this.buttons = [...root.querySelectorAll('[data-sj-collection-add]')];
      this.initialLabels = new WeakMap();
      this.buttons.forEach(button => this.initialLabels.set(button, (button.querySelector('[data-sj-order-add-label]') || button).textContent));
      this.abort = new AbortController();
      const listen = (node, type, handler) => node?.addEventListener(type, handler, { signal: this.abort.signal });
      listen(root, 'click', event => {
        const add = event.target.closest('[data-sj-collection-add]');
        if (add && root.contains(add)) this.add(add.value, add);
        const remove = event.target.closest('[data-sj-order-remove]');
        if (remove && root.contains(remove)) this.remove(remove.dataset.sjOrderRemove, remove);
        const step = event.target.closest('[data-sj-order-step]');
        if (step && root.contains(step)) this.stepQuantity(step);
      });
      listen(this.cross, 'change', () => {
        const id = this.cross.value;
        this.cross.value = '';
        if (id) this.add(id);
      });
      listen(this.lines, 'input', event => { if (event.target.matches('[data-sj-order-quantity]')) this.changeQuantity(event.target); });
      listen(this.lines, 'change', event => { if (event.target.matches('[data-sj-order-quantity]')) this.changeQuantity(event.target, true); });
      listen(this.form, 'submit', event => { event.preventDefault(); this.checkout(); });
      listen(window, 'pageshow', () => this.restore());
      listen(window, 'resize', () => { if (this.anchor?.isConnected && !this.panel.hidden) this.placePanel(this.anchor); });
      this.buttons.forEach(button => {
        if (!this.catalog.has(button.value)) return;
        button.hidden = false;
        const fallback = button.closest('[data-sj-order-card]')?.querySelector('[data-sj-collection-order-fallback]');
        if (fallback) fallback.hidden = true;
      });
      if (this.cross) this.cross.disabled = false;
      this.render();
    }

    announce(message) {
      if (!this.status) return;
      this.status.textContent = '';
      clearTimeout(this.announcement);
      this.announcement = setTimeout(() => { if (this.root.isConnected) this.status.textContent = message; }, 20);
    }

    fail(message) {
      if (this.error) this.error.textContent = message;
      this.announce(message);
    }

    add(id, trigger) {
      if (this.pending) return;
      const item = this.catalog.get(String(id));
      if (!item || !item.available) { this.fail('This scent is currently unavailable. Please choose an available scent.'); return; }
      if (this.selected.has(item.id)) {
        this.panel.hidden = false;
        this.lines.querySelector(`[data-sj-order-quantity="${item.id}"]`)?.focus();
        this.announce(`${item.title} is already in your order. You can change its quantity below.`);
        return;
      }
      const first = this.selected.size === 0;
      const quantity = this.rules(item).min;
      this.selected.set(item.id, { ...item, quantity, quantityRaw: String(quantity) });
      if (this.error) this.error.textContent = '';
      if (trigger) { this.anchor = trigger.closest('[data-sj-order-card]'); this.placePanel(this.anchor); }
      this.panel.hidden = false;
      this.render();
      this.announce(`${item.title} added. ${this.selected.size} ${this.selected.size === 1 ? 'scent' : 'scents'} in your order.`);
      if (first) this.root.querySelector('[data-sj-order-heading]')?.focus({ preventScroll: false });
    }

    placePanel(card) {
      if (!card || card.parentElement !== this.grid) return;
      const cards = [...this.grid.querySelectorAll(':scope > [data-sj-order-card]')];
      // Match sj-commerce.css: the card grid changes from three to two columns at 999px.
      const mobile = window.matchMedia ? window.matchMedia('(max-width: 999px)').matches : window.innerWidth <= 999;
      const top = card.getBoundingClientRect().top;
      const row = mobile ? cards : cards.filter(node => Math.abs(node.getBoundingClientRect().top - top) < 3);
      const last = row[row.length - 1] || card;
      if (last.nextElementSibling === this.panel) return;
      // Move the existing form, retaining entered details, quantities, focus and text selection.
      const active = this.panel.contains(document.activeElement) ? document.activeElement : null;
      const selection = active && typeof active.selectionStart === 'number' ? [active.selectionStart, active.selectionEnd] : null;
      last.after(this.panel);
      if (active?.isConnected) {
        active.focus({ preventScroll: true });
        if (selection) active.setSelectionRange(...selection);
      }
    }

    remove(id, trigger) {
      if (this.pending) return;
      const item = this.selected.get(id);
      if (!item) return;
      const moveFocus = trigger === document.activeElement;
      this.selected.delete(id);
      if (this.error) this.error.textContent = '';
      this.render();
      this.announce(`${item.title} removed. ${this.selected.size ? `${this.selected.size} ${this.selected.size === 1 ? 'scent remains' : 'scents remain'} in your order.` : 'Choose a scent to start your order.'}`);
      if (moveFocus) (this.lines.querySelector('[data-sj-order-remove]') || this.cross || this.root.querySelector('[data-sj-order-heading]'))?.focus({ preventScroll: true });
    }

    rules(item) {
      return { min: Math.max(1, cents(item.quantityMin) || 1), max: cents(item.quantityMax), increment: Math.max(1, cents(item.quantityIncrement) || 1) };
    }

    parseQuantity(item, raw) {
      const value = cents(raw), { min, max, increment } = this.rules(item);
      let error = '';
      if (value === null || value < 1) error = 'Enter a whole-number quantity of at least 1.';
      else if (value < min) error = `The minimum quantity is ${min}.`;
      else if (max !== null && value > max) error = `The maximum quantity is ${max}.`;
      else if ((value - min) % increment !== 0) error = `Choose quantities in steps of ${increment}, starting at ${min}.`;
      return { value: error ? null : value, error };
    }

    changeQuantity(input, announce = false) {
      if (this.pending) return;
      const item = this.selected.get(input.dataset.sjOrderQuantity);
      if (!item) return;
      item.quantityRaw = input.value;
      const result = this.parseQuantity(item, input.value);
      item.quantity = result.value;
      input.setCustomValidity(result.error);
      input.setAttribute('aria-invalid', String(!!result.error));
      if (this.error) this.error.textContent = announce && result.error ? `${item.title}: ${result.error}` : '';
      this.render(false);
      if (announce && !result.error) this.announce(`${item.title}: quantity ${item.quantity}. Order total ${this.root.querySelector('[data-sj-order-total]')?.textContent || ''}.`);
    }

    stepQuantity(button) {
      if (this.pending || button.getAttribute('aria-disabled') === 'true') return;
      const item = this.selected.get(button.dataset.sjOrderVariant);
      const input = this.lines.querySelector(`[data-sj-order-quantity="${button.dataset.sjOrderVariant}"]`);
      if (!item || !input) return;
      const result = this.parseQuantity(item, input.value);
      if (result.error) { this.fail(`${item.title}: ${result.error}`); input.reportValidity(); return; }
      const next = result.value + Number(button.dataset.sjOrderStep) * this.rules(item).increment;
      if (this.parseQuantity(item, String(next)).error) return;
      input.value = String(next);
      this.changeQuantity(input, true);
    }

    syncQuantities() {
      this.selected.forEach(item => {
        const input = this.lines.querySelector(`[data-sj-order-quantity="${item.id}"]`);
        if (input) item.quantityRaw = input.value;
        const result = this.parseQuantity(item, item.quantityRaw);
        item.quantity = result.value;
        input?.setCustomValidity(result.error);
        if (result.error) throw new Error(`${item.title}: ${result.error}`);
      });
    }

    money(value) {
      try { return new Intl.NumberFormat(document.documentElement.lang || 'en-PH', { style: 'currency', currency: this.form.dataset.currency || 'PHP' }).format(value / 100); }
      catch { return 'Confirmed at checkout'; }
    }

    setText(hook, value) { const node = this.root.querySelector(`[data-sj-order-${hook}]`); if (node) node.textContent = value; }

    render(rebuildLines = true) {
      const items = [...this.selected.values()];
      if (rebuildLines) this.lines.replaceChildren();
      if (rebuildLines) items.forEach(item => {
        const line = this.template.content.cloneNode(true);
        const title = line.querySelector('[data-sj-order-title]');
        if (title) title.textContent = item.title;
        const link = line.querySelector('[data-sj-order-link]');
        if (link) {
          try { const url = new URL(item.url, window.location.origin); if (url.origin === window.location.origin) link.href = url.pathname + url.search; else link.removeAttribute('href'); }
          catch { link.removeAttribute('href'); }
        }
        const image = line.querySelector('[data-sj-order-image]');
        if (image) { image.hidden = !item.image; if (item.image) image.src = item.image; image.alt = item.title; }
        const input = line.querySelector('[data-sj-order-quantity]');
        const rules = this.rules(item);
        if (input) {
          input.dataset.sjOrderQuantity = item.id;
          input.id = `${this.panel.id || 'CollectionOrder'}-quantity-${item.id}`;
          input.value = item.quantityRaw;
          input.min = rules.min; input.step = rules.increment;
          if (rules.max !== null) input.max = rules.max; else input.removeAttribute('max');
          input.setAttribute('aria-label', `Quantity for ${item.title}`);
          input.setCustomValidity(this.parseQuantity(item, input.value).error);
          input.setAttribute('aria-invalid', String(item.quantity === null));
        }
        line.querySelectorAll('[data-sj-order-step]').forEach(button => {
          button.dataset.sjOrderVariant = item.id;
          button.setAttribute('aria-label', `${Number(button.dataset.sjOrderStep) < 0 ? 'Decrease' : 'Increase'} quantity for ${item.title}`);
        });
        const ruleText = line.querySelector('[data-sj-order-quantity-rules]');
        if (ruleText) {
          ruleText.textContent = [rules.min > 1 ? `Minimum ${rules.min}` : '', rules.increment > 1 ? `Steps of ${rules.increment}` : '', rules.max !== null ? `Maximum ${rules.max}` : ''].filter(Boolean).join(' · ');
          ruleText.hidden = !ruleText.textContent;
          if (input) { ruleText.id = `${input.id}-rules`; input.setAttribute('aria-describedby', ruleText.id); }
        }
        const remove = line.querySelector('[data-sj-order-remove]');
        if (remove) { remove.dataset.sjOrderRemove = item.id; remove.setAttribute('aria-label', `Remove ${item.title} from your order`); }
        this.lines.append(line);
      });
      items.forEach(item => {
        const input = this.lines.querySelector(`[data-sj-order-quantity="${item.id}"]`);
        const line = input?.closest('li');
        const price = line?.querySelector('[data-sj-order-price]');
        if (price) price.textContent = item.quantity === null ? 'Check quantity' : cents(item.priceCents) === null ? 'Confirmed at checkout' : this.money(cents(item.priceCents) * item.quantity);
        line?.querySelectorAll('[data-sj-order-step]').forEach(button => {
          const next = (item.quantity || 0) + Number(button.dataset.sjOrderStep) * this.rules(item).increment;
          button.disabled = !!this.pending;
          button.setAttribute('aria-disabled', String(!!this.pending || item.quantity === null || !!this.parseQuantity(item, String(next)).error));
        });
      });
      const ids = new Set(items.map(item => item.id));
      this.buttons.forEach(button => {
        const item = this.catalog.get(button.value), selected = !!item && ids.has(item.id);
        button.disabled = this.pending || !item?.available;
        button.setAttribute('aria-pressed', String(selected));
        if (item?.available) button.setAttribute('aria-expanded', String(!this.panel.hidden));
        else button.removeAttribute('aria-expanded');
        button.classList.toggle('is-selected', selected);
        const label = button.querySelector('[data-sj-order-add-label]') || button;
        label.textContent = selected ? 'Added to order' : this.initialLabels.get(button);
      });
      if (this.cross) {
        this.cross.disabled = !!this.pending;
        [...this.cross.options].forEach(option => {
          if (!option.value) return;
          const item = this.catalog.get(option.value);
          option.disabled = !item?.available || ids.has(item.id);
        });
      }
      const validQuantities = items.every(item => !this.parseQuantity(item, item.quantityRaw).error);
      const bottleCount = validQuantities ? items.reduce((sum, item) => sum + item.quantity, 0) : null;
      this.submit.disabled = !!this.pending || !items.length || !validQuantities || items.some(item => !item.available);
      const subtotal = validQuantities && items.every(item => cents(item.priceCents) !== null) ? items.reduce((sum, item) => sum + cents(item.priceCents) * item.quantity, 0) : null;
      const currency = this.form.dataset.currency || 'PHP';
      const country = this.form.dataset.country || 'PH';
      const domestic = /^(philippines|ph)$/i.test(country.trim());
      const fee = cents(this.form.dataset.singleShipping);
      const shipping = !items.length ? 0 : !validQuantities ? null : domestic && bottleCount >= 2 ? 0 : domestic && currency === 'PHP' ? fee : null;
      this.setText('subtotal', !validQuantities ? 'Check quantities' : subtotal === null ? 'Confirmed at checkout' : this.money(subtotal));
      this.setText('shipping', !items.length ? 'Choose a scent' : !validQuantities ? 'Check quantities' : shipping === null ? 'Calculated at checkout' : shipping === 0 ? 'Free' : this.money(shipping));
      this.setText('total', !items.length ? this.money(0) : !validQuantities ? 'Check quantities' : subtotal === null || shipping === null ? 'Confirmed at checkout' : this.money(subtotal + shipping));
      this.setText('shipping-message', !items.length ? 'Choose a scent to start your order.' : !validQuantities ? 'Enter a valid quantity for each scent.' : shipping === 0 ? 'Two or more items qualify for free shipping.' : shipping === null ? 'Shipping is confirmed at checkout.' : `Shipping is ${this.money(shipping)} for one item. Add another bottle for free shipping.`);
    }

    orderItems() {
      this.syncQuantities();
      const items = [...this.selected.values()];
      if (!items.length) throw new Error('Choose a scent before checking out.');
      if (items.some(item => !/^\d+$/.test(item.id) || !this.catalog.get(item.id)?.available)) throw new Error('A selected scent is currently unavailable. Please remove it and choose another.');
      return items.map(item => ({ id: item.id, quantity: item.quantity }));
    }

    async checkout() {
      if (this.pending || !this.form.reportValidity()) return;
      if (this.error) this.error.textContent = '';
      const generation = ++this.checkoutGeneration;
      try {
        const items = this.orderItems();
        if (typeof window.SJCOD?.checkout !== 'function') throw new Error('The COD order form is still loading. Please try again in a moment.');
        this.savedControls = [...this.form.elements].filter(node => typeof node.disabled === 'boolean').map(node => ({ node, disabled: node.disabled }));
        this.pending = true;
        this.form.setAttribute('aria-busy', 'true');
        this.savedControls.forEach(({ node }) => { node.disabled = true; });
        this.buttons.forEach(button => { button.disabled = true; });
        this.setText('submit-label', 'Opening order form…');
        // The bridge opens the supported COD app. Only that app can confirm a real placed order.
        await window.SJCOD.checkout(items, this.form);
      } catch (error) {
        if (generation === this.checkoutGeneration) this.fail(error.message || 'The COD order form could not open. Please try again.');
      } finally {
        if (generation === this.checkoutGeneration) this.restore();
      }
    }

    restore() {
      if (!this.pending) return;
      this.pending = false;
      this.checkoutGeneration++;
      this.savedControls?.forEach(({ node, disabled }) => { if (node.isConnected) node.disabled = disabled; });
      this.form.removeAttribute('aria-busy');
      this.setText('submit-label', 'Check out');
      this.render(false);
    }

    destroy() { this.abort.abort(); clearTimeout(this.announcement); }
  }

  const initialize = () => document.querySelectorAll('[data-sj-collection-order]').forEach(root => {
    if (controllers.has(root)) return;
    try { controllers.set(root, new CollectionOrder(root)); }
    catch { /* Native product links remain available when enhanced ordering cannot initialize. */ }
  });
  document.addEventListener('shopify:section:load', initialize);
  document.addEventListener('shopify:section:unload', event => {
    const root = event.target.matches?.('[data-sj-collection-order]') ? event.target : event.target.querySelector?.('[data-sj-collection-order]');
    const controller = root && controllers.get(root);
    controller?.destroy();
    if (root) controllers.delete(root);
  });
  window.SJCollectionOrder = { initialize, getItems: form => {
    const controller = controllers.get(form.closest('[data-sj-collection-order]'));
    if (!controller) throw new Error('Order form is unavailable.');
    return controller.orderItems();
  } };
  initialize();
})();
