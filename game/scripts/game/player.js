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
	
	// Start facing up.
	this._currentAnim = this.SPRITE_SHEET_DATA.animations.n_push;
	this._currentFrame = this._currentAnim.length - 1;
}

// Inherit from GridOccupant.
Player.prototype = Object.create(GridOccupant.prototype);

// Define constants.
/** {String} The path from the root to the sprite sheet image file */
Player.prototype.SPRITE_SHEET_PATH = 'images/game/player';
/** {Image} The player sprite sheet image */
Player.prototype.SPRITE_SHEET_IMAGE;
/** {Object} The player sprite sheet data */
Player.prototype.SPRITE_SHEET_DATA;

/**
 * Move the player to a new location, if possible, and face in the direction of the movement.
 * @override
 * @param {Vector2D} movement - The vector by which to move the player
 * @returns {Boolean} - Whether the player could be moved
 */
Player.prototype.tryMove = function (movement) {
	// Face in the direction of the movement.
	var heading = 'n';
	switch (movement) {
		case Vector2D.RIGHT:
			heading = 'e';
			break;
		case Vector2D.UP:
			heading = 'n';
			break;
		case Vector2D.LEFT:
			heading = 'w';
			break;
		case Vector2D.DOWN:
			heading = 's';
			break;
	}
	this._currentFrame = 0;
	// Call the superclass implementation of the function to determine what happened and how to handle it.
	if (GridOccupant.prototype.tryMove.call(this, movement)) {
		this._currentAnim = this.SPRITE_SHEET_DATA.animations[heading + '_push'];
		return true;
	} else {
		document.getElementById('cannot-move-sound').play();
		this._currentAnim = this.SPRITE_SHEET_DATA.animations[heading + '_crash'];
		return false;
	}
};
