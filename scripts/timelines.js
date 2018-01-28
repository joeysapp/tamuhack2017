// Remember plans = [ ... ]
function Timeline() {
	this.w = windowWidth;
	this.h = 160;

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
	}
};