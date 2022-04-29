'use strict';

/**
 * Initialize a new tween.
 * @param {GridOccupant} occupant - The grid occupant whose property is being animated
 * @param {Object<String, Number>} props - A map of the properties being animated to the amounts by which they are to be changed
 * @param {Number} diff - The amount by which to change the property
 * @param {Number} duration - The duration of the animation in milliseconds
 */
function Tween(occupant, props, duration) {
	this._occupant = occupant;
	
	this._props = [];
	for (var prop in props) {
		this._props.push({
			name: prop,
			diff: props[prop],
			initialValue: this._occupant[prop],
			finalValue: this._occupant[prop] + props[prop]
		});
	}
	
	/** {Number} The duration of the animation in milliseconds */
	this._duration = duration;
	/** {Number} The time since the animation began in milliseconds */
	this._currentTime = 0;
	/** {Boolean} Whether the animation has finished */
	this._finished = false;
}

Tween.prototype = {
	/**
	 * Update the tween.
	 * @param {Number} deltaTime - The time since the last frame in milliseconds
	 */
	update: function (deltaTime) {
		if (this._finished) { return; }
		
		this._currentTime += deltaTime;
		
		if (this._currentTime >= this._duration) {
			// If it is the last frame, set the final value and call any callback.
			this._props.forEach(function (prop) {
				this._occupant[prop.name] = prop.finalValue;
			}, this);
			if (this.onfinish) {
				this.onfinish();
			}
			this._finished = true;
		} else {
			this._props.forEach(function (prop) {
				var currentDiff = prop.diff * (this._currentTime / this._duration),
					currentValue = prop.initialValue + currentDiff;
				this._occupant[prop.name] = currentValue;
			}, this);
		}
	}
};
