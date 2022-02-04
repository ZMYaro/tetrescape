'use strict';

/**
 * Initialize a new TitleView.
 * @param {HTMLElement} elem - The element for this view
 * @param {View} [parent] - The next view up, if any
 */
function TitleView(elem, parent) {
	// Call the superclass constructor.
	View.call(this, elem, parent);
	
	
	this._canvas = this.elem.querySelector('#title-canvas');
	this._ctx = this._canvas.getContext('2d');
	
	// Ensure the ember canvas always fits the view.
	window.onresize = this._handleResize.bind(this);
	this._handleResize();
	
	// Set up particle drawing.
	this._lastFrameTime;
	this._initParticles();
	this._boundDraw = this._draw.bind(this);
	requestAnimationFrame(this._boundDraw);
}

// Inherit from View.
TitleView.prototype = Object.create(View.prototype);

// Initialize constants.
TitleView.prototype.PARTICLE_COUNT = Math.floor(window.screen.availWidth * window.screen.availHeight / 50000);


TitleView.prototype._initParticles = function () {
	var particleImage = new Image();
	particleImage.src = 'images/ember.png';
	
	this._particles = new Array(this.PARTICLE_COUNT);
	
	for (var i = 0; i < this._particles.length; i++) {
		this._particles[i] = new TitleParticle(particleImage, this._ctx);
	}
};

/**
 * @private
 * Handle the window being resized.
 */
TitleView.prototype._handleResize = function () {
	this._canvas.width = window.innerWidth;
	this._canvas.height = window.innerHeight  / 2;
	if (this._game) {
		this._game.rescale();
	}
};

TitleView.prototype._draw = function (timestamp) {
	var deltaTime = (timestamp - this._lastFrameTime) || 0;
	this._lastFrameTime = timestamp;
	
	this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
	this._particles.forEach(function (particle) {
		particle.draw(this._ctx, deltaTime);
	}, this);
	
	requestAnimationFrame(this._boundDraw);
}
