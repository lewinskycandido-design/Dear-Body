(() => {
  'use strict';

  // Descriptive copy: owner-approved Scent Description Source Ledger.
  // Weights are editorial preferences, not measured scent similarity.
  const scents = [
    { id: 'mojito-metallique', name: 'Mojito Metallique', collection: 'her', description: 'Soft, creamy sweetness with a light fruity glow.', directions: ['fruit', 'sweet'], character: 'creamy' },
    { id: 'amber-oud-silk', name: 'Amber Oud Silk', collection: 'her', description: 'Dark spice and smoke with a warm, addictive edge.', directions: ['spice', 'smoke'], character: 'dark' },
    { id: 'mistened-narcissus', name: 'Mistened Narcissus', collection: 'her', description: 'Juicy berries softened by a smooth, sweet finish.', directions: ['fruit', 'sweet'], character: 'juicy' },
    { id: 'oud-mirage', name: 'Oud Mirage', collection: 'him', description: 'Dark rose wrapped in smoky, woody depth.', directions: ['rose', 'smoke'], character: 'dark' },
    { id: 'charme-envoutant', name: 'Charme Envoûtant', collection: 'him', description: 'Rich, spiced sweetness that feels deep and indulgent.', directions: ['spice', 'sweet'], character: 'rich' },
    { id: 'rtulle-and-satin', name: 'Rtulle & Satin', collection: 'him', description: 'Airy sweetness with a warm, glowing trail.', directions: ['sweet'], character: 'airy' }
  ];
  const questions = [
    { title: 'Which collection would you like to explore?', hint: 'Follow your curiosity. Every scent is yours to explore.', options: [
      { id: 'her', label: 'For Her', detail: 'Explore the three fragrances in this collection.' },
      { id: 'him', label: 'For Him', detail: 'Explore the three fragrances in this collection.' },
      { id: 'all', label: 'All six scents', detail: 'Keep every possibility open.' }
    ] },
    { title: 'Which scent direction draws you in?', hint: 'Pick the description you are most curious about.', options: [
      { id: 'fruit', label: 'Fruit or berries', detail: 'A fruity or juicy sweetness.' },
      { id: 'spice', label: 'Spice', detail: 'A spiced character.' },
      { id: 'smoke', label: 'Smoke or woods', detail: 'A darker, smoky direction.' },
      { id: 'rose', label: 'Rose', detail: 'A dark rose character.' },
      { id: 'sweet', label: 'Sweetness', detail: 'Explore the sweeter side.' },
      { id: 'open', label: 'Surprise me', detail: 'I am open to any direction.' }
    ] },
    { title: 'Which character sounds most like your taste?', hint: 'Go with the words that appeal to you most.', options: [
      { id: 'creamy', label: 'Soft & creamy', detail: 'A soft, creamy sweetness.' },
      { id: 'juicy', label: 'Juicy & smooth', detail: 'Berries with a smooth, sweet finish.' },
      { id: 'airy', label: 'Airy & warm', detail: 'An airy sweetness and warm trail.' },
      { id: 'rich', label: 'Rich & indulgent', detail: 'A deep, spiced sweetness.' },
      { id: 'dark', label: 'Dark & smoky', detail: 'A darker character with smoke.' },
      { id: 'open', label: 'I am still exploring', detail: 'Show me where my choices lead.' }
    ] }
  ];
  const states = new WeakMap();
  let activeDialog = null;
  let previousOverflow = '';

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function candidates(state) {
    return scents.filter(scent => state.answers[0] === 'all' || scent.collection === state.answers[0]);
  }
  function options(state) {
    return questions[state.step].options.filter(option => state.step === 0 || option.id === 'open' || candidates(state).some(scent => state.step === 1 ? scent.directions.includes(option.id) : scent.character === option.id));
  }
  function button(label, action, className) {
    const node = element('button', className, label);
    node.type = 'button';
    node.dataset.quizAction = action;
    return node;
  }
  function link(label, url, className) {
    // Liquid supplies real storefront URLs. Reject unsafe schemes defensively.
    if (typeof url !== 'string' || !url.trim()) return null;
    let parsed;
    try { parsed = new URL(url, window.location.href); } catch { return null; }
    if (!['https:', 'http:'].includes(parsed.protocol)) return null;
    const node = element('a', className, label);
    node.href = url;
    return node;
  }
  function focusHeading(dialog, heading) {
    heading.tabIndex = -1;
    heading.focus({ preventScroll: true });
    dialog.querySelector('.db-quiz-shell').scrollTop = 0;
  }
  function renderQuestion(dialog, state) {
    const content = dialog.querySelector('[data-quiz-content]');
    content.replaceChildren();
    const progress = element('div', 'db-quiz-progress');
    progress.append(element('p', 'db-quiz-step', `Question ${state.step + 1} of ${questions.length}`));
    const track = element('div', 'db-quiz-track');
    track.setAttribute('aria-hidden', 'true');
    const fill = element('span');
    fill.style.width = `${(state.step + 1) / questions.length * 100}%`;
    track.append(fill);
    progress.append(track);
    content.append(progress);

    const fieldset = element('fieldset', 'db-quiz-question');
    const legend = element('legend', '', questions[state.step].title);
    fieldset.append(legend);
    fieldset.append(element('p', 'db-quiz-hint', questions[state.step].hint));
    const choices = element('div', 'db-quiz-options');
    options(state).forEach(option => {
      const label = element('label', 'db-quiz-option');
      const input = element('input');
      input.type = 'radio';
      input.name = `db-scent-question-${state.step}`;
      input.value = option.id;
      input.checked = state.answers[state.step] === option.id;
      const copy = element('span');
      copy.append(element('strong', '', option.label), element('small', '', option.detail));
      label.append(input, copy);
      choices.append(label);
    });
    fieldset.append(choices);
    content.append(fieldset);
    const actions = element('div', 'db-quiz-actions');
    if (state.step > 0) actions.append(button('Back', 'back', 'db-quiz-back'));
    const next = button(state.step === questions.length - 1 ? 'See my match' : 'Next question', 'next', 'db-button');
    next.disabled = !state.answers[state.step];
    actions.append(next);
    content.append(actions);
    focusHeading(dialog, legend);
  }
  function renderResults(dialog, state) {
    const content = dialog.querySelector('[data-quiz-content]');
    content.replaceChildren();
    const ranked = candidates(state).map(scent => ({
      scent,
      direction: scent.directions.includes(state.answers[1]),
      character: scent.character === state.answers[2]
    })).map(match => ({ ...match, score: (match.direction ? 3 : 0) + (match.character ? 2 : 0) }));
    const topScore = Math.max(...ranked.map(match => match.score));
    const matches = ranked.filter(match => match.score === topScore);
    const heading = element('div', 'db-quiz-result-heading');
    const title = element('h3', '', topScore === 0 ? 'A little room to explore.' : matches.length === 1 ? 'Meet your scent match.' : 'Your scent shortlist.');
    heading.append(title, element('p', '', topScore === 0
      ? 'You kept your options open. Start with these scents and see which description speaks to you.'
      : matches.length === 1 ? 'A starting point, chosen from the scent descriptions and preferences you shared.'
      : 'These scents fit your choices equally. Explore their descriptions to find your favourite.'));
    content.append(heading);
    const results = element('div', 'db-quiz-results');
    matches.forEach(({ scent, direction, character }) => {
      const product = state.catalog.products[scent.id] || {};
      const card = element('article', 'db-quiz-result');
      card.dataset.scent = scent.id;
      if (product.image) {
        const image = element('img');
        image.src = product.image;
        image.alt = `${scent.name} perfume`;
        image.width = 180;
        image.height = 180;
        card.append(image);
      }
      const copy = element('div', 'db-quiz-result-copy');
      copy.append(element('h4', '', scent.name), element('p', 'db-quiz-description', scent.description));
      const reasons = [];
      if (direction) reasons.push(questions[1].options.find(option => option.id === state.answers[1]).label.toLowerCase());
      if (character) reasons.push(questions[2].options.find(option => option.id === state.answers[2]).label.toLowerCase());
      if (reasons.length) copy.append(element('p', 'db-quiz-reason', `Why it fits: your preference for ${reasons.join(' and ')}.`));
      const productLink = link('Explore this scent', product.url, 'db-button');
      if (productLink) copy.append(productLink);
      else copy.append(element('p', 'db-quiz-unavailable', 'Product page coming soon.'));
      card.append(copy);
      results.append(card);
    });
    content.append(results);
    const footer = element('div', 'db-quiz-result-footer');
    footer.append(button('Retake the quiz', 'restart', 'db-quiz-back'));
    const collection = state.answers[0];
    const collectionUrl = state.catalog.collections[collection];
    const isAllFragrances = collection === 'all' || collectionUrl === state.catalog.collections.all;
    const collectionLink = link(isAllFragrances ? 'Explore all fragrances' : `Explore For ${collection === 'her' ? 'Her' : 'Him'}`, collectionUrl, 'db-quiz-collection');
    if (collectionLink) footer.append(collectionLink);
    content.append(footer);
    focusHeading(dialog, title);
  }
  function close(dialog) {
    if (dialog.open) dialog.close();
  }
  function init(dialog) {
    if (states.has(dialog)) return states.get(dialog);
    let catalog;
    try { catalog = JSON.parse(dialog.querySelector('[data-quiz-catalog]').textContent); } catch { return null; }
    if (!catalog.products || !catalog.collections) return null;
    const state = { catalog, step: 0, answers: [], trigger: null };
    states.set(dialog, state);
    dialog.addEventListener('close', () => {
      document.documentElement.style.overflow = previousOverflow;
      activeDialog = null;
      if (state.trigger?.isConnected) state.trigger.focus({ preventScroll: true });
    });
    dialog.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      // Keep tabbing within the quiz instead of moving into browser chrome.
      const controls = [...dialog.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled)')].filter(control => control.getClientRects().length);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    });
    dialog.addEventListener('change', event => {
      const input = event.target.closest('input[type="radio"]');
      if (!input || !options(state).some(option => option.id === input.value)) return;
      if (state.answers[state.step] !== input.value) state.answers = state.answers.slice(0, state.step);
      state.answers[state.step] = input.value;
      dialog.querySelector('[data-quiz-action="next"]').disabled = false;
    });
    dialog.addEventListener('click', event => {
      if (event.target.closest('[data-quiz-close]')) return close(dialog);
      const action = event.target.closest('[data-quiz-action]')?.dataset.quizAction;
      if (action === 'back' && state.step > 0) { state.step -= 1; renderQuestion(dialog, state); }
      if (action === 'restart') { state.step = 0; state.answers = []; renderQuestion(dialog, state); }
      if (action === 'next' && options(state).some(option => option.id === state.answers[state.step])) {
        if (state.step < questions.length - 1) { state.step += 1; renderQuestion(dialog, state); }
        else renderResults(dialog, state);
      }
    });
    return state;
  }
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-scent-quiz-open]');
    if (!trigger || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button > 0) return;
    const dialog = document.querySelector('[data-scent-quiz]');
    if (!dialog || typeof dialog.showModal !== 'function') return;
    const state = init(dialog);
    if (!state) return;
    event.preventDefault();
    if (dialog.open) return;
    state.step = 0;
    state.answers = [];
    state.trigger = trigger.closest('.db-mobile-menu')?.querySelector('summary') || trigger;
    previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    activeDialog = dialog;
    dialog.showModal();
    renderQuestion(dialog, state);
  });
  // Replacing the static section in Shopify's editor must not leave the page locked.
  document.addEventListener('shopify:section:unload', event => {
    if (activeDialog && event.target.contains(activeDialog)) close(activeDialog);
  });
})();
