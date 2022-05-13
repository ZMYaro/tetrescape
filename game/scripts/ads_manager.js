'use strict';

var Ads = {};

/** @constant {String} The URL for the Google Play billing and digital goods service */
Ads.GPLAY_DIGITAL_GOODS_SERVICE_URL = 'https://play.google.com/billing';
/** @constant {String} The ID in Google Play for the remove ads in-app “product” */
Ads.REMOVE_ADS_PRODUCT_ID = 'remove_ads'
Ads.GOOGLE_AD_CLIENT_ID = '3940256099942544'; // This is the test client ID; replace it for production builds!
Ads.ADSENSE_UNIT_ID = 'XXXXXXXXXX'; // Replace this placeholder for production builds!
Ads.ADMOB_UNIT_ID = '6300978111'; // This is the test unit ID; replace it for production builds!

Ads.adMobBannerAd = undefined;

/**
 * Check whether the user has paid to remove ads, and load ads if not.
 */
Ads.init = function () {
	// If this is a paid version, just remove ads.
	if (BUILD_TYPE === 'packaged-paid') {
		views.options.hideRemoveAds();
		return;
	}
	
	// Check whether the user already paid to remove ads.
	Ads.checkForPastPurchase()
		.then(function () {
			views.options.hideRemoveAds();
		})
		.catch(Ads.addAds);
};

/**
 * Add the necessary code to load and show ads.
 */
Ads.addAds = function () {
	if (window.admob) {
		Ads.addAdMobAds();
		return;
	}
	
	Ads.addAdSenseAds();
};

/**
 * Add the necessary code to load AdSense ads.
 */
Ads.addAdSenseAds = function () {
	document.body.classList.add('has-ads');
	
	var adContainer = document.getElementById('place-where-an-ad-could-go');
	adContainer.innerHTML = '<ins class="adsbygoogle" ' +
		'style="display: block;" ' +
		'data-full-width-responsive="true" ' +
		'data-ad-client="ca-pub-' + Ads.GOOGLE_AD_CLIENT_ID + '" ' +
		'data-ad-slot="' + Ads.ADSENSE_UNIT_ID + '" ' +
		'data-adbreak-test="on" ' + // Fake ads for testing
		'></ins>';
	
	var adScript = document.createElement('script');
	adScript.async = true;
	adScript.crossOrigin = 'anonymous';
	adScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-' + Ads.GOOGLE_AD_CLIENT_ID;
	document.head.appendChild(adScript);
	
	(window.adsbygoogle = window.adsbygoogle || []).push({});
};

/**
 * Add the necessary code to load AdMob ads.
 */
Ads.addAdMobAds = function () {
	if (Ads.adMobBannerAd) {
		return;
	}
	Ads.adMobBannerAd = new admob.BannerAd({
		adUnitId: 'ca-app-pub-' + Ads.GOOGLE_AD_CLIENT_ID + '/' + Ads.ADMOB_UNIT_ID,
		position: 'bottom'
	});
	Ads.adMobBannerAd.show();
};

/**
 * Check whether the user paid to remove ads on Google Play.
 * @returns {Promise} - Resolves if the user already paid, or rejects if not
 */
Ads.checkForPastPurchase = function () {
	if (window.inAppPurchase) {
		return Ads.checkPurchaseCordova();
	}
	if (window.getDigitalGoodsService) {
		return Ads.checkPurchaseWeb();
	}
	return Promise.reject(new Error('The browser/platform does not support in-app purchases.'));
};

/**
 * Check for past ad removal with the web digital goods API.
 * @returns {Promise} - Resolves if the user already paid, or rejects if not
 */
Ads.checkPurchaseWeb = function () {
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
 * Check for past ad removal with the Cordova API.
 * @returns {Promise} - Resolves if the user already paid, or rejects if not
 */
Ads.checkPurchaseCordova = function () {
	return inAppPurchase.restorePurchases()
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
	if (!navigator.onLine) {
		return Promise.reject(new Error('Cannot connect to Google Play service while offline.'));
	}
	if (window.inAppPurchase) {
		return Ads.initPaymentCordova();
	}
	if (window.getDigitalGoodsService) {
		return Ads.initPaymentWeb();
	}
	return Promise.reject(new Error('Your browser/platform does not support this in-app purchase.'));
};

/**
 * Do the payment request with the web digital goods API.
 * @returns {Promise} - Resolves if the request is successful, or rejects if not
 */
Ads.initPaymentWeb = function () {
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
 * Do the payment request with the Cordova API.
 * @returns {Promise} - Resolves if the request is successful, or rejects if not
 */
Ads.initPaymentCordova = function () {
	return inAppPurchase.buy(Ads.REMOVE_ADS_PRODUCT_ID);
};

/**
 * Remove ads from the page that have been added.
 * This does not remove the Google ad script, but if the user purchased
 * ad removal, that will simply not be loaded on future loads.
 */
Ads.removeAds = function () {
	document.body.classList.remove('has-ads');
	document.body.removeChild(document.getElementById('place-where-an-ad-could-go'));
	if (Ads.adMobBannerAd) {
		Ads.adMobBannerAd.hide();
	}
};
