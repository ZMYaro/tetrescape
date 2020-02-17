'use strict';

var GAME_PREFIX = 'tetrescape-',
	LEVEL_PREFIX = 'lvl',
	MODES = {
		MOVES: 'moves',
		BLOCKS: 'blocks'
	},
	BUTTON_SUFFIX = '-btn';

var views,
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
		game: new GameView(document.getElementById('gameScreen')),
		results: new MenuView(document.getElementById('resultsScreen'))
	};
	
	// Open the title screen.
	views.title.open();
};


function populateLevelSelect() {
	var levelScreenMenu = views.levelSelect.elem.getElementsByClassName('menu')[0];
	
	// Clear the menu.
	levelScreenMenu.innerHTML = '';
	views.levelSelect.inputs = [];
	
	LEVELS.forEach(function (level, i) {
		var levelButton = document.createElement('button'),
			moves = localStorage[GAME_PREFIX + LEVEL_PREFIX + i + MODES.MOVES],
			blocks = localStorage[GAME_PREFIX + LEVEL_PREFIX + i + MODES.BLOCKS],
			moveStars = (moves <= level.starScores.moves[2] ? 3 :
				moves <= level.starScores.moves[1] ? 2 :
					moves <= level.starScores.moves[0] ? 1 : 0),
			blockStars = (blocks >= level.starScores.blocks[2] ? 3 :
				blocks >= level.starScores.blocks[1] ? 2 :
					blocks >= level.starScores.blocks[0] ? 1 : 0);
		levelButton.id = LEVEL_PREFIX + i + BUTTON_SUFFIX;
		
		var buttonHTML =
			'<div class=\"title\">Level</div>' +
			'<div class=\"number\">' + (i + 1) + '</div>' +
			'<div class=\"stars\">';
		if (typeof(moves) === 'undefined' && typeof(blocks) === 'undefined') {
			buttonHTML += 'Not attempted';
		} else {
			buttonHTML +=
				'<span title="Fewest moves">' +
					'<svg role="img" aria-label="Fewest moves">' +
						'<use xlink:href="images/icons/moves.svg#icon" href="images/icons/moves.svg#icon"></use>' +
					'</svg>' +
					moves +
					'<svg role="img" aria-label="' + moveStars + ' stars.">' +
						'<use xlink:href="images/icons/' + moveStars + 'star.svg#icon" href="images/icons/' + moveStars + 'star.svg#icon"></use>' +
					'</svg>' +
				'</span>' +
				'&nbsp;&nbsp;&middot;&nbsp;&nbsp;' +
				'<span title="Most blocks cleared">' +
					'<svg role="img" aria-label="Most blocks cleared">' +
						'<use xlink:href="images/icons/blocks.svg#icon" href="images/icons/blocks.svg#icon"></use>' +
					'</svg>' +
					blocks +
					'<svg role="img" aria-label="' + blockStars + ' stars.">' +
						'<use xlink:href="images/icons/' + blockStars + 'star.svg#icon" href="images/icons/' + blockStars + 'star.svg#icon"></use>' +
					'</svg>' +
				'</span>';
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
		savedMoves = localStorage[GAME_PREFIX + LEVEL_PREFIX + currentLevel + MODES.MOVES],
		savedBlocks = localStorage[GAME_PREFIX + LEVEL_PREFIX + currentLevel + MODES.BLOCKS];
	
	// Save the new score and update the UI if it is lower than the saved score.
	if (typeof(savedMoves) === 'undefined' || moves < savedMoves) {
		localStorage[GAME_PREFIX + LEVEL_PREFIX + currentLevel + MODES.MOVES] = moves;
	}
	if (typeof(savedBlocks) === 'undefined' || blocks > savedBlocks) {
		localStorage[GAME_PREFIX + LEVEL_PREFIX + currentLevel + MODES.BLOCKS] = blocks;
	}
	populateLevelSelect();
	
	// Open the results screen.
	document.getElementById('resultsTitle').innerHTML = 'Level ' + (currentLevel + 1) + ' complete!';
	
	if (currentMode === MODES.MOVES) {
		document.getElementById('resultsScore').innerHTML = 'Moves: ' + moves;
	} else if (currentMode === MODES.BLOCKS) {
		document.getElementById('resultsScore').innerHTML = 'Blocks cleared: ' + blocks;
	}
	// Set the number of stars awarded.
	var resultsStars = views.results.elem.getElementsByClassName('star');
	LEVELS[currentLevel].starScores[currentMode].forEach(function (starScore, i) {
		resultsStars[i].classList.remove('active');
		if ((currentMode === MODES.MOVES && moves <= starScore) ||
				(currentMode == MODES.BLOCKS && moves >= starScore)) {
			setTimeout(function () {
				resultsStars[i].classList.add('active');
			}, 150 * (i + 1));
		}
	});
	views.game.openSubview(views.results);
}