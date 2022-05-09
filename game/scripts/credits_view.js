'use strict';

/**
 * Initialize a new CreditsView.
 * @param {HTMLElement} elem - The element for this view
 * @param {View} [parent] - The next view up, if any
 */
function CreditsView(elem, parent) {
	// Call the superclass constructor.
	View.call(this, elem, parent);
	
	this.scrollArea = this.elem.querySelector('.menu');
	
	// Set up input event listeners.
	im.addEventListener('up', this._handleUpInput.bind(this));
	im.addEventListener('down', this._handleDownInput.bind(this));
}

// Inherit from View.
CreditsView.prototype = Object.create(View.prototype);

// Define constants.
/** @override @constant {String} The hash path for this view */
CreditsView.prototype.HASH_PATH = 'credits';
/** @constant {Number} The amount scrolled per arrow or d-pad input */
CreditsView.prototype.SCROLL_AMOUNT = 32;

/**
 * @private
 * Scroll up on an up input.
 */
CreditsView.prototype._handleUpInput = function () {
	if (!this._active) { return; }
	this.scrollArea.scrollTop -= this.SCROLL_AMOUNT;
};

/**
 * @private
 * Scroll down on a down input.
 */
CreditsView.prototype._handleDownInput = function () {
	if (!this._active) { return; }
	this.scrollArea.scrollTop += this.SCROLL_AMOUNT;
};

/**
 * @override
 * Open the view and enable its event listeners.
 * @param {View} [parent] - The view from which this view was opened, if any
 */
CreditsView.prototype.open = function (parent) {
	View.prototype.open.call(this, parent);
	
	// Move the scrollable area back to the top when reopened.
	this.scrollArea.scrollTop = 0;
};
