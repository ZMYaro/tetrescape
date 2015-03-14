'use strict';

/**
 * Initialize a new Vector2D.
 * @param {Number} x - The x-component of the vector.
 * @param {Number} y - The y-component of the vector.
 */
function Vector2D(x, y) {
	this.x = x;
	this.y = y;
}

// Define static constants.
Vector2D.LEFT = new Vector2D(-1, 0);
Vector2D.RIGHT = new Vector2D(1, 0);
Vector2D.UP = new Vector2D(0, -1);
Vector2D.DOWN = new Vector2D(0, 1);
