'use strict';

/**
 * Initialize a new OptionsView.
 * @param {HTMLElement} elem - The element for this view
 * @param {View} [parent] - The next view up, if any
 */
function OptionsView(elem, parent) {
	// Call the superclass constructor.
	MenuView.call(this, elem, parent);
	
	this.elem.querySelector('#controls-select')
		.addEventListener('input', this._handleControlsSelect);
	this.elem.querySelector('#reset-button')
		.addEventListener('click', this._handleResetButton);
}

// Inherit from View.
OptionsView.prototype = Object.create(MenuView.prototype);

/**
 * 
 */
OptionsView.prototype._handleControlsSelect = function (ev) {
	alert('Not yet implemented!');
};

/**
 * 
 */
OptionsView.prototype._handleResetButton = function () {
	var confirmed = confirm('Are you sure you want to reset your scores?  This cannot be undone!');
	if (!confirmed) {
		return;
	}
	
	LEVELS.forEach(function (level, i) {
		localStorage.removeItem(getLocalStorageID(level.name, MODES.MOVES));
		localStorage.removeItem(getLocalStorageID(level.name, MODES.BLOCKS));
	});
	
	// Update the level select screen with the new values.
	populateLevelSelect();
	
	alert('Scores reset!');
};
