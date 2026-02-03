// GSAP ScrollTrigger für Parallax-Effekt registrieren
gsap.registerPlugin(ScrollTrigger);

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
