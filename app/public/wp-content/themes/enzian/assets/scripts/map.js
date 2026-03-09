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

    mapElements.forEach(id => {
        // Beide SVGs sind inline eingebettet und haben identische IDs –
        // deshalb werden die Elemente jeweils im richtigen Kontext gesucht.
        const element = mapContainer ? mapContainer.querySelector(`#${id}`) : null;
        const elementInList = legendContainer ? legendContainer.querySelector(`#${id}`) : null;

        if (element || elementInList) {
            const handler = function (e) {
                e.preventDefault();
                console.log(`Clicked on ${id}`);
                addHighlight(element, elementInList);
            };

            if (element) {
                element.addEventListener('click', handler);
                element.addEventListener('touchstart', handler);
            }

            if (elementInList) {

                elementInList.addEventListener('click', handler);
                elementInList.addEventListener('touchstart', handler);
            }
        }
    });

    // Optional: Highlights entfernen bei Klick außerhalb
    document.addEventListener('click', function (e) {
        const isMapElement = mapElements.some(id => {
            const element = mapContainer ? mapContainer.querySelector(`#${id}`) : null;
            const elementInList = legendContainer ? legendContainer.querySelector(`#${id}`) : null;
            return element?.contains(e.target) || elementInList?.contains(e.target);
        });

        if (!isMapElement) {
            removeAllHighlights();
        }
    });

    const figure = mapContainer ? mapContainer.parentElement : null;
    const legendSvg = figure ? figure.querySelector('svg:not(#Ebene_1)') : null;

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
            offsetX = 275;
            offsetY = -350;
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
    }

    function updateLegend(mapX) {
        if (!legendSvg) return;
        // Die Legende bewegt sich mit der Karte (mapX),
        // klebt aber am rechten Viewport-Rand fest (Math.min).
        const legendWidth = legendSvg.offsetWidth;
        const maxX = window.innerWidth - stickyMargin - cachedFigRight - cachedBaseLeft - legendWidth;
        gsap.set(legendSvg, { x: Math.min(mapX, maxX) });
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

    updateCache();
    updateLegend(0);

    window.addEventListener('resize', () => {
        updateCache();
        updateLegend(draggable ? draggable.x : 0);
    });
});
