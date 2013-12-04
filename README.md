>	@grahamzibar presents:
>	
>	____________________             ________________
>	___  ____/_  /___  /___________________  /_  ___/
>	__  __/  _  __/_  __ \  _ \_  ___/__ _  /_____ \ 
>	_  /___  / /_ _  / / /  __/  /   / /_/ / ____/ / 
>	/_____/  \__/ /_/ /_/\___//_/    \____/  /____/
>
>	* version 0.1.1 - ALPHA
>	* https://www.github.com/grahamzibar/EtherJS
>
>	* This engine was GREATLY inspired by Coffee Physics.  
>		A very well made JavaScript physics engine written  
>		with CoffeeScript.  Be sure to check-out that  
>		project and show some love!


## A (good) JavaScript physics library.

But how does it work?  Let me show you.

### Getting Started

Include Ether.js into your project.  You may also want to use some of the laws
provided with the project.  These are located in _extra/laws_.  This might work
like so:

```
<script type="text/javascript" src="extra/laws/Bounds.js"></script>
<script type="text/javascript" src="extra/laws/Gravity.js"></script>
<script type="text/javascript" src="Ether.js"></script>
```

depending where in your project you've copied EtherJS.

### The Universe

EtherJS has a `Universe` class.  We use this to get started.

```
var universe = new ether.Universe();
```

Cool!  But this doesn't do much on its own.  We need to tell the universe how
to _render_ content.  `Universe` has a `render` function we can override.
Included in the project is a `DOMUniverse` class.  I'll show you how I made it:

1. Create the class
   ```
   ether.DOMUniverse = function DOMUniverse() {
   };
   ```
2. Inherit from `Universe`
   ```
   ether.DOMUniverse = function DOMUniverse() {
   		this.inheritFrom = ether.Universe;
   		this.inheritFrom();
   		delete this.inheritFrom;
   };
   ```
3. Add a parameter which is intended to receive a DOM element as the argument
   ```
   ether.DOMUniverse = function DOMUniverse(_container) {
   		this.inheritFrom = ether.Universe;
   		this.inheritFrom();
   		delete this.inheritFrom;
   		
   		this.display = _container;
   		// We save this to the display property inherited from ether.Universe
   };
   ```
4. Implement the render function inherited from `ether.Universe`
```
ether.DOMUniverse = function DOMUniverse(_container) {
		this.inheritFrom = ether.Universe;
		this.inheritFrom();
		delete this.inheritFrom;
		
		this.display = _container;
		
		// We render this one particle at a time.
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
```

And that's how we create a universe!  The `render` function handles the
rendering of the position and rotation of a particle and we handle it one
particle at a time.  Notice the `particle` object has a property called
`display`.  This is a recurring thing when we refer to the _view_ of an
object in this engine.  In this scenario, the `display` refers to a DOM element
but it could easily be some class that draws to a canvas or some other layer of
abstraction above the DOM.  All this means is we have to override this _one_
function to account for that difference.  Pretty cool, huh?  From here, it seems
trivial to then create a renderer for IE.  Perhaps `IEUniverse`? Or `Multiverse`
which implements the `render` function to account for all browsers.  Nice.

# TODO: more documentation.