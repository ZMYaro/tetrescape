'use strict';

/**
 * Initialize a new block.
 * @class
 * @extends GridOccupant
 * @param {Number} x - The x-coordinate of the block on the grid
 * @param {Number} y - The y-coordinate of the block on the grid
 * @param {Grid} grid - The grid to which the block is to be added
 * @param {String} minoType - The letter of the block type 
 * @param {Tetromino} [tetromino] - The tetromino the block belongs to, if any
 * @param {Object<String,Boolean>} [hasNeighbors] - The block's neighbors in a tetromino
 */
function Block(x, y, grid, minoType, tetromino, hasNeighbors) {
	// Call the superclass constructor.
	GridOccupant.call(this, x, y, grid);
	
	this.tetromino = tetromino;
	
	this.rotation = 0;
	this.opacity = 1;
	this.scale = 1;
	
	this.dying = false;
	this._deathTween = undefined;
	
	// Determine the block's image.
	this._image = new Image();
	hasNeighbors = hasNeighbors || {left: false, top: false, right: false, bottom: false};
	var fileName = 'images/blocks/' + (minoType || 'static').toLowerCase() + '_block';
	if (hasNeighbors.top || hasNeighbors.bottom || hasNeighbors.left || hasNeighbors.right) {
		fileName += '_' +
			(hasNeighbors.top ?    'n' : '') +
			(hasNeighbors.bottom ? 's' : '') +
			(hasNeighbors.right ?  'e' : '') +
			(hasNeighbors.left ?   'w' : '');
	}
	fileName += '.png';
	this._image.src = fileName;
}

// Inherit from GridOccupant.
Block.prototype = Object.create(GridOccupant.prototype);

// Define constants.
/** {Color} The default block color */
//Block.DEFAULT_COLOR = new Color(117, 117, 117);
/** {Number} The duration of the block death animation in frames. */
Block.prototype.DEATH_DURATION = 12;

/**
 * Check whether the block's tetromino can be moved to a new location.
 * @override
 * @param {Vector2D} movement - The vector by which the block would be moved
 * @returns {Boolean} - Whether the block could be moved
 */
Block.prototype.canMove = function (movement) {
	// Do not move while dying.
	if (this.dying) {
		return false;
	}
	if (this.tetromino) {
		return this.tetromino.canMove(movement);
	} else {
		return this.canMoveSingle(movement);
	}
};

/**
 * Check whether the block can be moved to a new location, independent of its tetromino.
 * @param {Vector2D} movement - The vector by which the block would be moved
 * @returns {Boolean} - Whether the block could be moved
 */
Block.prototype.canMoveSingle = function (movement) {
	// Do not move while dying.
	if (this.dying) {
		return false;
	}
	// Call the superclass implementation of canMove.
	return GridOccupant.prototype.canMove.call(this, movement);
};

/**
 * Move the block's tetromino to a new location, if possible.
 * @override
 * @param {Vector2D} movement - The vector by which to move the block
 * @returns {Boolean} - Whether the block could be moved
 */
Block.prototype.tryMove = function (movement) {
	// Do not move while dying.
	if (this.dying) {
		return false;
	}
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
	// Do not move while dying.
	if (this.dying) {
		return false;
	}
	// Call the superclass implementation of tryMove.
	if (GridOccupant.prototype.tryMove.call(this, movement)) {
		document.getElementById('move-sound').play();
		return true;
	} else {
		return false;
	}
};

/**
 * Remove the block from the game.
 */
Block.prototype.kill = function () {
	// Do not kill a block that is already dying.
	if (this.dying) {
		return false;
	}
	// Remove the block from its tetromino if it has one.
	if (this.tetromino) {
		this.tetromino.removeBlock(this);
	}
	
	// Start the death animation.
	this.dying = true;
	this._deathTween = new Tween(this, {opacity: -1, rotation: 0.08 * Math.PI, scale: 0.4}, this.DEATH_DURATION)
	this._deathTween.onfinish = (function () {
		// Remove the block from the grid.
		this._grid.removeOccupant(this);
	}).bind(this);
};

/**
 * Update the block.
 * @override
 */
Block.prototype.update = function () {
	// If dying, update the death animation and do nothing else.
	if (this.dying && this._deathTween) {
		this._deathTween.update();
	}
	
	// Call the superclass implementation of update.
	GridOccupant.prototype.update.call(this);
};

/**
 * Draw the block to the canvas.
 * @override
 * @param {CanvasRenderingContext2D} ctx - The drawing context for the game canvas
 */
Block.prototype.draw = function (ctx, blockSize) {
	var x = this.x * blockSize + (blockSize / 2),
		y = this.y * blockSize + (blockSize / 2);
	
	ctx.save();
	
	ctx.globalAlpha = this.opacity;
	
	ctx.translate(x, y);
	ctx.rotate(-Utils.degToRad(this.rotation));
	ctx.scale(this.scale, this.scale);
	
	// Draw the block.
	ctx.drawImage(this._image, -0.5 * blockSize, -0.5 * blockSize, blockSize, blockSize);
	
	ctx.restore();
};
