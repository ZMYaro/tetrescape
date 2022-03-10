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
	
	this._currentAnim = this.SPRITE_SHEET_DATA.animations.exit;
	this._loopAnim = true;
}

// Inherit from GridOccupant.
Goal.prototype = Object.create(GridOccupant.prototype);

// Define constants.
//Goal.prototype.COLOR = new Color(54, 0, 204);
/** {String} The path from the root to the sprite sheet JSON and image files */
Goal.prototype.SPRITE_SHEET_PATH = 'images/game/exit';
/** {Image} The goal sprite sheet image */
Goal.prototype.SPRITE_SHEET_IMAGE;
/** {Object} The goal sprite sheet data */
Goal.prototype.SPRITE_SHEET_DATA;

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
