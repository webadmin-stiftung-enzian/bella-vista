document.addEventListener('DOMContentLoaded', function () {
    console.log('Sell Index script loaded.');
    const table = document.querySelector('.sell-index-table');
    const svg = document.querySelector('.wp-block-enzian-sell-index svg #bella-vista');

    // Etagen-Hierarchie von unten nach oben
    const floors = ['EG', '1OG', '2OG', '3OG', 'DACH'];

    // Hilfsfunktion: Translate nur Etagen oberhalb der aktuellen
    function translateFloorsAbove(currentFloor) {
        const currentIndex = floors.indexOf(currentFloor);
        if (currentIndex === -1) return;
        
        const floorsAbove = floors.slice(currentIndex + 1);
        
        Array.from(svg.querySelectorAll(':scope > g[data-name]'))
            .filter(g => g.dataset.name && floorsAbove.some(floor => g.dataset.name.includes(floor)))
            .forEach(g => g.classList.add('translate'));
    }

    if (table) {
        console.log('Sell Index table found.');
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            row.addEventListener('mouseover', function () {
                console.log('Row hovered:', this);
                if (this.id === 'eg-1') {
                    if (svg) {
                        console.log('Highlighting EG-1');
                        const highlighted = svg.querySelectorAll('.highlight');
                        const translated = svg.querySelectorAll('.translate');
                        highlighted.forEach(el => el.classList.remove('highlight'));
                        translated.forEach(el => el.classList.remove('translate')); 
                        translateFloorsAbove('EG');
                        svg.querySelector('#EG_Overlay_Shades_WG_1').classList.add('highlight');
                    }
                } else if (this.id === 'eg-2') {
                    if (svg) {
                        console.log('Highlighting EG-2');
                        const highlighted = svg.querySelectorAll('.highlight');
                        const translated = svg.querySelectorAll('.translate');
                        highlighted.forEach(el => el.classList.remove('highlight'));
                        translated.forEach(el => el.classList.remove('translate')); 
                        translateFloorsAbove('EG');
                        svg.querySelector('#EG_Overlay_Shades_WG_2').classList.add('highlight');
                    }
                } else if (this.id === 'og1-3') {
                    if (svg) {
                        console.log('Highlighting OG1-3');
                        const highlighted = svg.querySelectorAll('.highlight');
                        const translated = svg.querySelectorAll('.translate');
                        highlighted.forEach(el => el.classList.remove('highlight'));
                        translated.forEach(el => el.classList.remove('translate')); 
                        translateFloorsAbove('1OG');
                        svg.querySelector('#_1OG_Overlay_Shades_WG_3').classList.add('highlight');
                    }
                } else if (this.id === 'og1-4') {
                    if (svg) {
                        console.log('Highlighting OG1-4');
                        const highlighted = svg.querySelectorAll('.highlight');
                        const translated = svg.querySelectorAll('.translate');
                        highlighted.forEach(el => el.classList.remove('highlight'));
                        translated.forEach(el => el.classList.remove('translate')); 
                        translateFloorsAbove('1OG');
                        svg.querySelector('#_1OG_Overlay_Shades_WG_4').classList.add('highlight');
                    }
                } else if (this.id === 'og2-5') {
                    if (svg) {
                        console.log('Highlighting OG2-5');
                        const highlighted = svg.querySelectorAll('.highlight');
                        const translated = svg.querySelectorAll('.translate');
                        highlighted.forEach(el => el.classList.remove('highlight'));
                        translated.forEach(el => el.classList.remove('translate')); 
                        translateFloorsAbove('2OG');
                        svg.querySelector('#_2OG_Overlay_Shades_WG_5').classList.add('highlight');
                    }
                } else if (this.id === 'og2-6') {
                    if (svg) {
                        console.log('Highlighting OG2-6');
                        const highlighted = svg.querySelectorAll('.highlight');
                        const translated = svg.querySelectorAll('.translate');
                        highlighted.forEach(el => el.classList.remove('highlight'));
                        translated.forEach(el => el.classList.remove('translate')); 
                        translateFloorsAbove('2OG');
                        svg.querySelector('#_2OG_Overlay_Shades_WG_6').classList.add('highlight');
                    }
                } else if (this.id === 'og3-7') {
                    if (svg) {
                        console.log('Highlighting OG3-7');
                        const highlighted = svg.querySelectorAll('.highlight');
                        const translated = svg.querySelectorAll('.translate');
                        highlighted.forEach(el => el.classList.remove('highlight'));
                        translated.forEach(el => el.classList.remove('translate')); 
                        translateFloorsAbove('3OG');
                        svg.querySelector('#_3OG_Overlay_Shades_WG_7').classList.add('highlight');
                    }
                }
            });
        });

        // Reset wenn Maus die Tabelle verlässt
        table.addEventListener('mouseleave', function () {
            console.log('Mouse left the table.');
            if (svg) {
                const highlighted = svg.querySelectorAll('.highlight');
                const translated = svg.querySelectorAll('.translate');
                highlighted.forEach(el => el.classList.remove('highlight'));
                translated.forEach(el => el.classList.remove('translate'));
            }
        });
        // Additional JavaScript functionality can be added here
    } else {
        console.log('Sell Index table not found.');
    }
});