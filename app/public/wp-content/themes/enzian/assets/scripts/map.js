console.log('Map script loaded');

// Warte auf DOM und Google Maps API
function waitForGoogleMaps(callback) {
    if (typeof google !== 'undefined' && google.maps) {
        callback();
    } else {
        setTimeout(() => waitForGoogleMaps(callback), 100);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // Prüfe ob Element existiert
    const mapElement = document.getElementById('map-canvas');
    
    if (!mapElement) {
        console.log('Map element not found on this page');
        return;
    }

    // Warte auf Daten und Google Maps
    if (typeof mapDataFromServer === 'undefined') {
        console.error('Map data not loaded');
        return;
    }

    waitForGoogleMaps(() => {
        console.log('Initializing map...');
        initMap();
    });
});

function initMap() {
    const data = mapDataFromServer.locations;

    if (!data || data.length === 0) {
        console.error('No location data available');
        return;
    }

    const map = new google.maps.Map(document.getElementById('map-canvas'), {
        zoom: 8,
        center: { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lng) }
    });

    map.markers = [];

    data.forEach(loc => {
        const marker = new google.maps.Marker({
            position: { lat: parseFloat(loc.lat), lng: parseFloat(loc.lng) },
            map: map,
            title: loc.title
        });
        map.markers.push(marker);
    });

    // Karte zentrieren basierend auf allen Markern
    centerMap(map);
}

function centerMap(map) {
    // Create map boundaries from all map markers.
    var bounds = new google.maps.LatLngBounds();
    map.markers.forEach(function (marker) {
        bounds.extend({
            lat: marker.position.lat(),
            lng: marker.position.lng()
        });
    });

    // Case: Single marker.
    if (map.markers.length == 1) {
        map.setCenter(bounds.getCenter());
        map.setZoom(12);

        // Case: Multiple markers.
    } else {
        map.fitBounds(bounds);
    }
}
