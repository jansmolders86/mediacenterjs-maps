var directionsDisplay;
var directionsService = new google.maps.DirectionsService();

function initialize() {
	var mapOptions = {
		zoom:7,
		center: new google.maps.LatLng(52.2, 5),
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    infoWindow = new google.maps.InfoWindow();
    geocoder = new google.maps.Geocoder();
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directions-panel'));
    insertMarker();
}

function insertMarker(){
    $.ajax({
        url: '/configuration/', 
        type: 'get'
    }).done(function(data){
        getLatLngBasedOnAddress(data);
    });
}

function openWindowInfo(){
    var html = '<div class="store-info">';
        html +='<h2>Your location</h2>';
        html +='</div>';
    infoWindow.setContent(html);
    infoWindow.open(map,this);
}


function getLatLngBasedOnAddress(data) {
    var markerIcon = '/maps/css/img/marker.png';
    var address = data.location;
    var bounds = new google.maps.LatLngBounds();
    geocoder.geocode({ 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var latLng = results[0].geometry.location;
            geoMarker = new google.maps.Marker({
                position: latLng,
                icon: markerIcon,
                map: map
            });
            bounds.extend(latLng);
            
            map.fitBounds(bounds);
            map.panToBounds(bounds);
            
            google.maps.event.addListener(geoMarker, 'click', openWindowInfo);
        }
    });
}

function calcRoute() {
console.log('calc')
    var start = document.getElementById('departure').value;
    var end = document.getElementById('arrival').value;
    var request = {
        origin:start,
        destination:end,
        travelMode: google.maps.TravelMode.DRIVING
    };
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
} 

google.maps.event.addDomListener(window, 'load', initialize);
