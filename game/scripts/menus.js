'use strict';

var GAME_PREFIX = 'tetrescape-',
	LEVEL_PREFIX = 'lvl',
	MODES = {
		MOVES: 'moves',
		BLOCKS: 'blocks'
	},
	BUTTON_SUFFIX = '-btn',
	MAX_MOVES = 999;

var views,
	currentLevel;

window.onload = function () {
	// Create views.
	views = {
		title: new MenuView(document.getElementById('titleScreen')),
		instructions: new View(document.getElementById('instructionsScreen')),
		about: new View(document.getElementById('aboutScreen')),
		levelSelect: new MenuView(document.getElementById('levelScreen')),
		game: new GameView(document.getElementById('gameScreen')),
		results: new MenuView(document.getElementById('resultsScreen'))
	};
	
	// Enable the play button.
	document.getElementById('playButton').onclick = function () {
		this.view.openSubview(views.levelSelect);
	};
	
	// Enable the instructions button.
	document.getElementById('instructionsButton').onclick = function () {
		this.view.openSubview(views.instructions);
	};
	
	// Enable the about button.
	document.getElementById('aboutButton').onclick = function () {
		this.view.openSubview(views.about);
	};
	
	// Enable the results screen buttons.
	document.getElementById('results-back-button').onclick = function () {
		this.view.close();
		views.game.close();
		
		views.levelSelect.resume();
		// Focus the button for the last-played level.
		document.activeElement.blur();
		document.getElementById(LEVEL_PREFIX + currentLevel + BUTTON_SUFFIX).focus();
	};
	
	// Populate the level select screen.
	populateLevelSelect();
	
	// Open the title screen.
	views.title.open();
};

function getStarRating(level, type, score) {
	var level = LEVELS[level],
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
	var levelScreenMenu = views.levelSelect.elem.getElementsByClassName('menu')[0];
	
	// Clear the menu.
	levelScreenMenu.innerHTML = '';
	views.levelSelect.inputs = [];
	
	LEVELS.forEach(function (level, i) {
		var levelButton = document.createElement('button'),
			moves = localStorage[GAME_PREFIX + LEVEL_PREFIX + i + MODES.MOVES],
			blocks = localStorage[GAME_PREFIX + LEVEL_PREFIX + i + MODES.BLOCKS],
			moveStars = getStarRating(i, MODES.MOVES, moves),
			blockStars = getStarRating(i, MODES.BLOCKS, blocks);
		levelButton.id = LEVEL_PREFIX + i + BUTTON_SUFFIX;
		
		var buttonHTML =
			'<div class=\"title\">Level</div>' +
			'<div class=\"number\">' + (i + 1) + '</div>' +
			'<div class=\"stars\">';
		if (typeof(moves) === 'undefined' && typeof(blocks) === 'undefined') {
			buttonHTML += 'Not attempted';
		} else {
			buttonHTML += getStarDisplaysHTML(moves, moveStars, blocks, blockStars);
		}
		buttonHTML += '</div>';
		
		levelButton.innerHTML = buttonHTML;
		levelButton.className = "z1";
		levelButton.dataset.level = i;
		levelButton.view = views.levelSelect;
		levelButton.onclick = function () {
			this.view.openSubview(views.game);
			views.game.startGame(parseInt(this.dataset.level));
		};
		
		// Add the new button to the menu.
		levelScreenMenu.appendChild(levelButton);
		views.levelSelect.inputs.push(levelButton);
	});
}

function endGame(moves, blocks) {
	var levelButton = document.getElementById(LEVEL_PREFIX + currentLevel + BUTTON_SUFFIX),
		moveStars = getStarRating(currentLevel, MODES.MOVES, moves),
		blockStars = getStarRating(currentLevel, MODES.BLOCKS, blocks),
		savedMoves = localStorage[GAME_PREFIX + LEVEL_PREFIX + currentLevel + MODES.MOVES] || MAX_MOVES,
		savedBlocks = localStorage[GAME_PREFIX + LEVEL_PREFIX + currentLevel + MODES.BLOCKS] || -1,
		savedMoveStars = getStarRating(currentLevel, MODES.MOVES, savedMoves),
		savedBlockStars = getStarRating(currentLevel, MODES.BLOCKS, savedBlocks),
		moveStarDifference = moveStars - savedMoveStars,
		blockStarDifference = blockStars - savedBlockStars;
	
	console.log('Moves: ' + moves + ' | Blocks: ' + blocks);
	console.log('Move\u2605: ' + moveStars + ' | Block\u2605: ' + blockStars);
	
	// Save the new score and update the UI if it is lower than the saved score.
	if (moves < savedMoves) {
		localStorage[GAME_PREFIX + LEVEL_PREFIX + currentLevel + MODES.MOVES] = moves;
	}
	if (blocks > savedBlocks) {
		localStorage[GAME_PREFIX + LEVEL_PREFIX + currentLevel + MODES.BLOCKS] = blocks;
	}
	
	// Update the level select screen with the new values.
	populateLevelSelect();
	
	// Open the results screen.
	document.getElementById('resultsTitle').innerHTML = 'Level ' + (currentLevel + 1) + ' complete!';
	
	// Feature the star count that is the greatest, or had the greatest
	// improvement if star count is equal.  If all else is equal,
	// feature the move star count.
	var featuredMode = MODES.MOVES,
		featuredModeStars = moveStars;
	if (blockStars > moveStars ||
			(blockStars === moveStars &&
				blockStarDifference > moveStarDifference)) {
		featuredMode = MODES.BLOCKS;
		featuredModeStars = blockStars;
	}
	
	if (featuredMode === MODES.MOVES) {
		document.getElementById('resultsScore').innerHTML = 'Moves: ' + moves;
	} else if (featuredMode === MODES.BLOCKS) {
		document.getElementById('resultsScore').innerHTML = 'Blocks cleared: ' + blocks;
	}
	// Set up the big stars.
	var resultsStars = Array.from(views.results.elem.getElementsByClassName('star'));
	resultsStars.forEach(function (resultsStar, i) {
		resultsStar.classList.remove('active');
		if (i < featuredModeStars) {
			setTimeout(function () {
				resultsStar.classList.add('active');
			}, 150 * (i + 1));
		}
	});
	
	// Show full star and score display.
	views.results.elem.querySelector('.stars').innerHTML =
		getStarDisplaysHTML(
			Math.min(moves, savedMoves),
			Math.max(moveStars, savedMoveStars),
			Math.max(blocks, savedBlocks),
			Math.max(blockStars, savedBlockStars));
	
	views.game.openSubview(views.results);
}