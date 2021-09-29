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
	
	// Set up input event listeners.
	im.addEventListener('left', this._handleLeftInput.bind(this));
	im.addEventListener('right', this._handleRightInput.bind(this));
	im.addEventListener('up', this._handleUpInput.bind(this));
	im.addEventListener('down', this._handleDownInput.bind(this));
	im.addEventListener('select', this._handleSelectInput.bind(this));
}

// Inherit from View.
MenuView.prototype = Object.create(View.prototype);

/**
 * @private
 * Handle a left input.
 */
MenuView.prototype._handleLeftInput = function () {
	if (!this._active) { return; }
	// Move horizontally in landscape.
	if (window.innerWidth > window.innerHeight) {
		this._movePrev();
	}
};

/**
 * @private
 * Handle a right input.
 */
MenuView.prototype._handleRightInput = function () {
	if (!this._active) { return; }
	// Move horizontally in landscape.
	if (window.innerWidth > window.innerHeight) {
		this._moveNext();
	}
};

/**
 * @private
 * Handle a up input.
 */
MenuView.prototype._handleUpInput = function () {
	if (!this._active) { return; }
	// Move vertically in portrait.
	if (window.innerHeight > window.innerWidth) {
		this._movePrev();
	}
};

/**
 * @private
 * Handle a down input.
 */
MenuView.prototype._handleDownInput = function () {
	if (!this._active) { return; }
	// Move vertically in portrait.
	if (window.innerHeight > window.innerWidth) {
		this._moveNext();
	}
};

/**
 * @private
 * Handle a selection input.
 */
MenuView.prototype._handleSelectInput = function () {
	if (!this._active) { return; }
	
	if (document.activeElement !== this.inputs[this.activeInputIndex]) {
		// If the active input is not focused, focus it.
		this.inputs[this.activeInputIndex].focus();
		return;
	}
	
	// Select the active button.
	this._active = false;
	Utils.animateButtonPress(this.inputs[this.activeInputIndex]);
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
