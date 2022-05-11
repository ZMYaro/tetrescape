'use strict';

/**
 * Initialize a new View.
 * @param {HTMLElement} elem - The element for this view
 * @param {View} [parent] - The next view up, if any
 */
function View(elem, parent) {
	// Initialize private variables.
	this._parent = parent;
	this._active = false;
	
	// Initialize public variables.
	this.elem = elem;
	
	// Give the back button (if any) a reference to its containing view.
	this.backButton = elem.getElementsByClassName('back-button')[0];
	if (this.backButton) {
		this.backButton.view = this;
		this.backButton.onclick = function () {
			this.view.goBack();
		};
	}
	
	// Set up back event listener.
	im.addEventListener('back', this._handleBackInput.bind(this));
}

// Define constants.
/** @constant {String} The URL fragment path for this view if static (should be overridden by subclasses) */
View.prototype.ROUTE;

/**
 * @private
 * Handle a back input.
 */
View.prototype._handleBackInput = function () {
	if (!this._active) { return; }
	
	// Do not allow the top-level view to be closed.
	if (!this._parent) {
		return;
	}
	Utils.animateButtonPress(this.backButton);
};

/**
 * Open the view and enable its event listeners.
 * @param {View} [parent] - The view from which this view was opened, if any
 */
View.prototype.open = function (parent) {
	// If an event listener has been added, fire the event.
	if (typeof(this.onopen) === 'function') {
		this.onopen();
	}
	if (parent) {
		// Set the parent view if one was specified.
		this._parent = parent;
	}
	
	this.resume();
	this.elem.classList.add('open');
};

/**
 * Reenable a suspended view and its event listeners.
 */
View.prototype.resume = function () {
	this._active = true;
	this.elem.classList.remove('suspended');
	
	views.active = this;
	
	// If the view has an associated route, update the URL.
	if (typeof(this.ROUTE) !== 'undefined') {
		location.hash = this.ROUTE;
	}
};

/**
 * Suspend a view and its event listeners.
 */
View.prototype.suspend = function () {
	this._active = false;
	this.elem.classList.add('suspended');
};

/**
 * Close the view and disable its event listeners.
 */
View.prototype.close = function () {
	// If an event listener has been added, fire the event.
	if (typeof(this.onclose) === 'function') {
		this.onclose();
	}
	this.suspend();
	this.elem.classList.remove('suspended');
	this.elem.classList.remove('open');
};

/**
 * Open a subview.
 * @param {View} subview - The subview to open.
 */
View.prototype.openSubview = function (subview) {
	this.suspend();
	subview.open(this);
};

/**
 * Close the view and return to the parent view.
 */
View.prototype.goBack = function () {
	// Close the view.
	this.close();
	
	// Open the parent view, if any.
	if (this._parent) {
		this._parent.resume();
	} else {
		console.error('View.goBack was called on a view with no parent.');
	}
};
