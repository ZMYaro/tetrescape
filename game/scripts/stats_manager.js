'use strict';

/**
 * Initialize a new StatsManager.
 */
function StatsManager() {
	this._stats = {
		moves: 0,    // Number of moves ever
		blocks: 0,   // Number of blocks cleared ever
		restarts: 0, // Number of level restarts ever
		crashes: 0,  // Number of walls crashed into ever
		time: 0      // Time spent in levels in seconds
	};
	
	for (var stat in this._stats) {
		// Load each stat's value from local storage, or default to 0 if it is not present.
		this._stats[stat] = parseInt(localStorage[GAME_PREFIX + this.PREFIX + stat]) || 0;
	}
}

/** {String} The prefix for stat keys in local storage */
StatsManager.prototype.PREFIX = 'stats-';
/** {Number} The maximum value for any stat */
StatsManager.prototype.MAX_VALUE = 999999999999;

/**
 * Get the current value for a stat.
 * @param {String} stat - moves, blocks, restarts, or crashes
 * @returns {Number} - The value for that stat
 */
StatsManager.prototype.get = function (stat) {
	return this._stats[stat];
};

/**
 * Set the value for a stat.
 * @param {String} stat - moves, blocks, restarts, or crashes
 * @param {Number} value - The new number of moves, blocks, restarts, or crashes
 */
StatsManager.prototype.set = function (stat, value) {
	if (!(stat in this._stats)) {
		// Do not allow invalid stats to be set.
		return;
	}
	value = Math.min(value, this.MAX_VALUE);
	this._stats[stat] = value;
	localStorage[GAME_PREFIX + this.PREFIX + stat] = value;
};

/**
 * Increment the value for a stat by 1 or the specified amount.
 * @param {String} stat - moves, blocks, restarts, or crashes
 * @param {Number} [amount] - The amount to increase the value by, if not 1
 */
StatsManager.prototype.increment = function (stat, amount) {
	if (typeof amount !== 'number') {
		amount = 1;
	}
	this.set(stat, (this._stats[stat] + amount));
};

/**
 * Reset all stats to zero.
 */
StatsManager.prototype.resetAll = function () {
	for (var stat in this._stats) {
		this.set(stat, 0);
	}
};
