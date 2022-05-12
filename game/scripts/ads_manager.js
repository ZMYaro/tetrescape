'use strict';

var Ads = {};

/** @constant {String} The URL for the Google Play billing and digital goods service */
Ads.GPLAY_DIGITAL_GOODS_SERVICE_URL = 'https://play.google.com/billing';
/** @constant {String} The ID in Google Play for the remove ads in-app “product” */
Ads.REMOVE_ADS_PRODUCT_ID = 'remove_ads'
Ads.ADSENSE_CLIENT_ID = 'ca-pub-XXXXXXXXXXXXXXXX';
Ads.ADSENSE_SLOT_ID = 'XXXXXXXXXX';

/**
 * Check whether the user has paid to remove ads, and load ads if not.
 */
Ads.init = function () {
	// If this is a paid version, just remove ads.
	if (BUILD_TYPE === 'packaged-paid') {
		views.options.hideRemoveAds();
		return;
	}
	
	// If this is a web version without in-app purchases, show ads.
	if (!window.getDigitalGoodsService) {
		Ads.addAds();
		return;
	}
	
	// Check whether the user already paid to remove ads.
	Ads.checkForPastPurchase()
		.then(function () {
			views.options.hideRemoveAds();
		})
		.catch(Ads.addAds);
}

/**
 * Add the necessary code to load and show ads.
 */
Ads.addAds = function () {
	document.body.classList.add('has-ads');
	
	var adContainer = document.getElementById('place-where-an-ad-could-go');
	adContainer.innerHTML = '<ins class="adsbygoogle" ' +
		'style="display: block;" ' +
		'data-full-width-responsive="true" ' +
		'data-ad-client="' + Ads.ADSENSE_CLIENT_ID + '" ' +
		'data-ad-slot="' + Ads.ADSENSE_SLOT_ID + '" ' +
		'data-adbreak-test="on" ' + // Fake ads for testing
		'></ins>';
	
	var adScript = document.createElement('script');
	adScript.async = true;
	adScript.crossOrigin = 'anonymous';
	adScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + Ads.ADSENSE_CLIENT_ID;
	document.head.appendChild(adScript);
	
	(window.adsbygoogle = window.adsbygoogle || []).push({});
}

/**
 * Check whether the user paid to remove ads on Google Play.
 * @returns {Promise} - Resolves if the user already paid, or rejects if not
 */
Ads.checkForPastPurchase = function () {
	return window.getDigitalGoodsService(Ads.GPLAY_DIGITAL_GOODS_SERVICE_URL)
		.then(function (service) {
			if (!service) { throw new Error('The digital goods service was not available.'); }
			return service.listPurchases();
		})
		.then(function (purchases) {
			if (purchases.length === 0) { throw new Error('The user did not pay to remove ads.'); }
			// If a second purchasable item is ever added, will need to update this to check which.
			return true;
		});
};

/**
 * Start a payment request to remove ads.
 * @returns {Promise} - Resolves if the request is successful, or rejects if not
 */
Ads.initRemovalPayment = function () {
	if (!window.PaymentRequest || !window.getDigitalGoodsService) {
		return Promise.reject(new Error('Your browser/platform does not support this in-app purchase.'));
	}
	if (!navigator.onLine) {
		return Promise.reject(new Error('Cannot connect to Google Play service while offline.'));
	}
	return window.getDigitalGoodsService(Ads.GPLAY_DIGITAL_GOODS_SERVICE_URL)
		.then(function (service) {
			if (!service) { throw new Error('The Google Play service was not available.'); }
			var paymentMethods = [{
					supportedMethods: Ads.GPLAY_DIGITAL_GOODS_SERVICE_URL,
					data: {
						sku: Ads.REMOVE_ADS_PRODUCT_ID
					}
				}],
				paymentDetails = {
					total: {
						// This is required by the payment request API, but will
						// be overridden by whatever the Google Play service says.
						label: 'Remove ads',
						amount: { currency: 'USD', value: '1.99' }
					}
				},
				request = new PaymentRequest(paymentMethods, paymentDetails);
			return request.show();
		})
		.then(function (paymentResponse) {
			// TODO: Call endpoint to acknowledge payment with Google Play before reporting success.
			return paymentResponse.complete('success');
		});
};

/**
 * Remove ads from the page that have been added.
 * This does not remove the Google ad script, but if the user purchased
 * ad removal, that will simply not be loaded on future loads.
 */
Ads.removeAds = function () {
	document.body.classList.remove('has-ads');
	document.body.removeChild(document.getElementById('place-where-an-ad-could-go'));
};
