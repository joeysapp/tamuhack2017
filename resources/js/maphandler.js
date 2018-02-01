function init() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 30.2631898, lng: -97.6984465},
    zoom: 12
  });

  var input = document.getElementById('search_box');

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

    // See what exactly a 'place' obj is
    // console.log(place);
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

      // esri -- add new map marker
	$("#esri").trigger("esri_add_marker", [ place.geometry.location.lng(), place.geometry.location.lat(), place.name, place.place_id] );


    var free_pos = (Math.random()*(width-50)).toString();
    var ct = plans.length;
    var div_id = "event-"+ct.toString();
    var name_event = place.name.slice(0, 20);

    // var unique_div_id = '<div id='.concat(div_id).concat('>').concat(name_event).concat('</div>');

    // $('#timeline').append(unique_div_id);   
    // Placing the new div in the correct place!
    // $('#'.concat(unique_div_id)).css("left",free_pos.concat("px"));

    // Doing this with p5!
    timeline.placePlan(free_pos, div_id);

    plans.push(div_id);

    // // Sending to flask instance
     $.ajax({
        url:'http://127.0.0.1:5000/getPopularity',
        type: "POST",
        contentType:"application/json",
        dataType:"json",
        data: JSON.stringify(data),
        success: function (msg, status, jqXHR){
          timeline.hours.push(msg['data'])
          // console.log(timeline.hours);
          timeline.hour_idx += 1;

        },
        error: function(error) {
          console.log("Error getting Google Popularity via flask", error);
            }
      });

      // $.getJSON('127.0.0.1:5000/getPopularity', {
      //   {'a': '1'}
      // }, function(data){
      //   console.log(data);
      // });


  })
}


