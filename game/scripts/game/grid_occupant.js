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
	
	/** {Number} The current frame in the current animation */
	this._currentFrame = 0;
	/** {Array<String>} The list of frame IDs for the current animation */
	this._currentAnim = [];
	/** {Boolean} Whether to loop the current animation */
	this._loopAnim = false;
	/** {Number} The sprite animation frame rate in frames per millisecond */
	this._frameRate = 1000 / 30; // In frames per millisecond
	
	grid.addOccupant(this);
}

// Initialize static constants.
/** {Number} The duration of grid occupant movements in frames */
GridOccupant.MOVE_DURATION = 5;

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

GridOccupant.prototype = {
	/**
	 * Check whether the grid occupant can be moved to a location.
	 * @param {Vector2D} movement - The vector by which the occupant would be moved
	 * @returns {Boolean} - Whether the occupant could be moved
	 */
	canMove: function (movement) {
		return this._grid.canMove(this, movement);
	},
	
	/**
	 * Move the grid occupant to a new location, if possible.
	 * @param {Vector2D} movement - The vector by which to move the occupant
	 * @returns {Boolean} - Whether the occupant could be moved
	 */
	tryMove: function (movement) {
		if (this._grid.tryMove(this, movement)) {
			this.x = this.gridX;
			this.y = this.gridY;
			this.gridX += movement.x;
			this.gridY += movement.y;
			this._motionTween = new Tween(this, movement, GridOccupant.MOVE_DURATION);
			this._motionTween.onfinish = (function () {
				this._motionTween = undefined;
			}).bind(this);
			return true;
		} else {
			return false;
		}
	},
	
	/**
	 * Update the grid occupant.
	 */
	update: function (ctx) {
		// Handle movement.
		if (this._motionTween) {
			this._motionTween.update();
		}
		if (this._currentFrame !== -1) {
			if (this._currentFrame < this._currentAnim.length - 1) {
				this._currentFrame++;
			} else if (this._loopAnim) {
				this._currentFrame = 0;
			}
		}
	},
	
	/**
	 * Draw the grid occupant to the canvas.
	 * @abstract
	 * @param {CanvasRenderingContext2D} ctx - The drawing context for the game canvas
	 * @param {Number} blockSize - The pixel size of one grid square at the current scale
	 */
	draw: function (ctx, blockSize) {
		var x = this.x * blockSize,
			y = this.y * blockSize,
			frameName = this._currentAnim[this._currentFrame],
			frameData = this.SPRITE_SHEET_DATA.frames[frameName].frame;
		
		ctx.drawImage(
			this.SPRITE_SHEET_IMAGE,
			frameData.x, frameData.y,
			frameData.w, frameData.h,
			x, y,
			blockSize, blockSize);
	}
};
