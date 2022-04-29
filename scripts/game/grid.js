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
Grid.COLOR = new Color(53, 52, 51);
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
	 * @param {Array<Tetromino>} checkedOccupants - The already checked grid occupants for this move attempt
	 * @returns {Boolean} - Whether the occupant could be moved
	 */
	canMove: function (occupant, movement, checkedOccupants) {
		if (checkedOccupants.includes(occupant)) {
			// If checking movement has recursed back to this occupant, move on.
			return true;
		}
		checkedOccupants.push(occupant);
		
		// Calculate the potential new position of the occupant.
		var newPos = new Vector2D(occupant.gridX + movement.x, occupant.gridY + movement.y);
		
		if (newPos.x < 0 ||
				newPos.x > this.width - 1 ||
				newPos.y < 0 ||
				newPos.y > this.height - 1) {
			// Prevent moving off the grid.
			return false;
		}
		
		// If the destination space is occupied by an occupant that is not a member of
		// this occupant's group, attempt to push the blocking occupant unless it is the
		// goal tile blocking the player.
		var blocker = this._occupants[newPos.x][newPos.y];
		if (!blocker) {
			// If there is no blocker, no problem.
			return true;
		}
		if (occupant instanceof Player && blocker instanceof Goal) {
			// If this is the player moving onto the goal, do not block.
			return true;
		}
		if (blocker.tetromino && blocker.tetromino === occupant.tetromino) {
			// If the blocker is part of the same mino, it is not blocking.
			return true;
		}
		return blocker.canMove(movement, checkedOccupants);
	},
	
	/**
	 * Move a grid occupant to a new location, if possible, pushing any
	 * other grid occupants in its way.
	 * @param {GridOccupant} initiatingOccupant - The occupant trying to move
	 * @param {Vector2D} movement - The vector by which to move the occupant
	 * @returns {Boolean} - Whether the occupant could be moved
	 */
	tryMove: function (initiatingOccupant, movement) {
		var checkedOccupants = [];
		if (!this.canMove(initiatingOccupant, movement, checkedOccupants)) {
			return false;
		}
		
		// Remove the occupants from their current spaces.
		checkedOccupants.forEach(function (occupant) {
			// The goal does not move.
			if (occupant instanceof Goal) { return; }
			
			this._occupants[occupant.gridX][occupant.gridY] = undefined;
		}, this);
		
		// Move them to their new spaces.
		checkedOccupants.forEach(function (occupant) {
			// The goal does not move.
			if (occupant instanceof Goal) { return; }
			
			var newPos = new Vector2D(occupant.gridX + movement.x, occupant.gridY + movement.y),
				playerMovingToGoal = (occupant instanceof Player) &&
					(this._occupants[newPos.x][newPos.y] instanceof Goal);
			
			// Tell the occupant it is moving.
			occupant.move(movement);
			
			if (playerMovingToGoal) {
				// If the player is moving to the goal, leave the player off the grid
				// and let Game draw it separately so the goal does not get overwirtten.
				return;
			}
			
			// Update the occupant's position on the grid.
			this._occupants[newPos.x][newPos.y] = occupant;
		}, this);
		
		return true;
	},
	
	/**
	 * Update the grid's occupants.
	 * @param {Number} deltaTime - The time since the last frame in milliseconds
	 */
	update: function (deltaTime) {
		for (var x = 0; x < this.width; x++) {
			for (var y = 0; y < this.height; y++) {
				if (this._occupants[x][y]) {
					this._occupants[x][y].update(deltaTime);
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
		ctx.strokeStyle = Grid.COLOR.darken(0.93).hex;
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
