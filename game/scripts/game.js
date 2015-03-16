'use strict';

/**
 * Initialize a new Game.
 * @class
 * @param {HTMLCanvasElement} canvas - The canvas on whch the game will appear
 */
function Game(canvas, level) {
	// Initialize private variables.
	this._canvas = canvas;
	this._ctx = canvas.getContext('2d');
	this._im = new InputManager();
	// Add placeholders for additional private variables.
	this._grid = undefined;
	this._player = undefined;
	this._currentLevel = undefined;
	
	this._boundUpdate = this._update.bind(this);
	
	this.startLevel(level);
}

Game.prototype = {
	/**
	 * The main game loop
	 * @private
	 */
	_update: function () {
		// Clear the screen.
		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
		
		// Handle player movement.
		if (this._im.left && !this._im.right && !this._im.up && !this._im.down) {
			this._player.tryMove(Vector2D.LEFT);
		} else if (this._im.right && !this._im.left && !this._im.up && !this._im.down) {
			this._player.tryMove(Vector2D.RIGHT);
		} else if (this._im.up && !this._im.left && !this._im.right && !this._im.down) {
			this._player.tryMove(Vector2D.UP);
		} else if (this._im.down && !this._im.left && !this._im.right && !this._im.up) {
			this._player.tryMove(Vector2D.DOWN);
		}
		
		// Draw grid elements.
		this._grid.draw(this._ctx);
		
		requestAnimationFrame(this._boundUpdate);
	},
	
	/**
	 * Initialize and start a level.
	 * @param {Level} level - The level to initialize
	 */
	startLevel: function (level) {
		// TODO: Replace this with proper level loading.
		// Create the grid.
		this._grid = new Grid(level.width, level.height);
		// Create the player.
		this._player = new Player(level.playerSpawn.x, level.playerSpawn.y, this._grid);
		// Create the tetrominos.
		level.tetrominos.forEach(function (tetromino) {
			new Tetromino(Tetromino.BLOCKS[tetromino.type][tetromino.orientation],
				tetromino.x,
				tetromino.y,
				this._grid,
				Tetromino.BLOCKS[tetromino.type].color);
		}, this);
		
		// Start the main game loop.
		this._update();
	}
};
