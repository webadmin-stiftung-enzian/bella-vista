// Scroll-abhängige Navigation
(function() {
    const navElement = document.querySelector('div.wp-block-group:has(>nav)');
    
    if (!navElement) {
        console.warn('Navigation element not found');
        return;
    }

    let lastScrollY = window.scrollY;
    let ticking = false;
    const scrollThreshold = 10; // Mindestscroll-Distanz für Reaktion
    const topThreshold = 100; // Pixel vom Top, ab dem die Navigation reagiert

    function updateNavigation() {
        const currentScrollY = window.scrollY;
        const scrollDifference = currentScrollY - lastScrollY;

        // Ignoriere kleine Scroll-Bewegungen
        if (Math.abs(scrollDifference) < scrollThreshold) {
            ticking = false;
            return;
        }

        // Wenn ganz oben, zeige Navigation immer
        if (currentScrollY < topThreshold) {
            navElement.classList.remove('nav-hidden');
            navElement.classList.add('nav-visible');
        }
        // Nach unten scrollen → Navigation verstecken
        else if (scrollDifference > 0) {
            navElement.classList.remove('nav-visible');
            navElement.classList.add('nav-hidden');
        }
        // Nach oben scrollen → Navigation zeigen
        else if (scrollDifference < 0) {
            navElement.classList.remove('nav-hidden');
            navElement.classList.add('nav-visible');
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateNavigation);
            ticking = true;
        }
    }

    // Scroll-Event Listener
    window.addEventListener('scroll', requestTick, { passive: true });

    // Touch-Events für bessere Mobile-Performance
    let touchStartY = 0;
    let touchEndY = 0;

    window.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', function(e) {
        touchEndY = e.touches[0].clientY;
        requestTick();
    }, { passive: true });

    // Initial state
    navElement.classList.add('nav-visible');
})();

