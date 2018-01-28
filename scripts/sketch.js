var canvas, timeline;
var movables = []

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

function mouseClicked(){
	// plans.forEach(function(item){
	// 	if (mouseX)
	// 	console.log(item);
	// 	if (!movables.includes(item)){
	// 		// select('#'.concat(item)).mouseClicked(movePlan);
	// 		}
	// });

}

