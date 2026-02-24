// Smooth animation for details elements
document.addEventListener('DOMContentLoaded', function () {
    gsap.registerPlugin(ScrollToPlugin);

    const detailsElements = document.querySelectorAll('.wp-block-details');

    detailsElements.forEach(details => {
        const summary = details.querySelector('summary');
        const content = details.querySelector(':scope > :not(summary)');

        if (!summary || !content) return;

        // Verhindere Standard-Toggle
        summary.addEventListener('click', function (e) {
            e.preventDefault();

            const isOpen = details.hasAttribute('open');

            if (isOpen) {
                // Schließen
                closeDetails(details, content);
            } else {
                // Öffnen
                openDetails(details, content);
            }
        });

        // Initial geschlossen setzen
        if (!details.hasAttribute('open')) {
            content.style.height = '0';
            content.style.overflow = 'hidden';
        }
    });

    function openDetails(details, content) {
        // Schließe andere offene Details auf Mobile
        if (window.matchMedia('(max-width: 768px)').matches) {
            let hadOpen = false;
            detailsElements.forEach(other => {
                if (other !== details && other.hasAttribute('open')) {
                    const otherContent = other.querySelector(':scope > :not(summary)');
                    if (otherContent) {
                        closeDetails(other, otherContent);
                        hadOpen = true;
                    }
                }
            });

            if (hadOpen) {
                // Warte bis Close-Animation fertig ist (400ms), dann Position neu berechnen und scrollen
                setTimeout(() => {
                    gsap.to(window, {
                        scrollTo: { y: details, offsetY: 200 },
                        duration: 0.6,
                        ease: 'power2.inOut'
                    });
                }, 400);
            }
        }

        // Öffne details temporär, um Höhe zu messen
        details.setAttribute('open', '');

        // Aktuelle und Ziel-Höhe
        const startHeight = 0;
        const endHeight = content.scrollHeight;

        // Animation mit Web Animations API
        content.animate([
            { height: startHeight + 'px', opacity: 0 },
            { height: endHeight + 'px', opacity: 1 }
        ], {
            duration: 400,
            easing: 'ease-in-out'
        }).onfinish = () => {
            content.style.height = 'auto';
            content.style.overflow = 'visible';
        };

        content.style.overflow = 'hidden';
    }

    function closeDetails(details, content) {
        // Aktuelle und Ziel-Höhe
        const startHeight = content.scrollHeight;
        const endHeight = 0;

        content.style.height = startHeight + 'px';
        content.style.overflow = 'hidden';

        // Animation mit Web Animations API
        content.animate([
            { height: startHeight + 'px', opacity: 1 },
            { height: endHeight + 'px', opacity: 0 }
        ], {
            duration: 400,
            easing: 'ease-in-out'
        }).onfinish = () => {
            details.removeAttribute('open');
            content.style.height = '0';
        };
    }
});
