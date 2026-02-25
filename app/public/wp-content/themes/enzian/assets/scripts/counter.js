const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
};

const extractNumber = (str) => {
  // Entferne Tausendertrennzeichen (Apostroph und Punkte) und extrahiere nur Ziffern
  const numStr = str.replace(/['\.]/g, '').match(/\d+/);
  return numStr ? +numStr[0] : 0;
};

const extractUnit = (str) => {
  // Extrahiere Text nach der Zahl (z.B. "kwh", "m²")
  const match = str.match(/[^\d\s.']+/);
  return match ? ' ' + match[0] : '';
};

function initCounters() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll('.counter').forEach((el) => {
    const originalText = el.getAttribute('data-target') || el.textContent;
    const target = extractNumber(originalText);
    const unit = extractUnit(originalText);

    if (target <= 0) {
      return;
    }

    // Speichere Originalwert als data-Attribut für spätere Referenz
    if (!el.hasAttribute('data-target')) {
      el.setAttribute('data-target', originalText);
    }

    const counter = { value: 0 };

    // ScrollTrigger statt IntersectionObserver:
    // → Gleicher Tick-Zyklus wie Parallax, kein Scroll-Anchoring-Konflikt
    ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      once: true,
      onEnter: function () {
        gsap.to(counter, {
          value: target,
          duration: 2.5,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = formatNumber(Math.ceil(counter.value)) + unit;
          },
          onComplete: function () {
            el.textContent = formatNumber(target) + unit;
          }
        });
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  initCounters();

  const articles = document.querySelectorAll('section.naechste-schritte article');
  const buttons = document.querySelectorAll('section.naechste-schritte .wp-block-button a');
  articles[0].classList.add('active'); // Erster Artikel standardmäßig aktiv
  buttons[0].classList.add('active'); // Erster Button standardmäßig aktiv

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      if (articles[index]) {
        console.log('Toggling article visibility for index:', index);
        console.log('Button clicked:', button);

        buttons.forEach((b, i) => {
          if (i !== index) {
            b.classList.remove('active');
          }
        });
        button.classList.toggle('active');
        
        articles.forEach((a, i) => {
          if (i !== index) {
            a.classList.remove('active');
          }
        });
        articles[index].classList.toggle('active');
      }
    });
  });
}
);