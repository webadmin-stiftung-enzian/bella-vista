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
        
        // GSAP smooth scroll mit ScrollTrigger-Integration
        gsap.to(window, {
          duration: 1.5,
          scrollTo: {
            y: targetElement,
            offsetY: 100 // Offset für die fixed Navigation
          },
          ease: "power2.inOut"
        });
      }
    });
  });
});
