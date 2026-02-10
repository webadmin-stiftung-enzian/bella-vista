// GSAP ScrollTrigger für Parallax-Effekt registrieren
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', function() {
  // Alle Elemente mit der Klasse "parallax" animieren
  document.querySelectorAll('.parallax').forEach((element) => {
    // Optionales data-speed Attribut (Standard: 100)
    const speed = element.getAttribute('data-speed') || 125;

    gsap.to(element, {
      y: -speed,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom", // Startet wenn das Element ins Viewport kommt
        end: "bottom top",   // Endet wenn das Element den Viewport verlässt
        scrub: true,         // Bindet die Animation an den Scroll-Fortschritt
        // markers: true     // Zum Debuggen aktivieren
      }
    });
  });

  // Bella Vista Gebäude Animation - gleiche Struktur wie parallax
  const bellaVistaElement = document.querySelector('svg#Ebene_1');
  
  if (bellaVistaElement) {
    gsap.fromTo(bellaVistaElement, 
      {
        scale: 0.95
      },
      {
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: bellaVistaElement,
          start: "top bottom",
          end: "top center",
          scrub: true,
          markers: true
        }
      }
    );
  }
});
