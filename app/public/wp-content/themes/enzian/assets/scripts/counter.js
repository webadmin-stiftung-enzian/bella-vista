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

// Intersection Observer Setup
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const originalText = el.getAttribute('data-target') || el.innerText;
      const target = extractNumber(originalText);
      const unit = extractUnit(originalText);

      // Nur hochzählen wenn target > 0
      if (target > 0) {
        const counter = { value: 0 };

        // Animation mit fester Dauer
        gsap.to(counter, {
          value: target,
          duration: 2.5, // Feste Dauer in Sekunden
          ease: "power2.out", // Easing für natürlichere Animation
          onUpdate: function () {
            el.innerText = formatNumber(Math.ceil(counter.value)) + unit;
          },
          onComplete: function () {
            el.innerText = formatNumber(target) + unit; // Stelle sicher, dass Endwert exakt ist
          }
        });
      }

      observer.unobserve(el); // Animation nur einmal ausführen
    }
  });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', function () {
  // Alle Elemente mit der Klasse "counter" beobachten
  document.querySelectorAll('.counter').forEach(n => observer.observe(n));
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