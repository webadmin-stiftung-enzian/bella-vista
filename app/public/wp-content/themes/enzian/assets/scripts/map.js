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
        // console.log('[map] removeAllHighlights — reason:', reason);
        mapContainer?.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
        legendContainer?.closest('svg')?.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
    }
    function addHighlight(element, elementInList) {
        const wasActive = element?.classList.contains('highlight') || elementInList?.classList.contains('highlight');
        // console.log('[map] addHighlight — wasActive:', wasActive, '| map:', element?.id, '| legend:', elementInList?.id);
        if (wasActive) {
            removeAllHighlights('toggle-off');
        } else {
            removeAllHighlights('before-set');
            if (element) element.classList.add('highlight');
            if (elementInList) elementInList.classList.add('highlight');
            // console.log('[map] highlight SET — map.highlight:', element?.classList.contains('highlight'), '| legend.highlight:', elementInList?.classList.contains('highlight'));
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
    // if (legendContainer) {
    //     const legendSvgRoot = legendContainer.closest('svg');
    //     if (legendSvgRoot) {
    //         legendSvgRoot.addEventListener('click', function (e) {
    //             const matchedId = findMatchingId(e.target);
    //             if (matchedId) {
    //                 e.stopPropagation();
    //                 handleMarkerClick(matchedId);
    //             }
    //         });
    //     }
    // }

    // Klick ins Dokument
    document.addEventListener('click', function (e) {
        // 1. Klicks auf die Legende abfangen
        const legendSvgRoot = legendContainer ? legendContainer.closest('svg') : null;
        if (legendSvgRoot?.contains(e.target)) {
            // console.log('[map] document click — inside legend, checking ID');
            const matchedId = findMatchingId(e.target);
            if (matchedId) handleMarkerClick(matchedId);
            return;
        }
        
        // 2. Klicks innerhalb der Karte hier ignorieren!
        // (Auf Touchgeräten verschluckt Draggable oft native Klicks, weshalb Desktop
        // hier anschlagen würde, Touch aber nicht. Wir überlassen deshalb alle Klicks
        // in der Karte dem Draggable.onClick Event.)
        if (mapContainer?.contains(e.target)) {
            // console.log('[map] document click — inside mapContainer, ignoring natively');
            return;
        }

        // console.log('[map] document click — outside, removing highlights | target:', e.target);
        removeAllHighlights('outside-click');
    });

    const figure = mapContainer ? mapContainer.parentElement : null;

    if (typeof Draggable === 'undefined' || !mapContainer) {
        // Fallback ohne Draggable: direkte Click-Listener auf Markern
        mapElements.forEach(id => {
            const { map: element } = markerElements[id];
            if (!element) return;
            element.addEventListener('click', () => handleMarkerClick(id));
        });
        return;
    }

    let lastClickTime = 0;

    var draggable = Draggable.create(mapContainer, {
        type: 'x',
        edgeResistance: 0.9,
        inertia: false,
        bounds: figure || undefined,
        cursor: 'grab',
        activeCursor: 'grabbing',
        zIndexBoost: false,
        onClick(e) {
            // GSAPs onClick ist für Touch+Maus optimiert (Tap-Detection).
            // console.log('[map] Draggable onClick fired');
            const matchedId = findMatchingId(e.target);
            if (matchedId) {
                handleMarkerClick(matchedId);
            } else {
                removeAllHighlights('map-background-click');
            }
        },
    });

    // Draggable setzt touch-action:none → blockiert nativen vertikalen Scroll.
    // pan-y erlaubt dem Browser vertikales Scrolling nativ, Draggable steuert nur x.
    mapContainer.style.touchAction = 'pan-y';
});
