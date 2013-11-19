if (!window.ether.laws)
	ether.laws = new Object();

ether.laws.Gravity = function Gravity(_acc) {
	
	this.enforce = function(p, dt, index) {
		p.vel.add(_acc);
		//p.pos.y += _acc.y;
	};
	
};