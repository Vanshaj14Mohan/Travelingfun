mapboxgl.accessToken = mapToken;

    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style:"mapbox://styles/mapbox/streets-v12",
        center: listing.geometry.coordinates, // starting position [longitude, latitude]
        zoom: 9 // starting zoom it can start from 1- any no 10
    });

    const marker1 = new mapboxgl.Marker({ color: 'red'})
    .setLngLat(listing.geometry.coordinates) //listing.geometry.coordinates
    .setPopup(new mapboxgl.Popup({offset: 25})
    .setHTML(`<h4>${listing.title}</h4><p>Exact Location provided after booking</p>`)) //listing.location or title we can choose
    .addTo(map);
