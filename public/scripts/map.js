
"use strict"


function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: {lat: 43.680, lng: -79.431}
  });
  const geocoder = new google.maps.Geocoder();

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
      let infowindow = new google.maps.InfoWindow;
      let latitude = event.latLng.lat();
      let longitude = event.latLng.lng();
      geocodeLatLng(geocoder, map, infowindow)

        function geocodeLatLng(geocoder, map, infowindow) {
        // var input = document.getElementById('latlng').value;
        // var latlngStr = input.split(',', 2);
        var latlng = {lat: latitude, lng: longitude};
        geocoder.geocode({'location': latlng}, function(results, status) {
          if (status === 'OK') {
            if (results[1]) {
              // map.setZoom(11);
              // var marker = new google.maps.Marker({
              //   position: latlng,
              //   map: map
              // });
              infowindow.setContent(results[1].formatted_address);
              infowindow.open(map, marker);
            } else {
              window.alert('No results found');
            }
          } else {
            window.alert('Geocoder failed due to: ' + status);
          }
        });
      }
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
