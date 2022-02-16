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
	
	this._image = new Image();
	this._image.src = 'images/player.png';
	
	// Start facing up.
	this._heading = 90;
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
		document.getElementById('cannot-move-sound').play();
		return false;
	}
};

/**
 * Draw the player to the canvas.
 * @override
 * @param {CanvasRenderingContext2D} ctx - The drawing context for the game canvas
 */
Player.prototype.draw = function (ctx, blockSize) {
	var x = this.x * blockSize + (blockSize / 2),
		y = this.y * blockSize + (blockSize / 2);
	
	ctx.save();
	
	ctx.translate(x, y);
	ctx.rotate(-Utils.degToRad(this._heading - 90));
	ctx.drawImage(this._image, -0.5 * blockSize, -0.5 * blockSize, blockSize, blockSize);
	
	ctx.restore();
}
