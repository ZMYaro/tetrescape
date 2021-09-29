'use strict';

var Utils = {
	/**
	 * Make a button appear to have been pressed (with the `active` class) and then click it.
	 * @param {HTMLButtonElement} button - The button to press
	 * @returns {Promise} - Resolves after the button has been pressed
	 */
	animateButtonPress: function (button) {
		var PRESS_TIME = 150; // Milliseconds
		return new Promise(function (resolve, reject) {
			button.classList.add('active');
			setTimeout(function () {
				button.classList.remove('active');
				button.click();
			}, PRESS_TIME);
		});
	}
};
