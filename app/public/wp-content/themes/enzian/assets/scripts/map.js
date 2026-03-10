console.log('Map script loaded');

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
    function removeAllHighlights() {
        document.querySelectorAll('.highlight').forEach(el => {
            el.classList.remove('highlight');
        });
    }
    // Funktion zum Hinzufügen von Highlight
    function addHighlight(element, elementInList) {
        // Prüfe ob bereits aktiv - wenn ja, entferne alle Highlights
        if (element?.classList.contains('highlight') || elementInList?.classList.contains('highlight')) {
            removeAllHighlights();
        } else {
            removeAllHighlights();
            if (element) element.classList.add('highlight');
            if (elementInList) elementInList.classList.add('highlight');
        }
    }

    console.log('[map] mapContainer:', mapContainer);
    console.log('[map] legendContainer:', legendContainer);

    // Hilfsfunktion: Vom Click-Target nach oben gehen und prüfen, ob ein
    // Vorfahre eine der gesuchten IDs hat (innerhalb eines Containers).
    function findMatchingAncestor(target, container) {
        let el = target;
        while (el && el !== container) {
            if (el.id && mapElements.includes(el.id)) return el.id;
            el = el.parentElement;
        }   
        return null;
    }

    // --- Transparente Hit-Areas für Legenden-Gruppen ---
    // fill="transparent" fängt Pointer-Events ab (fill="none" nicht!).
    if (legendContainer) {
        mapElements.forEach(id => {
            const g = legendContainer.querySelector(`#${id}`);
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

    // --- Map: Tap/Click auf Marker ---
    function handleMapTap(target) {
        const matchedId = findMatchingAncestor(target, mapContainer);
        if (!matchedId) return;
        const element = mapContainer.querySelector(`#${matchedId}`);
        const elementInList = legendContainer ? legendContainer.querySelector(`#${matchedId}`) : null;
        addHighlight(element, elementInList);
    }

    // --- Legenden-Delegation (einfacher Click dank Hit-Areas) ---
    if (legendContainer) {
        const legendSvgRoot = legendContainer.closest('svg');
        if (legendSvgRoot) {
            // touchend + click Debounce: touchend feuert zuerst,
            // sperrt danach den folgenden synthetischen click.
            let legendTouchHandled = false;

            legendSvgRoot.addEventListener('touchend', function (e) {
                const matchedId = findMatchingAncestor(e.target, legendSvgRoot);
                if (matchedId) {
                    e.preventDefault();
                    legendTouchHandled = true;
                    setTimeout(() => { legendTouchHandled = false; }, 400);
                    const element = mapContainer ? mapContainer.querySelector(`#${matchedId}`) : null;
                    const elementInList = legendContainer.querySelector(`#${matchedId}`);
                    addHighlight(element, elementInList);
                }
            });

            legendSvgRoot.addEventListener('click', function (e) {
                if (legendTouchHandled) return;
                const matchedId = findMatchingAncestor(e.target, legendSvgRoot);
                if (matchedId) {
                    e.stopPropagation();
                    const element = mapContainer ? mapContainer.querySelector(`#${matchedId}`) : null;
                    const elementInList = legendContainer.querySelector(`#${matchedId}`);
                    addHighlight(element, elementInList);
                }
            });
        }
    }

    // Highlights entfernen bei Klick außerhalb
    document.addEventListener('click', function (e) {
        const legendSvgRoot = legendContainer ? legendContainer.closest('svg') : null;
        if (legendSvgRoot && legendSvgRoot.contains(e.target)) return;

        const isMapElement = mapElements.some(id => {
            const element = mapContainer ? mapContainer.querySelector(`#${id}`) : null;
            return element?.contains(e.target);
        });

        if (!isMapElement) {
            removeAllHighlights();
        }
    });

    const figure = mapContainer ? mapContainer.parentElement : null;
    const legendSvg = figure ? figure.querySelector('svg:not(#Ebene_1)') : null;

    if (typeof Draggable === 'undefined' || !mapContainer) {
        // Fallback ohne Draggable: normaler Click-Listener
        if (mapContainer) {
            mapContainer.addEventListener('click', function (e) {
                handleMapTap(e.target);
            });
        }
        return;
    }


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
        console.log('[map] positionLegendBase — figure:', figure.offsetWidth, 'x', figure.offsetHeight, '| offsets:', offsetX, offsetY, '| left:', centerX + offsetX, 'top:', centerY + offsetY);

        legendSvg.style.position = 'absolute';
        legendSvg.style.left = (centerX + offsetX) + 'px';
        legendSvg.style.top = (centerY + offsetY) + 'px';
        legendSvg.style.right = 'auto';
        legendSvg.style.bottom = 'auto';
        gsap.set(legendSvg, { x: 0, y: 0 }); // Reset transforms für Basis-Berechnung
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
        console.log('[map] updateCache — figRect.right:', cachedFigRight, '| baseLeft:', cachedBaseLeft, '| legendRect:', legendRect.left, legendRect.width);
    }

    function updateLegend(mapX) {
        if (!legendSvg) return;
        // Die Legende bewegt sich mit der Karte (mapX),
        // klebt aber am rechten Viewport-Rand fest (Math.min).
        const legendWidth = legendSvg.offsetWidth;
        const maxX = window.innerWidth - stickyMargin - cachedFigRight - cachedBaseLeft - legendWidth;
        const finalX = Math.min(mapX, maxX);
        console.log('[map] updateLegend — mapX:', mapX, '| maxX:', maxX, '| finalX:', finalX, '| legendWidth:', legendWidth, '| viewport:', window.innerWidth);
        gsap.set(legendSvg, { x: finalX });
    }

    const [draggable] = Draggable.create(mapContainer, {
        type: 'x',
        edgeResistance: 0.9,
        inertia: true,
        minimumMovement: 10,
        bounds: figure || undefined,
        onClick() {
            handleMapTap(this.pointerEvent.target);
        },
        onDrag() { updateLegend(this.x); },
        onThrowUpdate() { updateLegend(this.x); },
        onThrowComplete() { updateLegend(this.x); },
    });

    window.addEventListener('load', () => {
        console.log('[map] window.load fired');
        requestAnimationFrame(() => {
            console.log('[map] rAF after load');
            updateCache();
            updateLegend(0);
        });
    });

    window.addEventListener('resize', () => {
        updateCache();
        updateLegend(draggable ? draggable.x : 0);
    });
});
