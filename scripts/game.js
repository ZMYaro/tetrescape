'use strict';

/**
 * Initialize a new Game.
 * @class
 * @param {HTMLCanvasElement} canvas - The canvas on whch the game will appear
 */
function Game(canvas) {
	// Initialize private variables.
	this._canvas = canvas;
	this._ctx = canvas.getContext('2d');
	// Add placeholders for additional private variables.
	this._grid = undefined;
	this._player = undefined;
	this._currentLevel = undefined;
	
	this._boundUpdate = this._update.bind(this);
}

Game.prototype = {
	/**
	 * The main game loop
	 */
	_update: function () {
		// Clear the screen.
		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
		
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
		this._grid = new Grid(10, 10);
		// Create the player.
		this._player = new Player(5, 9, this._grid);
		// Create some blocks.
		/*for (var x = 0; x < grid.width; x++) {
			for (var y = 0; y < 0.5 * grid.height; y++) {
				if ((y + x) % 2 === 0) {
					new Block(x, y, this._grid);
				}
			}
		}*/
		
		// Start the main game loop.
		this._update();
	}
};
