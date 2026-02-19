console.log('Map script loaded');

if (typeof gsap !== 'undefined' && typeof Draggable !== 'undefined') {
    gsap.registerPlugin(Draggable);
} else {
    console.error('GSAP oder Draggable ist nicht verfügbar.');
}

document.addEventListener('DOMContentLoaded', function () {
    const mapContainer = document.querySelector('[data-name="Ebene 1"], svg#Ebene_1');
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
        const element = document.getElementById(id);
        const elementInList = document.querySelector(`g[data-name="${id}"]`);

        if (element && elementInList) {
            // Click-Event für beide Elemente
            element.addEventListener('click', function (e) {
                e.preventDefault();
                addHighlight(element, elementInList);
            });

            elementInList.addEventListener('click', function (e) {
                e.preventDefault();
                addHighlight(element, elementInList);
            });

            // Touch-Event für mobile Geräte
            element.addEventListener('touchstart', function (e) {
                e.preventDefault();
                addHighlight(element, elementInList);
            });

            elementInList.addEventListener('touchstart', function (e) {
                e.preventDefault();
                addHighlight(element, elementInList);
            });
        }
    });

    // Optional: Highlights entfernen bei Klick außerhalb
    document.addEventListener('click', function (e) {
        const isMapElement = mapElements.some(id => {
            const element = document.getElementById(id);
            const elementInList = document.querySelector(`g[data-name="${id}"]`);
            return element?.contains(e.target) || elementInList?.contains(e.target);
        });

        if (!isMapElement) {
            removeAllHighlights();
        }
    });

    if (typeof Draggable === 'undefined' || !mapContainer) {
        return;
    } else {
        const boundsElement = mapContainer.closest('.pan-wrapper') || mapContainer.parentElement;

        const draggableOptions = {
            type: "x",
            edgeResistance: 0.9,
            inertia: true
        };

        if (boundsElement) {
            draggableOptions.bounds = boundsElement;
        }

        Draggable.create(mapContainer, draggableOptions);
    }   
});
