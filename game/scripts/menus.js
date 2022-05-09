'use strict';

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
	
	// Populate the level select screen.
	views.levelSelect.repopulate();
	
	// Load ads if the user has not removed them.
	initAds();
	
	// Open the title screen.
	views.title.open();
};

function initAds() {
	// TODO: Check whether the user has paid to remove ads *before* loading ads.
	if (BUILD_TYPE === 'packaged-paid') {
		views.options.hideRemoveAds();
		return;
	}
	
	document.body.classList.add('has-ads');
	
	var adContainer = document.getElementById('ad-container');
	adContainer.innerHTML = '<ins class="adsbygoogle" ' +
		'style="display: block;" ' +
		'data-full-width-responsive="true" ' +
		'data-ad-client="' + ADSENSE_CLIENT_ID + '" ' +
		'data-ad-slot="' + ADSENSE_SLOT_ID + '" ' +
		'data-adbreak-test="on" ' + // Fake ads for testing
		'></ins>';
	
	var adScript = document.createElement('script');
	adScript.async = true;
	adScript.crossOrigin = 'anonymous';
	adScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + ADSENSE_CLIENT_ID;
	document.head.appendChild(adScript);
	
	(window.adsbygoogle = window.adsbygoogle || []).push({});
}

function endGame(moves, blocks) {
	var currentLevel = LEVELS[currentLevelIndex],
		savedMoves = parseInt(localStorage[Utils.getLocalStorageKey(currentLevel.name, MODES.MOVES)]) || Game.prototype.MAX_MOVES,
		savedBlocks = parseInt(localStorage[Utils.getLocalStorageKey(currentLevel.name, MODES.BLOCKS)]) || -1;
	
	// Save the new score and update the UI if it is lower than the saved score.
	if (moves < savedMoves) {
		localStorage[Utils.getLocalStorageKey(currentLevel.name, MODES.MOVES)] = moves;
	}
	if (blocks > savedBlocks) {
		localStorage[Utils.getLocalStorageKey(currentLevel.name, MODES.BLOCKS)] = blocks;
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
