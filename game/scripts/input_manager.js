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
	
	this._currentInputMethod = '';
	this._setCurrentInputMethod(this._assumeInputMethod());
	this.gamepadControls = (localStorage[GAME_PREFIX + 'gamepad-controls'] ||
			(this._currentInputMethod === 'xbox' ? 'microsoft' : 'nintendo'));
	
	// Set up key event listener.
	window.addEventListener('keydown', this._handleKeyDown.bind(this));
	
	Controller.search({
		settings: {
			useAnalogAsDpad: 'both'
		}
	});
	window.addEventListener('gc.button.press', this._handleButtonPress.bind(this));
	
	// Set up pointer and Hammer.js swipe events.
	window.addEventListener('pointerdown', this._handlePointerDown.bind(this));
	if (swipeSurface) {
		this._hammer = new Hammer(swipeSurface);
		this._hammer.get('swipe').set({
			direction: Hammer.DIRECTION_ALL,
			threshold: 3,
			velocity: 0.05
		});
		this._hammer.on('swipe', this._handlePointerSwipe.bind(this));
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

/** @constant {Object<String, Array<String>} The Controller.js button names that map to each command for Microsoft layout */
InputManager.prototype.GAMEPAD_BUTTONS_MICROSOFT = {
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
		'FACE_1'
	],
	back: [
		'FACE_2',
		'SELECT'
	],
	quit: [
		'SELECT'
	],
	restart: [
		'FACE_3'
	]
};
/** @constant {Object<String, Array<String>} The Controller.js button names that map to each command for Nintendo layout */
InputManager.prototype.GAMEPAD_BUTTONS_NINTENDO = {
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
 * Assume preferred input method based on the user agent string and connected gamepads.
 * @returns “gamepad”, “keyboard”, “touch”, “xbox”, or empty string
 */
InputManager.prototype._assumeInputMethod = function () {
	if (navigator.userAgent.toLowerCase().includes('xbox')) {
		return 'xbox';
	} else if (Utils.getActiveGamepadCount() > 0) {
		return 'gamepad';
	} else if (navigator.userAgent.toLowerCase().includes('mobile')) {
		return 'touch';
	}
	return '';
};

/**
 * @private
 * Set the current assumed preferred input method on the body.
 * @param {String} inputMethodName - “gamepad”, “keyboard”, “touch”, “xbox”
 */
InputManager.prototype._setCurrentInputMethod = function (inputMethodName) {
	if (this._currentInputMethod === inputMethodName) {
		return;
	}
	document.body.classList.remove('prefer-input-gamepad');
	document.body.classList.remove('prefer-input-keyboard');
	document.body.classList.remove('prefer-input-touch');
	document.body.classList.remove('prefer-input-xbox');
	if (inputMethodName) {
		document.body.classList.add('prefer-input-' + inputMethodName);
	}
	this._currentInputMethod = inputMethodName;
}

/**
 * @private
 * Handle key presses.
 * @param {KeyboardEvent} ev
 */
InputManager.prototype._handleKeyDown = function (ev) {
	this._setCurrentInputMethod('keyboard');
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
	var gamepadId = navigator.getGamepads()[ev.detail.controllerIndex].id,
		gamepadType = (gamepadId.toLowerCase().includes('xbox') ? 'xbox' : 'gamepad');
	this._setCurrentInputMethod(gamepadType);
	
	var gamepadButtons = (this.gamepadControls === 'microsoft' ?
			this.GAMEPAD_BUTTONS_MICROSOFT : this.GAMEPAD_BUTTONS_NINTENDO);
	Object.keys(gamepadButtons).forEach(function (command) {
		if (gamepadButtons[command].includes(ev.detail.name)) {
			this._dispatchEvent(command);
		}
	}, this);
};

/**
 * @private
 * Handle a pointer touching the screen.
 * @param {PointerEvent} ev
 */
InputManager.prototype._handlePointerDown = function (ev) {
	if (ev.pointerType === 'touch' || ev.pointerType === 'pen') {
		this._setCurrentInputMethod('touch');
	} else if (ev.pointerType === 'mouse') {
		this._setCurrentInputMethod('keyboard');
	}
};

/**
 * @private
 * Handle a swipe gesture.
 * @param {Object} ev - The Hammer.js touch event
 */
InputManager.prototype._handlePointerSwipe = function (ev) {
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
