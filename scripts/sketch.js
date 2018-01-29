var canvas, timeline;
var movables = []

var show_hours = true;

function setup() {
	timeline = new Timeline(windowWidth, constrain(windowHeight/4, 120, 10000));

 	canvas = createCanvas(windowWidth, constrain(windowHeight/4, 120, 10000));
	canvas.parent('timeline');
 	canvas.id('timeline-sketch');
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
	resizeCanvas(windowWidth, constrain(windowHeight/4, 120, 10000));
	timeline.w = windowWidth;
	timeline.h = constrain(windowHeight/4, 120, 10000);
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


