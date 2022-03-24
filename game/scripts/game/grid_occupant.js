'use strict';

/**
 * Base constructor for a grid occupant
 * @class
 * @param {Number} x - The x-coordinate of the occupant on the grid
 * @param {Number} y - The y-coordinate of the occupant on the grid
 * @param {Grid} grid - The grid to which the occupant is to be added
 */
function GridOccupant(x, y, grid) {
	this._grid = grid;
	
	// Initialize private variables for animation.
	this._motionTween = undefined;
	
	this.gridX = x;
	this.gridY = y;
	this.x = x;
	this.y = y;
	
	/** {Number} The current frame in the current animation (**may be fractional!**) */
	this._currentFrame = 0;
	/** {Array<String>} The list of frame IDs for the current animation */
	this._currentAnim = [];
	/** {Boolean} Whether to loop the current animation */
	this._loopAnim = false;
	/** {Number} The sprite animation frame rate in frames per millisecond */
	this._frameRate = 30 / 1000; // In frames per millisecond
	
	grid.addOccupant(this);
}

// Initialize static constants.
/** {Number} The duration of grid occupant movements in milliseconds */
GridOccupant.prototype.MOVE_DURATION = 5000 / 60;

/**
 * @static
 * Load a GridOccupant subclass's sprite sheet image and data.
 * Assumes SubClass.prototype.SPRITE_SHEET_PATH is already defined.
 * @param {Function} subclass - The GridOccupant subclass
 * @returns {Promise} - Resolves when the image and data have loaded
 */
GridOccupant.loadAssets = function (subclass) {
	var imageLoadPromise = Utils.loadSpriteSheetImage(subclass.prototype.SPRITE_SHEET_PATH)
			.then(function (image) { subclass.prototype.SPRITE_SHEET_IMAGE = image; }),
		dataLoadPromise = Utils.loadSpriteSheetData(subclass.prototype.SPRITE_SHEET_PATH)
			.then(function (data) { subclass.prototype.SPRITE_SHEET_DATA = data; });
	return Promise.all([imageLoadPromise, dataLoadPromise]);
};

/**
 * Check whether the grid occupant can be moved to a location.
 * @param {Vector2D} movement - The vector by which the occupant would be moved
 * @param {Array<Tetromino>} checkedOccupants - The already checked grid occupants for this move attempt
 * @returns {Boolean} - Whether the occupant could be moved
 */
GridOccupant.prototype.canMove = function (movement, checkedOccupants) {
	return this._grid.canMove(this, movement, checkedOccupants);
};

/**
 * Move the grid occupant to a new location.
 * @param {Vector2D} movement - The vector by which to move the occupant
 */
GridOccupant.prototype.move = function (movement) {
	this.x = this.gridX;
	this.y = this.gridY;
	this.gridX += movement.x;
	this.gridY += movement.y;
	this._motionTween = new Tween(this, movement, this.MOVE_DURATION);
	this._motionTween.onfinish = (function () {
		this._motionTween = undefined;
	}).bind(this);
};

/**
 * Update the grid occupant.
 * @param {Number} deltaTime - The time since the last frame in milliseconds
 */
GridOccupant.prototype.update = function (deltaTime) {
	// Update motion tween animations.
	if (this._motionTween) {
		this._motionTween.update(deltaTime);
	}
	
	// Update sprite animations.
	if (Math.floor(this._currentFrame) < this._currentAnim.length - 1) {
		this._currentFrame += deltaTime * this._frameRate;
		this._currentFrame = Math.min(this._currentFrame, this._currentAnim.length - 1);
	} else if (this._loopAnim) {
		this._currentFrame = 0;
	}
};

/**
 * Draw the grid occupant to the canvas.
 * @abstract
 * @param {CanvasRenderingContext2D} ctx - The drawing context for the game canvas
 * @param {Number} blockSize - The pixel size of one grid square at the current scale
 */
GridOccupant.prototype.draw = function (ctx, blockSize) {
	var x = this.x * blockSize,
		y = this.y * blockSize,
		frameName = this._currentAnim[Math.floor(this._currentFrame)],
		frameData = this.SPRITE_SHEET_DATA.frames[frameName].frame;
	
	ctx.drawImage(
		this.SPRITE_SHEET_IMAGE,
		frameData.x, frameData.y,
		frameData.w, frameData.h,
		x, y,
		blockSize, blockSize);
};
