'use strict';

/**
 * Initialize a new player.
 * @class
 * @extends GridOccupant
 * @param {Number} x - The x-coordinate of the player on the grid
 * @param {Number} y - The y-coordinate of the player on the grid
 * @param {Grid} grid - The grid to which the player is to be added
 */
function Player(x, y, grid) {
	// Call the superclass constructor.
	GridOccupant.call(this, x, y, grid);
	
	this._image = Player.SPRITE_SHEET_IMAGE;
	this._spriteData = Player.SPRITE_SHEET_DATA;
	
	// Start facing up.
	this._heading = 90;
	
	this._currentAnim = this._spriteData.animations.n_push;
	this._currentFrame = 0;
	this._animPlaying = false;
}

// Initialize static constants.
/** {String} The path from the root to the sprite sheet image file */
Player.SPRITE_SHEET_PATH = 'images/game/player';
/** {Image} The player sprite sheet image */
Player.SPRITE_SHEET_IMAGE;
/** {Object} The player sprite sheet data */
Player.SPRITE_SHEET_DATA;

/**
 * @static
 * Load the player sprite sheet.
 * @returns {Promise} - Resolves when loaded
 */
Player.loadAssets = function () {
	var imageLoadPromise = Utils.loadSpriteSheetImage(Player.SPRITE_SHEET_PATH)
			.then(function (image) { Player.SPRITE_SHEET_IMAGE = image; }),
		dataLoadPromise = Utils.loadSpriteSheetData(Player.SPRITE_SHEET_PATH)
			.then(function (data) { Player.SPRITE_SHEET_DATA = data; });
	return Promise.all([imageLoadPromise, dataLoadPromise]);
};

// Inherit from GridOccupant.
Player.prototype = Object.create(GridOccupant.prototype);

/**
 * Move the player to a new location, if possible, and face in the direction of the movement.
 * @override
 * @param {Vector2D} movement - The vector by which to move the player
 * @returns {Boolean} - Whether the player could be moved
 */
Player.prototype.tryMove = function (movement) {
	// Face in the direction of the movement.
	switch (movement) {
		case Vector2D.RIGHT:
			this._heading = 'e';
			break;
		case Vector2D.UP:
			this._heading = 'n';
			break;
		case Vector2D.LEFT:
			this._heading = 'w';
			break;
		case Vector2D.DOWN:
			this._heading = 's';
			break;
	}
	this._currentFrame = 0;
	// Call the superclass implementation of the function to determine what happened and how to handle it.
	if (GridOccupant.prototype.tryMove.call(this, movement)) {
		this._currentAnim = this._spriteData.animations[this._heading + '_push'];
		return true;
	} else {
		document.getElementById('cannot-move-sound').play();
		this._currentAnim = this._spriteData.animations[this._heading + '_crash'];
		return false;
	}
};

/**
 * Draw the player to the canvas.
 * @override
 * @param {CanvasRenderingContext2D} ctx - The drawing context for the game canvas
 */
Player.prototype.draw = function (ctx, blockSize) {
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
