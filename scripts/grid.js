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
	 * Move a grid occupant to a new location, overwriting whatever may be at that location.
	 * @param {GridOccupant} occupant - The occupant to move
	 * @param {Vector2D} movement - The vector by which to move the occupant
	 */
	_move: function (occupant, movement) {
		this._occupants[occupant.x][occupant.y] = undefined;
		occupant.x += vector.x;
		occupant.y += vector.y;
		this._occupants[occupant.x][occupant.y] = occupant;
	},
	
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
	 * Move a grid occupant to a new location, if possible, pushing any other grid
	 * occupants in its way.
	 * @param {GridOccupant} occupant - The occupant to move
	 * @param {Vector2D} movement - The vector by which to move the occupant
	 * @returns {Boolean} - Whether the occupant could be moved
	 */
	tryMove: function (occupant, movement) {
		// Calculate the potential new position of the occupant.
		var newPos = new Vector2D(occupant.x + movement.x, occupant.y + movement.y);
		
		// Prevent moving off the grid.
		if (newPos.x < 0 ||
				newPos.x > this.width - 1 ||
				newPos.y < 0 ||
				newPos.y > this.height - 1) {
			return false;
		}
		
		// If the grid space is occupied, attempt to push the occupant.
		if (this._occupants[newPos.x][newPos.y]) {
			if (this._occupants[newPos.x][newPos.y].move(movement)) {
				this._move(occupant, movement);
				return true;
			} else {
				return false;
			}
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
	}
};
