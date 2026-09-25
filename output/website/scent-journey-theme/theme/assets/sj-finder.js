(() => {
  'use strict';
  // Profiles come from the theme's approved launch copy, with native metafield overrides.
  const normalize = value => String(value).normalize('NFKC').trim().toLocaleLowerCase('en').replace(/\s+/g, ' ');
  const tags = value => {
    const values = Array.isArray(value) ? value : typeof value === 'string' ? value.split(/[,;|\n]+/) : typeof value === 'number' ? [String(value)] : [];
    return [...new Map(values.filter(item => typeof item === 'string' || typeof item === 'number').map(item => String(item).trim()).filter(Boolean).map(item => [normalize(item), item])).values()];
  };
  const definitions = [
    { key: 'collection', weight: 0, title: 'WHERE WOULD YOU LIKE TO START?', hint: 'Choose a collection, or keep your options open.', skip: 'Explore both collections' },
    { key: 'mood', weight: 3, title: 'WHAT FEELING ARE YOU DRAWN TO?', hint: 'Think about the mood you want your fragrance to bring.', skip: 'I’m open to any mood' },
    { key: 'character', weight: 5, title: 'WHICH SCENT STYLE SOUNDS LIKE YOU?', hint: 'Follow your first instinct. There’s no wrong answer.', skip: 'I’d like to discover something new' },
    { key: 'occasion', weight: 1, title: 'WHEN WOULD YOU REACH FOR IT?', hint: 'Picture your plans. We’ll suggest a scent to go with them.', skip: 'A little of everything' },
    { key: 'intensity', weight: 1, title: 'WHAT KIND OF SCENT FEEL DO YOU LOVE?', hint: 'Think airy, sweet or deep — the character you enjoy wearing.', skip: 'Surprise me' }
  ];
  const poolFor = (profiles, answers) => answers.collection ? profiles.filter(profile => tags(profile.collection).some(value => normalize(value) === normalize(answers.collection))) : profiles;
  const questionsFor = (profiles, answers = {}) => definitions.map(definition => {
    const pool = definition.key === 'collection' ? profiles : poolFor(profiles, answers);
    const options = tags(pool.flatMap(profile => tags(profile[definition.key])));
    if (definition.key === 'collection') options.sort((a, b) => ['Women', 'Men'].indexOf(a) - ['Women', 'Men'].indexOf(b));
    else options.sort((a, b) => a.localeCompare(b, 'en'));
    return { ...definition, options };
  }).filter(question => question.options.length);
  const rank = (profiles, answers) => poolFor(profiles, answers).map((profile, index) => {
    let score = 0;
    const matches = [];
    definitions.filter(question => question.weight > 0).forEach(question => {
      const answer = answers[question.key];
      if (answer && tags(profile[question.key]).some(value => normalize(value) === normalize(answer))) { score += question.weight; matches.push(answer); }
    });
    return { profile, score, matches: [...new Set(matches)], index };
  }).filter(result => result.score > 0).sort((a, b) => b.score - a.score || a.index - b.index);
  const api = { tags, normalize, rank, poolFor, questionsFor };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof document === 'undefined') return;
  const initialize = () => document.querySelectorAll('[data-sj-finder]').forEach(section => {
    if (section.dataset.sjFinderInitialized) return;
    section.dataset.sjFinderInitialized = 'true';
    let profiles;
    try { profiles = JSON.parse(section.querySelector('[data-sj-finder-data]')?.textContent || '[]'); } catch { return; }
    const experience = section.querySelector('[data-sj-finder-experience]');
    if (!experience || !Array.isArray(profiles) || !profiles.length) return;
    let questions = questionsFor(profiles);
    if (!questions.length) return;
    const form = section.querySelector('[data-sj-finder-form]');
    const results = section.querySelector('[data-sj-finder-results]');
    const grid = section.querySelector('[data-sj-finder-result-grid]');
    const bank = section.querySelector('[data-sj-finder-card-bank]');
    const status = section.querySelector('[data-sj-finder-status]');
    const progress = section.querySelector('[data-sj-finder-progress]');
    const heading = section.querySelector('[data-sj-finder-question]');
    const choices = section.querySelector('[data-sj-finder-choices]');
    const back = section.querySelector('[data-sj-finder-back]');
    const instruction = section.querySelector('.sj-finder-instruction span');
    let step = 0;
    let answers = {};
    let pending = null;
    let generation = 0;
    const cancelPending = () => { clearTimeout(pending); pending = null; generation++; choices.removeAttribute('aria-busy'); };
    const iconFor = (key, option) => {
      if (!option) return 'compass';
      if (key === 'collection') return normalize(option) === 'women' ? 'women' : 'men';
      if (/dark|deep|smoky|evening/i.test(option)) return 'moon';
      if (/soft|airy|relaxed/i.test(option)) return 'cloud';
      if (/bright|warm|spice/i.test(option)) return 'sun';
      if (/woods|rose|fresh/i.test(option)) return 'leaf';
      if (/everyday|coffee/i.test(option)) return 'bag';
      return 'heart';
    };
    const focusHeading = element => { element.setAttribute('tabindex', '-1'); element.focus({ preventScroll: true }); element.scrollIntoView({ block: 'nearest', behavior: 'auto' }); };
    const render = (focus = true) => {
      cancelPending();
      questions = questionsFor(profiles, answers);
      form.hidden = false;
      results.hidden = true;
      const question = questions[step];
      progress.max = questions.length;
      progress.value = step;
      section.querySelector('[data-sj-finder-step]').textContent = `QUESTION ${step + 1} OF ${questions.length}`;
      heading.textContent = question.title;
      section.querySelector('[data-sj-finder-hint]').textContent = question.hint;
      if (instruction) instruction.textContent = step === questions.length - 1 ? 'Choose an answer to see your scent.' : 'Choose an answer. We’ll take you straight to the next question.';
      choices.replaceChildren();
      [...question.options, ''].forEach(option => {
        const button = document.createElement('button');
        button.className = 'sj-finder-answer'; button.type = 'button'; button.value = option;
        button.dataset.sjFinderAnswer = question.key;
        if (question.key === 'collection') button.dataset.collectionChoice = option ? normalize(option) : 'both';
        button.setAttribute('aria-pressed', String(Object.hasOwn(answers, question.key) && answers[question.key] === option));
        const mark = document.createElement('span'); mark.className = 'sj-finder-answer__icon';
        const artwork = section.querySelector(`[data-sj-finder-icon="${iconFor(question.key, option)}"]`);
        if (artwork) mark.append(artwork.content.cloneNode(true));
        const text = document.createElement('span');
        text.className = 'sj-finder-answer__label';
        text.textContent = !option ? question.skip : question.key === 'collection' ? `${option}’s collection` : option;
        button.append(mark, text); choices.append(button);
      });
      back.disabled = step === 0;
      back.style.visibility = step === 0 ? 'hidden' : 'visible';
      status.textContent = `Question ${step + 1} of ${questions.length}: ${question.title}`;
      if (focus) focusHeading(heading);
    };
    const showResults = () => {
      form.hidden = true; results.hidden = false;
      progress.value = questions.length;
      section.querySelector('[data-sj-finder-step]').textContent = 'YOUR RESULT';
      const hasPreferences = definitions.some(question => question.weight > 0 && answers[question.key]);
      const ranked = hasPreferences ? rank(profiles, answers).slice(0, 1) : poolFor(profiles, answers).slice(0, 1).map(profile => ({ profile, matches: [] }));
      grid.replaceChildren();
      ranked.forEach(result => {
        const original = bank.querySelector(`[data-sj-finder-product="${CSS.escape(String(result.profile.id))}"]`);
        if (!original) return;
        const card = original.cloneNode(true);
        const label = card.querySelector('[data-sj-match-label]');
        if (label) label.textContent = hasPreferences ? 'YOUR SCENT MATCH' : 'A SCENT TO EXPLORE';
        const description = card.querySelector('[data-sj-profile-description]');
        if (description) description.textContent = result.profile.description || '';
        card.querySelector('[data-sj-match-reason]').textContent = result.matches.length ? `Connects with your choices: ${result.matches.join(' · ')}.` : 'Explore its scent story and see what speaks to you.';
        grid.append(card);

      });
      const heading = results.querySelector('h2');
      heading.textContent = hasPreferences && ranked.length ? 'MEET YOUR\nSCENT MATCH.' : 'START YOUR\nDISCOVERY.';
      const summary = section.querySelector('[data-sj-finder-result-summary]');
      summary.textContent = !hasPreferences ? 'You kept your options open. Start with this scent and see how it feels to you.' : ranked.length ? 'This is your recommended scent based on the answers you chose.' : 'No close match was found for these choices. Try different answers, or explore the full collection.';
      status.textContent = grid.children.length ? '1 scent to explore.' : 'No matching scent found.';
      focusHeading(heading);
    };
    choices.addEventListener('click', event => {
      const selected = event.target.closest('button[data-sj-finder-answer]');
      if (!selected || !choices.contains(selected) || selected.disabled || pending !== null || event.detail > 1) return;
      const key = questions[step].key;
      if (selected.dataset.sjFinderAnswer !== key) return;
      // Changing the collection clears incompatible later choices before deriving its options.
      if (key === 'collection' && answers.collection !== selected.value) answers = {};
      answers[key] = selected.value;
      choices.querySelectorAll('button').forEach(button => { button.disabled = true; button.setAttribute('aria-pressed', String(button === selected)); });
      choices.setAttribute('aria-busy', 'true');
      const revision = generation;
      // A brief acknowledgement also absorbs a rapid second click. Reduced motion has no delay.
      pending = setTimeout(() => {
        pending = null;
        if (revision !== generation) return;
        choices.removeAttribute('aria-busy');
        if (!section.isConnected) { choices.querySelectorAll('button').forEach(button => { button.disabled = false; }); return; }
        if (step < questions.length - 1) { step++; render(); } else showResults();
      }, window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 0 : 150);
    });
    back.addEventListener('click', () => {
      if (step > 0) { step--; render(); }
    });
    section.querySelectorAll('[data-sj-finder-reset]').forEach(button => button.addEventListener('click', () => { answers = {}; step = 0; render(); }));
    const start = section.querySelector('[data-sj-finder-start]');
    const welcome = section.querySelector('[data-sj-finder-welcome]');
    if (start && welcome) {
      start.disabled = false;
      start.addEventListener('click', () => {
        welcome.hidden = true;
        experience.hidden = false;
        render();
      });
    } else {
      experience.hidden = false;
      render(false);
    }
  });
  document.addEventListener('shopify:section:load', initialize);
  initialize();
})();
