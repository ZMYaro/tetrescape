'use strict';

/**
 * Initialize a new MenuView.
 * @param {HTMLElement} elem - The element for this view
 * @param {View} [parent] - The next view up, if any
 */
function MenuView(elem, parent) {
	// Call the superclass constructor.
	View.call(this, elem, parent);
	
	this.inputs = Array.prototype.slice.call(elem.getElementsByClassName('menu')[0].querySelectorAll('button,input'));
	this.activeInputIndex = 0;
	
	// Give each input a reference to its containing view.
	this.inputs.forEach(function (input) {
		input.view = this;
		input.onfocus = function () {
			this.view.activeInputIndex = this.view.inputs.indexOf(this);
		};
	}, this);
}

// Initialize static constants.
/** {Array<Number>} The codes for keys that move left */
MenuView.LEFT_KEYS = [
	37, // Left arrow
	65 // A
];
/** {Array<Number>} The codes for keys that move right */
MenuView.RIGHT_KEYS = [
	39, // Right arrow
	68, // D
	69 // E
];
/** {Array<Number>} The codes for keys that move up */
MenuView.UP_KEYS = [
	38, // Up arrow
	87, // W
	188 // Comma
];
/** {Array<Number>} The codes for keys that move down */
MenuView.DOWN_KEYS = [
	40, // Down arrow
	79, // O
	83  // S
];


// Inherit from View.
MenuView.prototype = Object.create(View.prototype);

/**
 * Handle key presses.
 * @override
 * @param {KeyboardEvent} e
 */
MenuView.prototype._handleKeyDown = function (e) {
	// Call the superclass implementation of handleKeyDown.
	View.prototype._handleKeyDown.call(this, e);
	
	// Move horizontally in landscape and vertically in portrait.
	if (MenuView.RIGHT_KEYS.indexOf(e.keyCode) !== -1 && window.innerWidth > window.innerHeight) {
		e.preventDefault();
		this._moveNext();
	} else if (MenuView.LEFT_KEYS.indexOf(e.keyCode) !== -1 && window.innerWidth > window.innerHeight) {
		e.preventDefault();
		this._movePrev();
	} else if (MenuView.DOWN_KEYS.indexOf(e.keyCode) !== -1 && window.innerHeight > window.innerWidth) {
		e.preventDefault();
		this._moveNext();
	} else if (MenuView.UP_KEYS.indexOf(e.keyCode) !== -1 && window.innerHeight > window.innerWidth) {
		e.preventDefault();
		this._movePrev();
	}
};

/**
 * Focus the next input down, wrapping at the bottom.
 */
MenuView.prototype._moveNext = function () {
	if (this.inputs.length === 0) {
		// If this menu has no inputs, just ensure nothing else has focus.
		document.activeElement.focus();
		return;
	}
	
	do {
		// Move the focus down one.
		this.activeInputIndex++;
		
		// Wrap at the bottom.
		if (this.activeInputIndex >= this.inputs.length) {
			this.activeInputIndex = 0;
		}
		
		// Keep going until the focused element is not an unchecked checkbox or radio button.
	} while ((this.inputs[this.activeInputIndex].type === 'checkbox' || this.inputs[this.activeInputIndex].type === 'radio') &&
		!this.inputs[this.activeInputIndex].checked);
	
	// Focus the input.
	this.inputs[this.activeInputIndex].focus();
};

/**
 * Focus the next input up, wrapping at the top.
 */
MenuView.prototype._movePrev = function () {
	if (this.inputs.length === 0) {
		// If this menu has no inputs, just ensure nothing else has focus.
		document.activeElement.focus();
		return;
	}
	
	do {
		// Move the focus up one.
		this.activeInputIndex--;
		
		// Wrap at the top.
		if (this.activeInputIndex < 0) {
			this.activeInputIndex = this.inputs.length - 1;
		}
		
		// Keep going until the focused element is not an unchecked checkbox or radio button.
	} while ((this.inputs[this.activeInputIndex].type === 'checkbox' || this.inputs[this.activeInputIndex].type === 'radio') &&
		!this.inputs[this.activeInputIndex].checked);
	
	// Focus the input.
	this.inputs[this.activeInputIndex].focus();
};

/**
 * Open the menu and enable its event listeners.
 * @override
 * @param {View} [parent] - The menu from which this menu was opened.
 */
MenuView.prototype.open = function (parent) {
	// Call the superclass implementation of open.
	View.prototype.open.call(this, parent);
	
	// Focus the last focused input.
	this.activeInputIndex--;
	this._moveNext();
};
