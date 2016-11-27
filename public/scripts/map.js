
"use strict"
let tempMarkers = []
let userMarkers = []


function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 8,
    center: {lat: 43.680, lng: -79.431}
  });

  map.setOptions({draggableCursor:'crosshair'});

  const geocoder = new google.maps.Geocoder();


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
const onClickMarker = () => {
  google.maps.event.addListener(map, 'click', function(event) {
    // map.setCenter(event.latLng)

    let longitude = event.latLng.lng();
    let latitude = event.latLng.lat();

    function addMarker(location) {
      let tempMarker = new google.maps.Marker({
          position: location,
          map: map,
          title: "Temporary Marker",
          description: "temporary description"
        });
      tempMarkers.push(tempMarker);
      console.log("this is the position from the marker:", tempMarker.description)
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
      $("#latitude").val(latitude)
      $("#longitude").val(longitude)
      $("#address").val(address)

    })

    markerWindow(tempMarkers)
  })
}

  onClickMarker()




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


///beyond this point, everything is out of the mapinit functio//

const saveMarker = () => {
  $("#save-form").on('submit', function(event) {
    event.preventDefault()

    const lat = $("#latitude").val()
    const lng = $("#longitude").val()
    const title = $("#title").val()
    const description = $("#description").val()

    const marker = {lat, lng, title, description}
    console.log("that's the marker:", marker)

    $.ajax({
        url: "/api/maps/marker",
        method: "POST",
        data: marker
      }).then(getMarkers())
        .catch("error on ajax")
      })
}

const getMarkers = () => {
  $.get("/api/maps/markers", function(data) {
    console.log("get request made")
    // clearUserMarkers()
    buildUserMarkers(data)
    setUserMarkers(map)
    console.log("this is the data from get request:", data)
  })
}

const buildUserMarkers = (rawMarkersData) => {
  rawMarkersData.forEach(function(markerData) {
    const location = new google.maps.LatLng({lat: markerData.st_x, lng: markerData.st_y})
    const title = markerData.title
    //description should probably only be used in the window info
    let userMarker = new google.maps.Marker({
          position: location,
          map: map,
          title: title
        });
      userMarkers.push(userMarker);
  })
}

const setUserMarkers = (map) => {
  userMarkers.forEach(function(marker) {
    marker.setMap(map)
    userMarkersWindow(marker)
  })
}

const clearUserMarkers = () => {
   setUserMarkers(null);
}

const userMarkersWindow = (marker) => {
  // markers.forEach(function (marker) {
  //   if (markers.length === 0) {
  //     return
  //   }

    google.maps.event.addListener(marker, "click", function (event) {
      let infowindow = new google.maps.InfoWindow;
      let latitude = marker.position.lat();
      console.log("latitude in window:", latitude)
      let longitude = marker.position.lng();
      console.log("longitude in window:", longitude)

      getAddress(latitude, longitude, (address) => {
        console.log("this is the address in the marker window:", address)
        infowindow.setContent(address);
        infowindow.open(map, marker);
        // Center of map
      map.panTo(new google.maps.LatLng(latitude,longitude));
    });
  })
}

saveMarker()
setUserMarkers()
}


// $(()=>{
// saveMarker()
// })

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
