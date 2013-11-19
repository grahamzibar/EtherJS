if (!ether.laws)
	ether.laws = new Object();

ether.laws.Collision = function Collision(_pool) {
	this.pool = _pool == null ? new Array() : _pool;
	this.delta = new ether.Vector();
};
ether.laws.Collision.prototype.enforce = function(p1, dt, index) {
	var delta = this.delta;
	var pool = this.pool.slice(index + 1);
	for (var i = 0, len = pool.length; i < len; i++) {
		var p2 = pool[i];
		delta.copy(p2.pos);
		delta.sub(p1.pos);
		var distSq = delta.magSq();
		var radii = p1.radius + p2.radius;
		
		if (distSq > radii * radii)
			continue;
		
		// Change the following?
		var overlap = radii - Math.sqrt(distSq);
		var mass = p1.mass + p2.mass;
		delta.norm();
		
		var delta2 = delta.clone();
		delta2.scale(overlap * -p2.mass / mass);
		p1.vel.add(delta2);
		
		delta.scale(overlap * p1.mass / mass);
		p2.vel.add(delta);
	}
};