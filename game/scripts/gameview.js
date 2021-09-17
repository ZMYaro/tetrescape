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
	
	// Enable the game reset button.
	this.topBar.querySelector('#restart-button').onclick = (function () {
		this._game.reload();
	}).bind(this);
	
	// Ensure the canvas always fits the view.
	this._canvas = this.elem.querySelector('#canvas');
	window.onresize = this._handleResize.bind(this);
	this._handleResize();
}

// Inherit from View.
GameView.prototype = Object.create(View.prototype);

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
	this._game = new Game(this._canvas, LEVELS[level], endGame);
	
	// Show the control hint on the first level.
	this.elem.querySelector('#controlHint').style.display = (level === 0) ? 'block' : 'none';
};

/**
 * @override
 * Quit the game, close the view, and disable its event listeners.
 */
GameView.prototype.close = function () {
	// End the game.
	if (this._game) {
		this._game.destroy();
		delete this._game;
	}
	
	// Call the superclass implementation of close.
	View.prototype.close.call(this);
};
