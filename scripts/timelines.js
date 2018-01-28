// Remember plans = [ ... ]
function Timeline() {
	this.w = windowWidth;
	this.h = 160;
	this.hours = [];
	this.hour_idx = -1;

	this.display = function(){

		// Base layer
		noStroke();
		fill("#ffffff");
		rect(20, 20, this.w-40, this.h-40);
		
		// Begin the base for timeline!

		stroke("#e6e6e6");
		strokeWeight(1.1);
		noFill();
		rect(20, 20, this.w-40, this.h-40);

		var step;
		stroke("#666666");
		strokeWeight(3);
		for (step = 1; step < 24; step++) {
			point(step*1/24*this.w, this.h/2 + 5);
		}

		if (show_hours && this.hours_idx != -1){
			console.log("hi");
			console.log(this.hours[this.hour_idx]);
			var x = 25;

			stroke(0);
			strokeWeight(5);
			for (step = 1; step < 23; step++) {

				line(x, this.h - 25 + map(this.hours[this.hour_idx][constrain(step-1, 0, 24)], 0, 100, 0, -140), x + width/24, this.h - 25 + map(this.hours[this.hour_idx][step], 0, 100, 0, -140));
				// x += width/24;
				// y += map(this.hours[step], 0, 100, 0, -160)
				x += width/24;


			}	
		}
	}
};