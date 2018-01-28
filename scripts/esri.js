
require(
	["esri/map","dojo/_base/connect","esri/Color","esri/dijit/Search","esri/SpatialReference","esri/graphic","esri/tasks/GeometryService","esri/tasks/ProjectParameters","esri/geometry/Point","esri/geometry/Extent",
        "esri/tasks/RouteTask", "esri/tasks/RouteParameters","esri/geometry/webMercatorUtils", "esri/tasks/FeatureSet", "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol", "esri/symbols/TextSymbol","esri/symbols/Font","dojo/domReady!"
], function (Map, connect, Color, Search, SpatialReference, Graphic, GeometryService, 
ProjectParameters, Point, Extent, RouteTask, RouteParameters, webMercatorUtils, FeatureSet, SimpleMarkerSymbol, SimpleLineSymbol,  TextSymbol, Font) {
	var esriMap = new Map("esri", {
	    basemap: "streets",
	    center: [30.2631898, -97.6984465], // lon, lat
	    zoom: 5,
	});
	var window_x = 2*2770;
	var window_y = 2770;
	
	var textGraph = {};
	var simpGraph = {};
	
	function init() {
		dojo.connect(map, "onLoad", function() {
	  dojo.connect(map.graphics, "onClick", function(e) {
		console.log("clicked a graphic: ", e.graphic, e.graphic.attributes.id);
	  });
	})
	}
	
	gsvc = new GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");

	var markerSymbol = new SimpleMarkerSymbol();
	var selMarkerSymbol = new SimpleMarkerSymbol();
	var actMarkerSymbol = new SimpleMarkerSymbol();
	var labelFont = new Font();

	var textColor = Color.fromString("rgb(255,255,255)");
	var markerColor = Color.fromString("rgb(100,100,100)");
	var actColor = Color.fromString("rgb(212,0,12)");
	var selColor = Color.fromString("rgb(12,0,212)");
	
	var markerSize = 20;
	var selSize = 25;
	
	selMarkerSymbol.setColor(selColor);
	selMarkerSymbol.setSize(selSize);
	selMarkerSymbol.outline.setColor(textColor);
	
	markerSymbol.setColor(markerColor);
	markerSymbol.setSize(markerSize);
	markerSymbol.outline.setColor(textColor);

	labelFont.setFamily("Arial");
	labelFont.setWeight(Font.WEIGHT_BOLD);

	var latLongSR = new SpatialReference(4326);
	var xySR = esriMap.spatialReference;
	
	function resetBounding() {
		var num_pts = places.length;
		console.log(num_pts);
		if (num_pts == 0) {
			return true;
		}
		else if (num_pts == 1) {
			var newCenter = new Point(places[0].x,places[0].y,esriMap.spatialReference);
			esriMap.centerAndZoom(newCenter,15);
			return true;
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
			var avg_x, avg_y;
			avg_x = tot_x / num_pts;
			avg_y = tot_y / num_pts;
			
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
			if (max_pow > 5) {
				return false;
			} else {
				var newCenter = new Point(avg_x,avg_y,esriMap.spatialReference);
				esriMap.centerAndZoom(newCenter,15-max_pow);
				return true;
			}
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
				
				if(!resetBounding()) {
					for (var i = 0; i < places.length; i++) {
						if (places[i].name == name) {
							places.splice(i,1);
						}
					}
				}
				else {
					// ADD GRAPHICAL MARKER
					var g_attr = {"placeid": placeid, "p_name":place.name};
					var mk_point = new Point(x,y,esriMap.spatialReference);
					var simp = new Graphic(mk_point,markerSymbol,g_attr);
					var label = new TextSymbol(name[0],labelFont,textColor).setOffset(0,-4.5).setAlign(TextSymbol.ALIGN_MIDDLE);
					var text = new Graphic(mk_point,label,g_attr)
					esriMap.graphics.add(simp);
					esriMap.graphics.add(text);
					simpGraph[name] = simp;
					textGraph[name] = text;
				}
		}
	}

	$("#wrp_add").on("click", function() {
		addMarker(wrp_lng,wrp_lat,wrp_name,wrp_placeid);
	});

	var austin = new SpatialReference(102100);
	var mapCenter = new Point(-10880699.875412026, 3537992.625178636, austin);


  esriMap.on("load", function (){
	console.log("map loaded");
	connect.connect(esriMap.graphics, "onClick", myGraphicsClickHandler);
	esriMap.centerAndZoom(mapCenter,  10);
  });

	function select(name) {
	//console.log(simpGraph[name]);
	/*
		simpGraph[name].symbol.setSize(selSize);
		esriMap.graphics.refresh();
	*/
		var old_pt = new Point(simpGraph[name].geometry);
		var g_attr = simpGraph[name].attributes;
		//console.log(old_pt,g_attr);
		var simp = new Graphic(old_pt,selMarkerSymbol,g_attr);
		esriMap.graphics.remove(simpGraph[name]);
		esriMap.graphics.remove(textGraph[name]);
		var label = new TextSymbol(name[0],labelFont,textColor).setOffset(0,-4.5).setAlign(TextSymbol.ALIGN_MIDDLE);
		var text = new Graphic(old_pt,label,g_attr);
		esriMap.graphics.add(simp);
		esriMap.graphics.add(text);
		simpGraph[name] = simp;
		textGraph[name] = text;
	}
	
	function unselect(name) {
	/*
		simpGraph[name].symbol.setSize(markerSize);
		esriMap.graphics.refresh();
	*/
		var old_pt = new Point(simpGraph[name].geometry);
		var g_attr = simpGraph[name].attributes;
		//console.log(old_pt,g_attr);
		var simp = new Graphic(old_pt,markerSymbol,g_attr);
		esriMap.graphics.remove(simpGraph[name]);
		esriMap.graphics.remove(textGraph[name]);
		var label = new TextSymbol(name[0],labelFont,textColor).setOffset(0,-4.5).setAlign(TextSymbol.ALIGN_MIDDLE);
		var text = new Graphic(old_pt,label,g_attr);
		esriMap.graphics.add(simp);
		esriMap.graphics.add(text);
		simpGraph[name] = simp;
		textGraph[name] = text;
	}
	
	function activate(name) {
		simpGraph[name].symbol.setColor(actColor);
		esriMap.graphics.refresh();
	}
	
	$("#esri_act").on('click', function() {
		activate(wrp_actname);
	});
	
	function unactivate(name) {
		simpGraph[name].symbol.setColor(markerColor);
		esriMap.graphics.refresh();
	}
  
  function myGraphicsClickHandler(evt) {
		if(sel_name !== undefined && sel_name.length > 0) {
			unselect(sel_name);
		}
		
		if (sel_name == evt.graphic.attributes.p_name) {
			sel_name = "";
			$("#esri_unsel").click();
		}
		
		if (evt.graphic.attributes.p_name !== undefined && evt.graphic.attributes.p_name.length > 0) {
			sel_name = evt.graphic.attributes.p_name;
			sel_placeid = evt.graphic.attributes.placeid;
			$("#esri_sel").click();
			select(sel_name);
		}
		//console.log(evt.graphic.attributes);
  }
  
  esriMap.on("extent-change", showExtent);
  function showExtent(event){
  console.log(event.extent);
	//console.log(event.extent.xmax-event.extent.xmin, event.extent.ymax-event.extent.ymin);
  }
 
// JOEY USE THIS
  function removeMarker(name) {
	if(sel_name == name) {
		sel_name == "";
	}
	esriMap.graphics.remove(simpGraph[name]);
	esriMap.graphics.remove(textGraph[name]);
	delete simpGraph[name];
	delete textGraph[name];
	for (var i = 0; i < places.length; i++) {
		if (places[i].name == name) {
			places.splice(i,1);
		}
	}
	p_set.delete(name);

	console.log(places);
}

	$('#wrp_del').on('click', function() {
		removeMarker(wrp_delname);
	});

	routeTask = new RouteTask("https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World");

        //setup the route parameters
        routeParams = new RouteParameters();
        routeParams.stops = new FeatureSet();
        routeParams.outSpatialReference = {
          "wkid" : 102100
        };

        //routeTask.on("solve-complete", showRoute);
        //routeTask.on("error", errorHandler);
  
});
	  
