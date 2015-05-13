'use strict';

/**
 * Initialize a new static block.
 * @class
 * @extends Block
 * @param {Number} x - The x-coordinate of the block on the grid
 * @param {Number} y - The y-coordinate of the block on the grid
 * @param {Grid} grid - The grid to which the block is to be added
 */
function StaticBlock(x, y, grid) {
	// Call the superclass constructor.
	Block.call(this, x, y, grid, StaticBlock.COLOR);
}

// Initialize static constants.
/** {Color} The block color */
StaticBlock.COLOR = new Color(117, 117, 117); // Gray

// Inherit from Block.
StaticBlock.prototype = Object.create(Block.prototype);

/**
 * Inform that the block cannot be moved.
 * @override
 * @returns {Boolean} - That the block cannot be moved
 */
StaticBlock.prototype.canMoveSingle = function (movement) {
	return false;
};

/**
 * Do not allow the block to be moved.
 * @override
 * @returns {Boolean} - That the block could not be moved
 */
StaticBlock.prototype.tryMoveSingle = function (movement) {
	return false;
};
