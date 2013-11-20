/*
+-----------------------------------------------------------------------------+

	@grahamzibar presents:
	
		____________________             ________________
		___  ____/_  /___  /___________________  /_  ___/
		__  __/  _  __/_  __ \  _ \_  ___/__ _  /_____ \ 
		_  /___  / /_ _  / / /  __/  /   / /_/ / ____/ / 
		/_____/  \__/ /_/ /_/\___//_/    \____/  /____/
	
	
	* version 0.1.1 - ALPHA
	* https://www.github.com/grahamzibar/EtherJS
	
	* This engine was GREATLY inspired by Coffee Physics.  A very well made
	JavaScript physics engine written with CoffeeScript.  Be sure to check-out
	that project and show some love!
	
		* https://github.com/soulwire/Coffee-Physics

+-----------------------------------------------------------------------------+
*/
window.ether = new (function EtherModule() {
	/*
	+-------------------------------------------------------------------------+
		
		Vector
		
			Things have direction AND magnitude!  How crazy.  Use this to
			specify direction, position, etc.
		
	+-------------------------------------------------------------------------+
	*/
	var Vector = this.Vector = function Vector(_x, _y, _z) {
		_x = _x != null ? _x : 0.0;
		_y = _y != null ? _y : 0.0;
		_z = _z != null ? _z : 0.0;
		
		this.__defineGetter__('x', function() {
			return _x;
		});
		this.__defineGetter__('y', function() {
			return _y;
		});
		this.__defineGetter__('z', function() {
			return _z;
		});
		this.__defineSetter__('x', function(x) {
			_x = x;
		});
		this.__defineSetter__('y', function(y) {
			_y = y;
		});
		this.__defineSetter__('z', function(z) {
			_z = z;
		});
		
		this.add = function(v) {
			_x += v.x;
			_y += v.y;
			_z += v.z;
		};

		this.sub = function(v) {
			_x -= v.x;
			_y -= v.y;
			_z -= v.z;
		};

		this.scale = function(f) {
			_x *= f;
			_y *= f;
			_z *= f;
		};
		
		this.dot = function(v) {
			return _x * v.x + _y * v.y + _z * v.z;
		};
		
		this.cross = function(v) {
			return _x * v.y - _y * v.x - _z * v.z;
		};
		
		this.mag = function() {
			return Math.sqrt(_x * _x + _y * _y + _z * _z);
		};
		
		this.magSq = function() {
			return _x * _x + _y * _y + _z * _z;
		};
		
		this.dist = function(v) {
			var dx = v.x - _x;
			var dy = v.y - _y;
			var dz = v.z - _z;
			return Math.sqrt(dx * dx + dy * dy + dz * dz);
		};
		
		this.distSq = function(v) {
			var dx = v.x - _x;
			var dy = v.y - _y;
			var dz = v.z - _z;
			return dx * dx + dy * dy + dz * dz;
		};
		
		this.norm = function() {
			var m = Math.sqrt(_x * _x + _y * _y + _z * _z);
			_x /= m;
			_y /= m;
			_z /= m;
		};
		
		this.limit = function(l) {
			var mSq = _x * _x + _y * _y + _z * _z;
			if (mSq > l * l) {
				var m = Math.sqrt(mSq);
				_x /= m;
				_y /= m;
				_z /= m;
				_x *= l;
				_y *= l;
				_z *= l;
			}
		};
		
		this.copy = function(v) {
			_x = v.x;
			_y = v.y;
			_z = v.z;
		};
		
		this.clone = function() {
			return new Vector(_x, _y, _z);
		};
		
		this.clear = function() {
			_x = 0.0;
			_y = 0.0;
			_z = 0.0;
		};
	};
	Vector.add = function(v1, v2) {
		return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
	};
	Vector.sub = function(v1, v2) {
		return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
	};
	Vector.project = function(v1, v2) {
		return v1.clone().scale((v1.dot(v2)) / v1.magSq());
	};
	/**/
	
	
	/*
	+-------------------------------------------------------------------------+
		
		Particle
		
			Particles occupy the universe.  Use this as the base class to
			describe elements in your realm.
		
	+-------------------------------------------------------------------------+
	*/
	var Particle = this.Particle = function Particle(_mass) {
		var __self__ = this;
		
		this.mass = _mass != null ? _mass : 1.0;
		this.massInv = 1.0 / this.mass;
		
		this.display = null;
		
		// Currently, particles can ONLY be spheres. This needs to be changed
		// Particles should have their own function that specifies if it's
		// within the bounds of another particle. That could get messy.
		this.radius = 1.0;
		this.radiusSq = 1.0;
		this.fixed = false;
		this.rotate = false;
		this.remove = false;
		
		this.laws = new Array();
		this.pos = new Vector();
		this.vel = new Vector();
		this.acc = new Vector();
		// Should we devise a better we to store old?
		this.old = {
			pos: new Vector(),
			vel: new Vector(),
			acc: new Vector()
		};
		this.rotation = 0.0; // Change to a vector
	};
	Particle.prototype.moveTo = function(pos) {
		this.pos.copy(pos);
		this.old.pos.copy(pos);
	};
	Particle.prototype.setMass = function(mass) {
		this.mass = mass;
		this.massInv = 1.0 / mass;
	};
	Particle.prototype.setRadius = function(radius) {
		this.radius = radius;
		this.radiusSq = radius * radius;
	};
	Particle.prototype.update = function(dt, index) {
		if (this.fixed)
			return;
			
		for (var i = 0, len = this.laws.length; i < len; i++)
			this.laws[i].enforce(this, dt, index);
		
		// This is NOT how it works -- MUST CHANGE
		if (this.rotate)
			this.rotation = (this.pos.x / this.radius);
	};
	Particle.prototype.onremove = function() {
		//
	};
	/**/
	
	
	/*
	+-------------------------------------------------------------------------+
		
		Universe
		
			The realm in which particles reside.
		
	+-------------------------------------------------------------------------+
	*/
	var Universe = this.Universe = function Universe() {
		var __self__ = this;
		
		var TIME_STEP = 0.0167; // 1 / 60
		var MAX_STEPS = 4;
		
		var _time = 0.0;
		var _clock = null;
		var _buffer = 0.0;
		
		this.viscosity = 0.005;
		this.laws = new Array();
		this.particles = new Array();
		
		var apply = function(ts) {
			var _this = __self__;
			var tsSq = ts * ts;
			var drag = 1.0 - _this.viscosity;
			
			for (var i = 0, len = _this.particles.length; i < len; i++) {
				var particle = _this.particles[i];
				
				for (var j = 0, len1 = _this.laws.length; j < len1; j++)
					_this.laws[j].enforce(particle, ts, i);
					
				particle.update(ts, i);
				
				if (particle.remove) {
					_this.particles.splice(i, 1);
					particle.onremove.call(particle);
					len -= 1;
					i -= 1;
					continue;
				}
				
				integrate(particle, ts, tsSq, drag);
				_this.render(particle, i);
			}
		};
		
		var integrate = function(p, dt, dtSq, drag) {
			if (!(!p.fixed))
				return;
			
			p.acc.scale(p.massInv);
			//p.vel.copy(p.pos);
			//p.vel.sub(p.old.pos);
			if (drag)
				p.vel.scale(drag);
			
			p.old.pos.copy(p.pos);
			p.acc.scale(dtSq);
			p.vel.add(p.acc);
			p.pos.add(p.vel);
		};
		
		this.step = function() {
			if (!_clock)
				_clock = (new Date()).getTime();
			
			var time = new Date().getTime();
			var delta = time - _clock;
			
			if (delta <= 0.0)
				return;
			
			delta *= 0.001;
			_clock = time;
			_buffer += delta;
			
			var i = 0;
			while (_buffer >= TIME_STEP && ++i < MAX_STEPS) {
				apply(TIME_STEP);
				_buffer -= TIME_STEP;
				_time += TIME_STEP;
			}
		};
		
		this.render = function(particle) {
		};
		
		this.renderAll = function() {
			var _this = __self__;
			for (var i = 0, parts = _this.particles, len = parts.length; i < len; i++)
				_this.render(parts[i]);
		};
	};
	/**/
	
	
	/*
	+-------------------------------------------------------------------------+
		
		DOMUniverse
		
			A less abstract version of Universe that associates the physics
			calculated by the Universe with DOM elements.
		
	+-------------------------------------------------------------------------+
	*/
	var DOMUniverse = this.DOMUniverse = function DOMUniverse(_container) {
		this.inheritFrom = Universe;
		this.inheritFrom();
		delete this.inheritFrom;
		
		this.render = function(particle) {
			var transform = 'translate3d(';
			transform += Math.floor(particle.pos.x);
			transform += 'px, ';
			transform += Math.floor(particle.pos.y);
			transform += 'px, ';
			transform += Math.floor(particle.pos.z);
			transform += 'px) rotate(';
			transform += particle.rotation;
			transform += 'rad)';
			particle.display.style.WebkitTransform = transform;
		};
	};
	/**/
})();
/*
+-----------------------------------------------------------------------------+
	
	written & directed by:
	             _                 _ _           
	 ___ ___ ___| |_ ___ _____ ___|_| |_ ___ ___
	| . |  _| .'|   | .'|     |- _| | . | .'|  _|
	|_  |_| |__,|_|_|__,|_|_|_|___|_|___|__,|_|
	|___|

+-----------------------------------------------------------------------------+
*/