if (typeof gsap !== 'undefined' && typeof Draggable !== 'undefined') {
    gsap.registerPlugin(Draggable);
} else {
    console.error('GSAP oder Draggable ist nicht verfügbar.');
}

document.addEventListener('DOMContentLoaded', function () {
    const mapContainer = document.querySelector('svg#Ebene_1');
    const legendContainer = document.getElementById('legende');
    const mapElements = ["bahnhof", "primarschule", "verwaltung", "sport", "lebensmittel", "kirche"];

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
    function findMatchingId(target) {
        const g = target.closest(mapElements.map(id => `#${id}`).join(','));
        return g ? g.id : null;
    }

    // Elemente einmal cachen
    const markerElements = Object.fromEntries(
        mapElements.map(id => [id, {
            map: mapContainer?.querySelector(`#${id}`) ?? null,
            legend: legendContainer?.querySelector(`#${id}`) ?? null,
        }])
    );

    // --- Transparente Hit-Areas für Legenden-Gruppen ---
    // fill="transparent" fängt Pointer-Events ab (fill="none" nicht!).
    if (legendContainer) {
        mapElements.forEach(id => {
            const g = markerElements[id].legend;
            if (!g) return;
            const bbox = g.getBBox();
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', bbox.x);
            rect.setAttribute('y', bbox.y);
            rect.setAttribute('width', bbox.width);
            rect.setAttribute('height', bbox.height);
            rect.setAttribute('fill', 'transparent');
            rect.style.cursor = 'pointer';
            g.insertBefore(rect, g.firstChild);
        });
    }

    // --- Legenden-Delegation ---
    if (legendContainer) {
        const legendSvgRoot = legendContainer.closest('svg');
        if (legendSvgRoot) {
            legendSvgRoot.addEventListener('click', function (e) {
                const matchedId = findMatchingId(e.target);
                if (matchedId) {
                    e.stopPropagation();
                    const { map: element, legend: elementInList } = markerElements[matchedId];
                    addHighlight(element, elementInList);
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
        return;
    }

    let lastTapTime = 0;
    let offsetX, offsetY;

    function updateOffsets() {
        const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        if (viewportWidth < 768) {
            offsetX = 58;
            offsetY = -250;
        } else {
            offsetX = 325;
            offsetY = -425;
        }
    }

    if (figure) {
        figure.style.setProperty('position', 'relative', 'important');
        figure.style.setProperty('overflow', 'hidden', 'important');
    }

    function positionLegendBase() {
        if (!legendSvg || !figure) return;
        updateOffsets();
        // Obere linke Ecke der Legende relativ zur Mitte der Figure
        const centerX = figure.offsetWidth / 2;
        const centerY = figure.offsetHeight / 2;
        legendSvg.style.position = 'absolute';
        legendSvg.style.left = (centerX + offsetX) + 'px';
        legendSvg.style.top = (centerY + offsetY) + 'px';
        legendSvg.style.right = 'auto';
        legendSvg.style.bottom = 'auto';
        gsap.set(legendSvg, { x: 0, y: 0 });
    }

    const stickyMargin = 20;
    let cachedFigRight = 0;
    let cachedBaseLeft = 0;

    function updateCache() {
        if (!figure || !legendSvg) return;
        positionLegendBase();
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

    const [draggable] = Draggable.create(mapContainer, {
        type: 'x',
        edgeResistance: 0.9,
        inertia: false,
        minimumMovement: 10,
        bounds: figure || undefined,
        cursor: 'grab',
        activeCursor: 'grabbing',
        onClick() {
            // WebKit-Bug: ein einzelner Touch kann auf SVG-Elementen
            // zwei onClick-Events auslösen. Debounce verhindert Toggle-Effekt.
            const now = Date.now();
            if (now - lastTapTime < 100) return;
            lastTapTime = now;

            const id = findMatchingId(this.pointerEvent.target);
            console.log('[map] onClick — id:', id, '| target:', this.pointerEvent.target);
            if (id) {
                const { map: element, legend: elementInList } = markerElements[id];
                addHighlight(element, elementInList);
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
