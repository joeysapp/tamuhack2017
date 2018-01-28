
require(
	["esri/map","esri/Color","esri/dijit/Search","esri/SpatialReference","esri/graphic","esri/tasks/GeometryService","esri/tasks/ProjectParameters","esri/geometry/Point","esri/geometry/Extent","esri/geometry/webMercatorUtils","esri/symbols/SimpleMarkerSymbol","esri/symbols/TextSymbol","esri/symbols/Font","dojo/domReady!"
], function (Map, Color, Search, SpatialReference, Graphic, GeometryService, 
ProjectParameters, Point, Extent, webMercatorUtils, SimpleMarkerSymbol, TextSymbol, Font) {
	var esriMap = new Map("esri", {
	    basemap: "streets",
	    center: [30.2631898, -97.6984465], // lon, lat
	    zoom: 7,
	});
	var window_x = 2*2770;
	var window_y = 2770;
	
	gsvc = new GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");

	var markerSymbol = new SimpleMarkerSymbol();
	var labelFont = new Font();

	var textColor = Color.fromString("rgb(255,255,255)");
	var markerColor = Color.fromString("rgb(212,0,12)");

	markerSymbol.setColor(markerColor);
	markerSymbol.setSize(20);
	markerSymbol.outline.setColor(textColor);

	labelFont.setFamily("Arial");
	labelFont.setWeight(Font.WEIGHT_BOLD);

	var latLongSR = new SpatialReference(4326);
	var xySR = esriMap.spatialReference;
	
	function resetBounding() {
		var num_pts = places.length;
		console.log(num_pts);
		if (num_pts == 0) {
			return;
		}
		else if (num_pts == 1) {
			var newCenter = new Point(places[0].x,places[0].y,esriMap.spatialReference);
			esriMap.centerAndZoom(newCenter,15);
		}
		else {
			var e_xmin = places[0].x, e_xmax = places[0].x, e_ymin = places[0].y, e_ymax = places[0].y;
			var tot_x = 0, tot_y = 0;
			for(var i = 0; i < num_pts; ++i) {
				console.log(places[i].x, places[i].y);
				tot_x += places[i].x;
				tot_y += places[i].y;
				if (places[i].x < e_xmin) {
					e_xmin = places[i].x;
				}
				if (places[i].x > e_xmax) {
					e_xmax = places[i].x;
				}
				if (places[i].y < e_ymin) {
					e_ymin = places[i].y;
				}
				if (places[i].y > e_ymax) {
					e_ymax = places[i].y;
				}
			}
			var pow_x = 0, pow_y = 0;
			var exp_x = window_x, exp_y = window_y;
			while (exp_x < (e_xmax-e_xmin)) {
				exp_x *= 2;
				pow_x += 1;
			}
			while (exp_y < (e_ymax-e_ymin)) {
				exp_y *= 2;
				pow_y += 1;
			}
			var max_pow = pow_x;
			if (pow_y > max_pow) {
				max_pow = pow_y;
			}
			var avg_x, avg_y;
			avg_x = tot_x / num_pts;
			avg_y = tot_y / num_pts;
			var newCenter = new Point(avg_x,avg_y,esriMap.spatialReference);
			esriMap.centerAndZoom(newCenter,15-max_pow);
		}
	}
	
	
	function addMarker(longitude,latitude,name,placeid) {
		var merc = webMercatorUtils.lngLatToXY(longitude,latitude);
		var x = merc[0];
		var y = merc[1];

		console.log(x,y);

		var place = {};
		place.name = name;
		place.x = x;
		place.y = y;
		place.lng = longitude;
		place.lat = latitude;
		place.placeid = placeid;
		if(!p_set.has(place.name)) {
				// INTERNAL BOOKKEEPING
				p_set.add(place.name);
				places.push(place);

				// ADD GRAPHICAL MARKER
				var g_attr = {"p_id": place.id, "p_name":place.name};
				var mk_point = new Point(x,y,esriMap.spatialReference);
				esriMap.graphics.add(new Graphic(mk_point,markerSymbol,g_attr));
				var label = new TextSymbol(name[0],labelFont,textColor).setOffset(0,-4.5).setAlign(TextSymbol.ALIGN_MIDDLE);
				esriMap.graphics.add(new Graphic(mk_point,label,g_attr));
		}
		resetBounding();
	}

	$("#wrp_add").on("click", function() {
		addMarker(wrp_lng,wrp_lat,wrp_name,wrp_placeid);
	});

	var austin = new SpatialReference(102100);
	var mapCenter = new Point(-10880699.875412026, 3537992.625178636, austin);


  esriMap.on("load", function (){
	console.log("map loaded");
	esriMap.centerAndZoom(mapCenter,  12);
  });
  
  esriMap.on("extent-change", showExtent);
  function showExtent(event){
	//console.log(event.extent.xmax-event.extent.xmin, event.extent.ymax-event.extent.ymin);
  }
  
  
  
// JOEY USE THIS
  function removeMarker(name) {
	var graph_list = esriMap.graphics.graphics;
	for (var j = 0; j < 2; j++) { // do it twice to remove both markers, genius
		for (var i = 0; i < graph_list.length; i++) { // O(n) algorithms OMEGALUL
			// well deletion is O(n) anyway
			//console.log(map.graphics.graphics[i].attributes);
			if (graph_list[i].attributes !== undefined) {
				if (graph_list[i].attributes.p_name !== undefined) {
					if(graph_list[i].attributes.p_name == name){
						p_set.delete(name);
						esriMap.graphics.remove(graph_list[i]);
						break;
					}
				}
			}
		}
	}
	for (var i = 0; i < places.length; i++) {
		if (places[i].name == name) {
			places.splice(i,1);
		}
	}
	console.log(places);
}
  
});
	  
