/*
+-------------------------------------------------------------------------+
	
	Random
	
		Appends auxillary functions to the Math object for calculating
		randomization. This can be EXTREMELY useful!
	
+-------------------------------------------------------------------------+
*/
Math.rand_utils = new (function Random() {
	this.range = function(min, max) {
		if (max == null) {
			max = min;
			min = 0;
		}
		return min + Math.random() * (max - min);
	};
	this.int = function(min, max) {
		if (max == null) {
			max = min;
			min = 0;
		}
		return Math.floor(min + Math.random() * (max - min));
	};
	this.sign = function(prob) {
		if (prob == null)
			prob = 0.5;
		if (Math.random() < prob)
			return 1;
		return -1;
	};
	this.bool = function(prob) {
		if (prob == null)
			prob = 0.5;
		return Math.random() < prob;
	};
	this.item = function(list) {
		return list[Math.floor(Math.random() * list.length)];
	};
})();