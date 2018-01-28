var canvas, timeline;
var movables = []

var show_hours = true;

function setup() {
	timeline = new Timeline();

 	canvas = createCanvas(windowWidth, 160);
 	canvas.parent('timeline-holder');
}

function draw() {
	timeline.display();

	plans.forEach(function(item){
		if (!movables.includes(item)){
			select('#'.concat(item)).mousePressed(movePlan);
			}
	});

	// if (dragging){

	// 	select('#'.concat(this.elt.id)).position(mouseX-, height-80);

	// }

}

var dragging = false;

function movePlan(){
	// console.log(this.elt);
	select('#'.concat(this.elt.id)).position(mouseX-60, 30);


	console.log(this.elt.id);
	timeline.hour_idx = parseInt(this.elt.id.split("-")[1]);
}

function windowResized() {
	resizeCanvas(windowWidth, 160);
	timeline.w = windowWidth;
}

function keyPressed(){
	// if (plans.length > 0){
	// 	plans.pop().remove();
	// 	console.log("removed!");
	// } else {
	// 	console.log("not removed!");
	// }
}

function mousePressed(){
	// show_hours = !show_hours;
}
// function mouseReleased(){
// 	show_hours = false;
// }


