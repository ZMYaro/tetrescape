'use strict';

/**
 * Initialize a new TitleView.
 * @param {HTMLElement} elem - The element for this view
 * @param {View} [parent] - The next view up, if any
 */
function TitleView(elem, parent) {
	// Call the superclass constructor.
	MenuView.call(this, elem, parent);
	
	
	this._canvas = this.elem.querySelector('#title-canvas');
	this._ctx = this._canvas.getContext('2d');
	
	// Enable buttons.
	this.elem.querySelector('#play-button').addEventListener('click', function () {
		this.view.openSubview(views.levelSelect);
	});
	this.elem.querySelector('#instructions-button').addEventListener('click', function () {
		this.view.openSubview(views.instructions);
	});
	this.elem.querySelector('#options-button').addEventListener('click', function () {
		this.view.openSubview(views.options);
	});
	this.elem.querySelector('#about-button').addEventListener('click', function () {
		this.view.openSubview(views.about);
	});
	
	// Ensure the ember canvas always fits the view.
	window.onresize = this._handleResize.bind(this);
	this._handleResize();
	
	// Set up particle drawing.
	this._lastFrameTime;
	this._initParticles();
	this._boundDraw = this._draw.bind(this);
}

// Inherit from View.
TitleView.prototype = Object.create(MenuView.prototype);

// Define constants.
/** @override @constant {String} The fragment path for this view */
TitleView.prototype.ROUTE = '';
/** @constant {Number} The number of particles to create for the screen area */
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
};

TitleView.prototype._draw = function (timestamp) {
	var deltaTime = (timestamp - this._lastFrameTime) || 0;
	this._lastFrameTime = timestamp;
	
	this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
	this._particles.forEach(function (particle) {
		particle.draw(this._ctx, deltaTime);
	}, this);
	
	if (this._active && !Utils.shouldReduceMotion) {
		requestAnimationFrame(this._boundDraw);
	}
}


/**
 * Reenable the view and the embers.
 */
TitleView.prototype.resume = function () {
	MenuView.prototype.resume.call(this);
	if (!Utils.shouldReduceMotion) {
		requestAnimationFrame(this._boundDraw);
	}
};
