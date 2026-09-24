(() => {
  'use strict';
  const cod = window.SJCOD;
  if (!cod) return;
  let handoff = false;
  const ready = () => !!document.querySelector('#es-form') && !!document.querySelector('#es-popup-button-overwrite') && !window.SJCommerce?.busy;
  const visible = node => !!node && node.getBoundingClientRect().width > 0 && node.getBoundingClientRect().height > 0 && getComputedStyle(node).visibility !== 'hidden';
  const waitForPopup = () => new Promise((resolve, reject) => {
    const started = Date.now();
    const check = () => {
      if (visible(document.querySelector('#es-form'))) { resolve(); return; }
      if (Date.now() - started >= 8000) { reject(new Error('The delivery form could not open. Please refresh and try again. Your order has not been placed.')); return; }
      setTimeout(check, 100);
    };
    check();
  });
  cod.checkout = async (items, form) => {
    if (handoff || cod.busy) throw new Error('Please wait while your delivery form opens.');
    if (!ready()) throw new Error('The delivery form is still loading. Please try again in a moment.');
    handoff = true;
    try {
      await cod.prepare(items, { isReady: ready });
      if (!ready()) throw new Error('The delivery form is unavailable. Please refresh and try again.');
      const nativeQuantity = document.querySelector('[data-sj-cod-native-quantity]');
      const variant = form?.querySelector('[data-sj-variant]')?.value;
      if (nativeQuantity && variant) nativeQuantity.value = String(items.filter(item => String(item.id) === String(variant)).reduce((sum, item) => sum + item.quantity, 0));
      // Official EasySell custom opener. EasySell owns delivery details, order creation and confirmation.
      document.querySelector('#es-popup-button-overwrite').click();
      await waitForPopup();
      try { await cod.verify(items); }
      catch (error) {
        document.querySelector('#easysell-modal .close-icon')?.click();
        throw error;
      }
    } finally { handoff = false; }
  };
})();
