'use strict';

var GAME_PREFIX = 'tetrescape-',
	LEVEL_PREFIX = 'lvl-',
	MODES = {
		MOVES: 'moves',
		BLOCKS: 'blocks'
	},
	BUTTON_SUFFIX = '-btn',
	MAX_MOVES = 999;

var im, // Input manager
	views,
	currentLevelIndex;

window.onload = function () {
	// Initialize input manager.
	im = new InputManager(document.getElementById('game-screen'));
	
	// Create views.
	views = {
		title: new TitleView(document.getElementById('title-screen')),
		instructions: new View(document.getElementById('instructions-screen')),
		options: new OptionsView(document.getElementById('options-screen')),
		about: new CreditsView(document.getElementById('about-screen')),
		levelSelect: new MenuView(document.getElementById('level-screen')),
		game: new GameView(document.getElementById('game-screen')),
		results: new ResultsView(document.getElementById('results-screen'))
	};
	
	// Enable the results screen buttons.
	document.getElementById('results-back-button').onclick = function () {
		this.view.close();
		views.game.close();
		
		views.levelSelect.resume();
		// Focus the button for the last-played level.
		document.activeElement.blur();
		document.getElementById(getButtonID(LEVELS[currentLevelIndex].name)).focus();
	};
	
	// Populate the level select screen.
	populateLevelSelect();
	
	// Open the title screen.
	views.title.open();
};

function getButtonID(levelName) {
	return LEVEL_PREFIX + levelName + BUTTON_SUFFIX;
}

function getLocalStorageID(levelName, mode) {
	return GAME_PREFIX + LEVEL_PREFIX + levelName + '-' + mode;
}

function getStarRating(levelIndex, type, score) {
	var level = LEVELS[levelIndex],
		starScore1 = level.starScores[type][0],
		starScore2 = level.starScores[type][1],
		starScore3 = level.starScores[type][2];
	
	if (type === MODES.MOVES) {
		return (score <= starScore3 ? 3 :
			score <= starScore2 ? 2 :
				score <= starScore1 ? 1 : 0);
	} else if (type === MODES.BLOCKS) {
		return (score >= starScore3 ? 3 :
			score >= starScore2 ? 2 :
				score >= starScore1 ? 1 : 0);
	}
}

function getStarDisplayHTML(mode, score, stars) {
	var modeLabel = (mode === MODES.MOVES ? 'Fewest moves' : 'Most blocks cleared');
	return '<span title="Fewest moves">' +
		'<img alt="' + modeLabel + '" src="images/icons/' + mode + '.png" class="icon" />' +
		score +
		'<img alt="' + stars + ' stars." src="images/icons/' + stars + 'star.png" class="icon" />' +
	'</span>';
}

function getStarDisplaysHTML(moves, moveStars, blocks, blockStars) {
	return getStarDisplayHTML(MODES.MOVES, moves, moveStars) +
		'&nbsp;&nbsp;&middot;&nbsp;&nbsp;' +
		getStarDisplayHTML(MODES.BLOCKS, blocks, blockStars);
}

function populateLevelSelect() {
	var levelScreenList = views.levelSelect.elem.querySelector('.menu ul');
	
	// Clear the menu.
	levelScreenList.innerHTML = '';
	views.levelSelect.inputs = [];
	
	var levelButtonClickHandler = function () {
		this.view.openSubview(views.game);
		views.game.startGame(parseInt(this.dataset.levelIndex));
	};
	LEVELS.forEach(function (level, i) {
		var levelListItem = document.createElement('li'),
			levelButton = document.createElement('button'),
			moves = localStorage[getLocalStorageID(level.name, MODES.MOVES)],
			blocks = localStorage[getLocalStorageID(level.name, MODES.BLOCKS)],
			moveStars = getStarRating(i, MODES.MOVES, moves),
			blockStars = getStarRating(i, MODES.BLOCKS, blocks);
		levelButton.id = getButtonID(level.name);
		
		var buttonHTML =
			'<div class=\"title\">Level</div>' +
			'<div class=\"number\">' + level.name + '</div>' +
			'<div class=\"stars\">';
		if (typeof(moves) === 'undefined' && typeof(blocks) === 'undefined') {
			buttonHTML += 'Not completed';
		} else {
			buttonHTML += getStarDisplaysHTML(moves, moveStars, blocks, blockStars);
		}
		buttonHTML += '</div>';
		
		levelButton.innerHTML = buttonHTML;
		levelButton.className = "z1";
		levelButton.dataset.levelIndex = i;
		levelButton.dataset.levelName = level.name;
		levelButton.view = views.levelSelect;
		levelButton.addEventListener('focus', MenuView.setActiveInputToFocused);
		levelButton.addEventListener('click', levelButtonClickHandler);
		
		// Add the new button to the menu.
		levelListItem.appendChild(levelButton);
		levelScreenList.appendChild(levelListItem);
		views.levelSelect.inputs.push(levelButton);
	});
}

function endGame(moves, blocks) {
	var currentLevel = LEVELS[currentLevelIndex],
		levelButton = document.getElementById(getButtonID(currentLevel.name)),
		savedMoves = parseInt(localStorage[getLocalStorageID(currentLevel.name, MODES.MOVES)]) || MAX_MOVES,
		savedBlocks = parseInt(localStorage[getLocalStorageID(currentLevel.name, MODES.BLOCKS)]) || -1;
	
	// Save the new score and update the UI if it is lower than the saved score.
	if (moves < savedMoves) {
		localStorage[getLocalStorageID(currentLevel.name, MODES.MOVES)] = moves;
	}
	if (blocks > savedBlocks) {
		localStorage[getLocalStorageID(currentLevel.name, MODES.BLOCKS)] = blocks;
	}
	
	// Update the level select screen with the new values.
	populateLevelSelect();
	
	// Open the results screen.
	views.game.openSubview(views.results);
	views.results.showResults({
		levelName: currentLevel.name,
		moves: moves,
		blocks: blocks,
		savedMoves: savedMoves,
		savedBlocks: savedBlocks
	});
}