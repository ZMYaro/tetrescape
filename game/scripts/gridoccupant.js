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
	this.x = x;
	this.y = y;
	
	grid.addOccupant(this);
}

GridOccupant.prototype = {
	/**
	 * Move a grid occupant to a new location, if possible.
	 * @param {Vector2D} movement - The vector by which to move the occupant
	 * @returns {Boolean} - Whether the occupant could be moved
	 */
	tryMove: function (movement) {
		return this._grid.tryMove(this, movement);
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
