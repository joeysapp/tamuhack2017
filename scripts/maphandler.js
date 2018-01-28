function init() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 30.2631898, lng: -97.6984465},
    zoom: 12
  });

  var input = document.getElementById('main_input');

  var autocomplete = new google.maps.places.Autocomplete(input);

  // This is used to get Google Maps working!
  // autocomplete.bindTo('bounds', map);
  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  var infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);

  var marker = new google.maps.Marker({
    map: map
  });
  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });

  autocomplete.addListener('place_changed', function() {
    infowindow.close();
    var place = autocomplete.getPlace();
    console.log(place);
    if (!place.geometry) {
      return;
    }

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }

    marker.setPlace({
      placeId: place.place_id,
      location: place.geometry.location
    });
    marker.setVisible(true);

    infowindowContent.children['place-name'].textContent = place.name;
    infowindowContent.children['place-id'].textContent = place.place_id;
    infowindowContent.children['place-address'].textContent = place.formatted_address;
    infowindow.open(map, marker);

    // Data used for stuff, place_id!
    data = {}
    data['place'] = place.place_id;
    console.log(place.place_id);

      // bruce's esri stuff goes here
    wrp_name = place.name;
    wrp_lng = place.geometry.location.lng();
    wrp_lat = place.geometry.location.lat();
    wrp_placeid = place.place_id;
    $("#wrp_add").click();
    
    $.ajax({
      url: '/getPopularity',
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json;charset=UTF-8',
        cache:false,
        success: function (response) {
          console.log(response);
        },
        error: function(response){
          console.log("help me");
        }
      })
  })
}


