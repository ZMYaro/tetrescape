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
	},
	
	/**
	 * Get the number of connected gamepads (beacuse navigator.getGamepads().length is always 4 in some browsers).
	 * @returns {Number} - The number of non-null gamepads
	 */
	getActiveGamepadCount: function () {
		if (!navigator.getGamepads || !navigator.getGamepads()) {
			return 0;
		}
		var gamepadCount = 0,
			gamepads = navigator.getGamepads();
		for (var i = 0; i < gamepads.length; i++) {
			if (gamepads[i]) {
				gamepadCount++;
			}
		}
		return gamepadCount;
	}
};
