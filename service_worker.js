const CACHE_NAME = 'cache-2022-05-11',
	CACHE_MANIFEST = [
		'/',
		'/index.html',
		'/manifest.webmanifest',
		'/audio/block_hit.mp3',
		'/audio/block_slide.mp3',
		'/audio/win.mp3',
		'/fonts/roboto_slab_regular.woff2',
		'/images/backgrounds/level_select_horiz.jpg',
		'/images/backgrounds/level_select_vert.jpg',
		'/images/backgrounds/stone_dark_speckled.jpg',
		'/images/backgrounds/stone_light_smooth.jpg',
		'/images/backgrounds/stone_light_speckled.jpg',
		'/images/backgrounds/top_bar.jpg',
		'/images/buttons/back.jpg',
		'/images/buttons/back_a.jpg',
		'/images/buttons/back_b.jpg',
		'/images/buttons/back_backspace.jpg',
		'/images/buttons/back_face_bottom.jpg',
		'/images/buttons/back_face_right.jpg',
		'/images/buttons/close.jpg',
		'/images/buttons/close_esc.jpg',
		'/images/buttons/close_minus.jpg',
		'/images/buttons/close_view.jpg',
		'/images/buttons/level.png',
		'/images/buttons/restart.jpg',
		'/images/buttons/restart_face_left.jpg',
		'/images/buttons/restart_r.jpg',
		'/images/buttons/restart_x.jpg',
		'/images/game/blocks.json',
		'/images/game/blocks.png',
		'/images/game/exit.json',
		'/images/game/exit.png',
		'/images/game/player.json',
		'/images/game/player.png',
		'/images/hints/arrow_up.png',
		'/images/hints/dpad_up.png',
		'/images/hints/pointer_finger.png',
		'/images/icons/0star.png',
		'/images/icons/1star.png',
		'/images/icons/2star.png',
		'/images/icons/3star.png',
		'/images/icons/blocks.png',
		'/images/icons/cc_zero.svg',
		'/images/icons/moves.png',
		'/images/icons/select_arrows_horiz.png',
		'/images/icons/select_arrows_vert.png',
		'/images/instructions/arrow_keys.png',
		'/images/instructions/blocks.png',
		'/images/instructions/d-pad.png',
		'/images/instructions/goal.png',
		'/images/instructions/moves_blocks_stars.png',
		'/images/instructions/restart.png',
		'/images/instructions/touch.png',
		'/images/logo/credits_logo.png',
		'/images/logo/favicon.ico',
		'/images/logo/icon_128.png',
		'/images/logo/icon_256.png',
		'/images/logo/icon_256_maskable.png',
		'/images/options/gamepad_controls_microsoft.png',
		'/images/options/gamepad_controls_nintendo.png',
		'/images/options/remove_ads.png',
		'/images/options/reset_scores.png',
		'/images/logo/title.png',
		'/images/logo/title_robot.png',
		'/images/ember.png',
		'/images/inprod_logo.png',
		'/scripts/game/block.js',
		'/scripts/game/game.js',
		'/scripts/game/goal.js',
		'/scripts/game/grid.js',
		'/scripts/game/grid_occupant.js',
		'/scripts/game/level.js',
		'/scripts/game/player.js',
		'/scripts/game/static_block.js',
		'/scripts/game/tetromino.js',
		'/scripts/lib/controller.min.js',
		'/scripts/lib/hammer.min.js',
		'/scripts/lib/material-touch.js',
		'/scripts/lib/polyfills.js',
		'/scripts/lib/raf.js',
		'/scripts/lib/vector2d.js',
		'/scripts/color.js',
		'/scripts/constants.js',
		'/scripts/credits_view.js',
		'/scripts/game_view.js',
		'/scripts/input_manager.js',
		'/scripts/instructions_view.js',
		'/scripts/level_select_view.js',
		'/scripts/menus.js',
		'/scripts/menu_view.js',
		'/scripts/options_view.js',
		'/scripts/results_view.js',
		'/scripts/stats_manager.js',
		'/scripts/title_particle.js',
		'/scripts/title_view.js',
		'/scripts/tween.js',
		'/scripts/utils.js',
		'/scripts/view.js',
		'/styles/animations.css',
		'/styles/styles.css'
	];

self.addEventListener('install', function (ev) {
	// Add files to cache.
	ev.waitUntil(
		caches.open(CACHE_NAME).then(function (cache) {
			return cache.addAll(CACHE_MANIFEST);
		}).then(function () {
			console.log('Cached \u201c' + CACHE_NAME + '\u201d');
		}).catch(function () {
			console.warn('Failed to cache \u201c' + CACHE_NAME + '\u201d');
		}));
});

self.addEventListener('activate', function (ev) {
	// Delete old caches.
	ev.waitUntil(
		caches.keys().then(function (cacheNames) {
			var cacheDeletionPromises = cacheNames.map(function (cacheName) {
				if (cacheName !== CACHE_NAME) {
					return caches.delete(cacheName)
						.then(function () {
							console.log('Deleted old cache \u201c' + cacheName + '\u201d');
						});
				}
			});
			return Promise.all(cacheDeletionPromises);
		}));
});

self.addEventListener('fetch', function (ev) {
	// Do not attempt to load external requests from cache.
	if (ev.request.url.indexOf(self.origin) !== 0) {
		return fetch(ev.request);
	}
	
	// Serve from cache where possible.
	ev.respondWith(
		caches.match(ev.request).then(function (response) {
			if (response) {
				return response;
			}
			return fetch(ev.request);
		}));
});
