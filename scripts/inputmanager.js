'use strict';

/**
 * Initialize a new input manager.
 */
function InputManager() {
	this._keyStates = [];
	
	this._boundHandleKeyDown = this._handleKeyDown.bind(this);
	this._boundHandleKeyUp = this._handleKeyUp.bind(this);
	window.addEventListener('keydown', this._boundHandleKeyDown, false);
	window.addEventListener('keyup', this._boundHandleKeyUp, false);
}

InputManager.prototype = {
	// TODO: Support more input options.
	get down() {
		return this._keyStates[40];
	},
	get left() {
		return this._keyStates[37];
	},
	get right() {
		return this._keyStates[39];
	},
	get up() {
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
};

