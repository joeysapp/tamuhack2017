
require(
	["esri/map","esri/Color","esri/dijit/Search","esri/SpatialReference","esri/graphic","esri/tasks/GeometryService","esri/tasks/ProjectParameters","esri/geometry/Point","esri/geometry/Extent","esri/geometry/webMercatorUtils","esri/symbols/SimpleMarkerSymbol","esri/symbols/TextSymbol","esri/symbols/Font","dojo/domReady!"
], function (Map, Color, Search, SpatialReference, Graphic, GeometryService, 
ProjectParameters, Point, Extent, webMercatorUtils, SimpleMarkerSymbol, TextSymbol, Font) {
	var esriMap = new Map("esri", {
	    basemap: "gray",
	    center: [30.2631898, -97.6984465], // lon, lat
	    zoom: 7,
	});

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
	
	function addMarker(longitude,latitude,name,placeid) {
		var merc = webMercatorUtils.lngLatToXY(longitude,latitude);
		var x = merc[0];
		var y = merc[1];

		console.log(x,y);

		var place = {};
		place.name = name;
		place.x = x;
		place.y = y;
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
	}

	$("#wrp_add").on("click", function() {
		addMarker(wrp_lng,wrp_lat,wrp_name,wrp_placeid);
	});

	var austin = new SpatialReference(102100);
	var mapCenter = new Point(-10880699.875412026, 3537992.625178636, austin);
	esriMap.centerAndZoom(mapCenter,  12);


  esriMap.on("load", function (){
	console.log("map loaded");
	// Hook up jQuery
	$(document).ready(jQueryReady);
  });
  
  esriMap.on("extent-change", showExtent);
  function showExtent(event){
	//console.log(event.extent);
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
	  
