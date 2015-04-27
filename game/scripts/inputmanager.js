'use strict';

/**
 * Initialize a new input manager.
 */
function InputManager(callbacks) {
	this._callbacks = callbacks;
	
	// Set up Hammer for swipe events.
	this._hammer = new Hammer(document.getElementById('canvas'));
	this._hammer.get('swipe').set({
		direction: Hammer.DIRECTION_ALL,
		threshold: 3,
		velocity: 0.05
	});
	
	// Create bound event handling functions.
	this._boundHandleKeyDown = this._handleKeyDown.bind(this);
	this._boundHandleSwipe = this._handleSwipe.bind(this);
	
	// Set event listeners.
	window.addEventListener('keydown', this._boundHandleKeyDown, false);
	this._hammer.on('swipe', this._boundHandleSwipe);
}

// Initialize static constants.
InputManager.DOWN_KEYS = [
	40, // Down
	79, // O
	83 // S
];
InputManager.LEFT_KEYS = [
	37, // Left
	65 // A
];
InputManager.RIGHT_KEYS = [
	39, // Right
	68, // D
	69 // E
];
InputManager.UP_KEYS = [
	38, // Up
	87, // W
	188, // Comma
];
InputManager.RETRY_KEY = 82;

InputManager.prototype = {
	/**
	 * Handle a key being pressed.
	 * @param {KeyboardEvent} e
	 * @private
	 */
	_handleKeyDown: function (e) {
		if (InputManager.DOWN_KEYS.indexOf(e.keyCode) !== -1) {
			this._callbacks.down();
		} else if (InputManager.LEFT_KEYS.indexOf(e.keyCode) !== -1) {
			this._callbacks.left();
		} else if (InputManager.RIGHT_KEYS.indexOf(e.keyCode) !== -1) {
			this._callbacks.right();
		} else if (InputManager.UP_KEYS.indexOf(e.keyCode) !== -1) {
			this._callbacks.up();
		} else if (InputManager.RETRY_KEY === e.keyCode) {
			this._callbacks.retry();
		}
	},
	
	/**
	 * Handle a swipe gesture.
	 * @param {Object} e - The Hammer.js touch event
	 * @private
	 */
	_handleSwipe: function (e) {
		switch (e.direction) {
			case Hammer.DIRECTION_DOWN:
				this._callbacks.down();
				break;
			case Hammer.DIRECTION_LEFT:
				this._callbacks.left();
				break;
			case Hammer.DIRECTION_RIGHT:
				this._callbacks.right();
				break;
			case Hammer.DIRECTION_UP:
				this._callbacks.up();
				break;
		}
	}
};

