if (!window.ether.laws)
	ether.laws = new Object();

ether.laws.Gravity = function Gravity(_acc) {

	this.enforce = function(p) {
		p.vel.add(_acc);
	};

};