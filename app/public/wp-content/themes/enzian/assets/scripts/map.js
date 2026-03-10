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

    mapElements.forEach(id => {
        // Beide SVGs sind inline eingebettet und haben identische IDs –
        // deshalb werden die Elemente jeweils im richtigen Kontext gesucht.
        const element = mapContainer ? mapContainer.querySelector(`#${id}`) : null;
        const elementInList = legendContainer ? legendContainer.querySelector(`#${id}`) : null;

        console.log(`[map] Element "${id}" — map:`, !!element, '| legend:', !!elementInList);

        if (element) {
            const handler = function (e) {
                e.preventDefault();
                console.log(`[map] handler fired for "${id}" — event: ${e.type}, target:`, e.target);
                addHighlight(element, elementInList);
            };
            element.addEventListener('click', handler);
            element.addEventListener('touchstart', handler);
        }
    });

    // Event-Delegation auf dem gesamten Legenden-SVG:
    // Fängt auch Clicks auf dem <rect>-Hintergrund ab und ordnet sie
    // dem nächsten passenden <g>-Element zu.
    if (legendContainer) {
        const legendSvgRoot = legendContainer.closest('svg');
        if (legendSvgRoot) {
            function legendHandler(e) {
                // Zuerst prüfen, ob der Click direkt auf ein Element mit matchender ID ging
                let matchedId = findMatchingAncestor(e.target, legendSvgRoot);

                // Falls nicht (z.B. Click auf <rect>-Hintergrund), nächstes Element per Koordinaten finden
                if (!matchedId) {
                    const point = legendSvgRoot.createSVGPoint();
                    point.x = e.clientX;
                    point.y = e.clientY;
                    // Alle Elemente an dieser Stelle prüfen
                    for (const id of mapElements) {
                        const g = legendContainer.querySelector(`#${id}`);
                        if (!g) continue;
                        const bbox = g.getBBox();
                        const ctm = g.getCTM();
                        if (!ctm) continue;
                        const inv = legendSvgRoot.getScreenCTM().inverse();
                        const svgPoint = point.matrixTransform(inv);
                        // getCTM gibt die Transformation relativ zum SVG-Root
                        const localPoint = svgPoint.matrixTransform(ctm.inverse().multiply(legendSvgRoot.getCTM()));
                        if (localPoint.x >= bbox.x && localPoint.x <= bbox.x + bbox.width &&
                            localPoint.y >= bbox.y && localPoint.y <= bbox.y + bbox.height) {
                            matchedId = id;
                            break;
                        }
                    }
                }

                if (matchedId) {
                    e.preventDefault();
                    e.stopPropagation();
                    const element = mapContainer ? mapContainer.querySelector(`#${matchedId}`) : null;
                    const elementInList = legendContainer.querySelector(`#${matchedId}`);
                    console.log(`[map] legend delegation matched "${matchedId}"`);
                    addHighlight(element, elementInList);
                }
            }
            legendSvgRoot.addEventListener('click', legendHandler);
            legendSvgRoot.addEventListener('touchstart', legendHandler);
        }
    }

    // Optional: Highlights entfernen bei Klick außerhalb
    document.addEventListener('click', function (e) {
        // Prüfe ob Click innerhalb der Legende oder Map war
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

    // Debug: Capture-Phase Listener auf Legenden-SVG und Document
    if (legendSvg) {
        legendSvg.addEventListener('click', function (e) {
            console.log('[map] legendSvg click (bubble) — target:', e.target, 'id:', e.target.id, 'pointer-events:', getComputedStyle(e.target).pointerEvents);
        });
        legendSvg.addEventListener('click', function (e) {
            console.log('[map] legendSvg click (CAPTURE) — target:', e.target);
        }, true);
        console.log('[map] legendSvg found:', legendSvg, '| pointer-events:', getComputedStyle(legendSvg).pointerEvents);
    } else {
        console.warn('[map] legendSvg NOT FOUND');
    }
    if (legendContainer) {
        console.log('[map] legendContainer pointer-events:', getComputedStyle(legendContainer).pointerEvents);
    }

    if (typeof Draggable === 'undefined' || !mapContainer) {
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
        bounds: figure || undefined,
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
