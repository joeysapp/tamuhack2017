var canvas, timeline;
var movables = []

var show_hours = true;

function setup() {
	timeline = new Timeline();

	// timeline.c.parent('timeline-holder');
 	// canvas = createCanvas(windowWidth, windowHeight);
	// canvas.parent('timeline-holder');
 // 	canvas.id('timeline-sketch');
}

function draw() {
	timeline.display();

	// plans.forEach(function(item){
	// 	if (!movables.includes(item)){
	// 		select('#'.concat(item)).mousePressed(movePlan);
	// 	}
	// });

	// if (dragging){

	// 	select('#'.concat(this.elt.id)).position(mouseX-, height-80);

	// }

}

var dragging = false;

function windowResized() {
	resizeCanvas(windowWidth, constrain(windowHeight/4, 120, 10000));
	timeline.w = windowWidth;
	timeline.h = constrain(windowHeight/4, 120, 10000);
}

function keyPressed(){

}

function mousePressed(){
	
}