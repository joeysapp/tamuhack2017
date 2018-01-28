var canvas;
var tl;

function setup() {
	tl = new Timeline();


 	canvas = createCanvas(windowWidth, 160);
 	canvas.parent('timeline-holder');
}

function draw() {
	tl.display();
}

function windowResized() {
	resizeCanvas(windowWidth, 160);

	tl.w = windowWidth;
	
}