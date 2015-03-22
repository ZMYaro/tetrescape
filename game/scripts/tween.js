'use strict';

/**
 * Initialize a new tween.
 * @param {GridOccupant} occupant - The grid occupant whose property is being animated
 * @param {Object<String, Number>} props - A map of the properties being animated to the amounts by which they are to be changed
 * @param {Number} diff - The amount by which to change the property
 * @param {Number} duration - The duration of the animation in frames
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
	
	this._duration = duration;
	this._currentFrame = 0;
}

Tween.prototype = {
	update: function () {
		this._currentFrame++;
		if (this._currentFrame > this._duration) {
			// Do not go past the finalValue of the animation.
			return;
		} else if (this._currentFrame === this._duration) {
			// If it is the last frame, set the final value and call any callback.
			this._props.forEach(function (prop) {
				this._occupant[prop.name] = prop.finalValue;
			}, this);
			if (this.onfinish) {
				this.onfinish();
			}
		} else {
			this._props.forEach(function (prop) {
				var currentDiff = prop.diff * (this._currentFrame / this._duration),
					currentValue = prop.initialValue + currentDiff;
				this._occupant[prop.name] = currentValue;
			}, this);
		}
	}
};
