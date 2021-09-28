'use strict';

/**
 * Initialize a new input manager.
 */
function GameInputManager(callbacks) {
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
	this.enable();
}

// Initialize static constants.
GameInputManager.DOWN_KEYS = [
	40, // Down
	79, // O
	83 // S
];
GameInputManager.LEFT_KEYS = [
	37, // Left
	65 // A
];
GameInputManager.RIGHT_KEYS = [
	39, // Right
	68, // D
	69 // E
];
GameInputManager.UP_KEYS = [
	38, // Up
	87, // W
	188, // Comma
];
GameInputManager.RETRY_KEY = 82; // R

GameInputManager.prototype = {
	/**
	 * Handle a key being pressed.
	 * @param {KeyboardEvent} e
	 * @private
	 */
	_handleKeyDown: function (e) {
		if (GameInputManager.DOWN_KEYS.indexOf(e.keyCode) !== -1) {
			this._callbacks.down();
		} else if (GameInputManager.LEFT_KEYS.indexOf(e.keyCode) !== -1) {
			this._callbacks.left();
		} else if (GameInputManager.RIGHT_KEYS.indexOf(e.keyCode) !== -1) {
			this._callbacks.right();
		} else if (GameInputManager.UP_KEYS.indexOf(e.keyCode) !== -1) {
			this._callbacks.up();
		} else if (GameInputManager.RETRY_KEY === e.keyCode) {
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
	},
	
	/**
	 * Disable event listeners.
	 */
	disable: function () {
		window.removeEventListener('keydown', this._boundHandleKeyDown, false);
		this._hammer.off('swipe', this._boundHandleSwipe);
	},
	
	/**
	 * Enable event listeners.
	 */
	enable: function () {
		window.addEventListener('keydown', this._boundHandleKeyDown, false);
		this._hammer.on('swipe', this._boundHandleSwipe);
	}
};

