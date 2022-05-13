'use strict';

/**
 * Initialize a new OptionsView.
 * @param {HTMLElement} elem - The element for this view
 * @param {View} [parent] - The next view up, if any
 */
function OptionsView(elem, parent) {
	// Call the superclass constructor.
	MenuView.call(this, elem, parent);
	
	// Enable inputs.
	var gamepadControlsSelect = this.elem.querySelector('#gamepad-controls-select');
	gamepadControlsSelect.value = im.gamepadControls;
	document.body.classList.add('gamepad-controls-' + im.gamepadControls);
	gamepadControlsSelect.addEventListener('change', this._handleControlsSelect.bind(this));
	
	this.elem.querySelector('#remove-ads-button')
		.addEventListener('click', this._handleRemoveAds.bind(this));
	this.elem.querySelector('#reset-button')
		.addEventListener('click', this._handleReset.bind(this));
	
	var hasWebDigitalGoodsAPI = (!!window.PaymentRequest && !!window.getDigitalGoodsService),
		hasCordovaAPI = (!!window.cordova && !!window.inAppPurchase);
	if (!hasWebDigitalGoodsAPI && !hasCordovaAPI) {
		// Hide the option to remove ads if in-app purchases are not available.
		this.hideRemoveAds();
	}
}

// Inherit from View.
OptionsView.prototype = Object.create(MenuView.prototype);

// Define constants.
/** @override @constant {String} The fragment path for this view */
OptionsView.prototype.ROUTE = 'options';

/**
 * Hide the option to remove ads.
 */
OptionsView.prototype.hideRemoveAds = function () {
	this.elem.querySelector('#remove-ads-input-group').style.display = 'none';
	this.elem.querySelector('#remove-ads-input-group button').disabled = true;
};

/**
 * @private
 * Handle the gamepad controls selection being changed.
 * @param {Event} ev
 */
OptionsView.prototype._handleControlsSelect = function (ev) {
	document.body.classList.remove('gamepad-controls-microsoft');
	document.body.classList.remove('gamepad-controls-nintendo');
	document.body.classList.add('gamepad-controls-' + ev.target.value);
	
	im.gamepadControls = ev.target.value;
	
	localStorage[GAME_PREFIX + 'gamepad-controls'] = ev.target.value;
};

/**
 * @private
 * Handle the remove ads button being clicked.
 */
OptionsView.prototype._handleRemoveAds = function () {
	Ads.initRemovalPayment()
		.then(function () {
			// If successful, remove ads!
			Ads.removeAds();
			views.options.hideRemoveAds();
		})
		.catch(function (err) {
			// If the user cancelled the transaction, ignore the error, otherwise alert the user.
			if (err.name === 'AbortError' || err.message === 'Purchase Cancelled') {
				return;
			}
			alert(err.message);
		});
};

/**
 * @private
 * Handle the reset button being clicked.
 */
OptionsView.prototype._handleReset = function () {
	var confirmed = confirm('Are you sure you want to reset all your scores and stats?  This cannot be undone!');
	if (!confirmed) {
		return;
	}
	
	LEVELS.forEach(function (level, i) {
		localStorage.removeItem(Utils.getLocalStorageKey(level.name, MODES.MOVES));
		localStorage.removeItem(Utils.getLocalStorageKey(level.name, MODES.BLOCKS));
	});
	
	// Update the level select screen with the new values.
	views.levelSelect.repopulate();
	
	// Reset play stats.
	stats.resetAll();
	
	alert('Your progress has been reset.');
	
	// Keep the options view active since this button is not for navigation.
	this._active = true;
};
