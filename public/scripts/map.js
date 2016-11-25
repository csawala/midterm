
"use strict"


function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: {lat: 43.680, lng: -79.431}
  });
  var geocoder = new google.maps.Geocoder();

  // $('#location').on('click', function() {
  //   geocodeAddress(geocoder, map);
  // });

  $('#locate').on('click', function() {
    getToAddress(geocoder, map);
  });

  google.maps.event.addListener(map, 'click', function(event) {
    map.setCenter(event.latLng)
  })

  google.maps.event.addListener(map, 'click', function(event) {
   let marker = new google.maps.Marker({
          map: map,
          position: event.latLng,
          title : "Insert title here"
        });
    google.maps.event.addListener(marker, "click", function (event) {
      let latitude = event.latLng.lat();
      let longitude = event.latLng.lng();
      console.log( latitude + ', ' + longitude );
      //$(.marker-form).slidetoggle

      // Center of map
      map.panTo(new google.maps.LatLng(latitude,longitude));

});

    // alert(event.latLng);
  })


//   google.maps.event.addListener(map, 'click', function(event) {
//     placeMarker(event.latLng);
// });
}
function getToAddress(geocoder, resultsMap) {
  var address = $('#location').val();
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === 'OK') {
      resultsMap.setCenter(results[0].geometry.location);
    }
  })
}

// function geocodeAddress(geocoder, resultsMap) {
//   var address = $('#address').val();
//   geocoder.geocode({'address': address}, function(results, status) {
//     if (status === 'OK') {
//       resultsMap.setCenter(results[0].geometry.location);
//       // var marker = new google.maps.Marker({
//       //   map: resultsMap,
//       //   position: results[0].geometry.location
//       // });
//       const coordinates = { lat: results[0].geometry.location.lat(),
//         lng: results[0].geometry.location.lng()}
//       $.ajax({
//         url: "/api/maps/map",
//         method: "POST",
//         data: coordinates,
//         success: () => {
//           console.log("Ajax came thru")},
//         error: (err) => {
//           console.log("this is the error:", err)
//         }
//       })
//     } else {
//       alert('Geocode was not successful for the following reason: ' + status);
//     }
//   });
// }
