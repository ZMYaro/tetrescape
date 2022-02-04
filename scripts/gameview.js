'use strict';

/**
 * Initialize a new GameView.
 * @param {HTMLElement} elem - The element for this view
 * @param {View} [parent] - The next view up, if any
 */
function GameView(elem, parent) {
	// Call the superclass constructor.
	View.call(this, elem, parent);
	
	// Get the view's app bar.
	this.topBar = this.elem.querySelector('.top-bar');
	
	// Ensure the canvas always fits the view.
	this._canvas = this.elem.querySelector('#game-canvas');
	window.onresize = this._handleResize.bind(this);
	this._handleResize();
	
	// Create the game instance.
	this._game = new Game(this._canvas, endGame);
	
	// Enable the game restart button.
	this.restartButton = this.topBar.querySelector('#restart-button');
	this.restartButton.addEventListener('click', this._game.reload.bind(this._game));
	im.addEventListener('restart', this._handleRestartInput.bind(this));
	
	im.addEventListener('quit', this._handleQuitInput.bind(this));
	
}

// Inherit from View.
GameView.prototype = Object.create(View.prototype);

/**
 * @private
 * Do not close on regular back input.
 */
GameView.prototype._handleBackInput = function () { return; },

/**
 * @private
 * Close the view on a quit input.
 */
GameView.prototype._handleQuitInput = function () {
	View.prototype._handleBackInput.call(this);
},

/**
 * @private
 * Handle restart game input.
 */
GameView.prototype._handleRestartInput = function () {
	if (!this._active) { return; }
	Utils.animateButtonPress(this.restartButton);
};

/**
 * @private
 * Handle the window being resized.
 */
GameView.prototype._handleResize = function () {
	this._canvas.width = window.innerWidth;
	this._canvas.height = window.innerHeight - this.topBar.offsetHeight;
	if (this._game) {
		this._game.rescale();
	}
};

/**
 * Start the actual game to a particular level.
 * @param {Number} level
 */
GameView.prototype.startGame = function (level) {
	window.currentLevel = level; // TODO: Make this non-global.
	this._game.loadLevel(LEVELS[level]);
	this._game.start();
	
	// Show the control hint on the first level.
	this.elem.querySelector('#control-hint').style.display = (level === 0) ? 'block' : 'none';
};

/**
 * @override
 * Quit the game, close the view, and disable its event listeners.
 */
GameView.prototype.close = function () {
	// End the game.
	this._game.deactivate();
	
	// Call the superclass implementation of close.
	View.prototype.close.call(this);
};
