'use strict';

/**
 * Initialize a new TitleParticle.
 * @param {HTMLImageElement} image - The image to use for the particle
 * @param {CanvasRenderingContext2D} ctx - The canvas context the particle will be drawn to
 */
function TitleParticle(image, ctx) {
	this._image = image;
	
	this._x;
	this._y;
	this._waveOffset;
	this._animStep = 0;
	
	this._reinit(ctx);
}

// Initialize constants.
TitleParticle.prototype.MIN_Y = 0;
TitleParticle.prototype.SPEED = 0.05;
TitleParticle.prototype.SPRITE_HEIGHT = 16;
TitleParticle.prototype.WAVE_AMPLITUDE = 64;
TitleParticle.prototype.WAVE_WAVELENGTH = 512;

TitleParticle.prototype._reinit = function (ctx) {
	this._x = Utils.randInt(0, window.innerWidth);
	this._y = Utils.randInt(ctx.canvas.height + this.SPRITE_HEIGHT, ctx.canvas.height + ctx.canvas.height);
	this._waveOffset = Utils.randInt(0, this.WAVE_WAVELENGTH);
}

TitleParticle.prototype._getOpacity = function (ctx) {
	return Math.sin((this._y + this.SPRITE_HEIGHT) * Math.PI / (2 * ctx.canvas.height + this.SPRITE_HEIGHT));
};

TitleParticle.prototype._getWaveX = function () {
	return Math.sin((this._y + this._waveOffset) * Math.PI / (0.5 * this.WAVE_WAVELENGTH)) * this.WAVE_AMPLITUDE + this._x;
};

TitleParticle.prototype.draw = function (ctx, deltaTime) {
	ctx.save();
	
	ctx.globalAlpha = this._getOpacity(ctx);
	ctx.drawImage(this._image, this._getWaveX(), this._y);
	
	this._y -= this.SPEED * deltaTime;
	if (this._y < this.MIN_Y) {
		this._reinit(ctx);
	}
	
	ctx.restore();
};
