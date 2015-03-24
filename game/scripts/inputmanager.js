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

InputManager.prototype = {
	// TODO: Support more input options.
	get down() {
		if (this._lastSwipe.down) {
			this._lastSwipe.down = false;
			return true;
		}
		return this._keyStates[40];
	},
	get left() {
		if (this._lastSwipe.left) {
			this._lastSwipe.left = false;
			return true;
		}
		return this._keyStates[37];
	},
	get right() {
		if (this._lastSwipe.right) {
			this._lastSwipe.right = false;
			return true;
		}
		return this._keyStates[39];
	},
	get up() {
		if (this._lastSwipe.up) {
			this._lastSwipe.up = false;
			return true;
		}
		return this._keyStates[38];
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

