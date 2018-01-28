function Widget(x, y) {
	this.x = x;
	this.y = y;

	this.display = function(){

		// Base layer
		noStroke();
		fill(41);
		rect(x, 0, 50, 160);
	}
	


}