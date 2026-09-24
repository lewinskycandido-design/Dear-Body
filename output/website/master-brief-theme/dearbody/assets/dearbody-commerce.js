/* Shopify-rendered search and recommendations enhance, but never replace, native forms. */
(() => {
  let searchId = 0;
  const searchInstances = new WeakMap();

  function setupSearch(form) {
    if (searchInstances.has(form)) return;
    const input = form.querySelector('input[name="q"]');
    const results = form.querySelector('[data-db-search-results]');
    const status = form.querySelector('[data-db-search-status]');
    const endpoint = form.dataset.predictiveUrl;
    if (!input || !results || !endpoint) return;
    const listId = `db-predictive-${++searchId}`;
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-haspopup', 'listbox');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-controls', listId);
    results.setAttribute('aria-busy', 'false');
    let timer;
    let controller;
    let requestId = 0;
    let activeIndex = -1;
    let lastQuery = '';
    const options = () => [...results.querySelectorAll('[data-db-search-option]')];
    const announce = text => { if (status) status.textContent = text; };
    const setActive = index => {
      activeIndex = index;
      const items = options();
      items.forEach((option, current) => option.setAttribute('aria-selected', String(current === index)));
      if (items[index]) {
        input.setAttribute('aria-activedescendant', items[index].id);
        items[index].scrollIntoView?.({block: 'nearest'});
      } else input.removeAttribute('aria-activedescendant');
    };
    const close = () => {
      results.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      setActive(-1);
    };
    const cancel = () => {
      clearTimeout(timer);
      controller?.abort();
      requestId += 1;
      results.setAttribute('aria-busy', 'false');
    };
    const open = () => {
      if (!results.querySelector('[data-db-predictive-list]')) return;
      results.hidden = false;
      input.setAttribute('aria-expanded', 'true');
    };
    async function search(query) {
      controller?.abort();
      controller = new AbortController();
      const current = ++requestId;
      const url = new URL(endpoint, window.location.origin);
      url.searchParams.set('q', query);
      url.searchParams.set('resources[type]', 'product');
      url.searchParams.set('resources[limit]', '5');
      url.searchParams.set('resources[options][unavailable_products]', 'last');
      url.searchParams.set('section_id', 'db-predictive-search');
      results.setAttribute('aria-busy', 'true');
      announce('Searching fragrances…');
      try {
        const response = await fetch(url.toString(), {signal: controller.signal, headers: {Accept: 'text/html'}});
        if (!response.ok) throw new Error('Search unavailable');
        const html = new DOMParser().parseFromString(await response.text(), 'text/html');
        if (current !== requestId || input.value.trim() !== query || !form.isConnected) return;
        const content = html.querySelector('[data-db-predictive-content]');
        if (!content) throw new Error('Search response missing');
        results.replaceChildren(document.importNode(content, true));
        const list = results.querySelector('[data-db-predictive-list]');
        if (!list) throw new Error('Search results missing');
        list.id = listId;
        options().forEach((option, index) => { option.id = `${listId}-${index}`; });
        lastQuery = query;
        setActive(-1);
        if (document.activeElement === input) open();
        const count = results.querySelector('[data-db-predictive-count]')?.textContent.trim() || '0';
        announce(`${count} suggested fragrances. Use up and down arrows to explore, or press Enter to search.`);
      } catch (error) {
        if (error.name === 'AbortError' || current !== requestId) return;
        close();
        results.replaceChildren();
        lastQuery = '';
        announce('Suggestions are unavailable. Press Enter to search all fragrances.');
      } finally {
        if (current === requestId) results.setAttribute('aria-busy', 'false');
      }
    }
    input.addEventListener('input', () => {
      cancel();
      close();
      const query = input.value.trim();
      if (!query) { results.replaceChildren(); lastQuery = ''; announce(''); return; }
      timer = setTimeout(() => search(query), 200);
    });
    input.addEventListener('focus', () => { if (lastQuery && input.value.trim() === lastQuery) open(); });
    input.addEventListener('keydown', event => {
      if (event.isComposing) return;
      if (event.key === 'Escape') {
        cancel(); close(); announce('');
        event.stopPropagation();
        return;
      }
      if (event.key === 'Tab') { close(); return; }
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        if (input.value.trim() !== lastQuery || !options().length) return;
        event.preventDefault();
        open();
        const direction = event.key === 'ArrowDown' ? 1 : -1;
        const count = options().length;
        setActive(activeIndex < 0 ? (direction > 0 ? 0 : count - 1) : (activeIndex + direction + count) % count);
      }
      if (event.key === 'Enter' && !results.hidden && activeIndex >= 0) {
        event.preventDefault();
        options()[activeIndex]?.click();
      }
    });
    results.addEventListener('pointerover', event => {
      const option = event.target.closest('[data-db-search-option]');
      if (option) setActive(options().indexOf(option));
    });
    // Keep focus on the combobox while its mouse-selected result navigates.
    results.addEventListener('mousedown', event => { if (event.target.closest('[data-db-search-option]')) event.preventDefault(); });
    form.addEventListener('focusout', () => { setTimeout(() => { if (!form.contains(document.activeElement)) close(); }, 0); });
    form.addEventListener('submit', () => { cancel(); close(); });
    searchInstances.set(form, {close, cancel});
  }

  async function loadRecommendations(element) {
    if (element.dataset.loaded || !element.dataset.url) return;
    element.dataset.loaded = 'true';
    try {
      const response = await fetch(element.dataset.url, {headers: {Accept: 'text/html'}});
      if (!response.ok) return;
      const html = new DOMParser().parseFromString(await response.text(), 'text/html');
      const replacement = [...html.querySelectorAll('[data-db-recommendations]')].find(item => item.dataset.sectionId === element.dataset.sectionId);
      if (replacement && element.isConnected) element.replaceChildren(...[...replacement.childNodes].map(node => document.importNode(node, true)));
    } catch { /* A missing recommendation response never blocks purchasing. */ }
  }
  function initialize(root = document) {
    root.querySelectorAll('[data-db-search]').forEach(setupSearch);
    root.querySelectorAll('[data-db-recommendations]').forEach(loadRecommendations);
  }
  document.addEventListener('click', event => {
    document.querySelectorAll('[data-db-search]').forEach(form => { if (!form.contains(event.target)) searchInstances.get(form)?.close(); });
  });
  document.addEventListener('shopify:section:load', event => initialize(event.target));
  document.addEventListener('shopify:section:unload', event => {
    event.target.querySelectorAll('[data-db-search]').forEach(form => searchInstances.get(form)?.cancel());
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => initialize());
  else initialize();
})();
