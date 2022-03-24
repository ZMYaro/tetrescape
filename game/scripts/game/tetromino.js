'use strict';

/**
 * Initialize a new tetromino.
 * @class
 * @param {String} type - The letter of the tetromino type
 * @param {Number|String} orientation - The orientation of the tetromino in degrees
 * @param {Number} x - The the x-coordinate of the top-left corner of the tetromino
 * @param {Number} y - The the y-coordinate of the top-left corner of the tetromino
 * @param {Grid} grid - The grid to which the tetromino's blocks are to be added
 */
function Tetromino(type, orientation, x, y, grid) {
	var blockArrangement = Tetromino.BLOCKS[type][orientation];
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
				this._blocks.push(new Block(x + c, y + r, grid, type, this, neighbors));
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
		color: new Color(0, 188, 212).darken(0.7)
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
		color: new Color(32, 149, 243).darken(0.7)
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
		color: new Color(255, 152, 0).darken(0.7)
	},
	O: {
		'0': [
			[1, 1],
			[1, 1]
		],
		color: new Color(255, 234, 0).darken(0.7)
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
		color: new Color(76, 175, 79).darken(0.7)
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
		color: new Color(155, 39, 176).darken(0.7)
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
		color: new Color(244, 67, 54).darken(0.7)
	}
};

Tetromino.prototype = {
	/**
	 * Check whether the tetromino's blocks can be moved to a new location.
	 * @param {Vector2D} movement - The vector by which to move the blocks
	 * @param {Array<Tetromino>} checkedOccupants - The already checked grid occupants for this move attempt
	 * @returns {Boolean} - Whether the tetromino could be moved
	 */
	canMove: function (movement, checkedOccupants) {
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
			if (!this._blocks[i].canMoveSingle(movement, checkedOccupants)) {
				return false;
			}
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
