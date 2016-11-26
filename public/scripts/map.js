
"use strict"


function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: {lat: 43.680, lng: -79.431}
  });

  map.setOptions({draggableCursor:'crosshair'});

  const geocoder = new google.maps.Geocoder();
  let tempMarkers = []
  let userMarkers = []

  // $('#location').on('click', function() {
  //   geocodeAddress(geocoder, map);
  // });

  $('#locate').on('click', function() {
    getToAddress(geocoder, map);
  });

   const getAddress = function (latitude, longitude, cb) {
    let latlng = {lat: latitude, lng: longitude};

    geocoder.geocode({'location': latlng}, function(results, status) {
      if (status === 'OK') {
        if (results[1]) {
          cb(results[1].formatted_address)

        } else {
          return ""
        }
      }
    });
  }

  // {
  //   adddress: "sdvsdvsd",
  //   gmap_marker_data: {
  //     position: {
  //       lat: 3234,
  //       lng: 2343
  //     }
  //   }
  //   description: "sdfsdf sdfs dsd fsd fsd f"
  // }

  google.maps.event.addListener(map, 'click', function(event) {
    // map.setCenter(event.latLng)

    let longitude = event.latLng.lng();
    let latitude = event.latLng.lat();

    function addMarker(location) {
      let marker = new google.maps.Marker({
          position: location,
          map: map
        });
      console.log(marker)
      console.log("location:", location)
      tempMarkers.push(marker);
    }
    function setMapOnAll(map) {
      for (var i = 0; i < tempMarkers.length; i++) {
        tempMarkers[i].setMap(map);
      }
    }

    function clearMarkers() {
      setMapOnAll(null);
    }

    function deleteMarkers() {
      clearMarkers();
      tempMarkers = [];
    }

    deleteMarkers()
    addMarker(event.latLng)

    getAddress(latitude, longitude, function(address) {
      console.log(address)
      $(".panel-body .form-group input").val(address)
    })

    markerWindow(tempMarkers)
  })

  // const markerForm = (map) => {

  //   google.maps.event.addListener(map, 'click', function(event) {
  //   map.setCenter(event.latLng)

  //   let latitude = event.latLng.lat();
  //   let longitude = event.latLng.lng();

  //   $(".marker-form #adress").html(latitude)
  // }
  // markerForm(map)

  function markerWindow (markers) {
    markers.forEach(function (marker) {
      if (markers.length === 0) {
        return
      }

      google.maps.event.addListener(marker, "click", function (event) {
      let infowindow = new google.maps.InfoWindow;
      let latitude = event.latLng.lat();
      let longitude = event.latLng.lng();
      geocodeLatLng(geocoder, map, infowindow)

      function geocodeLatLng(geocoder, map, infowindow) {
        let latlng = {lat: latitude, lng: longitude};
        geocoder.geocode({'location': latlng}, function(results, status) {
          if (status === 'OK') {
            if (results[1]) {
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
      // Center of map
      map.panTo(new google.maps.LatLng(latitude,longitude));
    });
    })
  }

//   google.maps.event.addListener(map, 'click', function(event) {
//     placeMarker(event.latLng);
// });
}
// function getToAddress(geocoder, resultsMap) {
//   var address = $('#location').val();
//   geocoder.geocode({'address': address}, function(results, status) {
//     if (status === 'OK') {
//       resultsMap.setCenter(results[0].geometry.location);
//     }
//   })
// }

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
