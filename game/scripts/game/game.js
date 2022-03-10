'use strict';

/**
 * Initialize a new Game.
 * @class
 * @param {HTMLCanvasElement} canvas - The canvas on which the game will appear
 * @param {function} endCallback - The function to call when the player wins
 */
function Game(canvas, endCallback) {
	// Initialize private variables.
	this._active = false;
	this._canvas = canvas;
	this._ctx = canvas.getContext('2d');
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
	
	this._levelData = LEVELS[0];
	
	// Set up event listeners.
	im.addEventListener('left', (function () {
		if (!this._active) { return; }
		this._moves++;
		this._player.tryMove(Vector2D.LEFT);
	}).bind(this));
	im.addEventListener('right', (function () {
		if (!this._active) { return; }
		this._moves++;
		this._player.tryMove(Vector2D.RIGHT);
	}).bind(this));
	im.addEventListener('up', (function () {
		if (!this._active) { return; }
		this._moves++;
		this._player.tryMove(Vector2D.UP);
	}).bind(this));
	im.addEventListener('down', (function () {
		if (!this._active) { return; }
		this._moves++;
		this._player.tryMove(Vector2D.DOWN);
	}).bind(this));
	
	// Load sprites.
	this.loadPromise = Promise.all([
		GridOccupant.loadAssets(Player),
		GridOccupant.loadAssets(Goal)
	]);
}

Game.prototype = {
	/**
	 * @private
	 * The main game loop
	 */
	_update: function () {
		if (!this._active) { return; }
		
		// Clear the screen.
		this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
		
		// Update grid elements.
		this._grid.update();
		this._goal.update();
		
		// Check whether a new row has been formed and eliminate it.
		this._blocksCleared += this._grid.clearRows();
		
		// Check whether the player has reached the goal.
		if (this._player.x === this._goal.x && this._player.y === this._goal.y) {
			this._winGame();
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
	 * @private
	 * Update the score display on the app bar.
	 */
	_updateScore: function () {
		document.getElementById('moves-display').innerHTML = this._moves;
		document.getElementById('blocks-display').innerHTML = this._blocksCleared;
	},
	
	/**
	 * @private
	 * End the game.
	 */
	_winGame: function () {
		// Play a victory sound.
		document.getElementById('win-sound').play();
		
		// Go to the end screen.
		this.deactivate();
		this._endCallback(this._moves, this._blocksCleared);
	},
	
	/**
	 * Set the level and initialize it.
	 * @param {Object} levelData
	 */
	loadLevel: function (levelData) {
		this._levelData = levelData;
		this.reload();
		// Update the canvas size for the new level.
		this.rescale();
	},
	
	/**
	 * Start the game.
	 */
	start: function () {
		this._active = true;
		// Start the update loop.
		this._update();
	},
	
	/**
	 * Initialize and start the current level.
	 */
	reload: function () {
		// Display the level name.
		document.getElementById('level-name-display').innerHTML = this._levelData.name;
		
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
			new Tetromino(
				tetromino.type,
				tetromino.orientation,
				tetromino.x,
				tetromino.y,
				this._grid);
		}, this);
		
		// Reset the block counter.
		this._blocksCleared = 0;
		
		// Reset the move counter.
		this._moves = 0;
	},
	
	/**
	 * Scale the level to fit within the canvas.
	 * @param {Number} availWidth - The available width within the window and UI
	 * @param {Number} availHeight - The available height within the window and UI
	 */
	rescale: function () {
		var availWidth = views.game.elem.offsetWidth,
			availHeight = views.game.elem.offsetHeight - views.game.topBar.offsetHeight,
			availRatio = availWidth / availHeight,
			levelRatio = this._levelData.width / this._levelData.height;
		
		if (levelRatio < availRatio) {
			this._blockSize = availHeight / this._levelData.height;
		} else {
			this._blockSize = availWidth / this._levelData.width;
		}
		this._canvas.width = this._levelData.width * this._blockSize;
		this._canvas.height = this._levelData.height * this._blockSize;
	},
	
	/**
	 * Close and clean up the game.
	 */
	deactivate: function () {
		this._active = false;
	}
};
