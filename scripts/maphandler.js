function init() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 30.2631898, lng: -97.6984465},
    zoom: 12
  });

  var input = document.getElementById('main_input');

  // var input = "Austin Bouldering Project, Springdale Road, Austin, TX, United States";
  var autocomplete = new google.maps.places.Autocomplete(input);
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
          infowindowContent.children['place-address'].textContent =
              place.formatted_address;
          infowindow.open(map, marker);
    data = {}
    data['place'] = place.place_id;
    console.log(place.place_id);


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


