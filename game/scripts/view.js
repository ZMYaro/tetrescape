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
	var backButton = elem.getElementsByClassName('back-button')[0];
	if (backButton) {
		backButton.view = this;
		backButton.onclick = function () {
			this.view.goBack();
		};
	}
	
	// Set up back event listener.
	im.addEventListener('back', this._handleBackInput.bind(this));
}

// Initialize static constants.
/** {Array<Number>} The codes for keys that go back */
View.BACK_KEYS = [
	8, // Backspace
	27 // Esc
];

View.prototype = {
	/**
	 * @private
	 * Handle a back input.
	 */
	_handleBackInput: function () {
		if (!this._active) { return; }
		
		// Do not allow the top-level view to be closed.
		if (this._parent) {
			this.goBack();
		}
	},
	
	/**
	 * Open the view and enable its event listeners.
	 * @param {View} [parent] - The view from which this view was opened, if any
	 */
	open: function (parent) {
		// If an event listener has been added, fire the event.
		if (typeof(this.onopen) === 'function') {
			this.onopen();
		}
		if (parent) {
			// Set the parent view if one was specified.
			this._parent = parent;
		}
		
		this.resume();
		this.elem.classList.add('active');
	},
	
	/**
	 * Reenable a suspended view and its event listeners.
	 */
	resume: function () {
		this._active = true;
	},
	
	/**
	 * Suspend a view and its event listeners.
	 */
	suspend: function () {
		this._active = false;
	},
	
	/**
	 * Close the view and disable its event listeners.
	 */
	close: function () {
		// If an event listener has been added, fire the event.
		if (typeof(this.onclose) === 'function') {
			this.onclose();
		}
		this.suspend();
		this.elem.classList.remove('active');
	},
	
	/**
	 * Open a subview.
	 * @param {View} subview - The subview to open.
	 */
	openSubview: function (subview) {
		this.suspend();
		subview.open(this);
	},
	
	/**
	 * Close the view and return to the parent view.
	 */
	goBack: function () {
		// Close the view.
		this.close();
		
		// Open the parent view, if any.
		if (this._parent) {
			this._parent.resume();
		} else {
			console.error('View.goBack was called on a view with no parent.');
		}
	}
};
