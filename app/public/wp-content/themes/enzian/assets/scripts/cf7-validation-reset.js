// CF7: Fehlerstatus zurücksetzen sobald der Nutzer tippt
document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.wpcf7-form');
  if (!form) return;

  form.addEventListener('input', function (e) {
    const wrap = e.target.closest('.wpcf7-form-control-wrap');
    if (!wrap) return;

    // .wpcf7-not-valid vom Input/Textarea entfernen
    e.target.classList.remove('wpcf7-not-valid');
    e.target.removeAttribute('aria-invalid');

    // Fehlermeldung ausblenden
    const tip = wrap.querySelector('.wpcf7-not-valid-tip');
    if (tip) {
      tip.remove();
    }
  });
});
