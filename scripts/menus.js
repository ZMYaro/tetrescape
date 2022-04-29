'use strict';

var GAME_PREFIX = 'tetrescape-',
	LEVEL_PREFIX = 'lvl-',
	MODES = {
		MOVES: 'moves',
		BLOCKS: 'blocks'
	},
	BUTTON_SUFFIX = '-btn',
	MAX_MOVES = 999,
	ADSENSE_CLIENT_ID = 'ca-pub-9563245442880944',
	ADSENSE_SLOT_ID = '4255299962';

var im, // Input manager
	stats, // Stats manaager
	views,
	currentLevelIndex;

window.onload = function () {
	// Initialize input manager and stats manager.
	im = new InputManager(document.getElementById('game-screen'));
	stats = new StatsManager();
	
	// Create views.
	views = {
		title: new TitleView(document.getElementById('title-screen')),
		instructions: new View(document.getElementById('instructions-screen')),
		options: new OptionsView(document.getElementById('options-screen')),
		about: new CreditsView(document.getElementById('about-screen')),
		levelSelect: new LevelSelectView(document.getElementById('level-screen')),
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
	views.levelSelect.repopulate();
	
	// Load ads if the user has not removed them.
	initAds();
	
	// Do not show the title screen by default since this is not meant to be live yet.
	document.body.ondblclick = function () {
		document.body.ondblclick = function () {
			document.body.ondblclick = function () {
				views.title.open();
				document.body.ondblclick = null;
			};
		};
	};
};

function initAds() {
	// TODO: Check whether the user has paid to remove ads *before* loading ads.
	
	document.body.classList.add('has-ads');
	
	var adContainer = document.querySelector('.adsbygoogle');
	adContainer.dataset.adClient = ADSENSE_CLIENT_ID;
	adContainer.dataset.adSlot = ADSENSE_SLOT_ID;
	
	var adScript = document.createElement('script');
	adScript.async = true;
	adScript.crossOrigin = 'anonymous';
	adScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + ADSENSE_CLIENT_ID;
	document.head.appendChild(adScript);
	
	(window.adsbygoogle = window.adsbygoogle || []).push({});
}

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
	return '<span title="' + modeLabel + '">' +
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
	views.levelSelect.repopulate();
	
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
