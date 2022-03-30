'use strict';

/**
 * Initialize a new ResultsView.
 * @param {HTMLElement} elem - The element for this view
 * @param {View} [parent] - The next view up, if any
 */
function ResultsView(elem, parent) {
	// Call the superclass constructor.
	MenuView.call(this, elem, parent);
	
	this._titleDisplay = this.elem.querySelector('#results-title');
	this._bigScoreDisplay = this.elem.querySelector('#results-score');
	this._bigStars = Array.from(this.elem.getElementsByClassName('star'));
	this._highScoresDisplay = this.elem.querySelector('.stars');
}

// Inherit from View.
ResultsView.prototype = Object.create(MenuView.prototype);

// Define constants.
/** {Object<String,String>} The score display heading for each mode time */
ResultsView.prototype.MODE_SCORE_HEADINGS = {
	moves: 'Moves: ',
	blocks: 'Blocks cleared: '
};
/** {Number} The delay between big stars filling in milliseconds */
ResultsView.prototype.BIG_STAR_ANIM_PAUSE_TIME = 100;

/**
 * Display the results of a level and stars awarded.
 * @param {Object} scores - Contains the level name, moves, blocks cleared, and previous scores
 */
ResultsView.prototype.showResults = function (scores) {
	var stars = {
			moves: getStarRating(currentLevelIndex, MODES.MOVES, scores.moves),
			blocks: getStarRating(currentLevelIndex, MODES.BLOCKS, scores.blocks),
			savedMoves: getStarRating(currentLevelIndex, MODES.MOVES, scores.savedMoves),
			savedBlocks: getStarRating(currentLevelIndex, MODES.BLOCKS, scores.savedBlocks)
		},
		featuredMode = this._determineFeaturedMode(stars);
	
	this._titleDisplay.innerHTML = 'Level ' + scores.levelName + ' complete!';
	
	this._bigScoreDisplay.innerHTML =
		this.MODE_SCORE_HEADINGS[featuredMode] + scores[featuredMode];
	
	// Set up the big stars to animate in.
	var animPauseTime = Utils.shouldReduceMotion ? 0 : this.BIG_STAR_ANIM_PAUSE_TIME;
	this._bigStars.forEach(function (bigStar, i) {
		bigStar.classList.remove('active');
		if (i < stars[featuredMode]) {
			setTimeout(function () {
				bigStar.classList.add('active');
			}, animPauseTime * (i + 1));
		}
	}, this);
	
	// Set up small high scores and stars.
	this._highScoresDisplay.innerHTML =
		getStarDisplaysHTML(
			Math.min(scores.moves, scores.savedMoves),
			Math.max(stars.moves, stars.savedMoves),
			Math.max(scores.blocks, scores.savedBlocks),
			Math.max(stars.blocks, stars.savedBlocks));
};

/**
 * @private
 * Determine which mode should be featured at the top of the results.
 * @param {Object} stars - Contains the new and saved stars for both modes
 * @returns {String} - MODES.BLOCKS or MODES.MOVES
 */
ResultsView.prototype._determineFeaturedMode = function (stars) {
	var moveStarDifference = stars.moves - stars.savedMoves,
		blockStarDifference = stars.blocks - stars.savedBlocks;
	
	// Feature the star count that is the greatest, or had the greatest
	// improvement if star count is equal.  If all else is equal,
	// feature the move star count.
	if (stars.blocks > stars.moves ||
			(stars.blocks === stars.moves &&
				blockStarDifference > moveStarDifference)) {
		return MODES.BLOCKS;
	}
	return MODES.MOVES;
};
