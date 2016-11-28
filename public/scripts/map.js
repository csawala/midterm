
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


///beyond this point, everything is out of the mapinit functio//
const clearForm = (elements) => {
  elements.forEach(function($element) {
    $element.val("");
  })
}

const saveMarker = () => {
  $("#save-form").on('submit', function(event) {
    event.preventDefault()

    const $lat = $("#latitude");
    const $lng = $("#longitude");
    const $title = $("#title");
    const $description = $("#description");
    const $address = $("#address");

    const lat = $("#latitude").val();
    const lng = $("#longitude").val();
    const title = $("#title").val();
    const description = $("#description").val();

    const marker = {lat, lng, title, description};

    $.ajax({
        url: "/api/maps/marker",
        method: "POST",
        data: marker
      }).then(getMarkers())
        .then(clearForm([$lat, $lng, $title, $description, $address]))
        .catch("error on ajax")
      })
}

const getMarkers = () => {
  $.get("/api/maps/markers", function(data) {
    // clearUserMarkers()
    buildUserMarkers(data);
    setUserMarkers(map);
  })
}

const buildUserMarkers = (rawMarkersData) => {
  rawMarkersData.forEach(function(markerData) {
    console.log("raw marker object:", markerData)
    const location = new google.maps.LatLng({lat: markerData.st_x, lng: markerData.st_y});
    const title = markerData.title;
    const info = markerData.info;
    //description should probably only be used in the window info
    let userMarker = new google.maps.Marker({
          position: location,
          map: map,
          title: title,
          info: info,
          loc: markerData.loc
        });
      userMarkers.push(userMarker);
      userMarkersWindow(userMarker)
  })
}

const setUserMarkers = (map) => {
  userMarkers.forEach(function(marker) {
    marker.setMap(map)
    // userMarkersWindow(marker)
  })
}

const clearUserMarkers = () => {
   setUserMarkers(null);
}

const userMarkersWindow = (marker) => {
  // markers.forEach(function (marker) {
  //   // if (markers.length === 0) {
  //   //   return
  //   // }

    google.maps.event.addListener(marker, "click", function (event) {
      let infowindow = new google.maps.InfoWindow;
      let latitude = marker.position.lat();
      let longitude = marker.position.lng();
      let title = marker.title
      let info = marker.info
      let loc = marker.loc

      getAddress(latitude, longitude, (address) => {
        console.log("that's the loc from front end marker:", loc)
        let contentString = `<div id="content">
          <div id="siteNotice">
          </div>
          <h1 id="firstHeading" class="firstHeading">${title}</h1>
          <h2 id="marker-address"> ${address}</h2>
          <div id="image"><img></div>
          <div id="bodyContent">
          <p>${info}</p>
          <p></p>
          <footer>
          <form class="delete-form" method="POST" action="/api/maps/marker/delete">
            <input style="display:none" class="latitude" name="latitude" type="text">
            <input style="display:none" class="longitude" name="longitude" type="text">
            <input  class="loc" name="loc" type="text">
            <button type="submit" name="delete-marker">Delete Marker</button>
          </form>
          </footer>
          </div>
          </div>`;
        infowindow.setContent(contentString);
        infowindow.open(map, marker);
        // const markerId = {}
        $(".delete-form .latitude").val(latitude);
        $(".delete-form .longitude").val(longitude);
        $(".delete-form .loc").val(loc);

        // deleteMarker(marker, $("#delete-button"));
        // Center of map
      map.panTo(new google.maps.LatLng(latitude,longitude));
    });
  })
// })
}



getMarkers()
saveMarker()
// setUserMarkers()
// userMarkersWindow(userMarkers)
// console.log("userMarkers:", userMarkers)
// console.log("userMarkers length:", userMarkers.length)
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
