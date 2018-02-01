
require(
	["esri/map","esri/arcgis/OAuthInfo","esri/IdentityManager","dojo/_base/connect","esri/layers/GraphicsLayer","esri/Color","esri/dijit/Search","esri/SpatialReference","esri/geometry/Polyline","esri/graphic","esri/tasks/GeometryService","esri/tasks/ProjectParameters","esri/geometry/Point","esri/geometry/Extent",
        "esri/tasks/RouteTask", "esri/tasks/RouteParameters","esri/geometry/webMercatorUtils", "esri/tasks/FeatureSet", "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol", "esri/symbols/TextSymbol","esri/symbols/Font","dojo/domReady!"
], function (Map, OAuthInfo, esriId, connect, GraphicsLayer, Color, Search, SpatialReference, Polyline, Graphic, GeometryService, 
ProjectParameters, Point, Extent, RouteTask, RouteParameters, webMercatorUtils, FeatureSet, SimpleMarkerSymbol, SimpleLineSymbol,  TextSymbol, Font) {
	var esriMap = new Map("esri", {
	    basemap: "streets",
		//slider: false,
	    center: [30.2631898, -97.6984465], // lon, lat
	    zoom: 5,
	});
	var window_x = 2*2200;
	var window_y = 2200;
	var stopSymbol = new SimpleMarkerSymbol();
	
	var wide_mid;
	var wide_zoom;
	
	var places = [];
	var p_set = new Set();
	
	var austin = new SpatialReference(102100);
	var mapCenter = new Point(-10880699.875412026, 3537992.625178636, austin);
	
	var fakeOrder = 1;
	
		var proxy = "https://utility.arcgis.com/usrsvcs/appservices/wW3r3nENTyFGyBGm/rest/services/World/Route/NAServer/Route_World/solve?"
	
	
	
	function getValues(myUrl){
		 $.ajax({
			url: proxy + myUrl,
			type: 'get',
			dataType: 'json',
			cache: false,
			success: postProcessing,
			async:true,
			});
	};
	
	var routeLayer = new esri.layers.GraphicsLayer();
	esriMap.addLayer(routeLayer);
	var lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([255,0,0]),4);
	
	function drawRoute(p,q) {
		var pathsXY = [[[p.x,p.y],[q.x,q.y]]];
		var singlePathPolyline = new Polyline(pathsXY);
	  var polylineGraphic = new Graphic(singlePathPolyline, lineSymbol);
	  //console.log(pathsXY);
	  esriMap.graphics.add(polylineGraphic);
	  console.log(polylineGraphic);
		
		suffix = "stops=";
		suffix += p.lng.toString() + "," + p.lat.toString() + ";" + q.lng.toString() + ","  + q.lat.toString();
		suffix += "&f=json"
		console.log(suffix);
		getValues(suffix);

	};
	//getValues("stops=-117.1957,34.0564;-117.184,34.0546&f=json");
	
	function postProcessing(data) {
		//console.log(data.routes.features[0].geometry.paths[0]);
		var pathsLngLat = data.routes.features[0].geometry.paths[0];
		var pathsXY = [];
		for (var i = 0; i < pathsLngLat.length; ++i) {
			pathsXY.push(webMercatorUtils.lngLatToXY(pathsLngLat[i][0],pathsLngLat[i][1]));
		}
		var singlePathPolyline = new Polyline(pathsXY);
		singlePathPolyline.setSpatialReference(esriMap.spatialReference);
		  var polylineGraphic = new Graphic(singlePathPolyline,lineSymbol);
		 // console.log(pathsXY);
		  routeLayer.add(polylineGraphic);
	};
		
		//https://utility.arcgis.com/usrsvcs/appservices/wW3r3nENTyFGyBGm/rest/services/World/Route/NAServer/Route_World/solve?stops=-117.1957,34.0564;-117.184,34.0546&f=json
	
	function shiftCenter(point,zoom) {
		var pow = zoom - 8;
		var k = 0;
		var delt = 50000;
		while (k < pow) {
			delt /= 2;
			k += 1;
		}
		return new Point(point.x,point.y-delt,esriMap.spatialReference);
	};
	
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
	var textColorDark = Color.fromString("rgb(0,0,0)");
	var markerColor = Color.fromString("rgb(212,0,12)");
	var actColor = Color.fromString("rgb(212,0,12)");
	
	var markerSize = 23;
	var selSize = 25;
	
	selMarkerSymbol.setColor(markerColor);
	selMarkerSymbol.setSize(selSize);
	selMarkerSymbol.outline.setColor(markerColor);
	
	actMarkerSymbol.setColor(actColor);
	actMarkerSymbol.setSize(markerSize);
	actMarkerSymbol.outline.setColor(textColor);
	
	actSelMarkerSymbol.setColor(actColor);
	actSelMarkerSymbol.setSize(selSize);
	actSelMarkerSymbol.outline.setColor(textColor);
	
	markerSymbol.setColor(markerColor);
	markerSymbol.setSize(markerSize);
	markerSymbol.outline.setColor(markerColor);

	labelFont.setFamily("Arial");
	labelFont.setWeight(Font.WEIGHT_BOLD);

	var latLongSR = new SpatialReference(4326);
	var xySR = esriMap.spatialReference;
	
	function resetBounding() {
		var num_pts = places.length;
		//console.log(num_pts);
		if (num_pts == 0) {
			esriMap.centerAndZoom(shiftCenter(mapCenter,10),  10);
			return true;
		}
		else if (num_pts == 1) {
			wide_mid = new Point(places[0].x,places[0].y,esriMap.spatialReference);
			wide_zoom = 15;
			esriMap.centerAndZoom(shiftCenter(wide_mid,wide_zoom), wide_zoom);
			return true;
		}
		else {
			var e_xmin = places[0].x, e_xmax = places[0].x, e_ymin = places[0].y, e_ymax = places[0].y;
			var tot_x = 0, tot_y = 0;
			for(var i = 0; i < num_pts; ++i) {
				//console.log(places[i].x, places[i].y);
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
				wide_mid = new Point(avg_x,avg_y,esriMap.spatialReference);
				wide_zoom = 15-max_pow;
				esriMap.centerAndZoom(shiftCenter(wide_mid,wide_zoom),wide_zoom);
				return true;
			}
		}
	}
	

	function select(name) {
		//console.log("selecting ", name);
		//simpGraph[name].symbol = new SimpleMarkerSymbol(selMarkerSymbol);
		//esriMap.graphics.refresh();
		esriMap.centerAndZoom(shiftCenter(simpGraph[name].geometry,wide_zoom+2),wide_zoom+2);
		console.log(selMarkerSymbol.size);
	}
	
	function unselect(name) {
		//console.log("unselecting ", name);
		//simpGraph[name].symbol = new SimpleMarkerSymbol(markerSymbol);
		//esriMap.graphics.refresh();
		//console.log(markerSymbol.size);
	}
	
	function addMarker(longitude,latitude,name,placeid) {
		var merc = webMercatorUtils.lngLatToXY(longitude,latitude);
		var x = merc[0];
		var y = merc[1];

		//console.log(x,y);

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
					var order = new TextSymbol(fakeOrder.toString(),labelFont,textColor).setOffset(0,-4.5).setAlign(TextSymbol.ALIGN_MIDDLE);
					var label = new TextSymbol(place.name,labelFont,textColorDark).setOffset(15,-4.5).setAlign(TextSymbol.ALIGN_START);
					fakeOrder += 1;
					var num = new Graphic(mk_point,order,g_attr)
					var name_lab = new Graphic(mk_point,label,g_attr)
					esriMap.graphics.add(simp);
					esriMap.graphics.add(name_lab);
					esriMap.graphics.add(num);
					simpGraph[name] = simp;
					textGraph[name] = num;
					
					if(sel_name !== undefined && sel_name.length > 0) {
						unselect(sel_name);
					}
					// ADD to route lol
					
					if(places.length > 1) {
						drawRoute(places[places.length - 2], places[places.length - 1]);
					}
				}
		}
	}
	
  function myGraphicsClickHandler(evt) {
		if(keys[13]) removeMarker(evt.graphic.attributes.p_name);
		else {
		if(sel_name !== undefined && sel_name.length > 0) {
			unselect(sel_name);
		}
		
		if (sel_name == evt.graphic.attributes.p_name) {
			//console.log("unselect2");
			sel_name = "";
			$("#esri_unsel").click();
		}
		else if (evt.graphic.attributes.p_name !== undefined && evt.graphic.attributes.p_name.length > 0) {
			sel_name = evt.graphic.attributes.p_name;
			sel_placeid = evt.graphic.attributes.placeid;
			$("#esri_sel").click();
			//console.log(sel_placeid," is selected");
			select(sel_name);
		}
		if(sel_name === undefined || sel_name.length == "") {
			esriMap.centerAndZoom(shiftCenter(wide_mid,wide_zoom),wide_zoom);
		}
		//console.log(evt.graphic.attributes);
		}
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
	resetBounding();
	//console.log(places);
}

  esriMap.on("extent-change", showExtent);
  function showExtent(event){
  //console.log(event.extent);
	//console.log(event.extent.xmax-event.extent.xmin, event.extent.ymax-event.extent.ymin);
  }

  esriMap.on("load", function (){
	//console.log("map loaded");
	connect.connect(esriMap.graphics, "onClick", myGraphicsClickHandler);
	esriMap.centerAndZoom(shiftCenter(mapCenter,  10),10);
	
	/*
	var center = new Point(-10880699.875412026, 3537992.625178636);
	center.setSpatialReference(esriMap.spatialReference);
	var myGraphic2 = new Graphic(center, stopSymbol);
	esriMap.graphics.add(myGraphic2);
	
	var center = new Point(-10877600.74, 3550057.80);
	center.setSpatialReference(esriMap.spatialReference);
	var myGraphic2 = new Graphic(center, stopSymbol);
	esriMap.graphics.add(myGraphic2);
	
	var polyLine = new Polyline([[-10880699.875412026, 3537992.625178636],[-10877600.74, 3550057.80]]);
	polyLine.setSpatialReference(esriMap.spatialReference);
	var myGraphic = new Graphic(polyLine, lineSymbol);
	console.log(myGraphic);
	esriMap.graphics.add(myGraphic);
	*/
	
	//esriMap.setExtent(myGraphic.geometry.cache._extent);
	
  });
  
	// INERACTION WITH OTHER PARTS OF THE PROGRAM
	$('#wrp_del').on('click', function() {
		removeMarker(wrp_delname);
	});
	
	// add marker from maphandler.js
	$("#esri").on("esri_add_marker", function(evt,longitude,latitude,name,placeid) {
		addMarker(longitude,latitude,name,placeid);
	});
	
	
});
	  
