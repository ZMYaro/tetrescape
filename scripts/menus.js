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
		instructions: new InstructionsView(document.getElementById('instructions-screen')),
		options: new OptionsView(document.getElementById('options-screen')),
		about: new CreditsView(document.getElementById('about-screen')),
		levelSelect: new LevelSelectView(document.getElementById('level-screen')),
		game: new GameView(document.getElementById('game-screen')),
		results: new ResultsView(document.getElementById('results-screen')),
		active: undefined // ← Holds a reference to the current active view.
	};
	
	// Populate the level select screen.
	views.levelSelect.repopulate();
	
	// Load ads if the user has not removed them.
	initAds();
	
	// Add the listener for the user navigating with the back button.
	window.addEventListener('hashchange', handleHashChange);
	
	// Do not show menus by default since this is not meant to be live yet.
	document.body.ondblclick = function () {
		document.body.ondblclick = function () {
			document.body.ondblclick = function () {
				views.game._game.loadPromise.then(handleHashChange);
				document.body.ondblclick = null;
			};
		};
	};
};

function initAds() {
	// TODO: Check whether the user has paid to remove ads *before* loading ads.
	if (BUILD_TYPE === 'packaged-paid') {
		views.options.hideRemoveAds();
		return;
	}
	
	document.body.classList.add('has-ads');
	
	var adContainer = document.getElementById('place-where-an-ad-could-go');
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

function handleHashChange() {
	function goBackTo(view) {
		if (!views.active) {
			views.title.open();
		}
		while (views.active !== view && views.active !== views.title) {
			views.active.goBack();
		}
	}
	
	var fragment = location.hash.substring(1);
	
	// #
	if (fragment === '') {
		goBackTo(views.title);
		return;
	}
	
	// #instructions
	if (fragment === InstructionsView.prototype.ROUTE) {
		if (views.active === views.instructions) { return; }
		goBackTo(views.title);
		views.title.openSubview(views.instructions);
		return;
	}
	
	// #options
	if (fragment === OptionsView.prototype.ROUTE) {
		if (views.active === views.options) { return; }
		goBackTo(views.title);
		views.title.openSubview(views.options);
		return;
	}
	
	// #credits
	if (fragment === CreditsView.prototype.ROUTE) {
		if (views.active === views.about) { return; }
		goBackTo(views.title);
		views.title.openSubview(views.about);
		return;
	}
	
	// #play
	if (fragment === LevelSelectView.prototype.ROUTE) {
		if (views.active === views.levelSelect) { return; }
		if (views.active === views.game || views.active === views.results) {
			goBackTo(views.levelSelect);
		} else {
			goBackTo(views.title);
			views.title.openSubview(views.levelSelect);
		}
		return;
	}
	
	// #play/[levelIndex]
	var GAME_PATH_REGEX = '^' + LevelSelectView.prototype.ROUTE + '/([0-9]+)$',
		gamePathMatch = fragment.match(GAME_PATH_REGEX),
		levelIndex = (gamePathMatch ? parseInt(gamePathMatch[1]) : undefined);
	if (gamePathMatch) {
		if (views.active === views.game && currentLevelIndex === levelIndex) { return; }
		if (views.active === views.game || views.active === views.result) {
			// If in another level, go back to level select first.
			goBackTo(views.levelSelect);
		} else if (views.active !== views.levelSelect) {
			// If in a view that is not a subview of level select, back out and go to level select.
			goBackTo(views.title);
			views.title.openSubview(views.levelSelect);
		}
		// Then open the game view and start the selected level.
		views.levelSelect.openSubview(views.game);
		views.game.startGame(levelIndex);
		return;
	}
	
	// Invalid path → #
	location.hash = '';
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
