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
	
	grid.addOccupant(this);
}

// Initialize static constants.
/** {Number} The duration of grid occupant movements in frames */
GridOccupant.MOVE_DURATION = 5;
/** {Number} The number of frames between movements */
GridOccupant.MOVE_DELAY = 2;

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
				//this._moveDelay = GridOccupant.MOVE_DELAY;
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
	},
	
	/**
	 * Draw the grid occupant to the canvas.
	 * @abstract
	 * @param {CanvasRenderingContext2D} ctx - The drawing context for the game canvas
	 */
	draw: function (ctx, blockSize) {
		throw new Error('GridOccupant.draw must be implemented by a subclass.');
	}
};
