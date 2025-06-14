/* eslint-disable */


const locations =JSON.parse(document.getElementById('map').dataset.locations);

console.log(locations);

// mapboxgl.workerClass = MapboxWorker; 
mapboxgl.accessToken = 'pk.eyJ1IjoiYnVnaHVudGVyeCIsImEiOiJjbWJqNGZ4bzEwYnJwMmtxeDZyeWhtcnl0In0.yMs6F5ra9AojeBrm9AKooA';
var map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/bughunterx/cmajpdatw010801qyfr2rdj9h',
    scrollZoom: false,
    // center: [-118.113491, 34.111745], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    // zoom: 10 // starting zoom
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
    // Create marker 
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom',
    }).setLngLat(loc.coordinates).addTo(map);
    // Add popup
    new mapboxgl.Popup({
        offset: 30
    })
        .setLngLat(loc.coordinates)
        .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
        .addTo(map);
    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
});

map.fitBounds(bounds,{
    padding:{
        top: 200,
        bottom: 150,
        left: 100,
        right: 100
    }
});