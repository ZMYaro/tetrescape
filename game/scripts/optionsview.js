'use strict';

/**
 * Initialize a new OptionsView.
 * @param {HTMLElement} elem - The element for this view
 * @param {View} [parent] - The next view up, if any
 */
function OptionsView(elem, parent) {
	// Call the superclass constructor.
	MenuView.call(this, elem, parent);
	
	// Enable inputs.
	var gamepadControlsSelect = this.elem.querySelector('#gamepad-controls-select');
	gamepadControlsSelect.value = im.gamepadControls;
	document.body.classList.add('gamepad-controls-' + im.gamepadControls);
	gamepadControlsSelect.addEventListener('change', this._handleControlsSelect.bind(this));
	
	this.elem.querySelector('#remove-ads-button')
		.addEventListener('click', this._handleRemoveAds.bind(this));
	this.elem.querySelector('#reset-button')
		.addEventListener('click', this._handleReset.bind(this));
}

// Inherit from View.
OptionsView.prototype = Object.create(MenuView.prototype);

/**
 * Handle the gamepad controls selection being changed.
 * @param {Event} ev
 */
OptionsView.prototype._handleControlsSelect = function (ev) {
	document.body.classList.remove('gamepad-controls-microsoft');
	document.body.classList.remove('gamepad-controls-nintendo');
	document.body.classList.add('gamepad-controls-' + ev.target.value);
	
	im.gamepadControls = ev.target.value;
	
	localStorage[GAME_PREFIX + 'gamepad-controls'] = ev.target.value;
};

/**
 * Handle the remove ads button being clicked.
 */
OptionsView.prototype._handleRemoveAds = function () {
	alert('Not available in this version.');
};

/**
 * Handle the reset button being clicked.
 */
OptionsView.prototype._handleReset = function () {
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
	
	// Keep the options view active since this button is not for navigation.
	this._active = true;
};
