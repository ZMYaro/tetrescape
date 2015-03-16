'use strict';

/**
 * Initialize a new block.
 * @class
 * @extends GridOccupant
 * @param {Number} x - The x-coordinate of the block on the grid
 * @param {Number} y - The y-coordinate of the block on the grid
 * @param {Grid} grid - The grid to which the block is to be added
 * @param {Color} color - The color of the block
 * @param {Tetromino} [tetromino] - The tetromino the block belongs to, if any
 */
function Block(x, y, grid, color, tetromino) {
	// Call the superclass constructor.
	GridOccupant.call(this, x, y, grid);
	
	this.tetromino = tetromino;
	this._color = color || Block.DEFAULT_COLOR;
}

// Initialize static constants.
/** {Color} The default block color */
Block.DEFAULT_COLOR = new Color(160, 160, 160); // Gray
/** {Number} The width of block outlines */
Block.LINE_WIDTH = 3;

// Inherit from GridOccupant.
Block.prototype = Object.create(GridOccupant.prototype);

/**
 * Check whether the block's tetromino can be moved to a new location.
 * @override
 * @param {Vector2D} movement - The vector by which the block would be moved
 * @returns {Boolean} - Whether the block could be moved
 */
Block.prototype.canMove = function (movement) {
	if (this.tetromino) {
		return this.tetromino.canMove(movement);
	} else {
		return this.canMoveSingle(movement);
	}
};

/**
 * Check whether the block can be moved to a new location, independent of its tetromino.
 * @override
 * @param {Vector2D} movement - The vector by which the block would be moved
 * @returns {Boolean} - Whether the block could be moved
 */
Block.prototype.canMoveSingle = function (movement) {
	return GridOccupant.prototype.canMove.call(this, movement);
};

/**
 * Move the block's tetromino to a new location, if possible.
 * @override
 * @param {Vector2D} movement - The vector by which to move the block
 * @returns {Boolean} - Whether the block could be moved
 */
Block.prototype.tryMove = function (movement) {
	if (this.tetromino) {
		return this.tetromino.tryMove(movement);
	} else {
		return this.tryMoveSingle(movement);
	}
};

/**
 * Move the block to a new location, if possible, independent of its tetromino.
 * @param {Vector2D} movement - The vector by which to move the block
 * @return {Boolean} - Whether the block could be moved
 */
Block.prototype.tryMoveSingle = function (movement) {
	// Call the superclass implementation of the tryMove.
	return GridOccupant.prototype.tryMove.call(this, movement);
};

/**
 * Remove the block from the game.
 */
Block.prototype.kill = function () {
	// Remove the block from its tetromino if it has one.
	if (this.tetromino) {
		this.tetromino.removeBlock(this);
	}
	// TODO: Replace this with death animation.
	// Remove the block from the grid.
	this._grid.removeOccupant(this);
};

/**
 * Draw the block to the canvas.
 * @override
 * @param {CanvasRenderingContext2D} ctx - The drawing context for the game canvas
 */
Block.prototype.draw = function (ctx) {
	var x = this.x * Grid.SQUARE_SIZE + Block.LINE_WIDTH / 2,
		y = this.y * Grid.SQUARE_SIZE + Block.LINE_WIDTH / 2,
		size = Grid.SQUARE_SIZE - Block.LINE_WIDTH / 2 - Block.LINE_WIDTH / 2;
	
	ctx.lineWidth = Block.LINE_WIDTH;
	ctx.fillStyle = this._color.hex;
	ctx.strokeStyle = this._color.darken(0.8).hex;
	
	ctx.beginPath();
	ctx.rect(x, y, size, size);
	ctx.fill();
	ctx.stroke();
	ctx.closePath();
};
