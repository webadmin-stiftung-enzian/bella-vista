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
        if (!navElement.classList.contains('nav-visible')) {
            // console.log('[nav] showNav');
        }
        navElement.classList.remove('nav-hidden');
        navElement.classList.add('nav-visible');
    }

    function hideNav() {
        if (!navElement.classList.contains('nav-hidden')) {
            // console.log('[nav] hideNav');
        }
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

    // ── User-Scroll-Erkennung ──
    // Nur echtes manuelles Scrollen soll die Nav steuern.
    // Layout-Shifts (Bilder, Animationen), GSAP-Scrub u. Ä. werden ignoriert.

    let isUserScrolling = false;
    let userScrollTimer = null;
    const userScrollTimeout = 200; // ms nach letztem Input-Event

    function markUserScrolling() {
        isUserScrolling = true;
        clearTimeout(userScrollTimer);
        userScrollTimer = setTimeout(function () {
            isUserScrolling = false;
        }, userScrollTimeout);
    }

    // Passive Listener auf alle Events, die manuelles Scrollen auslösen
    window.addEventListener('wheel', markUserScrolling, { passive: true });
    window.addEventListener('touchstart', markUserScrolling, { passive: true });
    window.addEventListener('touchmove', markUserScrolling, { passive: true });
    // Momentum-Scrolling auf Touch-Geräten: Finger ist weg, aber Scroll läuft weiter.
    // Ohne diesen Listener endet isUserScrolling 200ms nach touchend,
    // obwohl der Scroll (und damit ScrollTrigger.onUpdate) noch aktiv ist.
    window.addEventListener('scroll', markUserScrolling, { passive: true });
    window.addEventListener('keydown', function (e) {
        // Nur Tasten, die Scrollen auslösen
        var scrollKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
        if (scrollKeys.indexOf(e.key) !== -1) {
            markUserScrolling();
        }
    }, { passive: true });

    // ── Scroll-basierte Navigation ──

    const topThreshold = 100;
    // Mindest-Geschwindigkeit (px/s) bevor die Nav reagiert.
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

                // Während programmatischem scrollTo nicht reagieren,
                // sonst: hideNav → Layout-Shift → autoKill bricht Scroll ab
                if (window.__smoothScrollActive) {
                    return;
                }

                // Nur auf echtes manuelles Scrollen reagieren
                if (!isUserScrolling) {
                    return;
                }

                var velocity = self.getVelocity();

                if (velocity < -velocityThreshold) {
                    // console.log('[nav] onUpdate → showNav | velocity:', Math.round(velocity), '| scroll:', Math.round(self.scroll()), '| isUserScrolling:', isUserScrolling);
                    showNav();
                } else if (velocity > velocityThreshold) {
                    // console.log('[nav] onUpdate → hideNav | velocity:', Math.round(velocity), '| scroll:', Math.round(self.scroll()), '| isUserScrolling:', isUserScrolling);
                    hideNav();
                }
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

            // Nur auf echtes manuelles Scrollen reagieren
            if (!isUserScrolling) {
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

