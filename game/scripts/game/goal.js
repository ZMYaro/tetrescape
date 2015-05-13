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
	
	this._img = new Image();
	this._img.src = 'images/exit.png';
}

// Define static constants.
/** {Color} The color of the goal tile */
Goal.COLOR = new Color(255, 255, 255);
/** {Color} The outline color of the goal tile */
Goal.LINE_COLOR = new Color(54, 0, 204);

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
	var x = this.x * blockSize + Block.LINE_WIDTH / 2,
		y = this.y * blockSize + Block.LINE_WIDTH / 2,
		size = blockSize - Block.LINE_WIDTH / 2 - Block.LINE_WIDTH / 2;
	
	ctx.strokeStyle = Goal.LINE_COLOR.hex;
	ctx.fillStyle = Goal.COLOR.hex;
	ctx.fillRect(x, y, size, size);
	ctx.strokeRect(x, y, size, size);
	ctx.drawImage(this._img, x, y, size, size);
}
