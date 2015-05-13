'use strict';

var GAME_PREFIX = 'tetrescape-',
	LEVEL_PREFIX = 'lvl-',
	MOVES_SUFFIX = '-moves',
	BUTTON_SUFFIX = '-btn';

var views,
	canvas,
	game,
	currentLevel;

window.onload = function () {
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
	var levelScreenElement = document.getElementById('levelScreen'),
		levelScreenMenu = levelScreenElement.getElementsByClassName('menu')[0];
	for (var i = 0; i < LEVELS.length; i++) {
		var levelButton = document.createElement('button'),
			savedScore = localStorage[GAME_PREFIX + LEVEL_PREFIX + i + MOVES_SUFFIX];
		levelButton.id = LEVEL_PREFIX + i + BUTTON_SUFFIX;
		levelButton.innerHTML = '<div class=\"title\">Level ' + (i + 1) + '</div>' +
			'<div class=\"score\">' +
				(savedScore ? 'Least moves: ' + savedScore : 'Not attempted') +
			'</div>' +
			'<div class=\"stars\">' +
				((savedScore && savedScore <= LEVELS[i].starScores[0]) ? '&#x2605;' : '&#x2606;') +
				((savedScore && savedScore <= LEVELS[i].starScores[1]) ? '&#x2605;' : '&#x2606;') +
				((savedScore && savedScore <= LEVELS[i].starScores[2]) ? '&#x2605;' : '&#x2606;') +
			'</div>';
		levelButton.className = "z1";
		levelButton.dataset.level = i;
		levelButton.onclick = function () {
			this.view.openSubview(views.game);
			startGame(this.dataset.level);
		};
		levelScreenMenu.appendChild(levelButton);
	}
	
	// Create views.
	views = {
		title: new MenuView(document.getElementById('titleScreen')),
		instructions: new View(document.getElementById('instructionsScreen')),
		about: new View(document.getElementById('aboutScreen')),
		levelSelect: new MenuView(levelScreenElement),
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

function startGame(level) {
	currentLevel = level;
	game = new Game(canvas, LEVELS[level], endGame);
}

function endGame(score) {
	var levelButton = document.getElementById(LEVEL_PREFIX + currentLevel + BUTTON_SUFFIX),
		savedScore = localStorage[GAME_PREFIX + LEVEL_PREFIX + currentLevel + MOVES_SUFFIX];
	
	// Save the new score and update the UI if it is lower than the saved score.
	if (score && (!savedScore || score < savedScore)) {
		localStorage[GAME_PREFIX + LEVEL_PREFIX + currentLevel + MOVES_SUFFIX] = score;
		
		levelButton.getElementsByClassName('score')[0].innerHTML =
			'Least moves: ' + score;
		levelButton.getElementsByClassName('stars')[0].innerHTML = 
			((score <= LEVELS[currentLevel].starScores[0]) ? '&#x2605;' : '&#x2606;') +
			((score <= LEVELS[currentLevel].starScores[1]) ? '&#x2605;' : '&#x2606;') +
			((score <= LEVELS[currentLevel].starScores[2]) ? '&#x2605;' : '&#x2606;');
	}
	game = undefined;
	
	// Open the results screen.
	document.getElementById('resultsScore').innerHTML =
		'Moves: ' + score;
	// Set the number of stars awarded.
	var resultsStars = views.results.elem.getElementsByClassName('star');
	LEVELS[currentLevel].starScores.forEach(function (starScore, i) {
		resultsStars[i].classList.remove('active');
		if (score <= starScore) {
			setTimeout(function () {
				resultsStars[i].classList.add('active');
			}, 150 * (i + 1));
		}
	});
	views.game.openSubview(views.results);
}