'use strict';

var Utils = {
	/** {Boolean} Whether the user prefers reduced motion */
	shouldReduceMotion: (window.matchMedia &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches),
	
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
	 * Get the local storage key for a high score.
	 * @param {String} levelName - The letter-number name of the level
	 * @param {String} mode - moves or blocks
	 * @returns {String} - The local storage key
	 */
	getLocalStorageKey: function (levelName, mode) {
		return GAME_PREFIX + LEVEL_PREFIX + levelName + '-' + mode;
	},
	
	/**
	 * Get the HTML to display a small star score.
	 * @param {String} mode - moves or blocks
	 * @param {Number} score - The score for that mode
	 * @param {Number} stars - The number of stars awarded for the score
	 * @returns {String} - The HTML to display the mode icon, score, and stars
	 */
	getStarDisplayHTML: function (mode, score, stars) {
		var modeLabel = (mode === MODES.MOVES ? 'Fewest moves' : 'Most blocks cleared');
		return '<span title="' + modeLabel + '">' +
				'<img alt="' + modeLabel + '" src="images/icons/' + mode + '.png" class="icon" />' +
				score +
				'<img alt="' + stars + ' stars." src="images/icons/' + stars + 'star.png" class="icon" />' +
			'</span>';
	},
	
	/**
	 * Get the HTML to display a level's star scores.
	 * @param {Number} moves - The number of moves the level was completed in
	 * @param {Number} moveStars - The number of stars awarded for those moves
	 * @param {Number} blocks - The number of blocks cleared in the level
	 * @param {Number} blockStars - The number of stars awarded for those block clears
	 * @returns {String} - The HTML to display the mode icons, scores, and stars
	 */
	getStarDisplaysHTML: function (moves, moveStars, blocks, blockStars) {
		return Utils.getStarDisplayHTML(MODES.MOVES, moves, moveStars) +
			'&nbsp;&nbsp;&middot;&nbsp;&nbsp;' +
			Utils.getStarDisplayHTML(MODES.BLOCKS, blocks, blockStars);
	},
	
	/**
	 * Get the star rating for a given score on a given level.
	 * @param {Number} levelIndex - The index of the level on the levels list
	 * @param {String} mode - moves or blocks
	 * @param {Number} score - The score for that mode
	 * @returns {Number} - The number of stars
	 */
	getStarRating: function (levelIndex, mode, score) {
		var level = LEVELS[levelIndex],
			starScore1 = level.starScores[mode][0],
			starScore2 = level.starScores[mode][1],
			starScore3 = level.starScores[mode][2];
		
		if (mode === MODES.MOVES) {
			return (score <= starScore3 ? 3 :
				score <= starScore2 ? 2 :
					score <= starScore1 ? 1 : 0);
		} else if (mode === MODES.BLOCKS) {
			return (score >= starScore3 ? 3 :
				score >= starScore2 ? 2 :
					score >= starScore1 ? 1 : 0);
		}
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

if (window.matchMedia) {
	window.matchMedia('(prefers-reduced-motion: reduce)').addListener(function (ev) {
		Utils.shouldReduceMotion = ev.matches;
	});
}
