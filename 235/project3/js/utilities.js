	// http://paulbourke.net/miscellaneous/interpolation/

	// we use this to interpolate the ship towards the mouse position
	function lerp(start, end, amt) {
	    return start * (1 - amt) + amt * end;
	}

	// we didn't use this one
	function cosineInterpolate(y1, y2, amt) {
	    let amt2 = (1 - Math.cos(amt * Math.PI)) / 2;
	    return (y1 * (1 - amt2)) + (y2 * amt2);
	}

	// we use this to keep the ship on the screen
	function clamp(val, min, max) {
	    return val < min ? min : (val > max ? max : val);
	}

	// bounding box collision detection - it compares PIXI.Rectangles
	function rectsIntersect(a, b) {
	    var ab = a.getBounds();
	    var bb = b.getBounds();
	    return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
	}

	// these 2 helpers are used by classes.js
	function getRandomUnitVector() {
	    let x = getRandom(-1, 1);
	    let y = getRandom(-1, 1);
	    let length = Math.sqrt(x * x + y * y);
	    if (length == 0) { // very unlikely
	        x = 1; // point right
	        y = 0;
	        length = 1;
	    } else {
	        x /= length;
	        y /= length;
	    }

	    return { x: x, y: y };
	}

	function getRandom(min, max) {
	    return Math.random() * (max - min) + min;
	}

	function Format(n, d) {
	    x = ('' + n).length;
	    //3
	    //Formatting Error for values of x = 3
	    p = Math.pow;
	    d = p(10, d);
	    //10
	    if (x % 3 == 0) {
	        g = Math.round(n * d / p(10, (x - 3))) / d;
	        //1. Math.floor(100 * 1/ 10 ^ 3)/1
	        return g + " kMBTQ" [Math.floor((x - 1) / 3)];
	    }
	    x -= x % 3;
	    //x = 3

	    g = Math.round(n * d / p(10, x)) / d;
	    //1. Math.floor(100 * 1/ 10 ^ 3)/1
	    return g + " kMBTQ" [x / 3];
	}

	function FormatTime(n){
		return `${AtLeastTwoZeroes(Math.trunc((n/3600)))}:${AtLeastTwoZeroes(Math.trunc((n/60) % 60))}:${AtLeastTwoZeroes(Math.trunc(n % 60))}`;
	}

	function AtLeastTwoZeroes(n){
		if(n < 10){
			return `0${n}`
		}else{
			return n;
		}
	}