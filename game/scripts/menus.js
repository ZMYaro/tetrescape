'use strict';

var GAME_PREFIX = 'tetrescape-',
	LEVEL_PREFIX = 'lvl-',
	MODES = {
		MOVES: 'moves',
		BLOCKS: 'blocks'
	},
	BUTTON_SUFFIX = '-btn';

var views,
	canvas,
	game,
	currentMode,
	currentLevel;

window.onload = function () {
	// Enable the play button.
	document.getElementById('playButton').onclick = function () {
		this.view.openSubview(views.modeSelect);
	};
	
	// Enable the instructions button.
	document.getElementById('instructionsButton').onclick = function () {
		this.view.openSubview(views.instructions);
	};
	
	// Enable the about button.
	document.getElementById('aboutButton').onclick = function () {
		this.view.openSubview(views.about);
	};
	
	// Enable the mode selection buttons.
	document.getElementById('movesModeButton').dataset.mode = MODES.MOVES;
	document.getElementById('blocksModeButton').dataset.mode = MODES.BLOCKS;
	document.getElementById('movesModeButton').onclick =
			document.getElementById('blocksModeButton').onclick = function () {
		currentMode = this.dataset.mode;
		populateLevelSelect();
		this.view.openSubview(views.levelSelect);
	};
	
	// Enable the game reset button.
	document.getElementById('retryButton').onclick = function () {
		game.reload();
	};
	
	// Enable the results screen buttons.
	document.getElementById('resultsBackButton').onclick = function () {
		this.view.close();
		views.game.close();
		
		views.levelSelect.resume();
		// Focus the button for the last-played level.
		document.activeElement.blur();
		document.getElementById(LEVEL_PREFIX + currentLevel + BUTTON_SUFFIX).focus();
	};
	
	// Populate the level select screen.
	
	
	// Create views.
	views = {
		title: new MenuView(document.getElementById('titleScreen')),
		instructions: new View(document.getElementById('instructionsScreen')),
		about: new View(document.getElementById('aboutScreen')),
		modeSelect: new MenuView(document.getElementById('modeScreen')),
		levelSelect: new MenuView(document.getElementById('levelScreen')),
		game: new View(document.getElementById('gameScreen')),
		results: new MenuView(document.getElementById('resultsScreen'))
	};
	
	// Get the game view's app bar.
	views.game.appBar = views.game.elem.getElementsByClassName('appBar')[0];
	
	// Open the title screen.
	views.title.open();
	
	// Ensure the canvas always fits the view.
	canvas = document.getElementById('canvas');
	window.onresize = handleResize;
	handleResize();
};

function handleResize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight - views.game.appBar.offsetHeight;
	if (game) {
		game.rescale();
	}
}

function populateLevelSelect() {
	var levelScreenMenu = views.levelSelect.elem.getElementsByClassName('menu')[0];
	
	// Clear the menu.
	levelScreenMenu.innerHTML = '';
	views.levelSelect.inputs = [];
	
	LEVELS.forEach(function (level, i) {
		var levelButton = document.createElement('button'),
			savedScore = localStorage[GAME_PREFIX + LEVEL_PREFIX + i + '-' + currentMode];
		levelButton.id = LEVEL_PREFIX + i + BUTTON_SUFFIX;
		
		var buttonHTML = '<div class=\"title\">Level ' + (i + 1) + '</div>' +
			'<div class=\"score\">';
		if (savedScore) {
			if (currentMode === MODES.MOVES) {
				buttonHTML += 'Least moves: ' + savedScore;
			} else if (currentMode === MODES.BLOCKS) {
				buttonHTML += 'Most blocks cleared: ' + savedScore;
			}
		} else {
			buttonHTML += 'Not attempted';
		}
		buttonHTML += '</div>' +
			'<div class=\"stars\">';
		level.starScores[currentMode].forEach(function (starScore) {
			if ((typeof savedScore !== 'undefined') && (
					(currentMode === MODES.MOVES && savedScore <= starScore) ||
					(currentMode === MODES.BLOCKS && savedScore >= starScore))) {
				buttonHTML += '&#x2605;';
			} else {
				buttonHTML += '&#x2606;';
			}
		});
		buttonHTML += '</div>';
		levelButton.innerHTML = buttonHTML;
		
		levelButton.className = "z1";
		levelButton.dataset.level = i;
		levelButton.view = views.levelSelect;
		levelButton.onclick = function () {
			this.view.openSubview(views.game);
			startGame(this.dataset.level);
		};
		
		// Add the new button to the menu.
		levelScreenMenu.appendChild(levelButton);
		views.levelSelect.inputs.push(levelButton);
	});
}

function startGame(level) {
	currentLevel = level;
	game = new Game(canvas, LEVELS[level], endGame);
}

function endGame(score) {
	var levelButton = document.getElementById(LEVEL_PREFIX + currentLevel + BUTTON_SUFFIX),
		savedScore = localStorage[GAME_PREFIX + LEVEL_PREFIX + currentLevel + '-' + currentMode];
	
	// Save the new score and update the UI if it is lower than the saved score.
	if (typeof score !== 'undefined' &&
			((typeof savedScore === 'undefined') || (
				(currentMode === MODES.MOVES && score < savedScore) ||
				(currentMode === MODES.BLOCKS && score > savedScore)))) {
		localStorage[GAME_PREFIX + LEVEL_PREFIX + currentLevel + '-' + currentMode] = score;
		populateLevelSelect();
	}
	game = undefined;
	
	// Open the results screen.
	document.getElementById('resultsTitle').innerHTML = 'Level ' + currentLevel + ' complete!';
	if (currentMode === MODES.MOVES) {
		document.getElementById('resultsScore').innerHTML = 'Moves: ' + score;
	} else if (currentMode === MODES.BLOCKS) {
		document.getElementById('resultsScore').innerHTML = 'Blocks cleared: ' + score;
	}
	// Set the number of stars awarded.
	var resultsStars = views.results.elem.getElementsByClassName('star');
	LEVELS[currentLevel].starScores[currentMode].forEach(function (starScore, i) {
		resultsStars[i].classList.remove('active');
		if ((currentMode === MODES.MOVES && score <= starScore) ||
				(currentMode == MODES.BLOCKS && score >= starScore)) {
			setTimeout(function () {
				resultsStars[i].classList.add('active');
			}, 150 * (i + 1));
		}
	});
	views.game.openSubview(views.results);
}