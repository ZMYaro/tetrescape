var CACHE_NAME = 'cache-2022-02-04';

self.addEventListener('install', function (ev) {
	// Add files to cache.
	ev.waitUntil(
		caches.open(CACHE_NAME).then(function (cache) {
			return cache.addAll([
				'/',
				'/index.html',
				'/manifest.webmanifest',
				'/audio/block_hit.mp3',
				'/audio/block_slide.mp3',
				'/audio/win.mp3',
				'/images/backgrounds/level_select_horiz.jpg',
				'/images/backgrounds/level_select_vert.jpg',
				'/images/backgrounds/stone_dark_speckled.jpg',
				'/images/backgrounds/stone_light_smooth.jpg',
				'/images/backgrounds/stone_light_speckled.jpg',
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
				'/images/buttons/level.jpg',
				'/images/buttons/restart.jpg',
				'/images/buttons/restart_face_left.jpg',
				'/images/buttons/restart_r.jpg',
				'/images/buttons/restart_x.jpg',
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
				'/images/instructions/blocks.png',
				'/images/instructions/controls.png',
				'/images/logo/128.png',
				'/images/logo/256.png',
				'/images/logo/256_maskable.png',
				'/images/logo/favicon.ico',
				'/images/logo/title.png',
				'/images/ember.png',
				'/images/exit.png', // TO BE REPLACED
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
				'/scripts/gameview.js',
				'/scripts/input_manager.js',
				'/scripts/menus.js',
				'/scripts/menuview.js',
				'/scripts/titleparticle.js',
				'/scripts/titleview.js',
				'/scripts/tween.js',
				'/scripts/utils.js',
				'/scripts/view.js',
				'/styles/animations.css',
				'/styles/styles.css'
			]);
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
					return caches.delete(cacheName);
				}
			});
			return Promise.all(cacheDeletionPromises);
		}));
});

self.addEventListener('fetch', function (ev) {
	// Serve from cache where possible.
	ev.respondWith(
		caches.match(ev.request).then(function (response) {
			if (response) {
				return response;
			}
			return fetch(ev.request);
		}));
});
