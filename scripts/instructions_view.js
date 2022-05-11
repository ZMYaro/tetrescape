'use strict';

/**
 * Initialize a new InstructionsView.
 * @param {HTMLElement} elem - The element for this view
 * @param {View} [parent] - The next view up, if any
 */
function InstructionsView(elem, parent) {
	// Call the superclass constructor.
	View.call(this, elem, parent);
}

// Inherit from View.
InstructionsView.prototype = Object.create(View.prototype);

// Define constants.
/** @override @constant {String} The fragment path for this view */
InstructionsView.prototype.ROUTE = 'instructions';
