// Remember plans = [ ... ]
function Timeline() {
	this.w = windowWidth;
	this.h = 160;
	this.hours = [];
	this.hour_idx = -1;

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
			for (step = 1; step < 23; step++) {
				line(x, this.h - 25 + map(this.hours[this.hour_idx][constrain(step-1, 0, 24)], 0, 100, 0, -120), x + width/24, this.h - 25 + map(this.hours[this.hour_idx][step], 0, 100, 0, -120));
				x += width/24;


			}	
		}
	}
};