if (typeof gsap !== 'undefined' && typeof Draggable !== 'undefined') {
    gsap.registerPlugin(Draggable);
} else {
    console.error('GSAP oder Draggable ist nicht verfügbar.');
}

document.addEventListener('DOMContentLoaded', function () {
    const mapContainer = document.querySelector('svg#Ebene_1');
    const legendContainer = document.getElementById('legende');
    const mapElements = ["bahnhof", "primarschule", "verwaltung", "sport", "lebensmittel", "kirche", "bellavista"];

    // Funktion zum Entfernen aller Highlights
    function removeAllHighlights(reason) {
        console.log('[map] removeAllHighlights — reason:', reason);
        mapContainer?.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
        legendContainer?.closest('svg')?.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
    }
    function addHighlight(element, elementInList) {
        const wasActive = element?.classList.contains('highlight') || elementInList?.classList.contains('highlight');
        console.log('[map] addHighlight — wasActive:', wasActive, '| map:', element?.id, '| legend:', elementInList?.id);
        if (wasActive) {
            removeAllHighlights('toggle-off');
        } else {
            removeAllHighlights('before-set');
            if (element) element.classList.add('highlight');
            if (elementInList) elementInList.classList.add('highlight');
            console.log('[map] highlight SET — map.highlight:', element?.classList.contains('highlight'), '| legend.highlight:', elementInList?.classList.contains('highlight'));
        }
    }

    // Hilfsfunktion: Vom Click-Target nach oben gehen und prüfen, ob ein
    // Vorfahre eine der gesuchten IDs hat (innerhalb eines Containers).
    // Unterstützt auch data-name-Fallback (z.B. id="bellavista-2" data-name="bellavista").
    function findMatchingId(target) {
        const selector = mapElements.flatMap(id => [`#${id}`, `[data-name="${id}"]`]).join(',');
        const g = target.closest(selector);
        if (!g) return null;
        return g.dataset.name || g.id;
    }

    // Elemente einmal cachen (data-name-Fallback für abweichende IDs im Map-SVG)
    const markerElements = Object.fromEntries(
        mapElements.map(id => [id, {
            map: mapContainer?.querySelector(`#${id}`) ?? mapContainer?.querySelector(`[data-name="${id}"]`) ?? null,
            legend: legendContainer?.querySelector(`#${id}`) ?? null,
        }])
    );

    function handleMarkerClick(id) {
        const { map: element, legend: elementInList } = markerElements[id];
        addHighlight(element, elementInList);
    }

    // --- Legenden-Delegation ---
    if (legendContainer) {
        const legendSvgRoot = legendContainer.closest('svg');
        if (legendSvgRoot) {
            legendSvgRoot.addEventListener('click', function (e) {
                const matchedId = findMatchingId(e.target);
                if (matchedId) {
                    e.stopPropagation();
                    handleMarkerClick(matchedId);
                }
            });
        }
    }

    // Highlights entfernen bei Klick außerhalb
    document.addEventListener('click', function (e) {
        const legendSvgRoot = legendContainer ? legendContainer.closest('svg') : null;
        if (legendSvgRoot?.contains(e.target)) {
            console.log('[map] document click — inside legend, ignored');
            return;
        }
        if (Object.values(markerElements).some(({ map }) => map?.contains(e.target))) {
            console.log('[map] document click — inside marker, ignored');
            return;
        }
        console.log('[map] document click — outside, removing highlights | target:', e.target);
        removeAllHighlights('outside-click');
    });

    const figure = mapContainer ? mapContainer.parentElement : null;
    const legendSvg = figure ? figure.querySelector('svg:not(#Ebene_1)') : null;

    if (typeof Draggable === 'undefined' || !mapContainer) {
        // Fallback ohne Draggable: direkte Click-Listener auf Markern
        mapElements.forEach(id => {
            const { map: element } = markerElements[id];
            if (!element) return;
            element.addEventListener('click', () => handleMarkerClick(id));
        });
        return;
    }

    const stickyMargin = 20;
    let cachedFigRight = 0;
    let cachedBaseLeft = 0;

    function updateCache() {
        if (!figure || !legendSvg) return;
        gsap.set(legendSvg, { x: 0, y: 0 });
        const figRect = figure.getBoundingClientRect();
        const legendRect = legendSvg.getBoundingClientRect();
        cachedFigRight = figRect.right;
        cachedBaseLeft = legendRect.left - figRect.left;
    }

    function updateLegend(mapX) {
        if (!legendSvg) return;
        // Die Legende bewegt sich mit der Karte (mapX),
        // klebt aber am rechten Viewport-Rand fest (Math.min).
        const legendWidth = legendSvg.offsetWidth;
        const maxX = window.innerWidth - stickyMargin - cachedFigRight - cachedBaseLeft - legendWidth;
        const finalX = Math.min(mapX, maxX);
        gsap.set(legendSvg, { x: finalX });
    }

    let lastClickTime = 0;

    const [draggable] = Draggable.create(mapContainer, {
        type: 'x',
        edgeResistance: 0.9,
        inertia: false,
        bounds: figure || undefined,
        cursor: 'grab',
        activeCursor: 'grabbing',
        zIndexBoost: false,
        minimumMovement: 10,
        onClick(e) {
            // Touch-Geräte erzeugen nach touchend einen synthetischen click —
            // Draggable feuert onClick für beide. Zweiten Aufruf ignorieren.
            const now = Date.now();
            if (now - lastClickTime < 300) return;
            lastClickTime = now;

            const matchedId = findMatchingId(e.target);
            if (matchedId) {
                handleMarkerClick(matchedId);
            } else {
                removeAllHighlights('map-background-click');
            }
        },
        onDrag() { updateLegend(this.x); },
    });

    window.addEventListener('load', () => {
        requestAnimationFrame(() => {
            updateCache();
            updateLegend(0);
        });
    });

    window.addEventListener('resize', () => {
        updateCache();
        updateLegend(draggable ? draggable.x : 0);
    });
});
