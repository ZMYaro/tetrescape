'use strict';

/**
 * Initialize a new LevelSelectView.
 * @param {HTMLElement} elem - The element for this view
 * @param {View} [parent] - The next view up, if any
 */
function LevelSelectView(elem, parent) {
	// Call the superclass constructor.
	MenuView.call(this, elem, parent);
	
	this._list = this.elem.querySelector('.menu ul');
	
	this._boundButtonHandler = this._handleLevelButtonClick.bind(this);
}

// Inherit from View.
LevelSelectView.prototype = Object.create(MenuView.prototype);

/**
 * @static
 * Get the HTML ID for a given level's button.
 * @param {String} levelName - The letter-number name of the level
 * @returns {String}
 */
LevelSelectView.getButtonID = function (levelName) {
	return LEVEL_PREFIX + levelName + BUTTON_SUFFIX;
};

/**
 * @private
 * Handle a level select button being selected.
 * @param {PointerEvent|MouseEvent} ev
 */
LevelSelectView.prototype._handleLevelButtonClick = function (ev) {
	this.openSubview(views.game);
	views.game.startGame(parseInt(ev.target.dataset.levelIndex));
};

/**
 * Remake the level select buttons with the current scores and stars.
 */
LevelSelectView.prototype.repopulate = function () {
	// Clear the menu.
	this._list.innerHTML = '';
	this.inputs = [];
	
	LEVELS.forEach(function (level, i) {
		var levelListItem = document.createElement('li'),
			levelButton = document.createElement('button'),
			moves = localStorage[Utils.getLocalStorageKey(level.name, MODES.MOVES)],
			blocks = localStorage[Utils.getLocalStorageKey(level.name, MODES.BLOCKS)],
			moveStars = Utils.getStarRating(i, MODES.MOVES, moves),
			blockStars = Utils.getStarRating(i, MODES.BLOCKS, blocks);
		levelButton.id = LevelSelectView.getButtonID(level.name);
		
		var buttonHTML =
			'<div class=\"title\">Level</div>' +
			'<div class=\"number\">' + level.name + '</div>' +
			'<div class=\"stars\">';
		if (typeof(moves) === 'undefined' && typeof(blocks) === 'undefined') {
			buttonHTML += 'Not completed';
		} else {
			buttonHTML += Utils.getStarDisplaysHTML(moves, moveStars, blocks, blockStars);
		}
		buttonHTML += '</div>';
		
		levelButton.innerHTML = buttonHTML;
		levelButton.className = "z1";
		levelButton.dataset.levelIndex = i;
		levelButton.dataset.levelName = level.name;
		levelButton.view = views.levelSelect;
		levelButton.addEventListener('focus', MenuView.setActiveInputToFocused);
		levelButton.addEventListener('click', this._boundButtonHandler);
		
		// Add the new button to the menu.
		levelListItem.appendChild(levelButton);
		this._list.appendChild(levelListItem);
		views.levelSelect.inputs.push(levelButton);
	}, this);
};

/**
 * @override
 * Reenable a suspended view and its event listeners.
 */
LevelSelectView.prototype.resume = function () {
	MenuView.prototype.resume.call(this);
	// Make sure the next button is in view.
	this._moveFocusNext();
	this._moveFocusPrev();
};
