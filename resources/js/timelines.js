// Remember plans = [ ... ]
function Timeline(t_x, t_y) {
	this.c = createCanvas(windowWidth, windowHeight/4);
	this.w = t_x;
	this.h = t_y;
	this.hours = [];
	this.hour_idx = -1;
	this.c.parent('timeline-holder');
	this.c.id('timeline-div');
	this.c.style('inline-block');


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
		var tmp = createDiv(0, 0);
		tmp.id(id);
		tmp.html(name);
		tmp.mouseClicked(this.movePlan);
		tmp.parent('timeline-holder');	

		tmp.style('background-color', 'white');
		tmp.style('height', '100%');
		tmp.style('width', '15%');
		tmp.style('padding', '0.5em');
		tmp.style('margin', '2em');
		tmp.style('display', 'inline-block');

		// jQuery events
		$('#'+id).draggable({
			axis: 'x',
			containment: 'parent'
		});
	}




	this.display = function(){

		// Base layer

		
		// Begin the base for timeline!

		stroke("#e6e6e6");
		strokeWeight(1.1);
		fill(255);
		rect(20, 20, this.w-40, this.h-40);

		var step;
		stroke("#666666");
		strokeWeight(3);
		textSize(10);
		fill(0, 80);
		for (step = 1; step < 24; step++) {
			strokeWeight(1);
			stroke(0, 80);
			text(step, step*1/24*this.w - 5, this.h/2 - 3);
			strokeWeight(3);
			stroke(0, 120);
			point(step*1/24*this.w, this.h/2 + 5);
		}

		if (show_hours && this.hours_idx != -1 && this.hours.length > 0){
			var x = 25;

			stroke(20, 240, 20, 150);
			strokeWeight(4);
			if (this.hours == []){
				return;
			}
			for (step = 1; step < 23; step++) {
				line(x, this.h - 25 + map(this.hours[this.hour_idx][constrain(step-1, 0, 24)], 0, 100, 0, -120), x + width/24, this.h - 25 + map(this.hours[this.hour_idx][step], 0, 100, 0, -120));
				x += width/24;


			}	
		}
	}
};