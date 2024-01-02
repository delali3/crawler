var map = L.map('map').setView([0, 0], 3);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

var redIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var characterIcon = L.divIcon({
    className: 'character-icon',
    iconSize: [30, 30],
    html: '<div id="character-marker" style="width: 30px; height: 30px; background-color: blue; border-radius: 50%;"></div>'
});

var characterMarker = null;
var currentIndex = 0;
var line = L.polyline([], { color: 'blue' }).addTo(map);

var isAnimating = false;

// Function to fetch location data from the server
function fetchLocationsFromBackend() {
    fetch('/get_locations')
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            locations_data = data;
            processLocations(locations_data);
        })
        .catch(function (error) {
            console.error('Error fetching data: ' + error);
        });
}

fetchLocationsFromBackend();

function processLocations(locations) {
    locations.forEach(function (location, index) {
        var marker = L.marker([location.latitude, location.longitude], { icon: redIcon }).addTo(map);
        marker.bindPopup(location.name);
        markers.push(marker);
        line.addLatLng([location.latitude, location.longitude]);
        marker.on('click', function () {
            if (isAnimating) {
                // If animation is in progress, stop it and move to the clicked marker
                isAnimating = false;
                characterMarker.setLatLng(marker.getLatLng());
            } else {
                moveCharacter(location.latitude, location.longitude, index);
            }
        });
    });
}

var markers = [];

function moveCharacter(latitude, longitude, index) {
    if (characterMarker) {
        isAnimating = true;
        var targetLatLng = L.latLng(latitude, longitude);
        var duration = 2000;

        var startTime = performance.now();
        var currentLatLng = characterMarker.getLatLng();

        function animate(time) {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const newLatLng = L.latLng(
                currentLatLng.lat + progress * (targetLatLng.lat - currentLatLng.lat),
                currentLatLng.lng + progress * (targetLatLng.lng - currentLatLng.lng)
            );

            characterMarker.setLatLng(newLatLng);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                currentIndex = index;
                isAnimating = false;
            }
        }

        requestAnimationFrame(animate);
    } else {
        createCharacter(latitude, longitude);
    }
}

function createCharacter(latitude, longitude) {
    characterMarker = L.marker([latitude, longitude], { icon: characterIcon }).addTo(map);
    currentIndex = markers.length; // Set the current index to the last marker
    moveCharacter(latitude, longitude, currentIndex);
}
