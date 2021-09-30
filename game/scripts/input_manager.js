'use strict';

/**
 * Initialize a new InputManager.
 * @param {HTMLElement} [swipeSurface] - The surface to detect directional swipes on, if any
 */
function InputManager(swipeSurface) {
	this._handlers = {
		left: [],
		right: [],
		up: [],
		down: [],
		select: [],
		back: [],
		quit: [],
		restart: []
	};
	
	// Set up key event listener.
	window.addEventListener('keydown', this._handleKeyDown.bind(this));
	
	Controller.search({
		settings: {
			useAnalogAsDpad: 'both'
		}
	});
	window.addEventListener('gc.button.press', this._handleButtonPress.bind(this));
	
	// Set up Hammer for swipe events.
	if (swipeSurface) {
		this._hammer = new Hammer(swipeSurface);
		this._hammer.get('swipe').set({
			direction: Hammer.DIRECTION_ALL,
			threshold: 3,
			velocity: 0.05
		});
		this._hammer.on('swipe', this._handleSwipe.bind(this));
	}
}

/** @constant {Object<String, Array<Number>>} The key codes that map to each command */
InputManager.prototype.KEYS = {
	left: [
		37, // Left arrow
		65  // A
	],
	right: [
		39, // Right arrow
		68, // D
		69  // E
	],
	up: [
		38, // Up arrow
		87, // W
		188 // Comma
	],
	down: [
		40, // Down arrow
		79, // O
		83  // S
	],
	back: [
		8, // Backspace
		27 // Esc
	],
	quit: [
		27 // Esc
	],
	restart: [
		82 // R
	]
};

/** @constant {Object<String, Array<String>} The Controller.js button names that map to each command */
InputManager.prototype.GAMEPAD_BUTTONS = {
	left: [
		'DPAD_LEFT'
	],
	right: [
		'DPAD_RIGHT'
	],
	up: [
		'DPAD_UP'
	],
	down: [
		'DPAD_DOWN'
	],
	select: [
		'FACE_2'
	],
	back: [
		'FACE_1',
		'SELECT'
	],
	quit: [
		'SELECT'
	],
	restart: [
		'FACE_3'
	]
};

/**
 * Add a new event listener for a given command.
 * @param {String} command
 * @param {Function} callback
 */
InputManager.prototype.addEventListener = function (command, callback) {
	if (!this._handlers[command]) {
		throw new Error('No such event: \u201c' + command + '\u201d');
	}
	if (typeof(callback) !== 'function') {
		throw new TypeError('Callback must be a function.');
	}
	this._handlers[command].push(callback);
};

/**
 * @private
 * Emit an event to listeners for a given command.
 * @param {String} command
 */
InputManager.prototype._dispatchEvent = function (command) {
	this._handlers[command].forEach(function (handler) {
		handler();
	});
};

/**
 * @private
 * Handle key presses.
 * @param {KeyboardEvent} ev
 */
InputManager.prototype._handleKeyDown = function (ev) {
	if (ev.ctrlKey || ev.altKey || ev.metaKey) {
		// Do not block browser keyboard shortcuts.
		return;
	}
	Object.keys(this.KEYS).forEach(function (command) {
		if (this.KEYS[command].includes(ev.keyCode)) {
			ev.preventDefault();
			this._dispatchEvent(command);
		}
	}, this);
};

/**
 * @private
 * Handle gamepad button presses.
 * @param {Event} ev
 */
InputManager.prototype._handleButtonPress = function (ev) {
	Object.keys(this.GAMEPAD_BUTTONS).forEach(function (command) {
		if (this.GAMEPAD_BUTTONS[command].includes(ev.detail.name)) {
			this._dispatchEvent(command);
		}
	}, this);
};

/**
 * @private
 * Handle a swipe gesture.
 * @param {Object} ev - The Hammer.js touch event
 */
InputManager.prototype._handleSwipe = function (ev) {
	switch (ev.direction) {
		case Hammer.DIRECTION_LEFT:
			this._dispatchEvent('left');
			break;
		case Hammer.DIRECTION_RIGHT:
			this._dispatchEvent('right');
			break;
		case Hammer.DIRECTION_UP:
			this._dispatchEvent('up');
			break;
		case Hammer.DIRECTION_DOWN:
			this._dispatchEvent('down');
			break;
	}
};
