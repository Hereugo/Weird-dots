// this is a slow convex hull calculation that you can count on to work
// it's careful of the epsilon cases, and wether or not
//   to include collinear points along the hull edge

var EPSILON_LOW =  0.003;
var EPSILON =      0.00001;
var EPSILON_HIGH = 0.00000001;

function epsilonEqual(a, b, epsilon){
	if(epsilon === undefined){ epsilon = EPSILON_HIGH; }
	return ( Math.abs(a - b) < epsilon );
}

function arrayContainsObject(array, object) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === object) {
            return true;
        }
    }
    return false;
}

// points should be an array of objects {x:___, y:___} where ___ values should be numbers
function convexHull(points){
	// validate input
	if(points === undefined || points.length === 0){ return []; }
	// # points in the convex hull before escaping function
	var INFINITE_LOOP = 10000;
	// sort points by x and y
	var sorted = points.sort(function(a,b){
			if(a.x-b.x < -EPSILON_HIGH){ return -1; }
			if(a.x-b.x > EPSILON_HIGH){ return 1; }
			if(a.y-b.y < -EPSILON_HIGH){ return -1; }
			if(a.y-b.y > EPSILON_HIGH){ return 1; }
			return 0;});
	var hull = [];
	hull.push(sorted[0]);
	// the current direction the perimeter walker is facing
	var ang = 0;  
	var infiniteLoop = 0;
	do{
		infiniteLoop++;
		var h = hull.length-1;
		var angles = sorted
			// remove all points in the same location from this search
			.filter(function(el){ 
				return !(epsilonEqual(el.x, hull[h].x, EPSILON_HIGH) && epsilonEqual(el.y, hull[h].y, EPSILON_HIGH)) })
			// sort by angle, setting lowest values next to "ang"
			.map(function(el){
				var angle = Math.atan2(hull[h].y - el.y, hull[h].x - el.x);
				while(angle < ang){ angle += Math.PI*2; }
				return {node:el, angle:angle}; })
			.sort(function(a,b){return (a.angle < b.angle)?-1:(a.angle > b.angle)?1:0});
		if(angles.length === 0){ return []; }
		// narrowest-most right turn
		var rightTurn = angles[0];
		// collect all other points that are collinear along the same ray
		angles = angles.filter(function(el){ return epsilonEqual(rightTurn.angle, el.angle, EPSILON_LOW); })
		// sort collinear points by their distances from the connecting point
		.map(function(el){ 
			var distance = Math.sqrt(Math.pow(hull[h].x-el.node.x, 2) + Math.pow(hull[h].y-el.node.y, 2));
			el.distance = distance;
			return el;})
		// (OPTION 1) exclude all collinear points along the hull 
		.sort(function(a,b){return (a.distance < b.distance)?1:(a.distance > b.distance)?-1:0});
		// (OPTION 2) include all collinear points along the hull
		// .sort(function(a,b){return (a.distance < b.distance)?-1:(a.distance > b.distance)?1:0});
		// if the point is already in the convex hull, we've made a loop. we're done
		if(arrayContainsObject(hull, angles[0].node)){ return hull; }
		// add point to hull, prepare to loop again
		hull.push(angles[0].node);
		// update walking direction with the angle to the new point
		ang = Math.atan2( hull[h].y - angles[0].node.y, hull[h].x - angles[0].node.x);
	}while(infiniteLoop < INFINITE_LOOP);
	return [];
}