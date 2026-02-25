// GSAP ScrollTrigger für Parallax-Effekt registrieren
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  // Mobile Browser (iOS Safari, Chrome Android) blenden die Adressleiste
  // beim Scrollen ein/aus → das triggert resize-Events → ScrollTrigger
  // würde bei jedem Resize alle Trigger-Positionen neu berechnen → Scroll springt.
  ScrollTrigger.config({
    ignoreMobileResize: true
  });
} else {
  console.error('GSAP oder ScrollTrigger ist nicht verfügbar.');
}

let refreshDebounceTimer = null;

function refreshScrollTriggers() {
  if (typeof ScrollTrigger === 'undefined') {
    return;
  }

  // Debounce: 200ms warten bevor refresh ausgeführt wird.
  // Verhindert Refresh-Sturm wenn mehrere Bilder kurz nacheinander laden.
  clearTimeout(refreshDebounceTimer);
  refreshDebounceTimer = setTimeout(function () {
    ScrollTrigger.refresh();
  }, 200);
}

function initParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    return;
  }

  // Alle Elemente mit der Klasse "parallax" animieren
  gsap.utils.toArray('.parallax').forEach((element) => {
    // Optionales data-speed Attribut (Standard: 125)
    const speed = Number(element.getAttribute('data-speed')) || 125;

    // will-change wird per CSS gesetzt (.parallax), hier nur die Animation.
    gsap.to(element, {
      y: -speed,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.5, // leichte Glättung statt true (= 1 Frame Delay)
        invalidateOnRefresh: true,
        markers: false
      }
    });
  });

  // Bella Vista Gebäude Animation - gleiche Struktur wie parallax
  const bellaVistaElement = document.querySelector('svg#Ebene_1');

  if (bellaVistaElement) {
    gsap.fromTo(
      bellaVistaElement,
      {
        scale: 0.95
      },
      {
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: bellaVistaElement,
          start: 'top bottom',
          end: 'top center',
          scrub: true,
          invalidateOnRefresh: true,
          markers: false
        }
      }
    );
  }

  // Best Practice: nur bei asynchronen Layout-Änderungen manuell refreshen.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(refreshScrollTriggers);
  }

  document.querySelectorAll('img').forEach((img) => {
    if (!img.complete) {
      img.addEventListener('load', refreshScrollTriggers, { once: true });
      img.addEventListener('error', refreshScrollTriggers, { once: true });
    }
  });
}

document.addEventListener('DOMContentLoaded', initParallax);
