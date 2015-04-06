'use strict';

/**
 * Initialize a new Game.
 * @class
 * @param {HTMLCanvasElement} canvas - The canvas on whch the game will appear
 */
function Game(canvas, level, endCallback) {
	// Initialize private variables.
	this._canvas = canvas;
	this._ctx = canvas.getContext('2d');
	this._im = new InputManager({
		down: (function () {
			this._player.tryMove(Vector2D.DOWN)
		}).bind(this),
		left: (function () {
			this._player.tryMove(Vector2D.LEFT)
		}).bind(this),
		right: (function () {
			this._player.tryMove(Vector2D.RIGHT)
		}).bind(this),
		up: (function () {
			this._player.tryMove(Vector2D.UP)
		}).bind(this),
		retry: this.reload.bind(this)
	});
	this._endCallback = endCallback;
	// Add placeholders for additional private variables.
	this._grid = undefined;
	this._player = undefined;
	this._goal = undefined;
	this._currentLevel = undefined;
	
	this._boundUpdate = this._update.bind(this);
	
	this._levelData = level;
	
	// Load the level.
	this.reload();
	
	// Start the main game loop.
	this._update();
}

Game.prototype = {
	/**
	 * The main game loop
	 * @private
	 */
	_update: function () {
		// If the reset key is being pressed, reload the level.
		if (this._im.retry) {
			this.reload();
		}
			
		// Clear the screen.
		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
		
		// Update grid elements.
		this._grid.update();
		
		// Check whether a new row has been formed and eliminate it.
		this._grid.clearRows();
		// Check whether the player has reached the goal.
		if (this._player.x === this._goal.x && this._player.y === this._goal.y) {
			// End the game.
			this._endCallback();
			// End the loop.
			return;
		}
		
		// Draw grid elements.
		this._grid.draw(this._ctx);
		
		requestAnimationFrame(this._boundUpdate);
	},
	
	/**
	 * Initialize and start the level.
	 */
	reload: function () {
		// Create the grid.
		this._grid = new Grid(this._levelData.width, this._levelData.height);
		// Create the player.
		this._player = new Player(this._levelData.playerSpawn.x, this._levelData.playerSpawn.y, this._grid);
		// Create the goal tile.
		this._goal = new Goal(this._levelData.goal.x, this._levelData.goal.y, this._grid);
		// Create the static blocks.
		this._levelData.staticBlocks.forEach(function (block) {
			new StaticBlock(block.x, block.y, this._grid);
		}, this);
		// Create the tetrominos.
		this._levelData.tetrominos.forEach(function (tetromino) {
			new Tetromino(Tetromino.BLOCKS[tetromino.type][tetromino.orientation],
				tetromino.x,
				tetromino.y,
				this._grid,
				Tetromino.BLOCKS[tetromino.type].color);
		}, this);
	}
};
