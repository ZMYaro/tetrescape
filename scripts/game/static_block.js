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
	Block.call(this, x, y, grid, 'static');
}

// Inherit from Block.
StaticBlock.prototype = Object.create(Block.prototype);

/**
 * @override
 * Inform that the block cannot be moved.
 * @returns {Boolean} - That the block cannot be moved
 */
StaticBlock.prototype.canMoveSingle = function (movement, checkedOccupants) {
	return false;
};
