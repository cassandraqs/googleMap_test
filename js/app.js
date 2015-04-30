function initialize() {
	var mapOptions = {
		zoom: 8,
		center: new google.maps.LatLng(-34.397, 150.644)
	};
	var markers = [];
	var map = new google.maps.Map(document.getElementById('mapCanvas'), mapOptions);
	var input = document.getElementById('pac-input');
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

	var searchBox = new google.maps.places.SearchBox(input);
	google.maps.event.addListener(searchBox, 'places_changed', function() {
		var places = searchBox.getPlaces();
		if (places.length === 0) {
			return;
		}
		var placeList = function(placeItem) {
			console.log(placeItem.name);
			this.name = ko.oberservable(placeItem.name);
			this.address = ko.oberservable(placeItem.formatted_address);
			this.hours = ko.oberservable(placeItem.opening_hours);
			this.rating = ko.oberservable(placeItem.rating);
		};

		var ViewModel = function() {
			var self = this;
			this.displayPlaces = ko.observableArray([]);
			places.forEach(function(placeItem) {
				self.displayPlaces.push(new placeList(placeItem));
			});
			console.log(this.places[0]);
		};
		ViewModel();
		for (var i = 0, marker; marker = markers[i]; i++) {
			marker.setMap(null);
		}
		markers = [];
		var bounds = new google.maps.LatLngBounds();
		for (var i = 0, place; place = places[i]; i++) {
			var image = {
				url: place.icon,
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(25, 25)
			};

			// Create a marker for each place.
			var marker = new google.maps.Marker({
				index: i,
				map: map,
				icon: image,
				title: place.name,
				position: place.geometry.location
			});

			markers.push(marker);
			bounds.extend(place.geometry.location);
			var infowindow = new google.maps.InfoWindow();
			google.maps.event.addListener(marker, 'click', function() {
				var info = places[this.index];
				console.log(info);
				infowindow.setContent(info.formatted_address);
				infowindow.open(map, this);
			});

			//Model for searched places 

			map.fitBounds(bounds);
		};
	});

	// Bias the SearchBox results towards places that are within the bounds of the
	// current map's viewport.
	google.maps.event.addListener(map, 'bounds_changed', function() {
		var bounds = map.getBounds();
		searchBox.setBounds(bounds);
	});


};
google.maps.event.addDomListener(window, 'load', function() {
	initialize();
	ko.applyBindings(new ViewModel());
});



	