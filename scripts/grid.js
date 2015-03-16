'use strict';

/**
 * Initialize a new game grid.
 * @class
 * @param {Number} width - The width of the level grid
 * @param {Number} height - The height of the level grid
 */
function Grid(width, height) {
	this.width = width;
	this.height = height;
	this._occupants = [];
	
	// Initialize the occupants grid.
	for (var x = 0; x < width; x++) {
		this._occupants[x] = [];
	}
}

// Define static constants.
/** {Number} The size of each grid square in pixels */
Grid.SQUARE_SIZE = 32;

Grid.prototype = {
	/**
	 * Add a new occupant to the grid.
	 * @param {GridOccupant} occupant - The new occupant to add
	 * @returns {Boolean} - Whether the occupant could be added
	 */
	addOccupant: function (newOccupant) {
		if (this._occupants[newOccupant.x][newOccupant.y]) {
			return false;
		} else {
			this._occupants[newOccupant.x][newOccupant.y] = newOccupant;
			return true;
		}
	},
	
	/**
	 * Check whether a grid occupant can be moved to a new location.
	 * @param {GridOccupant} occupant - The occupant to move
	 * @param {Vector2D} movement - The vector by which the occupant would be moved
	 * @returns {Boolean} - Whether the occupant could be moved
	 */
	canMove: function (occupant, movement) {
		// Calculate the potential new position of the occupant.
		var newPos = new Vector2D(occupant.x + movement.x, occupant.y + movement.y);
		
		// Prevent moving off the grid.
		if (newPos.x < 0 ||
				newPos.x > this.width - 1 ||
				newPos.y < 0 ||
				newPos.y > this.height - 1) {
			return false;
		}
		
		// If the destination space is occupied by an occupant that is not a member of
		// this occupant's group, attempt to push the blocking occupant.
		var blocker = this._occupants[newPos.x][newPos.y];
		if (blocker && !(blocker.tetromino && blocker.tetromino === occupant.tetromino)) {
			if (blocker.canMove(movement)) {
				return true;
			} else {
				return false;
			}
		}
		return true;
	},
	
	/**
	 * Move a grid occupant to a new location, if possible, pushing any other grid
	 * occupants in its way.
	 * @param {GridOccupant} occupant - The occupant to move
	 * @param {Vector2D} movement - The vector by which to move the occupant
	 * @returns {Boolean} - Whether the occupant could be moved
	 */
	tryMove: function (occupant, movement) {
		if (this.canMove(occupant, movement)) {
			// If the destination space is occupied, attempt to push the opponent.
			var newPos = new Vector2D(occupant.x + movement.x, occupant.y + movement.y);
			if (this._occupants[newPos.x][newPos.y] && !this._occupants[newPos.x][newPos.y].tryMove(movement)) {
				return false;
			}
			
			// Move to the new location.
			this._occupants[occupant.x][occupant.y] = undefined;
			occupant.x += movement.x;
			occupant.y += movement.y;
			this._occupants[occupant.x][occupant.y] = occupant;
			
			// Check whether a new row has been formed and eliminate it.
			this._clearRows();
			
			return true;
		} else {
			return false;
		}
	},
	
	/**
	 * Draw the grid and its occupants to the game canvas.
	 * @param {CanvasRenderingContext2D} ctx - The drawing context for the game canvas
	 */
	draw: function (ctx) {
		// Draw the grid.
		ctx.strokeStyle = '#808080';
		ctx.beginPath();
		for (var x = 0; x <= this.width; x++) {
			ctx.moveTo(x * Grid.SQUARE_SIZE, 0);
			ctx.lineTo(x * Grid.SQUARE_SIZE, this.height * Grid.SQUARE_SIZE);
		}
		for (var y = 0; y <= this.height; y++) {
			ctx.moveTo(0, y * Grid.SQUARE_SIZE);
			ctx.lineTo(this.height * Grid.SQUARE_SIZE, y * Grid.SQUARE_SIZE);
		}
		ctx.stroke();
		ctx.closePath();
		
		// Draw the grid's occupants.
		for (var x = 0; x < this.width; x++) {
			for (var y = 0; y < this.height; y++) {
				if (this._occupants[x][y]) {
					this._occupants[x][y].draw(ctx);
				}
			}
		}
	},
	
	/**
	 * Check for and clear any complete rows.
	 */
	_clearRows: function () {
		var counter;
		
		// Check all columns.
		for (var x = 0; x < this.width; x++) {
			// Reset the counter.
			counter = 0;
			for (var y = 0; y < this.height; y++) {
				// For each block found in the row, increment the counter.
				if (this._occupants[x][y] instanceof Block) {
					counter++;
				}
			}
			// If the row is full, remove all blocks in it.
			if (counter === this.height) {
				for (var y = 0; y < this.height; y++) {
					// For each block found in the row, increment the counter.
					if (this._occupants[x][y] instanceof Block) {
						// TODO: Replace this with death animation.
						this._occupants[x][y] = undefined;
					}
				}
			}
		}
		
		// Check all rows.
		for (var y = 0; y < this.height; y++) {
			// Reset the counter.
			counter = 0;
			for (var x = 0; x < this.width; x++) {
				// For each block found in the row, increment the counter.
				if (this._occupants[x][y] instanceof Block) {
					counter++;
				}
			}
			// If the row is full, remove all blocks in it.
			if (counter === this.width) {
				for (var x = 0; x < this.width; x++) {
					// For each block found in the row, increment the counter.
					if (this._occupants[x][y] instanceof Block) {
						// TODO: Replace this with death animation.
						this._occupants[x][y] = undefined;
					}
				}
			}
		}
		
	}
};
