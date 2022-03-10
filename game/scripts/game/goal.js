'use strict';

/**
 * Initialize a new goal tile.
 * @class
 * @extends GridOccupant
 * @param {Number} x - The x-coordinate of the goal on the grid
 * @param {Number} y - The y-coordinate of the goal on the grid
 * @param {Grid} grid - The grid to which the goal is to be added
 */
function Goal(x, y, grid) {
	// Call the superclass constructor.
	GridOccupant.call(this, x, y, grid);
	
	this._image = Goal.SPRITE_SHEET_IMAGE;
	this._spriteData = Goal.SPRITE_SHEET_DATA;
	
	this._currentAnim = this._spriteData.animations.exit;
	this._currentFrame = 0;
	this._frameRate = 1000 / 30; // In frames per millisecond
	this._loopAnim = true;
}

// Define static constants.
/** {Color} The color of the goal tile */
Goal.COLOR = new Color(255, 255, 255);
/** {Color} The outline color of the goal tile */
Goal.LINE_COLOR = new Color(54, 0, 204);
/** {String} The path from the root to the sprite sheet JSON and image files */
Goal.SPRITE_SHEET_PATH = 'images/game/exit';
/** {Image} The goal sprite sheet image */
Goal.SPRITE_SHEET_IMAGE;
/** {Object} The goal sprite sheet data */
Goal.SPRITE_SHEET_DATA;

/**
 * @static
 * Load the goal sprite sheet.
 * @returns {Promise} - Resolves when loaded
 */
Goal.loadAssets = function () {
	var imageLoadPromise = Utils.loadSpriteSheetImage(Goal.SPRITE_SHEET_PATH)
			.then(function (image) { Goal.SPRITE_SHEET_IMAGE = image; }),
		dataLoadPromise = Utils.loadSpriteSheetData(Goal.SPRITE_SHEET_PATH)
			.then(function (data) { Goal.SPRITE_SHEET_DATA = data; });
	return Promise.all([imageLoadPromise, dataLoadPromise]);
};

// Inherit from GridOccupant.
Goal.prototype = Object.create(GridOccupant.prototype);

/**
 * Inform that the goal tile cannot be moved.
 * @returns {Boolean} - That the goal cannot be moved
 */
Goal.prototype.canMove = function (movement) {
	return false;
};

/**
 * Do not allow the goal tile to be moved.
 * @returns {Boolean} - That the goal cannot be moved
 */
Goal.prototype.tryMove = function (movement) {
	return false;
};

/**
 * Draw the goal tile to the canvas.
 * @override
 * @param {CanvasRenderingContext2D} ctx - The drawing context for the game canvas
 */
Goal.prototype.draw = function (ctx, blockSize) {
	var x = this.x * blockSize,
		y = this.y * blockSize,
		frameName = this._currentAnim[this._currentFrame],
		frameData = this._spriteData.frames[frameName].frame;
	
	ctx.drawImage(
		this._image,
		frameData.x, frameData.y,
		frameData.w, frameData.h,
		x, y,
		blockSize, blockSize);
};
