// Remember plans = [ ... ]
function Timeline(t_x, t_y) {
	this.c = createCanvas(windowWidth, windowHeight*0.2);
	this.w = t_x;
	this.h = t_y;
	this.hours = [];
	this.hour_idx = -1;
	this.c.parent('timeline-holder');
	this.c.id('timeline-div');
	// this.c.style("height", "100%");
	this.c.style("z-index", "0");


	this.c.mouseClicked(function(e){
		console.log(e);
	})



	this.movePlan = function(){
		// Make the timeline visible here?
		// console.log('mfo');
		
		// select('#'.concat(this.elt.id)).position(mouseX-60, 30);
		// console.log(this.elt.id);
		// timeline.hour_idx = parseInt(this.elt.id.split("-")[1]);
	}

	this.placePlan = function(x, id, name){
		var tmp = createDiv(name);
		tmp.id(id);
		tmp.parent('timeline-holder');	

		tmp.style("top", "0");
		tmp.style("position", "absolute");

		tmp.style('background-color', 'white');
		// tmp.style('top', '0px');
		// tmp.style('position', 'absolute');
		// tmp.style('float', 'left');
		tmp.style('z-index', '6');
		// tmp.center();

		tmp.style("font-size", "12pt");
		tmp.style("margin", "5%");
		tmp.style("width", "15vh");
		tmp.style("height", "12vh");
		tmp.style("text-align", "center");

		tmp.style('border-style', 'solid');
		tmp.style('border-color', '2px 2px black');
		tmp.style('box-shadow', '3px 3px black');

		// jQuery events
		$('#'+id).draggable({
			axis: 'x',
			containment: 'parent'
		});

		tmp.mouseClicked(function(e){
			// console.log("boo", e);
		});

		var button = createButton('x');
		button.parent(tmp);
		button.style('right', '0px');
		button.style('top', '0px');
		button.style('position', 'absolute');

		button.mouseClicked(function(e){
			// Function to remove the element - maybe a helper fn for this
			// button.parent().remove();
			console.log("removing", name);
			$("#esri").trigger("esri_rem_marker", [ name ]);
			// button.parent().remove();
		})

	}

	this.display = function(){
		rect(0, 0, this.c.width-1, this.c.height-1);
	
		
	}
};