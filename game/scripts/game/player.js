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
	
	// Start facing down.
	this._heading = 270;
}

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
			this._heading = 0;
			break;
		case Vector2D.UP:
			this._heading = 90;
			break;
		case Vector2D.LEFT:
			this._heading = 180;
			break;
		case Vector2D.DOWN:
			this._heading = 270;
			break;
	}
	// Call the superclass implementation of the function.
	if (GridOccupant.prototype.tryMove.call(this, movement)) {
		return true;
	} else {
		document.getElementById('blockTapSound').play();
		return false;
	}
};

/**
 * Draw the player to the canvas.
 * @override
 * @param {CanvasRenderingContext2D} ctx - The drawing context for the game canvas
 */
Player.prototype.draw = function (ctx, blockSize) {
	var circX = this.x * blockSize + (0.5 * blockSize),
		circY = this.y * blockSize + (0.5 * blockSize);
	
	ctx.fillStyle = 'green';
	ctx.beginPath();
	ctx.arc(circX, circY, 0.4 * blockSize, 0, 2 * Math.PI);
	ctx.closePath();
	ctx.fill();
}
