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

    // Zoom-Level aus data-Attribut lesen oder Standardwert verwenden
    const mapElement = document.getElementById('map-canvas');
    const zoomLevel = parseInt(mapElement.getAttribute('data-zoom')) || 17;

    // Map Style - Minimalistisches helles Design
    const mapStyle = [
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{"color": "#c1c1c1"}]
        },
        {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [{"color": "#f9f9f9"}]
        },
        {
            "featureType": "landscape.man_made",
            "elementType": "geometry",
            "stylers": [{"color": "#efefef"}]
        },
        {
            "featureType": "landscape.natural.terrain",
            "elementType": "geometry",
            "stylers": [{"color": "#eaeaea"}]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#e5e5e5"}]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{"color": "#cccccc"}]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#e5e5e5"}]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry.stroke",
            "stylers": [{"color": "#cccccc"}]
        },
        {
            "featureType": "road.local",
            "elementType": "geometry.fill",
            "stylers": [{"color": "#e5e5e5"}]
        },
        {
            "featureType": "road.local",
            "elementType": "geometry.stroke",
            "stylers": [{"color": "#cccccc"}]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [{"color": "#666666"}]
        },
        {
            "featureType": "poi.business",
            "elementType": "geometry",
            "stylers": [{"visibility": "on"}]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels",
            "stylers": [{"visibility": "on"}]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.icon",
            "stylers": [{"visibility": "on"}]
        },
        {
            "featureType": "poi.medical",
            "elementType": "labels",
            "stylers": [{"visibility": "on"}]
        },
        {
            "featureType": "poi.medical",
            "elementType": "labels.icon",
            "stylers": [{"visibility": "on"}]
        },
        {
            "featureType": "poi.school",
            "elementType": "labels",
            "stylers": [{"visibility": "on"}]
        },
        {
            "featureType": "poi.school",
            "elementType": "labels.icon",
            "stylers": [{"visibility": "on"}]
        },
        {
            "featureType": "poi.store",
            "elementType": "labels",
            "stylers": [{"visibility": "on"}]
        },
        {
            "featureType": "poi.store",
            "elementType": "labels.icon",
            "stylers": [{"visibility": "on"}]
        },
        {
            "featureType": "poi.sports_complex",
            "elementType": "geometry",
            "stylers": [{"visibility": "off"}]
        },
        {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [{"color": "#e5e5e5"}]
        }
    ];

    const map = new google.maps.Map(mapElement, {
        zoom: zoomLevel,
        center: { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lng) },
        styles: mapStyle,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: true,  // Ermöglicht 3D-Ansicht Rotation
        fullscreenControl: false,
        tilt: 45,  // 3D-Gebäudeansicht aktivieren
        mapId: null  // Standard Map für Gebäudeanzeige
    });

    // Explizit Gebäude-Layer aktivieren
    map.setTilt(45);

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
        // Zoom-Level beibehalten aus initMap

        // Case: Multiple markers.
    } else {
        map.fitBounds(bounds);
    }
}
