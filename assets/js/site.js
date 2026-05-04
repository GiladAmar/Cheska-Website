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

// Inline form validation. Suppresses browser-native tooltips and shows a
// designed message under each invalid field. Falls back gracefully if JS
// is disabled — the form's `required`/`type=email` attributes still gate
// submission via the browser's default UI.
(function () {
  const forms = document.querySelectorAll('form.form');
  if (!forms.length) return;

  const messageFor = (field) => {
    if (field.validity.valueMissing) return 'Please fill in this field.';
    if (field.validity.typeMismatch && field.type === 'email') return 'Please enter a valid email address.';
    return field.validationMessage || 'Please check this field.';
  };

  const showError = (field, msg) => {
    field.setAttribute('aria-invalid', 'true');
    let err = field.parentElement.querySelector('.form__error');
    if (!err) {
      err = document.createElement('p');
      err.className = 'form__error';
      err.id = `${field.id || field.name}-error`;
      field.parentElement.appendChild(err);
      field.setAttribute('aria-describedby', err.id);
    }
    err.textContent = msg;
  };

  const clearError = (field) => {
    field.removeAttribute('aria-invalid');
    const err = field.parentElement.querySelector('.form__error');
    if (err) err.remove();
  };

  forms.forEach((form) => {
    form.setAttribute('novalidate', '');
    const fields = form.querySelectorAll('input[required], textarea[required], input[type="email"]');

    form.addEventListener('submit', (e) => {
      let firstInvalid = null;
      fields.forEach((field) => {
        if (!field.checkValidity()) {
          showError(field, messageFor(field));
          if (!firstInvalid) firstInvalid = field;
        } else {
          clearError(field);
        }
      });
      if (firstInvalid) {
        e.preventDefault();
        firstInvalid.focus();
      }
    });

    fields.forEach((field) => {
      field.addEventListener('input', () => {
        if (field.checkValidity()) clearError(field);
      });
      field.addEventListener('blur', () => {
        if (!field.checkValidity()) showError(field, messageFor(field));
      });
    });
  });
})();
