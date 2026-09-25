(() => {
  'use strict';
  if (customElements.get('sj-product')) return;

  class ScentJourneyProduct extends HTMLElement {
    connectedCallback() {
      if (this.ready) return;
      this.ready = true;
      this.abort = new AbortController();
      this.desktop = matchMedia('(min-width: 1100px)');
      this.reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
      this.gallery = this.querySelector('[data-sj-gallery]');
      this.mediaPanel = this.querySelector('.sj-product__media');
      this.slides = [...this.querySelectorAll('[data-sj-media]')];
      this.thumbnails = [...this.querySelectorAll('[data-sj-thumbnail]')];
      this.activeIndex = Math.max(0, this.slides.findIndex(slide => slide.classList.contains('is-active')));
      this.form = this.querySelector('[data-sj-checkout-form], [data-sj-product-form]');
      this.variantSelect = this.querySelector('[data-sj-variant]');
      this.secondScent = this.form?.querySelector('[data-sj-checkout-second]');
      this.quantity = this.form?.querySelector('[data-sj-checkout-quantity], [name="quantity"]');
      this.secondQuantity = this.form?.querySelector('[data-sj-checkout-second-quantity]');
      this.orderPanel = this.form?.querySelector('[data-sj-product-order-panel]');
      this.orderOpen = this.form?.querySelector('[data-sj-product-order-open]');
      this.addButton = this.querySelector('[data-sj-add]');
      this.zoomDialog = this.querySelector('[data-sj-zoom-dialog]');
      const listen = (node, event, handler, options = {}) => node?.addEventListener(event, handler, { ...options, signal: this.abort.signal });

      listen(this, 'click', event => this.onClick(event));
      listen(this.gallery, 'keydown', event => this.onGalleryKey(event));
      listen(this.gallery, 'scroll', () => this.onGalleryScroll(), { passive: true });
      for (const surface of [this.gallery, this.querySelector('.sj-product__thumbnails')]) {
        listen(surface, 'pointerdown', () => this.pauseGalleryRotation(), { passive: true });
        listen(surface, 'wheel', event => {
          if (event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) this.pauseGalleryRotation();
        }, { passive: true });
      }
      listen(this.mediaPanel, 'focusin', () => this.pauseGalleryRotation());
      listen(this.reducedMotion, 'change', () => {
        if (this.reducedMotion.matches) this.pauseGalleryRotation();
      });
      listen(document, 'visibilitychange', () => this.scheduleGalleryRotation());
      listen(this.variantSelect, 'change', () => this.updateVariant(true));
      listen(this.secondScent, 'change', () => this.updateSecondQuantity());
      listen(this.form, 'sj:product-form-settled', () => this.updateVariant(false));
      listen(this.quantity, 'input', () => this.updateCheckoutSummary());
      listen(this.secondQuantity, 'input', () => this.updateCheckoutSummary());
      listen(this.desktop, 'change', () => this.onViewportChange());
      listen(window, 'resize', () => this.onViewportChange(), { passive: true });
      listen(this.zoomDialog, 'close', () => {
        this.querySelector('[data-sj-zoom-canvas]')?.replaceChildren();
        this.zoomTrigger?.focus({ preventScroll: true });
      });
      listen(document, 'sj:cart-updated', () => this.updateQuantityButtons());

      this.initGalleryRotation();
      this.selectMedia(this.activeIndex, false, false, false);
      this.updateVariant(false);
      if (this.variantSelect && this.form?.matches('[data-sj-checkout-form]')) this.variantSelect.disabled = false;
      if (this.secondScent) {
        this.secondScent.disabled = false;
        const secondField = this.form.querySelector('[data-sj-checkout-second-field]');
        if (secondField) secondField.hidden = false;
      }
      if (this.quantity && this.form?.matches('[data-sj-checkout-form]')) {
        this.quantity.disabled = false;
        const quantityField = this.form.querySelector('[data-sj-checkout-quantity-field]');
        if (quantityField) quantityField.hidden = false;
      }
      this.updateSecondQuantity();
      if (this.orderPanel && this.orderOpen) {
        this.orderPanel.hidden = true;
        this.orderOpen.hidden = false;
        this.orderOpen.setAttribute('aria-expanded', 'false');
      }
      if (this.form?.matches('[data-sj-checkout-form]')) {
        const nativeDelivery = this.form.querySelector('[data-sj-native-delivery]');
        if (nativeDelivery) { nativeDelivery.disabled = true; nativeDelivery.hidden = true; }
        const note = this.form.querySelector('[data-sj-checkout-note]');
        if (note) note.textContent = 'Choose your quantities, then Check out to enter your delivery details and place your cash-on-delivery order.';
      }
      this.observePurchase();
      document.dispatchEvent(new CustomEvent('sj:product-ready', { detail: { product: this } }));
    }

    disconnectedCallback() {
      this.abort?.abort();
      this.purchaseObserver?.disconnect();
      this.galleryObserver?.disconnect();
      clearTimeout(this.rotationTimer);
      cancelAnimationFrame(this.scrollFrame);
      this.ready = false;
    }

    onClick(event) {
      if (event.target.closest('[data-sj-thumbnail], [data-sj-gallery-prev], [data-sj-gallery-next], [data-sj-zoom]')) this.pauseGalleryRotation();
      const thumbnail = event.target.closest('[data-sj-thumbnail]');
      if (thumbnail) this.selectMedia(this.slides.findIndex(slide => slide.dataset.sjMedia === thumbnail.dataset.sjThumbnail));
      if (event.target.closest('[data-sj-gallery-prev]')) this.selectMedia(this.activeIndex - 1);
      if (event.target.closest('[data-sj-gallery-next]')) this.selectMedia(this.activeIndex + 1);
      const zoomTrigger = event.target.closest('[data-sj-zoom]');
      if (zoomTrigger && this.zoomDialog?.showModal) {
        this.zoomTrigger = zoomTrigger;
        const image = document.createElement('img');
        image.src = zoomTrigger.dataset.sjZoom;
        image.alt = zoomTrigger.querySelector('img')?.alt || '';
        this.querySelector('[data-sj-zoom-canvas]').replaceChildren(image);
        this.zoomDialog.showModal();
      }
      if (event.target.closest('[data-sj-close-zoom]')) this.zoomDialog?.close();
      const quantityButton = event.target.closest('[data-sj-quantity-change]');
      if (quantityButton) this.adjustQuantity(Number(quantityButton.dataset.sjQuantityChange), quantityButton.dataset.sjQuantityFor === 'second' ? this.secondQuantity : this.quantity);
      if (event.target.closest('[data-sj-product-order-open]')) this.revealOrder();
      if (event.target.closest('[data-sj-sticky-add]')) this.form?.requestSubmit(this.addButton);
    }

    onGalleryKey(event) {
      // Leave video controls, model viewers, and interactive child controls their own keys.
      if (event.target !== this.gallery && !event.target.matches('[data-sj-zoom]')) return;
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      this.pauseGalleryRotation();
      let next = this.activeIndex + (event.key === 'ArrowRight' ? 1 : -1);
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = this.slides.length - 1;
      const movingFocus = event.target.matches('[data-sj-zoom]');
      this.selectMedia(next);
      if (movingFocus) this.gallery.focus({ preventScroll: true });
    }

    initGalleryRotation() {
      // Do not interrupt native video, 3D media, or a gallery with only one image.
      this.rotationEnabled = this.slides.length > 1 && this.slides.every(slide => slide.querySelector('[data-sj-zoom] img'));
      this.rotationPaused = this.reducedMotion.matches;
      this.galleryInView = false;
      if (this.rotationEnabled) {
        if ('IntersectionObserver' in window) {
          this.galleryObserver = new IntersectionObserver(entries => {
            this.galleryInView = entries[0].isIntersecting && entries[0].intersectionRatio >= .5;
            this.scheduleGalleryRotation();
          }, { threshold: [0, .5] });
          this.galleryObserver.observe(this.gallery);
        } else {
          this.galleryInView = true;
        }
      }
      this.scheduleGalleryRotation();
    }

    pauseGalleryRotation() {
      this.rotationPaused = true;
      this.scheduleGalleryRotation();
    }

    scheduleGalleryRotation() {
      clearTimeout(this.rotationTimer);
      this.rotationTimer = null;
      const playing = this.rotationEnabled && !this.rotationPaused && this.galleryInView && !document.hidden && this.isConnected && !this.zoomDialog?.open;
      this.dataset.sjGalleryRotation = !this.rotationEnabled ? 'unavailable' : this.rotationPaused ? 'paused' : playing ? 'playing' : 'waiting';
      // Automatic changes stay quiet for screen readers; manual browsing is announced.
      this.querySelector('[data-sj-gallery-status]')?.setAttribute('aria-live', this.rotationEnabled && !this.rotationPaused ? 'off' : 'polite');
      if (!playing) return;
      const nextImage = this.slides[(this.activeIndex + 1) % this.slides.length].querySelector('img');
      if (nextImage) nextImage.loading = 'eager';
      this.rotationTimer = setTimeout(() => {
        this.selectMedia(this.activeIndex + 1, false, false, false);
        this.scheduleGalleryRotation();
      }, 8000);
    }

    selectMedia(index, animate = true, fromSwipe = false, announce = true) {
      if (!this.slides.length || index < -1) return;
      const next = (index + this.slides.length) % this.slides.length;
      this.activeIndex = next;
      this.slides.forEach((slide, slideIndex) => {
        const active = slideIndex === next;
        slide.classList.toggle('is-active', active);
        slide.inert = !active;
        if (!active) {
          slide.querySelectorAll('video').forEach(video => video.pause());
          slide.querySelectorAll('model-viewer').forEach(model => model.pause?.());
          slide.querySelectorAll('iframe').forEach(frame => {
            if (frame.src.includes('youtube.com') || frame.src.includes('youtube-nocookie.com')) frame.contentWindow?.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), new URL(frame.src, location.href).origin);
            if (frame.src.includes('vimeo.com')) frame.contentWindow?.postMessage(JSON.stringify({ method: 'pause' }), new URL(frame.src, location.href).origin);
          });
        }
      });
      this.thumbnails.forEach((thumbnail, thumbnailIndex) => {
        thumbnail.classList.toggle('is-active', thumbnailIndex === next);
        thumbnail.setAttribute('aria-pressed', String(thumbnailIndex === next));
      });
      const selectedThumbnail = this.thumbnails[next];
      if (selectedThumbnail) {
        const rail = selectedThumbnail.parentElement;
        const top = selectedThumbnail.getBoundingClientRect().top - rail.getBoundingClientRect().top + rail.scrollTop;
        if (top < rail.scrollTop || top + selectedThumbnail.offsetHeight > rail.scrollTop + rail.clientHeight) rail.scrollTo({ top: Math.max(0, top - rail.clientHeight / 2 + selectedThumbnail.offsetHeight / 2), behavior: 'auto' });
      }
      if (!this.desktop.matches && !fromSwipe) this.gallery.scrollTo({ left: this.gallery.clientWidth * next, behavior: animate && !this.reducedMotion.matches ? 'smooth' : 'auto' });
      const current = this.querySelector('[data-sj-gallery-current]');
      const total = this.querySelector('[data-sj-gallery-total]');
      if (current) current.textContent = String(next + 1);
      if (total) total.textContent = String(this.slides.length);
      const status = this.querySelector('[data-sj-gallery-status]');
      if (status && announce) status.textContent = `Media ${next + 1} of ${this.slides.length}`;
    }

    onGalleryScroll() {
      if (this.desktop.matches || !this.gallery.clientWidth) return;
      cancelAnimationFrame(this.scrollFrame);
      this.scrollFrame = requestAnimationFrame(() => {
        const nearest = Math.round(this.gallery.scrollLeft / this.gallery.clientWidth);
        if (nearest !== this.activeIndex && nearest >= 0 && nearest < this.slides.length) this.selectMedia(nearest, false, true);
      });
    }

    onViewportChange() {
      this.selectMedia(this.activeIndex, false);
      this.updateStickyPurchase();
    }

    updateVariant(updateURL) {
      const option = this.variantSelect?.selectedOptions[0];
      if (!option) return;
      const available = option.dataset.available === 'true';
      const checkoutPending = Boolean(this.form?.dataset.sjCheckoutSubmitting);
      this.querySelector('[data-sj-price]').textContent = option.dataset.price;
      const stickyPrice = this.querySelector('[data-sj-sticky-price]');
      if (stickyPrice) stickyPrice.textContent = option.dataset.price;
      const compare = this.querySelector('[data-sj-compare]');
      compare.textContent = option.dataset.compare || '';
      compare.hidden = !option.dataset.compare;
      const reference = this.querySelector('[data-sj-reference]');
      if (reference) reference.hidden = !option.dataset.compare;
      const savingsAmount = this.querySelector('[data-sj-savings-amount]');
      if (savingsAmount) {
        savingsAmount.textContent = option.dataset.savingsAmount || '';
        savingsAmount.hidden = !option.dataset.savingsAmount;
      }
      const savings = this.querySelector('[data-sj-savings]');
      if (savings) {
        savings.textContent = option.dataset.savings || '';
        savings.hidden = !option.dataset.savings;
      }
      this.querySelector('[data-sj-stock]').textContent = available ? 'Available' : 'Sold out';
      this.addButton.disabled = checkoutPending || !available;
      this.querySelector('[data-sj-add-label]').textContent = checkoutPending ? 'Opening order form…' : available ? 'Add to cart' : 'Sold out';
      if (this.orderOpen) {
        this.orderOpen.disabled = checkoutPending || !available;
        const openLabel = this.orderOpen.querySelector('[data-sj-product-order-open-label]');
        if (openLabel) openLabel.textContent = available ? 'Add to order' : 'Sold out';
      }
      const stickyButton = this.querySelector('[data-sj-sticky-add]');
      if (stickyButton) {
        stickyButton.disabled = !available;
        stickyButton.textContent = available ? 'Add to cart' : 'Sold out';
      }
      const express = this.querySelector('[data-sj-express]');
      if (express) express.hidden = !available;
      this.applyQuantityRules(this.quantity, option, this.querySelector('[data-sj-quantity-rules]'));
      this.updateCheckoutSummary();
      if (updateURL) {
        this.pauseGalleryRotation();
        const index = this.slides.findIndex(slide => slide.dataset.sjMedia === option.dataset.mediaId);
        if (index >= 0) this.selectMedia(index);
        const url = new URL(window.location.href);
        url.searchParams.set('variant', option.value);
        window.history.replaceState({}, '', url);
        this.querySelector('[data-sj-product-error]').textContent = '';
        this.dispatchEvent(new CustomEvent('sj:variant-change', { bubbles: true, detail: { variant: { id: option.value, available, featured_media: { id: option.dataset.mediaId } }, sectionId: this.dataset.sectionId, form: this.form } }));
      }
    }

    quantityRules(option) {
      const integer = (value, fallback) => /^\d+$/.test(value || '') && Number.isSafeInteger(Number(value)) && Number(value) > 0 ? Number(value) : fallback;
      return { min: integer(option?.dataset.quantityMin, 1), step: integer(option?.dataset.quantityStep, 1), max: integer(option?.dataset.quantityMax, null) };
    }

    quantityError(value, option) {
      const { min, step, max } = this.quantityRules(option);
      if (!/^\d+$/.test(String(value)) || !Number.isSafeInteger(Number(value)) || Number(value) < min) return `Enter a whole-number quantity of at least ${min}.`;
      if (max !== null && Number(value) > max) return `The maximum quantity for this scent is ${max}.`;
      if ((Number(value) - min) % step !== 0) return `Choose quantities in increments of ${step}, starting at ${min}.`;
      return '';
    }

    applyQuantityRules(input, option, ruleNode) {
      if (!input || !option) return;
      const { min, step, max } = this.quantityRules(option);
      input.min = String(min); input.step = String(step);
      if (max !== null) input.max = String(max); else input.removeAttribute('max');
      if (this.quantityError(input.value, option)) input.value = String(min);
      input.setCustomValidity('');
      const rules = [];
      if (min > 1) rules.push(`Minimum ${min}.`);
      if (step > 1) rules.push(`Increments of ${step}.`);
      if (max !== null) rules.push(`Maximum ${max}.`);
      if (ruleNode) ruleNode.textContent = rules.join(' ');
    }

    updateSecondQuantity() {
      const option = this.secondScent?.selectedOptions[0];
      const selected = Boolean(option?.value);
      const field = this.form?.querySelector('[data-sj-checkout-second-quantity-field]');
      if (field) field.hidden = !selected;
      if (this.secondQuantity) {
        this.secondQuantity.disabled = !selected;
        this.secondQuantity.setCustomValidity('');
        if (selected) this.applyQuantityRules(this.secondQuantity, option, this.querySelector('[data-sj-second-quantity-rules]'));
      }
      this.updateCheckoutSummary();
    }

    revealOrder() {
      if (!this.orderPanel || this.orderOpen?.disabled) return;
      this.orderPanel.hidden = false;
      this.orderOpen?.setAttribute('aria-expanded', 'true');
      const heading = this.orderPanel.querySelector('[data-sj-product-order-heading]');
      heading?.focus({ preventScroll: true });
      heading?.scrollIntoView({ block: 'nearest', behavior: this.reducedMotion.matches ? 'auto' : 'smooth' });
    }

    updateCheckoutSummary() {
      if (!this.form?.matches('[data-sj-checkout-form]')) return;
      const current = this.variantSelect?.selectedOptions[0];
      if (!current) return;
      const second = this.secondScent?.selectedOptions[0];
      const hasSecond = Boolean(second?.value);
      const quantity = this.quantity?.value || (this.quantity ? '' : '1');
      const secondQuantity = this.secondQuantity?.value || (this.secondQuantity ? '' : '1');
      let mainError = this.quantityError(quantity, current);
      let secondError = hasSecond ? this.quantityError(secondQuantity, second) : '';
      const items = new Map();
      if (!mainError) items.set(current.value, { quantity: Number(quantity), option: current });
      if (hasSecond && !secondError) {
        const entry = items.get(second.value);
        items.set(second.value, { quantity: (entry?.quantity || 0) + Number(secondQuantity), option: entry?.option || second });
      }
      if (!mainError && !secondError) {
        for (const entry of items.values()) {
          const mergedError = this.quantityError(String(entry.quantity), entry.option);
          if (mergedError) { secondError = `Combined quantity: ${mergedError}`; break; }
        }
      }
      this.quantity?.setCustomValidity(mainError);
      this.secondQuantity?.setCustomValidity(secondError);
      const available = current.dataset.available === 'true' && (!hasSecond || second.dataset.available === 'true' && !second.disabled);
      const valid = !mainError && !secondError;
      const pending = Boolean(this.form.dataset.sjCheckoutSubmitting);
      if (this.addButton) this.addButton.disabled = pending || !available || !valid;
      const base = this.form.dataset.sjCheckoutBase;
      if (base && valid) this.form.action = `${base.replace(/\/$/, '')}/${[...items].map(([id, entry]) => `${id}:${entry.quantity}`).join(',')}`;
      this.updateQuantityButtons();
      const error = this.form.querySelector('[data-sj-product-error]');
      if (error && !pending) error.textContent = mainError || secondError;
      const summary = this.form.querySelector('[data-sj-checkout-summary]');
      if (!summary) return;
      const currency = summary.dataset.currency || 'PHP';
      const cents = option => /^\d+$/.test(option?.dataset.priceCents || '') ? Number(option.dataset.priceCents) : NaN;
      const subtotal = cents(current) * Number(quantity) + (hasSecond ? cents(second) * Number(secondQuantity) : 0);
      const priced = valid && Number.isSafeInteger(subtotal) && subtotal >= 0;
      const itemCount = valid ? Number(quantity) + (hasSecond ? Number(secondQuantity) : 0) : 0;
      const country = this.form.elements.namedItem('checkout[shipping_address][country]')?.value;
      const domestic = country === 'Philippines' || country === 'PH';
      const singleShipping = Number(summary.dataset.singleShipping);
      const shippingKnown = valid && domestic && (itemCount >= 2 || currency === 'PHP' && Number.isSafeInteger(singleShipping) && singleShipping >= 0);
      const shipping = itemCount >= 2 ? 0 : singleShipping;
      const money = value => new Intl.NumberFormat(document.documentElement.lang || 'en-PH', { style: 'currency', currency }).format(value / 100);
      const set = (selector, value) => { const node = summary.querySelector(selector); if (node) node.textContent = value; };
      set('[data-sj-checkout-subtotal]', priced ? money(subtotal) : valid ? 'Confirmed at checkout' : 'Enter a valid quantity');
      set('[data-sj-checkout-shipping]', shippingKnown ? shipping === 0 ? 'Free' : money(shipping) : 'Calculated at checkout');
      set('[data-sj-checkout-total]', priced && shippingKnown ? money(subtotal + shipping) : 'Confirmed at checkout');
      set('[data-sj-checkout-shipping-message]', shippingKnown ? itemCount >= 2 ? `${itemCount} bottles qualify for free shipping.` : `Shipping is ${money(shipping)} for one item. Two or more bottles qualify for free shipping.` : 'Final shipping is confirmed at checkout.');
    }

    adjustQuantity(direction, input = this.quantity) {
      if (!input || input.disabled || input.type === 'hidden') return;
      const option = input === this.secondQuantity ? this.secondScent?.selectedOptions[0] : this.variantSelect?.selectedOptions[0];
      const { min, step, max } = this.quantityRules(option);
      let value = this.quantityError(input.value, option) ? min : Number(input.value) + direction * step;
      value = Math.max(min, value);
      if (max !== null) value = Math.min(value, min + Math.floor((max - min) / step) * step);
      input.value = String(value);
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    updateQuantityButtons() {
      for (const [key, input] of [['main', this.quantity], ['second', this.secondQuantity]]) {
        const option = key === 'main' ? this.variantSelect?.selectedOptions[0] : this.secondScent?.selectedOptions[0];
        const { min, step, max } = this.quantityRules(option);
        const value = Number(input?.value);
        const unavailable = !input || input.disabled || Boolean(this.form?.dataset.sjCheckoutSubmitting) || option?.dataset.available !== 'true';
        const minus = this.querySelector(`[data-sj-quantity-for="${key}"][data-sj-quantity-change="-1"]`);
        const plus = this.querySelector(`[data-sj-quantity-for="${key}"][data-sj-quantity-change="1"]`);
        if (minus) minus.disabled = unavailable || Number.isFinite(value) && value <= min;
        if (plus) plus.disabled = unavailable || max !== null && Number.isFinite(value) && value + step > max;
      }
    }

    observePurchase() {
      this.purchase = this.querySelector('[data-sj-purchase]');
      if (!this.purchase || !this.querySelector('[data-sj-sticky-buy]') || !('IntersectionObserver' in window)) return;
      this.purchaseObserver = new IntersectionObserver(() => this.updateStickyPurchase(), { threshold: [0, 1] });
      this.purchaseObserver.observe(this.purchase);
      window.addEventListener('scroll', () => this.updateStickyPurchase(), { passive: true, signal: this.abort.signal });
      this.updateStickyPurchase();
    }

    updateStickyPurchase() {
      const sticky = this.querySelector('[data-sj-sticky-buy]');
      if (!sticky || !this.purchase) return;
      const purchasePast = this.purchase.getBoundingClientRect().bottom <= 0;
      const productVisible = this.getBoundingClientRect().bottom > sticky.offsetHeight;
      sticky.hidden = this.desktop.matches || !purchasePast || !productVisible;
    }
  }

  class ScentJourneyRecommendations extends HTMLElement {
    connectedCallback() {
      if (this.connected) return;
      this.connected = true;
      this.abort = new AbortController();
      document.addEventListener('sj:product-ready', () => this.mount(), { signal: this.abort.signal });
      this.load();
    }

    disconnectedCallback() {
      this.abort?.abort();
      this.connected = false;
    }

    async load() {
      if (this.markup !== undefined) return this.mount();
      try {
        const response = await fetch(this.dataset.url, { signal: this.abort.signal, headers: { Accept: 'text/html' } });
        if (!response.ok) return;
        const documentFragment = new DOMParser().parseFromString(await response.text(), 'text/html');
        const recommendations = documentFragment.querySelector('[data-sj-recommendations]');
        this.markup = recommendations?.querySelector('section') ? recommendations.innerHTML : '';
        this.mount();
      } catch (error) {
        // Recommendations are optional; a network failure must never interrupt purchase.
        if (error.name !== 'AbortError') this.hidden = true;
      }
    }

    mount() {
      if (!this.markup) return;
      const slot = document.querySelector('sj-product [data-sj-recommendations-slot]');
      if (slot) {
        slot.classList.add('sj-product-recommendations');
        slot.innerHTML = this.markup;
        this.hidden = true;
      } else {
        this.innerHTML = this.markup;
        this.hidden = false;
      }
    }
  }

  customElements.define('sj-product', ScentJourneyProduct);
  customElements.define('sj-recommendations', ScentJourneyRecommendations);
})();
