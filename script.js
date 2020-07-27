var all = [];

function setup() {
	createCanvas(500, 500).center();

	all.push(new population(50, 100, "white"));
	
}

function draw() {
	background(51);
	for (let i=0; i<all.length; i++) all[i].updateAll();
}

function dot(clr) {
	this.pos = createVector(random(width), random(height));
	this.vel = p5.Vector.random2D();
	this.clr = clr;
	this.r = 8;
}
dot.prototype.update = function() {
	this.pos.add(this.vel);
};
dot.prototype.show = function() {
	stroke(this.clr);
	strokeWeight(this.r);
	point(this.pos.x , this.pos.y);
};
dot.prototype.border = function() {
	if (this.pos.x < -this.r)  this.pos.x = width + this.r;
  	if (this.pos.y < -this.r)  this.pos.y = height + this.r;
 	if (this.pos.x > width + this.r) this.pos.x = -this.r;
 	if (this.pos.y > height + this.r) this.pos.y = -this.r;
};



function population(n, d, clr) {
	this.amount = n;
	this.clr = clr;
	this.MAX = d;
	this.elements = new Array(this.amount);
	for (let i=0; i<this.amount; i++) {
		this.elements[i] = new dot(this.clr);
	}
}
population.prototype.updateAll = function() {
	this.show();
	this.elements.forEach(function(val, i) {
		val.update();
		val.border();
		val.show();
	});
};

population.prototype.group = function() {
	let groups = [];
	for (let i=0; i<this.amount; i++) {
		let gr = [];
		let dot1 = this.elements[i];
		for (let j=0; j<this.amount; j++) {
			if (i == j) continue;
			let dot2 = this.elements[j];
			//<================================================================>
			let d1 = dist(dot1.pos.x, dot1.pos.y, dot2.pos.x, dot2.pos.y);
			//<================================================================>
			if (d1 <= this.MAX) gr.push({x:dot2.pos.x, y:dot2.pos.y});
			
		}
		let h = convexHull(gr);
		
		groups.push(h);
	}

	return groups;
};

population.prototype.show = function() {
	let group = this.group();

	stroke(this.clr);
	noFill();
	strokeWeight(2);
	for (let j=0; j<group.length; j++) {
		beginShape();
		for (let i=0; i<group[j].length; i++) 
			vertex(group[j][i].x, group[j][i].y);
		endShape();
	};
};