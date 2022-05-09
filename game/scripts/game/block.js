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
	
	this.moveSound = document.getElementById('move-sound');
	
	this.dying = false;
	this._deathTween = undefined;
	
	// Determine the block's image.
	this._image = new Image();
	hasNeighbors = hasNeighbors || {left: false, top: false, right: false, bottom: false};
	var spriteName = (minoType || 'static').toLowerCase() + '_block';
	if (hasNeighbors.top || hasNeighbors.bottom || hasNeighbors.left || hasNeighbors.right) {
		spriteName += '_' +
			(hasNeighbors.top ?    'n' : '') +
			(hasNeighbors.bottom ? 's' : '') +
			(hasNeighbors.right ?  'e' : '') +
			(hasNeighbors.left ?   'w' : '');
	}
	this._currentAnim = [spriteName];
}

// Inherit from GridOccupant.
Block.prototype = Object.create(GridOccupant.prototype);

// Define constants.
/** @constant {Color} The default block color */
//Block.DEFAULT_COLOR = new Color(117, 117, 117);
/** @constant {String} The path from the root to the sprite sheet JSON and image files */
Block.prototype.SPRITE_SHEET_PATH = 'images/game/blocks';
/** @constant {Image} The goal sprite sheet image */
Block.prototype.SPRITE_SHEET_IMAGE;
/** @constant {Object} The goal sprite sheet data */
Block.prototype.SPRITE_SHEET_DATA;
/** @constant {Number} The duration of the block death animation in milliseconds */
Block.prototype.DEATH_DURATION = 200;

/**
 * @override
 * Check whether the block's tetromino can be moved to a new location.
 * @param {Vector2D} movement - The vector by which the block would be moved
 * @param {Array<Tetromino>} checkedOccupants - The already checked grid occupants for this move attempt
 * @returns {Boolean} - Whether the block could be moved
 */
Block.prototype.canMove = function (movement, checkedOccupants) {
	// Do not move while dying.
	if (this.dying) {
		return false;
	}
	if (this.tetromino) {
		return this.tetromino.canMove(movement, checkedOccupants);
	} else {
		return this.canMoveSingle(movement, checkedOccupants);
	}
};

/**
 * Check whether the block can be moved to a new location, independent of its tetromino.
 * @param {Vector2D} movement - The vector by which the block would be moved
 * @param {Array<Tetromino>} checkedOccupants - The already checked grid occupants for this move attempt
 * @returns {Boolean} - Whether the block could be moved
 */
Block.prototype.canMoveSingle = function (movement, checkedOccupants) {
	// Do not move while dying.
	if (this.dying) {
		return false;
	}
	// Call the superclass implementation of canMove.
	return GridOccupant.prototype.canMove.call(this, movement, checkedOccupants);
};

/**
 * Move the block to a new location.
 * @param {Vector2D} movement - The vector by which to move the block
 * @return {Boolean} - Whether the block could be moved
 */
Block.prototype.move = function (movement) {
	GridOccupant.prototype.move.call(this, movement);
	this.moveSound.currentTime = 0;
	this.moveSound.play();
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
	if (Utils.shouldReduceMotion) {
		// Die instantly if reducing motion.
		this._grid.removeOccupant(this);
		return;
	}
	this._deathTween = new Tween(this, {opacity: -1, rotation: 0.05 * Math.PI, scale: 0.4}, this.DEATH_DURATION)
	this._deathTween.onfinish = (function () {
		// Remove the block from the grid.
		this._grid.removeOccupant(this);
	}).bind(this);
};

/**
 * @override
 * Update the block.
 * @param {Number} deltaTime - The time since the last frame in milliseconds
 */
Block.prototype.update = function (deltaTime) {
	// If dying, update the death animation and do nothing else.
	if (this.dying && this._deathTween) {
		this._deathTween.update(deltaTime);
	}
	
	// Call the superclass implementation of update.
	GridOccupant.prototype.update.call(this, deltaTime);
};

/**
 * @override
 * Draw the block to the canvas.
 * @param {CanvasRenderingContext2D} ctx - The drawing context for the game canvas
 */
Block.prototype.draw = function (ctx, blockSize) {
	if (!this.dying) {
		GridOccupant.prototype.draw.call(this, ctx, blockSize);
		return;
	}
	
	var x = this.x * blockSize + (blockSize / 2),
		y = this.y * blockSize + (blockSize / 2);
	
	ctx.save();
	
	ctx.globalAlpha = this.opacity;
	
	ctx.translate(x, y);
	ctx.rotate(this.rotation);
	ctx.scale(this.scale, this.scale);
	ctx.translate(-x, -y);
	GridOccupant.prototype.draw.call(this, ctx, blockSize);
	
	ctx.restore();
};
