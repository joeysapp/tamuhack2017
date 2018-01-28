var canvas, timeline;
var movables = []

var show_hours = false;

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

}

function movePlan(){
	// console.log(this.elt);
	select('#'.concat(this.elt.id)).position(mouseX-60, height-80);
	console.log(this.elt.id);
	timeline.hour_idx = this.elt.id.split("-")[1];
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
	show_hours = true;
	console.log("MousePressed,", timeline.hour_idx);
}
function mouseReleased(){
	show_hours = false;
}


