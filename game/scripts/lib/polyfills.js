'use strict';

// Partial polyfill—**does not include `fromIndex`**
Array.prototype.includes = Array.prototype.includes || function (searchElement) {
	return this.indexOf(searchElement) !== -1;
};

// Partial polyfill—**does not include `position`**
String.prototype.includes = String.prototype.includes || function (searchString) {
	return this.indexOf(searchString) !== -1;
};
