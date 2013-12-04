if (!window.ether.laws)
	ether.laws = new Object();

ether.laws.Bounds = function Bounds(_min, _max, _factor) {

	var tween = function() {
		_factor *= 0.9;
		if (_factor < 0.0625)
			_factor = 0;
	};

	this.enforce = function(p, dt, index) {
		if (p.pos.x - p.radius - 0.5 < _min.x) {
			p.pos.x = _min.x + p.radius;
			p.vel.x *= -_factor;
			tween();
		} else if (p.pos.x + p.radius + 0.5 > _max.x) {
			p.pos.x = _max.x - p.radius;
			p.vel.x *= -_factor;
			tween();
		}

		if (p.pos.y - p.radius + 0.5 < _min.y) {
			p.pos.y = _min.y + p.radius;
			p.vel.y *= -_factor;
			tween();
		} else if (p.pos.y + p.radius + 0.5 > _max.y) {
			p.pos.y = _max.y - p.radius;
			p.vel.y *= -_factor;
			tween();
		}
	};
};