const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
const myMap = L.map("map").setView([37.09, -95.71], 3);

// Add a Leaflet tile layer.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Create layer groups
const earthquake_data = L.layerGroup().addTo(myMap);
const tectonics = L.layerGroup().addTo(myMap);

// Fetch earthquake data
d3.json(url).then(function (data) {
    L.geoJson(data, {
        pointToLayer: function (feature, latlon) {
            return L.circleMarker(latlon).bindPopup(feature.id);
        },
        style: function (feature) {
            return {
                color: chooseColor(feature.geometry.coordinates[2]),
                radius: chooseRadius(feature.properties.mag),
                fillColor: chooseColor(feature.geometry.coordinates[2])
            };
        }
    }).addTo(earthquake_data);
});

// Fetch tectonic plate data
d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function (data) {
    L.geoJson(data, {
        color: "pink",
        weight: 8
    }).addTo(tectonics);
});

// Function to choose color based on depth
function chooseColor(depth) {
    if (depth <= 70) return "red";       // Shallow earthquakes (< 70 km)
    else if (depth <= 300) return "orange";  // Intermediate earthquakes (70 - 300 km)
    else return "green";                 // Deep earthquakes (> 300 km)
}


// Function to choose radius based on magnitude
function chooseRadius(magnitude) {
    return magnitude * 5;
}

// Define legend HTML with color-coded backgrounds
const legendHTML = `
    <h4>Depth Color Legend</h4>
    <div style="background-color:red; color: white; padding: 2px;">Shallow earthquakes (&lt; 70 km)</div>
    <div style="background-color:orange; color: white; padding: 2px;">Intermediate earthquakes (70 - 300 km)</div>
    <div style="background-color:green; color: white; padding: 2px;">Deep earthquakes (&gt; 300 km)</div>
`;

document.getElementById('legend').innerHTML = legendHTML;
