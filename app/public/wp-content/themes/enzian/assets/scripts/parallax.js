// GSAP ScrollTrigger für Parallax-Effekt registrieren
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
} else {
  console.error('GSAP oder ScrollTrigger ist nicht verfügbar.');
}

let rafRefreshId = null;

function refreshScrollTriggers() {
  if (typeof ScrollTrigger === 'undefined') {
    return;
  }

  if (rafRefreshId) {
    cancelAnimationFrame(rafRefreshId);
  }

  rafRefreshId = requestAnimationFrame(() => {
    ScrollTrigger.refresh();
    rafRefreshId = null;
  });
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
      force3D: true, // erzwingt translateZ(0) → GPU-Compositing
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
