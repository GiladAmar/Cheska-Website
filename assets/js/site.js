// Mobile menu toggle. Burger opens the rose overlay; clicking a link, the
// burger again, or Esc closes. Open state moves focus into the menu and traps
// Tab inside it; closing returns focus to the burger.
(function () {
  const body = document.body;
  const burger = document.querySelector('.js-burger');
  const menu = document.querySelector('.js-mobile-menu');
  if (!burger || !menu) return;

  const links = () => menu.querySelectorAll('a');
  menu.setAttribute('aria-hidden', 'true');

  const open = () => {
    body.classList.add('menu-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    menu.setAttribute('aria-hidden', 'false');
    const first = links()[0];
    if (first) first.focus();
  };
  const close = ({ restoreFocus = true } = {}) => {
    body.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    menu.setAttribute('aria-hidden', 'true');
    if (restoreFocus) burger.focus();
  };

  burger.addEventListener('click', () => {
    body.classList.contains('menu-open') ? close() : open();
  });
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) close({ restoreFocus: false });
  });
  document.addEventListener('keydown', (e) => {
    if (!body.classList.contains('menu-open')) return;
    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'Tab') {
      const items = links();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
  });
})();
