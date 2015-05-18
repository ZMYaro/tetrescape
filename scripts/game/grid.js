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
/** {Color} The color of the grid background */
Grid.COLOR = new Color(240, 240, 240);
/** {Number} The size of each grid square in pixels */
Grid.SQUARE_SIZE = 32;

Grid.prototype = {
	/**
	 * Add a new occupant to the grid.
	 * @param {GridOccupant} newOccupant - The new occupant to add
	 * @returns {Boolean} - Whether the occupant could be added
	 */
	addOccupant: function (newOccupant) {
		if (this._occupants[newOccupant.gridX][newOccupant.gridY]) {
			return false;
		} else {
			this._occupants[newOccupant.gridX][newOccupant.gridY] = newOccupant;
			return true;
		}
	},
	
	/**
	 * Remove an occupant from the grid.
	 * @param {GridOccupant} occupant - The occupant to remove
	 * @returns {Boolean} - Whether the occupant was found and removed
	 */
	removeOccupant: function (occupant) {
		if (this._occupants[occupant.gridX][occupant.gridY] === occupant) {
			this._occupants[occupant.gridX][occupant.gridY] = undefined;
			return true;
		}
		return false;
	},
	
	/**
	 * Check whether a grid occupant can be moved to a new location.
	 * @param {GridOccupant} occupant - The occupant to move
	 * @param {Vector2D} movement - The vector by which the occupant would be moved
	 * @returns {Boolean} - Whether the occupant could be moved
	 */
	canMove: function (occupant, movement) {
		// Calculate the potential new position of the occupant.
		var newPos = new Vector2D(occupant.gridX + movement.x, occupant.gridY + movement.y);
		
		// Prevent moving off the grid.
		if (newPos.x < 0 ||
				newPos.x > this.width - 1 ||
				newPos.y < 0 ||
				newPos.y > this.height - 1) {
			return false;
		}
		
		// If the destination space is occupied by an occupant that is not a member of
		// this occupant's group, attempt to push the blocking occupant unless it is the
		// goal tile blocking the player.
		var blocker = this._occupants[newPos.x][newPos.y];
		if (blocker && !(blocker.tetromino && blocker.tetromino === occupant.tetromino) &&
				!(occupant instanceof Player && blocker instanceof Goal)) {
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
			var newPos = new Vector2D(occupant.gridX + movement.x, occupant.gridY + movement.y),
				blocker = this._occupants[newPos.x][newPos.y];
			if (blocker) {
				blocker.tryMove(movement);
			}
			
			// Move to the new location.
			this._occupants[occupant.gridX][occupant.gridY] = undefined;
			this._occupants[newPos.x][newPos.y] = occupant;
			
			return true;
		} else {
			return false;
		}
	},
	
	/**
	 * Update the grid's occupants.
	 */
	update: function () {
		for (var x = 0; x < this.width; x++) {
			for (var y = 0; y < this.height; y++) {
				if (this._occupants[x][y]) {
					this._occupants[x][y].update();
				}
			}
		}
	},
	
	/**
	 * Draw the grid and its occupants to the game canvas.
	 * @param {CanvasRenderingContext2D} ctx - The drawing context for the game canvas
	 */
	draw: function (ctx, blockSize) {
		// Draw the grid background.
		ctx.fillStyle = Grid.COLOR.hex;
		ctx.fillRect(0, 0, this.width * blockSize, this.height * blockSize);
		
		// Draw the grid.
		ctx.lineWidth = 1;
		ctx.strokeStyle = Grid.COLOR.darken(0.9).hex;
		ctx.beginPath();
		for (var x = 0; x <= this.width; x++) {
			ctx.moveTo(x * blockSize, 0);
			ctx.lineTo(x * blockSize, this.height * blockSize);
		}
		for (var y = 0; y <= this.height; y++) {
			ctx.moveTo(0, y * blockSize);
			ctx.lineTo(this.width * blockSize, y * blockSize);
		}
		ctx.stroke();
		ctx.closePath();
		
		// Draw the grid's occupants.
		for (var x = 0; x < this.width; x++) {
			for (var y = 0; y < this.height; y++) {
				if (this._occupants[x][y]) {
					this._occupants[x][y].draw(ctx, blockSize);
				}
			}
		}
	},
	
	/**
	 * Check for and clear any complete rows.
	 * @returns {Number} The number of blocks cleared
	 */
	clearRows: function () {
		var counter;
		
		// Check all columns.
		for (var x = 0; x < this.width; x++) {
			// Reset the counter.
			counter = 0;
			for (var y = 0; y < this.height; y++) {
				// For each block found in the row, increment the counter.
				if (this._occupants[x][y] instanceof Block &&
						!this._occupants[x][y].moving &&
						!this._occupants[x][y].dying) {
					counter++;
				}
			}
			// If the row is full, remove all blocks in it.
			if (counter === this.height) {
				for (var y = 0; y < this.height; y++) {
					// For each block found in the row, remove the block.
					if (this._occupants[x][y] instanceof Block) {
						this._occupants[x][y].kill();
					}
				}
				return this.height;
			}
		}
		
		// Check all rows.
		for (var y = 0; y < this.height; y++) {
			// Reset the counter.
			counter = 0;
			for (var x = 0; x < this.width; x++) {
				// For each block found in the row, increment the counter.
				if (this._occupants[x][y] instanceof Block &&
						!this._occupants[x][y].moving &&
						!this._occupants[x][y].dying) {
					counter++;
				}
			}
			// If the row is full, remove all blocks in it.
			if (counter === this.width) {
				for (var x = 0; x < this.width; x++) {
					// For each block found in the row, remove the block.
					if (this._occupants[x][y] instanceof Block) {
						this._occupants[x][y].kill();
					}
				}
				return this.width;
			}
		}
		
		return 0;
	}
};
