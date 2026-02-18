// Scroll-abhängige Navigation
(function() {
    const navElement = document.querySelector('div.wp-block-group:has(>nav)');
    const mobileWrapper = navElement ? navElement.querySelector('nav.nav-mobile') : null;
    const mobileMenuList = mobileWrapper ? mobileWrapper.querySelector('ul.wp-block-navigation__container') : null;
    const mobileButtonsContainer = navElement
        ? Array.from(navElement.children).find((child) => child.classList && child.classList.contains('wp-block-buttons'))
        : null;
    
    if (!navElement) {
        console.warn('Navigation element not found');
        return;
    }

    let mobileToggleButton = null;

    function isMobileMenuOpen() {
        return !!(mobileWrapper && mobileWrapper.classList.contains('is-open'));
    }

    function setMobileMenuOpen(isOpen) {
        if (!mobileWrapper || !mobileToggleButton) {
            return;
        }

        mobileWrapper.classList.toggle('is-open', isOpen);
        mobileToggleButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        mobileToggleButton.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');

        // Bei offenem Menü Navigation sichtbar halten
        if (isOpen) {
            navElement.classList.remove('nav-hidden');
            navElement.classList.add('nav-visible');
        }
    }

    function ensureMobileToggleButton() {
        if (!mobileWrapper || !mobileMenuList || !mobileButtonsContainer) {
            return null;
        }

        mobileWrapper.classList.add('has-toggle');

        let button = mobileWrapper.querySelector('button.nav-toggle');
        if (button) {
            return button;
        }

        const buttonWrapper = document.createElement('div');
        buttonWrapper.className = 'wp-block-button';

        button = document.createElement('button');
        button.type = 'button';
        button.className = 'nav-toggle';
        button.setAttribute('aria-expanded', 'false');
        button.setAttribute('aria-controls', 'mobile-nav-list');
        button.setAttribute('aria-label', 'Menü öffnen');

        buttonWrapper.appendChild(button);
        mobileButtonsContainer.appendChild(buttonWrapper);

        mobileMenuList.id = mobileMenuList.id || 'mobile-nav-list';

        return button;
    }

    let lastScrollY = window.scrollY;
    let ticking = false;
    const scrollThreshold = 10; // Mindestscroll-Distanz für Reaktion
    const topThreshold = 100; // Pixel vom Top, ab dem die Navigation reagiert

    function updateNavigation() {
        if (isMobileMenuOpen()) {
            navElement.classList.remove('nav-hidden');
            navElement.classList.add('nav-visible');
            ticking = false;
            return;
        }

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

    mobileToggleButton = ensureMobileToggleButton();

    if (mobileToggleButton) {
        mobileToggleButton.addEventListener('click', function() {
            setMobileMenuOpen(!isMobileMenuOpen());
        });

        document.addEventListener('click', function(e) {
            if (!isMobileMenuOpen()) {
                return;
            }

            if (mobileWrapper.contains(e.target)) {
                return;
            }

            if (mobileButtonsContainer && mobileButtonsContainer.contains(e.target)) {
                return;
            }

            setMobileMenuOpen(false);
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && isMobileMenuOpen()) {
                setMobileMenuOpen(false);
            }
        });

        if (mobileMenuList) {
            mobileMenuList.querySelectorAll('a').forEach((link) => {
                link.addEventListener('click', function() {
                    setMobileMenuOpen(false);
                });
            });
        }

        window.addEventListener('resize', function() {
            if (!window.matchMedia('(max-width: 900px)').matches && isMobileMenuOpen()) {
                setMobileMenuOpen(false);
            }
        });
    }

    // Initial state
    navElement.classList.add('nav-visible');
})();

