var canvas;
var tl;
var w;

function setup() {
	tl = new Timeline();

 	canvas = createCanvas(windowWidth, 160);
 	// background(41);
 	canvas.parent('timeline-holder');
}

function draw() {
	tl.display();
}

function windowResized() {
	resizeCanvas(windowWidth, 160);

	tl.w = windowWidth;
	
}

var plans = []

// So these should actually be divs, that we add etc
function mouseClicked(){
	var new_plan = createDiv("test");
	new_plan.parent('timeline-holder');
	new_plan.position(mouseX, height-80);
	plans.push(new_plan);

	// tl.addWidget(new Widget(constrain(mouseX, 0, width), constrain(mouseY, 0, height)));

}