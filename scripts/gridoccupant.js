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
	this._moving = false;
	this.x = x;
	this.y = y;
	
	grid.addOccupant(this);
}

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
		if (this._moving) {
			return false;
		}
		if (this._grid.tryMove(this, movement)) {
			this._moving = true;
			// TODO: Replace this with the actual animation timer.
			setTimeout((function () {
				this._moving = false;
			}).bind(this), 150);
			return true;
		} else {
			return false;
		}
	},
	
	/**
	 * Draw the grid occupant to the canvas.
	 * @abstract
	 * @param {CanvasRenderingContext2D} ctx - The drawing context for the game canvas
	 */
	draw: function (ctx) {
		throw new Error('GridOccupant.draw must be implemented by a subclass.');
	}
};
