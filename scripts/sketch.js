var canvas, timeline;
var plans = []

function setup() {
	timeline = new Timeline();

 	canvas = createCanvas(windowWidth, 160);
 	canvas.parent('timeline-holder');
}

function draw() {
	timeline.display();
}

function windowResized() {
	resizeCanvas(windowWidth, 160);
	timeline.w = windowWidth;
}


function keyPressed(){
	if (plans.length > 0){
		plans.pop().remove();
		console.log("removed!");
	} else {
		console.log("not removed!");
	}
}

function mouseClicked(){
	var new_plan = createDiv("test");
	new_plan.parent('timeline-holder');
	new_plan.position(mouseX, height-80);
	plans.push(new_plan);
}