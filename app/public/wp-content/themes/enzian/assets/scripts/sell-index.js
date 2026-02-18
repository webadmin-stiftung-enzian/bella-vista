document.addEventListener('DOMContentLoaded', function () {
    console.log('Sell Index script loaded.');
    const table = document.querySelector('.sell-index-table');
    const svg = document.querySelector('.wp-block-enzian-sell-index svg #bella-vista');

    // Etagen-Hierarchie von unten nach oben
    const floors = ['EG', '1OG', '2OG', '3OG', 'DACH'];

    // Aktive Touch-Zeile für Toggle-Logik
    let activeTouchRowId = null;

    // Erkennt Touch/Pen-Eingabe direkt am Event (nicht am Gerät)
    function isTouchEvent(event) {
        return event.pointerType === 'touch' || event.pointerType === 'pen';
    }

    // Hilfsfunktion: Translate nur Etagen oberhalb der aktuellen
    function translateFloorsAbove(currentFloor) {
        const currentIndex = floors.indexOf(currentFloor);
        if (currentIndex === -1) return;

        const floorsAbove = floors.slice(currentIndex + 1);

        Array.from(svg.querySelectorAll(':scope > g[data-name]'))
            .filter(g => g.dataset.name && floorsAbove.some(floor => g.dataset.name.includes(floor)))
            .forEach(g => g.classList.add('translate'));
    }

    function clearHighlights(reason) {
        if (!svg) return;
        const highlighted = svg.querySelectorAll('.highlight');
        const translated = svg.querySelectorAll('.translate');
        console.log('[Sell Index] clearHighlights', {
            reason: reason || 'unspecified',
            highlightedCount: highlighted.length,
            translatedCount: translated.length
        });
        highlighted.forEach(el => el.classList.remove('highlight'));
        translated.forEach(el => el.classList.remove('translate'));
    }

    function highlightByRowId(rowId) {
        if (!svg) return false;

        const rowConfig = {
            'eg-1': { floor: 'EG', target: '#EG_Overlay_Shades_WG_1' },
            'eg-2': { floor: 'EG', target: '#EG_Overlay_Shades_WG_2' },
            'og1-3': { floor: '1OG', target: '#_1OG_Overlay_Shades_WG_3' },
            'og1-4': { floor: '1OG', target: '#_1OG_Overlay_Shades_WG_4' },
            'og2-5': { floor: '2OG', target: '#_2OG_Overlay_Shades_WG_5' },
            'og2-6': { floor: '2OG', target: '#_2OG_Overlay_Shades_WG_6' },
            'og3-7': { floor: '3OG', target: '#_3OG_Overlay_Shades_WG_7' }
        };

        const config = rowConfig[rowId];
        if (!config) {
            console.warn('[Sell Index] No row config for:', rowId);
            return false;
        }

        console.log('[Sell Index] highlightByRowId', { rowId, config });

        clearHighlights('before-highlight');
        translateFloorsAbove(config.floor);

        const target = svg.querySelector(config.target);
        if (target) {
            target.classList.add('highlight');
            console.log('[Sell Index] highlight added', {
                selector: config.target,
                id: target.id,
                classList: target.classList.toString(),
                totalHighlights: svg.querySelectorAll('.highlight').length
            });
            return true;
        } else {
            console.warn('[Sell Index] target not found for selector:', config.target);
            return false;
        }
    }

    if (table) {
        console.log('Sell Index table found.');
        const rows = table.querySelectorAll('tbody tr');

        rows.forEach(row => {
            // ── Maus-Hover: pointerenter mit pointerType === 'mouse' ──
            row.addEventListener('pointerenter', function (event) {
                if (event.pointerType !== 'mouse') return;
                activeTouchRowId = null; // Touch-State zurücksetzen
                console.log('[Sell Index] mouse hover:', this.id);
                highlightByRowId(this.id);
            });

            // ── Touch-Tap: pointerup mit pointerType === 'touch'/'pen' ──
            row.addEventListener('pointerup', function (event) {
                if (!isTouchEvent(event)) return;
                event.preventDefault();

                const rowId = this.id;
                console.log('[Sell Index] touch tap:', rowId, 'active:', activeTouchRowId);

                // Toggle: erneuter Tap auf gleiche Zeile → Effekt entfernen
                if (activeTouchRowId === rowId) {
                    clearHighlights('touch-toggle-off');
                    activeTouchRowId = null;
                    return;
                }

                // Neuen Highlight setzen
                const success = highlightByRowId(rowId);
                activeTouchRowId = success ? rowId : null;
            });

            // ── Click komplett unterdrücken (verhindert ungewollte Effekte) ──
            row.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                console.log('[Sell Index] click suppressed on row:', this.id);
            });
        });

        // ── Maus-Reset: pointerleave mit pointerType === 'mouse' ──
        table.addEventListener('pointerleave', function (event) {
            if (event.pointerType !== 'mouse') return;
            console.log('[Sell Index] mouse left table');
            clearHighlights('table-pointerleave');
        });

        // ── Touch-Reset: Tap außerhalb der Tabelle ──
        document.addEventListener('pointerdown', function (event) {
            if (!isTouchEvent(event)) return;
            if (!table.contains(event.target)) {
                console.log('[Sell Index] touch outside table');
                clearHighlights('touch-outside-table');
                activeTouchRowId = null;
            }
        });
    } else {
        console.log('Sell Index table not found.');
    }
});