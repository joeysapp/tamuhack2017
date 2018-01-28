function Timeline() {
	this.w = windowWidth;
	this.h = 160;

	this.display = function(){

		// Base layer
		noStroke();
		fill("#ffffff");
		rect(30, 48, this.w-80, this.h-68);
		
		// Begin the base for timeline!

		stroke("#e6e6e6");
		strokeWeight(1.1);
		noFill();
		rect(30+3, 48+3, this.w-86, this.h-74);

		var step;
		push();
		translate(30, 48);
		stroke("#666666");
		strokeWeight(3);
		for (step = 1; step < 22; step++) {
			point(step*1/24*this.w, (this.h/2) - 37);
		}
		pop();
	}
	


};