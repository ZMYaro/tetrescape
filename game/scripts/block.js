'use strict';

/**
 * Initialize a new block.
 * @class
 * @extends GridOccupant
 * @param {Number} x - The x-coordinate of the block on the grid
 * @param {Number} y - The y-coordinate of the block on the grid
 * @param {Grid} grid - The grid to which the block is to be added
 * @param {Tetromino} [tetromino] - The tetromino the block belongs to, if any
 */
function Block(x, y, grid, tetromino) {
	// Call the superclass constructor.
	GridOccupant.call(this, x, y, grid);
	
	this._tetromino = tetromino;
}

// Inherit from GridOccupant.
Block.prototype = Object.create(GridOccupant.prototype);

/**
 * Move the block's tetromino to a new location, if possible.
 * @override
 * @param {Vector2D} movement - The vector by which to move the block
 * @returns {Boolean} - Whether the block could be moved
 */
Block.prototype.tryMove = function (movement) {
	if (this._tetromino) {
		this._tetromino.tryMove(movement);
	} else {
		this.moveSingle(movement);
	}
};

/**
 * Move the block to a new location, if possible, independent of its tetromino.
 * @param {Vector2D} movement - The vector by which to move the block
 * @return {Boolean} - Whether the block could be moved
 */
Block.prototype.moveSingle = function (movement) {
	// Call the superclass implementation of the tryMove.
	return GridOccupant.prototype.tryMove.call(this, movement);
};

/**
 * Draw the block to the canvas.
 * @override
 * @param {CanvasRenderingContext2D} ctx - The drawing context for the game canvas
 */
Block.prototype.draw = function (ctx) {
	ctx.fillStyle = 'blue';
	ctx.fillRect(this.x * Grid.SQUARE_SIZE, this.y * Grid.SQUARE_SIZE, Grid.SQUARE_SIZE, Grid.SQUARE_SIZE);
};
