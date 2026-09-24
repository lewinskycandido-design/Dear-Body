/* Every option and match is drawn from enabled Shopify products. No inferred profiles. */
(() => {
  'use strict';
  if (window.DearBodyScentFinder) {
    window.DearBodyScentFinder.init(document);
    return;
  }
  const dimensions = [
    { key: 'scent_character', title: 'Which scent character draws you in?', label: 'Scent character' },
    { key: 'mood', title: 'What mood are you in?', label: 'Mood' },
    { key: 'occasion', title: 'Where will your scent take you?', label: 'Occasion' },
    { key: 'intensity', title: 'What kind of scent presence do you enjoy?', label: 'Intensity' },
    { key: 'gender', title: 'Which fragrance selection would you like to explore?', label: 'Selection' }
  ];
  const states = new WeakMap();
  const normalize = value => typeof value === 'string' ? value.trim().toLocaleLowerCase() : '';
  const text = value => typeof value === 'string' ? value.trim() : '';

  function values(value) {
    const supplied = typeof value === 'string' ? [value] : Array.isArray(value) ? value : [];
    const seen = new Set();
    return supplied.filter(item => {
      const key = normalize(item);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    }).map(item => item.trim());
  }
  function safeUrl(value) {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
      const parsed = new URL(value, window.location.href);
      return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : null;
    } catch { return null; }
  }
  function catalogProducts(catalog) {
    if (!Array.isArray(catalog?.products)) return [];
    const ids = new Set();
    return catalog.products.flatMap(product => {
      if (!product || product.enabled !== true || !text(product.id) || !text(product.name) || !safeUrl(product.url) || ids.has(product.id)) return [];
      const attributes = Object.fromEntries(dimensions.map(({ key }) => [key, values(product.attributes?.[key])]));
      if (!Object.values(attributes).some(items => items.length)) return [];
      ids.add(product.id);
      return [{ ...product, attributes }];
    });
  }
  function questionsFor(products) {
    return dimensions.map(dimension => ({
      ...dimension,
      options: values(products.flatMap(product => product.attributes[dimension.key]))
    })).filter(question => question.options.length);
  }
  function matchesFor(products, answers) {
    const selected = Object.entries(answers).filter(([, value]) => value !== null);
    if (!selected.length) return [];
    // Exact confirmed attributes only. Missing attributes cannot satisfy a choice.
    return products.filter(product => selected.every(([key, value]) =>
      dimensions.some(dimension => dimension.key === key) &&
      product.attributes[key]?.some(supplied => normalize(supplied) === normalize(value))
    ));
  }
  function node(tag, className, content) {
    const result = document.createElement(tag);
    if (className) result.className = className;
    if (content !== undefined) result.textContent = content;
    return result;
  }
  function button(label, action, className = 'db-button') {
    const result = node('button', className, label);
    result.type = 'button';
    result.dataset.quizAction = action;
    return result;
  }
  function link(label, url, className = 'db-button') {
    const href = safeUrl(url);
    if (!href) return null;
    const result = node('a', className, label);
    result.href = href;
    return result;
  }
  function focus(nodeToFocus) {
    nodeToFocus.tabIndex = -1;
    nodeToFocus.focus({ preventScroll: true });
  }
  function announce(root, message) {
    const status = root.querySelector('[data-quiz-status]');
    if (status) status.textContent = message;
  }
  function browseLink(state) {
    return link('Explore all fragrances', state.catalog.allProductsUrl, 'db-text-link');
  }
  function renderEmpty(root, state) {
    const content = root.querySelector('[data-quiz-content]');
    content.replaceChildren();
    content.append(node('h3', 'db-quiz-empty-title', 'Your scent journey starts with a little curiosity.'));
    content.append(node('p', 'db-quiz-hint', 'Our scent finder is being prepared. Explore the collection and discover the scent descriptions in the meantime.'));
    const browse = browseLink(state);
    if (browse) content.append(browse);
  }
  function renderQuestion(root, state, shouldFocus = true) {
    const content = root.querySelector('[data-quiz-content]');
    const question = state.questions[state.step];
    content.replaceChildren();
    const progress = node('div', 'db-quiz-progress');
    progress.append(node('p', 'db-quiz-step', 'Question ' + (state.step + 1) + ' of ' + state.questions.length));
    const track = node('div', 'db-quiz-track');
    track.setAttribute('aria-hidden', 'true');
    const fill = node('span');
    fill.style.width = (state.step + 1) / state.questions.length * 100 + '%';
    track.append(fill);
    progress.append(track);
    content.append(progress);
    const fieldset = node('fieldset', 'db-quiz-question');
    const legend = node('legend', '', question.title);
    fieldset.append(legend);
    fieldset.append(node('p', 'db-quiz-hint', 'Go with what feels like you. These choices come from the collection’s scent profiles.'));
    const options = node('div', 'db-quiz-options');
    [...question.options, null].forEach((option, index) => {
      const label = node('label', 'db-quiz-option');
      const input = node('input');
      input.type = 'radio';
      input.name = root.id + '-' + question.key;
      input.value = option === null ? 'skip' : String(index);
      input.checked = Object.hasOwn(state.answers, question.key) && state.answers[question.key] === option;
      label.append(input, node('span', '', option === null ? 'I’m open to any' : option));
      options.append(label);
    });
    fieldset.append(options);
    content.append(fieldset);
    const actions = node('div', 'db-quiz-actions');
    if (state.step > 0) actions.append(button('Back', 'back', 'db-quiz-back'));
    const next = button(state.step === state.questions.length - 1 ? 'Discover my scents' : 'Next question', 'next');
    next.disabled = !Object.hasOwn(state.answers, question.key);
    actions.append(next);
    content.append(actions);
    if (shouldFocus) focus(legend);
    announce(root, 'Question ' + (state.step + 1) + ' of ' + state.questions.length + '. ' + question.title);
  }
  function renderResults(root, state) {
    const content = root.querySelector('[data-quiz-content]');
    content.replaceChildren();
    const selected = state.questions.filter(question => state.answers[question.key] !== null && Object.hasOwn(state.answers, question.key));
    const matches = matchesFor(state.products, state.answers);
    const heading = node('h3', 'db-quiz-result-title', !selected.length
      ? 'Your journey is still wide open.'
      : !matches.length ? 'A little more room to explore.'
        : matches.length === 1 ? 'A scent to begin your next chapter.' : 'A few scents for your next chapter.');
    content.append(heading);
    content.append(node('p', 'db-quiz-hint', !selected.length
      ? 'You kept every possibility open. Choose at least one preference to find a match, or explore the collection.'
      : !matches.length
        ? 'We haven’t found a fragrance in this selection with all of your chosen qualities. Try another combination or explore the collection.'
        : 'These fragrances share every quality you selected in their confirmed scent profiles. Explore the full descriptions to find your favourite.'));
    if (selected.length) {
      const summary = node('ul', 'db-quiz-choice-summary');
      selected.forEach(question => summary.append(node('li', '', question.label + ': ' + state.answers[question.key])));
      content.append(summary);
    }
    if (matches.length) {
      const results = node('div', 'db-quiz-results');
      matches.forEach(product => {
        const card = node('article', 'db-quiz-result');
        card.dataset.productId = product.id;
        const imageUrl = safeUrl(product.image);
        if (imageUrl) {
          const image = node('img');
          image.src = imageUrl;
          image.alt = text(product.imageAlt) || product.name;
          image.width = 480;
          image.height = 480;
          image.loading = 'lazy';
          card.append(image);
        }
        const copy = node('div', 'db-quiz-result-copy');
        copy.append(node('h4', '', product.name));
        if (text(product.description)) copy.append(node('p', 'db-quiz-description', product.description));
        if (text(product.price)) copy.append(node('p', 'db-quiz-price', (product.priceVaries === true ? 'From ' : '') + product.price));
        if (product.available === false) copy.append(node('p', 'db-quiz-availability', 'Currently sold out'));
        copy.append(node('p', 'db-quiz-reason', 'Shared qualities: ' + selected.map(question => state.answers[question.key]).join(' · ') + '.'));
        const explore = link('Explore this scent', product.url);
        if (explore) copy.append(explore);
        card.append(copy);
        results.append(card);
      });
      content.append(results);
    }
    const actions = node('div', 'db-quiz-result-footer');
    actions.append(button('Start again', 'restart', 'db-quiz-back'));
    actions.append(button('Adjust my last answer', 'adjust', 'db-quiz-back'));
    const browse = browseLink(state);
    if (browse) actions.append(browse);
    content.append(actions);
    focus(heading);
    announce(root, matches.length ? matches.length + ' fragrance' + (matches.length === 1 ? '' : 's') + ' share all your choices.' : 'No fragrance matches to display. You can adjust your choices or explore the collection.');
  }
  function initRoot(root) {
    if (states.has(root) || !root.querySelector('[data-quiz-content]')) return;
    let catalog;
    try { catalog = JSON.parse(root.querySelector('[data-quiz-catalog]').textContent); }
    catch { return; } // Keep the server-rendered browse link if the catalog cannot be read.
    if (!catalog || !Array.isArray(catalog.products)) return;
    const products = catalogProducts(catalog);
    const state = { catalog, products, questions: questionsFor(products), step: 0, answers: {} };
    states.set(root, state);
    if (!state.questions.length) {
      renderEmpty(root, state);
      return;
    }
    renderQuestion(root, state, false);
    root.addEventListener('change', event => {
      const input = event.target.closest('input[type="radio"]');
      const question = state.questions[state.step];
      if (!input || input.name !== root.id + '-' + question.key) return;
      const value = input.value === 'skip' ? null : question.options[Number(input.value)];
      if (value === undefined) return;
      if (state.answers[question.key] !== value) {
        state.questions.slice(state.step + 1).forEach(later => { delete state.answers[later.key]; });
      }
      state.answers[question.key] = value;
      root.querySelector('[data-quiz-action="next"]').disabled = false;
    });
    root.addEventListener('click', event => {
      const action = event.target.closest('[data-quiz-action]')?.dataset.quizAction;
      if (action === 'back' && state.step > 0) {
        state.step -= 1;
        renderQuestion(root, state);
      } else if (action === 'restart') {
        state.step = 0;
        state.answers = {};
        renderQuestion(root, state);
      } else if (action === 'adjust') {
        state.step = state.questions.length - 1;
        renderQuestion(root, state);
      } else if (action === 'next' && Object.hasOwn(state.answers, state.questions[state.step].key)) {
        if (state.step < state.questions.length - 1) {
          state.step += 1;
          renderQuestion(root, state);
        } else renderResults(root, state);
      }
    });
  }
  function init(scope) {
    if (scope.matches?.('[data-scent-finder]')) initRoot(scope);
    scope.querySelectorAll('[data-scent-finder]').forEach(initRoot);
    const ready = [...document.querySelectorAll('[data-scent-finder]')].find(root => states.get(root)?.questions.length);
    document.querySelectorAll('[data-scent-finder-start]').forEach(trigger => {
      trigger.hidden = !ready;
      if (ready) trigger.setAttribute('aria-controls', ready.id);
      else trigger.removeAttribute('aria-controls');
    });
  }
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-scent-finder-start]');
    if (!trigger) return;
    const root = document.getElementById(trigger.getAttribute('aria-controls'));
    const target = root?.querySelector('legend, .db-quiz-result-title');
    if (!target) return;
    focus(target);
    root.scrollIntoView?.({ behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  });
  document.addEventListener('shopify:section:load', event => init(event.target));
  document.addEventListener('shopify:section:unload', event => {
    document.querySelectorAll('[data-scent-finder-start]').forEach(trigger => {
      const target = document.getElementById(trigger.getAttribute('aria-controls'));
      if (target && event.target.contains(target)) trigger.hidden = true;
    });
  });
  window.DearBodyScentFinder = Object.freeze({ init });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init(document), { once: true });
  else init(document);
})();
