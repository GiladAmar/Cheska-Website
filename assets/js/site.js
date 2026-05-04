// Mobile menu toggle. Click burger to open the overlay; click a link or
// the burger again to close. Esc also closes.
(function () {
  const body = document.body;
  const burger = document.querySelector('.js-burger');
  const menu = document.querySelector('.js-mobile-menu');
  if (!burger || !menu) return;

  const close = () => {
    body.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
  };
  const open = () => {
    body.classList.add('menu-open');
    burger.setAttribute('aria-expanded', 'true');
  };

  burger.addEventListener('click', () => {
    body.classList.contains('menu-open') ? close() : open();
  });
  menu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') close();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
})();
