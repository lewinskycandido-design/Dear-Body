/* Progressive, keyboard-friendly disclosure navigation; native details works without JS. */
(() => {
  const disclosures = '.db-mobile-menu, .db-search-disclosure, .db-nav-group';
  function close(details, restoreFocus = false) {
    details.open = false;
    if (restoreFocus) details.querySelector('summary')?.focus();
  }
  document.addEventListener('click', event => {
    document.querySelectorAll(`${disclosures.split(', ').map(s => `${s}[open]`).join(', ')}`).forEach(details => {
      if (!details.contains(event.target) || event.target.closest('nav a')) close(details);
    });
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || event.defaultPrevented) return;
    const current = event.target.closest(disclosures);
    if (current?.open) { close(current, true); event.preventDefault(); }
  });
  document.addEventListener('toggle', event => {
    const current = event.target;
    if (!current.matches?.(disclosures) || !current.open) return;
    if (current.matches('.db-search-disclosure')) current.querySelector('input[type="search"]')?.focus();
    const header = current.closest('.db-header');
    header?.querySelectorAll('.db-search-disclosure[open], .db-mobile-menu[open]').forEach(other => {
      if (other !== current && !other.contains(current)) close(other);
    });
  }, true);
})();
