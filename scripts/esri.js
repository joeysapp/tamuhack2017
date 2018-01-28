
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
	var window_x = 2*2000;
	var window_y = 2000;
	var stopSymbol = new SimpleMarkerSymbol();
	

	routeTask = new RouteTask("https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World");

        //setup the route parameters
        routeParams = new RouteParameters();
        routeParams.stops = new FeatureSet();
        routeParams.outSpatialReference = {
          "wkid" : 102100
        };
		
	function addStop(point) {
          var stop = esriMap.graphics.add(new Graphic(point, stopSymbol));
          routeParams.stops.features.push(stop);

          if (routeParams.stops.features.length >= 2) {
            routeTask.solve(routeParams);
            lastStop = routeParams.stops.features.splice(0, 1)[0];
          }
    }
        //Adds the solved route to the map as a graphic
        function showRoute(evt) {
          map.graphics.add(evt.result.routeResults[0].route.setSymbol(routeSymbol));
        }

        //Displays any error returned by the Route Task
        function errorHandler(err) {
          alert("An error occured\n" + err.message + "\n" + err.details.join("\n"));

          routeParams.stops.features.splice(0, 0, lastStop);
          map.graphics.remove(routeParams.stops.features.splice(1, 1)[0]);
        }
		
		
     routeTask.on("solve-complete", showRoute);
     routeTask.on("error", errorHandler);
  
	
	var textGraph = {};
	var simpGraph = {};
	var act_name = new Set();
	
	gsvc = new GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");

	var markerSymbol = new SimpleMarkerSymbol();
	var selMarkerSymbol = new SimpleMarkerSymbol();
	var actMarkerSymbol = new SimpleMarkerSymbol();
	var actSelMarkerSymbol = new SimpleMarkerSymbol();
	var labelFont = new Font();

	var textColor = Color.fromString("rgb(255,255,255)");
	var markerColor = Color.fromString("rgb(100,100,100)");
	var actColor = Color.fromString("rgb(212,0,12)");
	
	var markerSize = 20;
	var selSize = 25;
	
	selMarkerSymbol.setColor(markerColor);
	selMarkerSymbol.setSize(selSize);
	selMarkerSymbol.outline.setColor(textColor);
	
	actMarkerSymbol.setColor(actColor);
	actMarkerSymbol.setSize(markerSize);
	actMarkerSymbol.outline.setColor(textColor);
	
	actSelMarkerSymbol.setColor(actColor);
	actSelMarkerSymbol.setSize(selSize);
	actSelMarkerSymbol.outline.setColor(textColor);
	
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
					// ADD to route lol
					//addStop(mk_point);
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
		simpGraph[name].symbol = new SimpleMarkerSymbol(selMarkerSymbol);
		esriMap.graphics.refresh();
	}
	
	function unselect(name) {
		simpGraph[name].symbol = new SimpleMarkerSymbol(markerSymbol);
		esriMap.graphics.refresh();
		//console.log(markerSymbol);
	}
	
	/*
	function activate(name) {
		var old_pt = new Point(simpGraph[name].geometry);
		var g_attr = simpGraph[name].attributes;
		//console.log(old_pt,g_attr);
		esriMap.graphics.remove(simpGraph[name]);
		esriMap.graphics.remove(textGraph[name]);
		var label = new TextSymbol(name[0],labelFont,textColor).setOffset(0,-4.5).setAlign(TextSymbol.ALIGN_MIDDLE);
		var text = new Graphic(old_pt,label,g_attr);
		esriMap.graphics.add(text);
		var simp;
		if (sel_name == name) {
			simp = new Graphic(old_pt,actSelMarkerSymbol,g_attr);
		} else {
			simp = new Graphic(old_pt,actMarkerSymbol,g_attr);
		}
		esriMap.graphics.add(simp);
		simpGraph[name] = simp;
		textGraph[name] = text;
		act_name.add(name);
	}
	
	$("#esri_act").on('click', function() {
		activate(wrp_actname);
	});
	
	
	function unactivate(name) {
		simpGraph[name].symbol.setColor(markerColor);
		esriMap.graphics.refresh();
	}*/
  
  function myGraphicsClickHandler(evt) {
		if(sel_name !== undefined && sel_name.length > 0) {
		
			unselect(sel_name);
		}
		
		if (sel_name == evt.graphic.attributes.p_name) {
			sel_name = "";
			$("#esri_unsel").click();
		}
		else if (evt.graphic.attributes.p_name !== undefined && evt.graphic.attributes.p_name.length > 0) {
			sel_name = evt.graphic.attributes.p_name;
			sel_placeid = evt.graphic.attributes.placeid;
			$("#esri_sel").click();
			console.log(sel_placeid," is selected");
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
});
	  
