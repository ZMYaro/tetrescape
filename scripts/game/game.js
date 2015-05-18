'use strict';

/**
 * Initialize a new Game.
 * @class
 * @param {HTMLCanvasElement} canvas - The canvas on whch the game will appear
 */
function Game(canvas, levelData, endCallback) {
	// Initialize private variables.
	this._canvas = canvas;
	this._ctx = canvas.getContext('2d');
	this._im = new InputManager({
		down: (function () {
			this._moves++;
			this._player.tryMove(Vector2D.DOWN)
		}).bind(this),
		left: (function () {
			this._moves++;
			this._player.tryMove(Vector2D.LEFT)
		}).bind(this),
		right: (function () {
			this._moves++;
			this._player.tryMove(Vector2D.RIGHT)
		}).bind(this),
		up: (function () {
			this._moves++;
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
	this._blockSize = 1;
	
	this._blocksCleared = 0;
	this._moves = 0;
	
	this._boundUpdate = this._update.bind(this);
	
	this._levelData = levelData;
	
	// Load the level.
	this.reload();
	
	// Scale the game for the current canvas size.
	this.rescale();
	
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
		this._blocksCleared += this._grid.clearRows();
		
		// Check whether the player has reached the goal.
		if (this._player.x === this._goal.x && this._player.y === this._goal.y) {
			// Play a victory sound.
			document.getElementById('winSound').play();
			// End the game.
			if (currentMode === MODES.MOVES) {
				this._endCallback(this._moves);
			} else if (currentMode === MODES.BLOCKS) {
				this._endCallback(this._blocksCleared);
			}
			// End the loop.
			return;
		}
		
		// Draw grid elements.
		this._grid.draw(this._ctx, this._blockSize);
		
		// Update the score display.
		this._updateScore();
		
		requestAnimationFrame(this._boundUpdate);
	},
	
	/**
	 * Update the score display on the app bar.
	 */
	_updateScore: function () {
		if (currentMode === MODES.MOVES) {
			document.getElementById('gameScore').innerHTML = this._moves + ' move' + (this._moves === 1 ? '' : 's');
		} else if (currentMode === MODES.BLOCKS) {
			document.getElementById('gameScore').innerHTML = this._blocksCleared + ' block' + (this._blocksCleared === 1 ? '' : 's') + ' cleared';
		}
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
		
		// Reset the block counter.
		this._blocksCleared = 0;
		
		// Reset the move counter.
		this._moves = 0;
	},
	
	/**
	 * Scale the level to fit within the canvas.
	 */
	rescale: function () {
		var canvasRatio = this._canvas.width / this._canvas.height,
			levelRatio = this._levelData.width / this._levelData.height;
		
		if (levelRatio < canvasRatio) {
			this._blockSize = this._canvas.height / this._levelData.height;
		} else {
			this._blockSize = this._canvas.width / this._levelData.width;
		}
	}
};
