'use strict';

/**
 * Initialize a new tetromino.
 * @class
 * @param {Array<Array<Boolean>>} blockArrangement - The arrangement of blocks in the tetromino
 * @param {Number} x - The the x-coordinate of the top-left corner of the tetromino
 * @param {Number} y - The the y-coordinate of the top-left corner of the tetromino
 * @param {Grid} grid - The grid to which the tetromino's blocks are to be added
 * @param {Color} color - The color of the tetromino
 */
function Tetromino(blockArrangement, x, y, grid, color) {
	this._blocks = [];
	for (var r = 0; r < blockArrangement.length; r++) {
		for (var c = 0; c < blockArrangement[r].length; c++) { // Heh, C++
			if (blockArrangement[r][c]) {
				var neighbors = {
					left: (c > 0 && blockArrangement[r][c - 1]),
					top: (r > 0 && blockArrangement[r - 1][c]),
					right: (c < blockArrangement[r].length - 1 && blockArrangement[r][c + 1]),
					bottom: (r < blockArrangement.length - 1 && blockArrangement[r + 1][c])
				};
				this._blocks.push(new Block(x + c, y + r, grid, color, this, neighbors));
			}
		}
	}
}

// Initialize static constants.
Tetromino.BLOCKS = {
	I: {
		'0': [
			[1],
			[1],
			[1],
			[1]
		],
		'90': [
			[1, 1, 1, 1]
		],
		color: new Color(0, 188, 212)
	},
	J: {
		'0': [
			[0, 1],
			[0, 1],
			[1, 1]
		],
		'90': [
			[1, 0, 0],
			[1, 1, 1]
		],
		'180': [
			[1, 1],
			[1, 0],
			[1, 0]
		],
		'270': [
			[1, 1, 1],
			[0, 0, 1]
		],
		color: new Color(32, 149, 243)
	},
	L: {
		'0': [
			[1, 0],
			[1, 0],
			[1, 1]
		],
		'90': [
			[1, 1, 1],
			[1, 0, 0]
		],
		'180': [
			[1, 1],
			[0, 1],
			[0, 1]
		],
		'270': [
			[0, 0, 1],
			[1, 1, 1]
		],
		color: new Color(255, 152, 0)
	},
	O: {
		'0': [
			[1, 1],
			[1, 1]
		],
		color: new Color(255, 234, 0)
	},
	S: {
		'0': [
			[0, 1, 1],
			[1, 1, 0]
		],
		'90': [
			[1, 0],
			[1, 1],
			[0, 1]
		],
		color: new Color(76, 175, 79)
	},
	T: {
		'0': [
			[1, 1, 1],
			[0, 1, 0]
		],
		'90': [
			[0, 1],
			[1, 1],
			[0, 1]
		],
		'180': [
			[0, 1, 0],
			[1, 1, 1]
		],
		'270': [
			[1, 0],
			[1, 1],
			[1, 0]
		],
		color: new Color(155, 39, 176)
	},
	Z: {
		'0': [
			[1, 1, 0],
			[0, 1, 1]
		],
		'90': [
			[0, 1],
			[1, 1],
			[1, 0]
		],
		color: new Color(244, 67, 54)
	}
};

Tetromino.prototype = {
	/**
	 * Check whether the tetromino's blocks can be moved to a new location.
	 * @param {Vector2D} movement - The vector by which to move the blocks
	 * @returns {Boolean} - Whether the tetromino could be moved
	 */
	canMove: function (movement) {
		// Sort the blocks in the order in which they should attempt to be moved.
		switch (movement) {
			case Vector2D.LEFT:
				this._blocks.sort(function (a, b) {
					if (a.x < b.x) {
						return -1;
					} else if (a.x === b.x) {
						if (a.y < b.y) {
							return -1;
						}
						return 1;
					}
					return 1;
				});
				break;
			case Vector2D.RIGHT:
				this._blocks.sort(function (a, b) {
					if (a.x > b.x) {
						return -1;
					} else if (a.x === b.x) {
						if (a.y < b.y) {
							return -1;
						}
						return 1;
					}
					return 1;
				});
				break;
			case Vector2D.UP:
				this._blocks.sort(function (a, b) {
					if (a.y < b.y) {
						return -1;
					} else if (a.y === b.y) {
						if (a.x < b.x) {
							return -1;
						}
						return 1;
					}
					return 1;
				});
				break;
			case Vector2D.DOWN:
				this._blocks.sort(function (a, b) {
					if (a.y > b.y) {
						return -1;
					} else if (a.y === b.y) {
						if (a.x < b.x) {
							return -1;
						}
						return 1;
					}
					return 1;
				});
				break;
		}
		
		// Check whether the blocks can be moved.
		for (var i = 0; i < this._blocks.length; i++) {
			// If any block is unable to be moved, the whole tetromino should fail to be moved.
			if (!this._blocks[i].canMoveSingle(movement)) {
				return false;
			}
		}
		return true;
	},
	
	/**
	 * Move the tetromino's blocks to a new location, if possible.
	 * @param {Vector2D} movement - The vector by which to move the blocks
	 * @returns {Boolean} - Whether the tetromino could be moved
	 */
	tryMove: function (movement) {
		if (!this.canMove(movement)) {
			return false;
		}
		// Attempt to move the blocks.
		for (var i = 0; i < this._blocks.length; i++) {
			// If any block is unable to be moved, the whole tetromino should fail to be moved.
			this._blocks[i].tryMoveSingle(movement);
		}
		return true;
	},
	
	/**
	 * Remove a block from the tetromino.
	 * @param {Block} block - The block to remove
	 */
	removeBlock: function (block) {
		if (this._blocks.indexOf(block) !== -1) {
			this._blocks.splice(this._blocks.indexOf(block), 1);
		}
	}
};
