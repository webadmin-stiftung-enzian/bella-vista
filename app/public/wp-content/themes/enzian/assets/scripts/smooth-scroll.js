// GSAP-basiertes Smooth Scrolling für Anchor-Links
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

document.addEventListener('DOMContentLoaded', function() {
  // Alle Links, die zu Anchors auf der gleichen Seite führen
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      
      // Ignoriere leere Hashes und # alleine
      if (!targetId || targetId === '#') {
        return;
      }
      
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        e.preventDefault();
        // console.log('[scroll-to] click → target:', targetId, '| scrollY:', Math.round(window.scrollY));

        // Flag signalisiert nav.js: nicht hideNav() während scrollTo
        window.__smoothScrollActive = true;

        gsap.to(window, {
          duration: 1.5,
          scrollTo: {
            y: targetElement,
            offsetY: 160,
            autoKill: false
          },
          ease: "power2.inOut",
          onStart: function () {
            // console.log('[scroll-to] animation START → scrollY:', Math.round(window.scrollY));
          },
          onComplete: function () {
            // console.log('[scroll-to] COMPLETE → scrollY:', Math.round(window.scrollY));
            window.__smoothScrollActive = false;
          }
        });
      }
    });
  });
});
