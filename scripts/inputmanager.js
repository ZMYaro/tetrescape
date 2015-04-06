'use strict';

/**
 * Initialize a new input manager.
 */
function InputManager() {
	this._keyStates = [];
	this._lastSwipe = {
		down: false,
		left: false,
		right: false,
		up: false
	};
	
	// Set up Hammer for swipe events.
	this._hammer = new Hammer(document.getElementById('canvas'));
	this._hammer.get('swipe').set({direction: Hammer.DIRECTION_ALL});
	
	this._boundHandleKeyDown = this._handleKeyDown.bind(this);
	this._boundHandleKeyUp = this._handleKeyUp.bind(this);
	this._boundHandleSwipe = this._handleSwipe.bind(this);
	window.addEventListener('keydown', this._boundHandleKeyDown, false);
	window.addEventListener('keyup', this._boundHandleKeyUp, false);
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
	// TODO: Support more input options.
	get down() {
		if (this._lastSwipe.down) {
			this._lastSwipe.down = false;
			return true;
		}
		for (var i = 0; i < InputManager.DOWN_KEYS.length; i++) {
			if (this._keyStates[InputManager.DOWN_KEYS[i]]) {
				return true;
			}
		}
		return false;
	},
	get left() {
		if (this._lastSwipe.left) {
			this._lastSwipe.left = false;
			return true;
		}
		for (var i = 0; i < InputManager.LEFT_KEYS.length; i++) {
			if (this._keyStates[InputManager.LEFT_KEYS[i]]) {
				return true;
			}
		}
		return false;
	},
	get right() {
		if (this._lastSwipe.right) {
			this._lastSwipe.right = false;
			return true;
		}
		for (var i = 0; i < InputManager.RIGHT_KEYS.length; i++) {
			if (this._keyStates[InputManager.RIGHT_KEYS[i]]) {
				return true;
			}
		}
		return false;
	},
	get up() {
		if (this._lastSwipe.up) {
			this._lastSwipe.up = false;
			return true;
		}
		for (var i = 0; i < InputManager.UP_KEYS.length; i++) {
			if (this._keyStates[InputManager.UP_KEYS[i]]) {
				return true;
			}
		}
		return false;
	},
	get retry() {
		return this._keyStates[InputManager.RETRY_KEY];
	},
	
	/**
	 * Handle a key being pressed.
	 * @param {KeyboardEvent} e
	 * @private
	 */
	_handleKeyDown: function (e) {
		this._keyStates[e.keyCode] = true;
	},
	
	/**
	 * Handle a key being released.
	 * @param {KeyboardEvent} e
	 * @private
	 */
	_handleKeyUp: function (e) {
		this._keyStates[e.keyCode] = false;
	},
	
	/**
	 * Handle a swipe gesture.
	 * @param {Object} e - The Hammer.js touch event
	 * @private
	 */
	_handleSwipe: function (e) {
		switch (e.direction) {
			case Hammer.DIRECTION_DOWN:
				this._lastSwipe.down = true;
				break;
			case Hammer.DIRECTION_LEFT:
				this._lastSwipe.left = true;
				break;
			case Hammer.DIRECTION_RIGHT:
				this._lastSwipe.right = true;
				break;
			case Hammer.DIRECTION_UP:
				this._lastSwipe.up = true;
				break;
		}
	}
};

