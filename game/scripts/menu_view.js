'use strict';

/**
 * Initialize a new MenuView.
 * @param {HTMLElement} elem - The element for this view
 * @param {View} [parent] - The next view up, if any
 */
function MenuView(elem, parent) {
	// Call the superclass constructor.
	View.call(this, elem, parent);
	
	this.inputs = Array.prototype.slice.call(
		elem.querySelectorAll('.menu button, .menu input, .menu select'));
	this.activeInputIndex = 0;
	
	// Give each input a reference to its containing view.
	this.inputs.forEach(function (input) {
		input.view = this;
		input.addEventListener('focus', MenuView.setActiveInputToFocused);
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
 * @static
 * Set the active input index to a focused button.
 */
MenuView.setActiveInputToFocused = function () {
	this.view.activeInputIndex = this.view.inputs.indexOf(this);
};


/**
 * @private
 * Handle a left input.
 */
MenuView.prototype._handleLeftInput = function () {
	if (!this._active) { return; }
	if (window.innerWidth > window.innerHeight) {
		// Move horizontally in landscape.
		this._moveFocusPrev();
	} else {
		// Change options in portrait.
		this._selectPrevOption();
	}
};

/**
 * @private
 * Handle a right input.
 */
MenuView.prototype._handleRightInput = function () {
	if (!this._active) { return; }
	if (window.innerWidth > window.innerHeight) {
		// Move horizontally in landscape.
		this._moveFocusNext();
	} else {
		// Change options in portrait.
		this._selectNextOption();
	}
};

/**
 * @private
 * Handle an up input.
 */
MenuView.prototype._handleUpInput = function () {
	if (!this._active) { return; }
	if (window.innerHeight > window.innerWidth) {
		// Move vertically in portrait.
		this._moveFocusPrev();
	} else {
		// Change options in landscape.
		this._selectPrevOption();
	}
};

/**
 * @private
 * Handle a down input.
 */
MenuView.prototype._handleDownInput = function () {
	if (!this._active) { return; }
	if (window.innerHeight > window.innerWidth) {
		// Move vertically in portrait.
		this._moveFocusNext();
	} else {
		// Change options in landscape.
		this._selectNextOption();
	}
};

/**
 * @private
 * Handle a selection input.
 */
MenuView.prototype._handleSelectInput = function () {
	if (!this._active) { return; }
	if (this._wasActiveInputInactive()) { return; }
	
	// Select the active button.
	if (this.inputs[this.activeInputIndex].tagName.toLowerCase() === 'button') {
		this._active = false;
		Utils.animateButtonPress(this.inputs[this.activeInputIndex]);
	}
};

/**
 * @private
 * If the active input is not focused, focus it.
 * @returns {Boolean} Whether the active input was inactive before the function was run
 */
MenuView.prototype._wasActiveInputInactive = function () {
	if (document.activeElement !== this.inputs[this.activeInputIndex]) {
		if (this.inputs[this.activeInputIndex]) {
			this.inputs[this.activeInputIndex].focus();
		}
		return true;
	}
	return false;
}

/**
 * @private
 * Focus the next input down, wrapping at the bottom.
 */
MenuView.prototype._moveFocusNext = function () {
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
		
		// Keep going until the focused element is not disabled or
		// an unchecked checkbox or radio button.
	} while (
		this.inputs[this.activeInputIndex].disabled ||
		((this.inputs[this.activeInputIndex].type === 'checkbox' ||
				this.inputs[this.activeInputIndex].type === 'radio') &&
			!this.inputs[this.activeInputIndex].checked));
	
	// Focus the input.
	this.inputs[this.activeInputIndex].focus();
	this.inputs[this.activeInputIndex].scrollIntoView(false);
};

/**
 * @private
 * Focus the next input up, wrapping at the top.
 */
MenuView.prototype._moveFocusPrev = function () {
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
		
		// Keep going until the focused element is not disabled or
		// an unchecked checkbox or radio button.
	} while (
		this.inputs[this.activeInputIndex].disabled ||
		((this.inputs[this.activeInputIndex].type === 'checkbox' ||
				this.inputs[this.activeInputIndex].type === 'radio') &&
			!this.inputs[this.activeInputIndex].checked));
	
	// Focus the input.
	this.inputs[this.activeInputIndex].focus();
	this.inputs[this.activeInputIndex].scrollIntoView(true);
};

/**
 * @private
 * Advance the active element to the previous option if it is a <select>.
 */
MenuView.prototype._selectPrevOption = function () {
	if (this._wasActiveInputInactive()) { return; }
	
	var activeInput = this.inputs[this.activeInputIndex];
	
	if (activeInput.tagName.toLowerCase() !== 'select' || activeInput.options.length === 0) {
		// Skip inputs with no options.
		return;
	}
	
	var newIndex = activeInput.selectedIndex;
	do {
		newIndex--;
		
		// Wrap.
		if (newIndex < 0) {
			newIndex = activeInput.options.length - 1;
		}
		
		// Keep going until a non-disabled option is found.
	} while (activeInput.options[newIndex].disabled);
	
	activeInput.selectedIndex = newIndex;
	
	// Trigger a change event.
	activeInput.dispatchEvent(new Event('change'));
};

/**
 * @private
 * Advance the active element to the next option if it is a <select>.
 */
MenuView.prototype._selectNextOption = function () {
	if (this._wasActiveInputInactive()) { return; }
	
	var activeInput = this.inputs[this.activeInputIndex];
	
	if (activeInput.tagName.toLowerCase() !== 'select' || activeInput.options.length === 0) {
		// Skip inputs with no options.
		return;
	}
	
	var newIndex = activeInput.selectedIndex;
	do {
		newIndex++;
		
		// Wrap.
		if (newIndex >= activeInput.options.length) {
			newIndex = 0;
		}
		
		// Keep going until a non-disabled option is found.
	} while (activeInput.options[newIndex].disabled);
	
	activeInput.selectedIndex = newIndex;
	
	// Trigger a change event.
	activeInput.dispatchEvent(new Event('change'));
};

/**
 * @override
 * Reenable a suspended view and its event listeners.
 */
MenuView.prototype.resume = function () {
	// Call the superclass implementation of resume.
	View.prototype.resume.call(this);
	
	// Focus the last focused input.
	this.activeInputIndex--;
	this._moveFocusNext();
};
