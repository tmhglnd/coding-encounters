// Coding Encounters
// A project that maps out creative coding encounters 
// in the real world.
//
// Submit a marker for a location where you encountered a
// cool event, venue, workshop, meetup or you name it.
//
// by Timo Hoogland (c) 2022, www.timohoogland.com

var map = L.map('map').setView([52.10064451596076, 5.083994183919435], 16);

// navigate to current location if allowed
map.locate({ setView: true, maxZoom: 16 });

// if location found show with accuracy radius
function onLocationFound(e) {
	var radius = e.accuracy;

	// L.circle(e.latlng, radius).bindPopup()
	// L.marker(e.latlng)
	L.popup()
	.setLatLng(e.latlng)
	.addTo(map)
	.setContent("Hi there! You are here<br><br>Click somewhere on the map to add a location where you had an encounter with coding :)<br><br>This could be in a venue during an event, a meetup place, a library, on the street, you name it!")
	.openPopup();
}
map.on('locationfound', onLocationFound);

// if location not found throw error
function onLocationError(e) {
	alert('Not allowed to get current your location');
}
map.on('locationerror', onLocationError);

// add the OpenStreetMap tiles
// L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
// 	maxZoom: 19,
// 	attribution: '© OpenStreetMap'
// }).addTo(map);

// dark map from stadiamaps.com
L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
	maxZoom: 19,
	attribution: '(c) <a href="https://stadiamaps.com/">Stadia Maps</a>, (c) <a href="https://openmaptiles.org/">OpenMapTiles</a> (c) <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);

// create a marker
function createMarker(obj){
	var m = L.marker(obj.geometry.coordinates).addTo(map);
	
	var div = document.createElement('div');
	
	var h = document.createElement('h2');
	h.innerHTML = obj.properties.name;
	
	var u = document.createElement('p');
	u.innerHTML = `<a href="http://${obj.properties.web}" target='_blank'>${obj.properties.web}</a>`;
	
	var d = document.createElement('p');
	d.innerHTML = obj.properties.description;
	
	var t = document.createElement('p');
	obj.properties.tags.forEach((tag) => {
		t.innerHTML += `#${tag} `;
	});
	
	div.appendChild(h).appendChild(u).appendChild(d).appendChild(t);
	m.bindPopup(div);
	return m;
}
// createMarker(geoJsonFeature);

// add a polygon
// var circle = L.circle([52.10064451596076, 5.083994183919435], {
// 	color: 'red',
// 	fillColor: '#f03',
// 	fillOpacity: 0.5,
// 	radius: 25
// }).addTo(map);

// click marker popup
// var popup = L.popup();

function onMapClick(e) {
	var popup = L.popup();
	var form = document.createElement('form');
	var n = document.createElement('input');
	var d = document.createElement('input');
	var t = document.createElement('input');
	var w = document.createElement('input');
	var s = document.createElement('input');

	// var explanation = document.createElement('p');
	// explanation.innerHTML = 'To create a marker at this location fill in all the info below, use the relevant categories and click submit';
	// form.appendChild(explanation);

	var fields = ['name', 'www', 'description'];
	
	for (var i=0; i<fields.length; i++){
		var p = document.createElement('p');
		var ip = document.createElement('input');
		var v = fields[i];
		ip.value = ip.name = v;
		if (v === 'submit'){ ip.type = v; }
		// p.appendChild(ip);
		form.appendChild(ip);
		form.appendChild(document.createElement('br'));
	}

	var categories = ['venue', 'event', 'workshop', 'meetup', 'exhibition', 'workspace', 'fablab', 'opencall', 'collaborate', 'education', 'audio', 'visual', 'audiovisual'];

	for (var i=0; i<categories.length; i++){
		// var p = document.createElement('p');
		var box = document.createElement('input');
		var label = document.createElement('label');
		box.type = 'checkbox';
		label.innerHTML = `${categories[i]}<br>`;
		// box.id = box.name = `tag${i}`;
		box.id = box.name = box.value = categories[i];
		// box.value = categories[i];
		form.appendChild(box);
		form.appendChild(label);
	}

	var submit = document.createElement('input');
	submit.type = submit.value = 'submit';
	form.appendChild(submit);

	form.addEventListener('submit', (event) => {
		event.preventDefault();

		var tags = [];
		categories.forEach((c) => {
			if (form.elements[c].checked){
				tags.push(c);
			}
		});
		// console.log(tags);

		var geoLoc = {
			"type": "Feature",
			"properties": {
				"name": form.elements['name'].value,
				"web": form.elements['www'].value,
				"amenity" : "",
				"description": form.elements['description'].value,
				"popupContent": "", 
				"tags": tags
			},
			"geometry": {
				"type": "Point",
				"coordinates": e.latlng,
			}
		}
		// console.log(geoLoc);
		createMarker(geoLoc);
		map.closePopup();
	});

	popup
	.setLatLng(e.latlng)
	.setContent(form)
	.openOn(map);
}
map.on('click', onMapClick);
