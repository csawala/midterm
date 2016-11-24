
"use strict"


function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: {lat: -34.397, lng: 150.644}
  });
  var geocoder = new google.maps.Geocoder();

  $('#submit').on('click', function() {
    geocodeAddress(geocoder, map);
  });
}

function geocodeAddress(geocoder, resultsMap) {
  var address = $('#address').val();
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === 'OK') {
      resultsMap.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      });
      const coordinates = { lat: results[0].geometry.location.lat(),
        lng: results[0].geometry.location.lng()}
      $.ajax({
        url: "/api/maps/map",
        method: "POST",
        data: coordinates,
        success: () => {
          console.log("Ajax came thru")},
        error: (err) => {
          console.log("this is the error:", err)
        }
      })
    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}
