/*
+-----------------------------------------------------------------------------+

	@grahamzibar presents:
	
		____________________             ________________
		___  ____/_  /___  /___________________  /_  ___/
		__  __/  _  __/_  __ \  _ \_  ___/__ _  /_____ \ 
		_  /___  / /_ _  / / /  __/  /   / /_/ / ____/ / 
		/_____/  \__/ /_/ /_/\___//_/    \____/  /____/
	
	
	https://www.github.com/grahamzibar/etherjs

+-----------------------------------------------------------------------------+
*/
window.ether = new (function EtherModule() {
	/*
	+-------------------------------------------------------------------------+
		
		Random
		
			A static class that provides auxillary functions for
			randomization. Not used internally but is EXTREMELY useful.
		
	+-------------------------------------------------------------------------+
	*/
	this.Random = new (function() {
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
	/**/
	
	
	/*
	+-------------------------------------------------------------------------+
		
		Vector
		
			Things have direction AND magnitude!  How crazy.  Use this to
			specify direction, position, etc.
		
	+-------------------------------------------------------------------------+
	*/
	var Vector = this.Vector = function Vector(_x, _y) {
		_x = _x != null ? _x : 0.0;
		_y = _y != null ? _y : 0.0;
		
		this.__defineGetter__('x', function() {
			return _x;
		});
		this.__defineGetter__('y', function() {
			return _y;
		});
		this.__defineSetter__('x', function(x) {
			_x = x;
		});
		this.__defineSetter__('y', function(y) {
			_y = y;
		});
		
		this.set = function(x, y) {
			_x = x;
			_y = y;
		};
		
		this.add = function(v) {
			_x += v.x;
			_y += v.y;
		};

		this.sub = function(v) {
			_x -= v.x;
			_y -= v.y;
		};

		this.scale = function(f) {
			_x *= f;
			_y *= f;
		};
		
		this.dot = function(v) {
			return _x * v.x + _y * v.y;
		};
		
		this.cross = function(v) {
			// Shouldn't this ALSO have direction?
			return (_x * v.y) - (_y * v.x);
		};
		
		this.mag = function() {
			return Math.sqrt(_x * _x + _y * _y);
		};
		
		this.magSq = function() {
			return _x * _x + _y * _y;
		};
		
		this.dist = function(v) {
			var dx = v.x - _x;
			var dy = v.y - _y;
			return Math.sqrt(dx * dx + dy * dy);
		};
		
		this.distSq = function(v) {
			var dx = v.x - _x;
			var dy = v.y - _y;
			return dx * dx + dy * dy;
		};
		
		this.norm = function() {
			var m = Math.sqrt(_x * _x + _y * _y);
			_x /= m;
			_y /= m;
		};
		
		this.limit = function(l) {
			var mSq = _x * _x + _y * _y;
			if (mSq > l * l) {
				var m = Math.sqrt(mSq);
				_x /= m;
				_y /= m;
				_x *= l;
				_y *= l;
			}
		};
		
		this.copy = function(v) {
			_x = v.x;
			_y = v.y;
		};
		
		this.clone = function() {
			return new Vector(_x, _y);
		};
		
		this.clear = function() {
			_x = 0.0;
			_y = 0.0;
		};
	};
	Vector.add = function(v1, v2) {
		return new Vector(v1.x + v2.x, v1.y + v2.y);
	};
	Vector.sub = function(v1, v2) {
		return new Vector(v1.x - v2.x, v1.y - v2.y);
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
		this.mass = _mass != null ? _mass : 1.0;
		this.massInv = 1.0 / this.mass;
		this.id = 'p' + Particle.GUID++;
		this.radius = 1.0;
		this.radiusSq = 1.0;
		this.fixed = false;
		this.laws = new Array();
		this.pos = new Vector();
		this.vel = new Vector();
		this.acc = new Vector();
		this.rotate = false;
		this.rotation = 0.0;
		this.old = {
			pos: new Vector(),
			vel: new Vector(),
			acc: new Vector()
		};
	};
	Particle.prototype.moveTo = function(pos) {
		this.pos.copy(pos);
		return this.old.pos.copy(pos);
	};
	Particle.prototype.setMass = function(mass) {
		this.mass = mass;
		return this.massInv = 1.0 / mass;
	};
	Particle.prototype.setRadius = function(radius) {
		this.radius = radius;
		return this.radiusSq = radius * radius;
	};
	Particle.prototype.update = function(dt, index) {
		if (this.fixed)
			return;
			
		for (_i = 0, _len = _ref.length; _i < _len; _i++)
			this.laws[i].apply(this, dt, index);
		
		if (this.rotate)
			this.rotation = (this.pos.x / this.radius); // This is NOT how it works
	};
	/**/
	
	
	/*
	+-------------------------------------------------------------------------+
		
		Universe
		
			The realm in which particles reside.
		
	+-------------------------------------------------------------------------+
	*/
	var Universe = this.Universe = function Universe() {
		this.integrator = new Verlet();
		this.timestep = 1.0 / 60;
		this.viscosity = 0.005;
		this.laws = new Array();
		this._time = 0.0;
		this._step = 0.0;
		this._clock = null;
		this._buffer = 0.0;
		this._maxSteps = 4;
		this.particles = new Array();
	};
	Universe.prototype.integrate = function(dt) {
		var drag = 1.0 - this.viscosity;
		for (var i = 0, len = this.particle.length; i < len; i++) {
			var particle = this.particles[i];
			
			// Apply universe laws
			for (var j = 0, len1 = this.laws.length; j < len1; j++) {
				var law = this.laws[j];
				law.apply(particle, dt, i);
			}
			
			// Apply particle behaviours
			particle.update(dt, i);
		}
		
		// Then we use some physics
		this.integrator.integrate(this.particles, dt, drag);
	};
	Universe.prototype.step = function() {
		var delta, i, time, _ref;
		
		if ((_ref = this._clock) == null)
			this._clock = new Date().getTime();
		
		time = new Date().getTime();
		delta = time - this._clock;
		if (delta <= 0.0)
			return;
		
		delta *= 0.001;
		this._clock = time;
		this._buffer += delta;
		i = 0;
		while (this._buffer >= this.timestep && ++i < this._maxSteps) {
			this.integrate(this.timestep);
			this._buffer -= this.timestep;
			this._time += this.timestep;
		}
		
		return this._step = new Date().getTime() - time;
	};
	
	
	
	/*
	+-------------------------------------------------------------------------+
		
		Verlet
		
			Simulates Newton's laws of motion.  True story.
		
	+-------------------------------------------------------------------------+
	*/
	var Verlet = function Verlet() {
		this.integrate = function(particles, dt, drag) {
			var pos = new Vector();
			var dtSq = dt * dt;
			
			for (var i = 0, len = particles.length; i < len; i++) {
				var p = particles[i];
				if (!(!p.fixed))
					continue;
				
				p.acc.scale(p.massInv);
				p.vel.copy(p.pos).sub(p.old.pos);
				if (drag)
					p.vel.scale(drag);
				
				pos.copy(p.pos).add(p.vel.add(p.acc.scale(dtSq)));
				p.old.pos.copy(p.pos);
				p.pos.copy(pos);
			}
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
	this.DOMUniverse = function DOMUniverse(_container) {
		this.inheritFrom = Universe;
		this.inheritFrom();
		delete this.inheritFrom;
		
		var __self__ = this;
		
		this.render = function(particle) {
			
		};
		
		this.renderAll = function() {
			var _this = __self__;
			for (var i = 0, parts = _this.particles, len = parts.length; i < len; i++)
				_this.render(parts[i]);
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