// Scroll-abhängige Navigation (GSAP ScrollTrigger-integriert)
(function () {
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

    // ── Hilfsfunktionen ──

    function isMobileMenuOpen() {
        return !!(mobileWrapper && mobileWrapper.classList.contains('is-open'));
    }

    function showNav() {
        navElement.classList.remove('nav-hidden');
        navElement.classList.add('nav-visible');
    }

    function hideNav() {
        navElement.classList.remove('nav-visible');
        navElement.classList.add('nav-hidden');
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
            showNav();
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

    // ── Scroll-basierte Navigation ──

    const topThreshold = 100;
    // Mindest-Geschwindigkeit (px/s) bevor die Nav reagiert.
    // Filtert Micro-Scroll-Events, die durch GSAP-Scrub/Parallax entstehen.
    const velocityThreshold = 50;

    function initScrollNavigation() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            initFallbackScroll();
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        // ScrollTrigger.create() nutzt dasselbe interne Scroll-Tracking
        // wie Parallax-Scrub → kein Desync zwischen den Systemen.
        ScrollTrigger.create({
            start: 0,
            end: 'max',
            onUpdate: function (self) {
                if (isMobileMenuOpen()) {
                    return;
                }

                // Ganz oben: Navigation immer sichtbar
                if (self.scroll() < topThreshold) {
                    showNav();
                    return;
                }

                // getVelocity() liefert px/s – filtert Rauschen durch Parallax-Scrub
                var velocity = self.getVelocity();

                if (velocity < -velocityThreshold) {
                    showNav();
                } else if (velocity > velocityThreshold) {
                    hideNav();
                }
                // Bei velocity innerhalb der Toleranz: aktuellen Zustand beibehalten
            }
        });
    }

    // Fallback ohne GSAP (z.B. wenn Scripte nicht geladen werden)
    function initFallbackScroll() {
        var lastScrollY = window.scrollY;
        var ticking = false;
        var scrollThreshold = 10;

        function updateNavigation() {
            var currentScrollY = window.scrollY;
            var scrollDifference = currentScrollY - lastScrollY;

            // lastScrollY immer aktualisieren, auch bei kleinen Bewegungen
            lastScrollY = currentScrollY;
            ticking = false;

            if (isMobileMenuOpen()) {
                return;
            }

            if (Math.abs(scrollDifference) < scrollThreshold) {
                return;
            }

            if (currentScrollY < topThreshold) {
                showNav();
            } else if (scrollDifference > 0) {
                hideNav();
            } else {
                showNav();
            }
        }

        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(updateNavigation);
                ticking = true;
            }
        }, { passive: true });
    }

    // ── Mobile Menu ──

    mobileToggleButton = ensureMobileToggleButton();

    if (mobileToggleButton) {
        mobileToggleButton.addEventListener('click', function () {
            setMobileMenuOpen(!isMobileMenuOpen());
        });

        document.addEventListener('click', function (e) {
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

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && isMobileMenuOpen()) {
                setMobileMenuOpen(false);
            }
        });

        if (mobileMenuList) {
            mobileMenuList.querySelectorAll('a').forEach(function (link) {
                link.addEventListener('click', function () {
                    setMobileMenuOpen(false);
                });
            });
        }

        window.addEventListener('resize', function () {
            if (!window.matchMedia('(max-width: 900px)').matches && isMobileMenuOpen()) {
                setMobileMenuOpen(false);
            }
        });
    }

    // ── Init ──

    showNav();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScrollNavigation);
    } else {
        initScrollNavigation();
    }
})();

