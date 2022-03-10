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
	 * Convert degrees to radians.
	 * @param {Number} deg - The measurement in degrees
	 * @returns {Number} - The measurement in radians
	 */
	degToRad: function (deg) {
		return (deg * (Math.PI / 180));
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
	},
	
	/**
	 * Load a sprite sheet's JSON data.
	 * @param {String} path - The path from the root to the sprite sheet, minus file extension
	 * @returns {Promise<Object>} - Resolves when the data has loaded, or rejects if it fails to load or parse
	 */
	loadSpriteSheetData: function (path) {
		return fetch(path + '.json')
			.then(function (res) {
				if (res.ok) {
					return res.json();
				}
				throw new Error(res.status + ' - ' + res.statusText);
			});
	},
	
	/**
	 * Load a sprite sheet's image file.
	 * @param {String} path - The path from the root to the sprite sheet, minus file extension
	 * @returns {Promise<Image|Event>} - Resolves when the image has loaded, or rejects if it fails to
	 */
	loadSpriteSheetImage: function (path) {
		return new Promise(function (resolve, reject) {
			var image = new Image();
			image.onload = function () {
				resolve(image);
			}
			image.onerror = reject;
			image.src = path + '.png';
		});
	},
	
	/**
	 * Get a random integer.
	 * @param {Number} min
	 * @param {Number} [max]
	 * @returns {Number} - A random integer in the range [0, min) or [min, max) depending on whether max is defined
	 */
	randInt: function (min, max) {
		if (typeof(max) === 'undefined') {
			return Math.floor(Math.random() * min);
		} else {
			return Math.floor(Math.random() * (max - min) + min);
		}
	}
};
