'use strict';

var LEVELS = [{
	/*
	*  I  i  i  i  *
	I  *  * [G] *  I
	i  *  *  *  *  i
	i  *  *  *  *  i
	i  *  P  *  *  i
	*  I  i  i  i  *
	*/
	width: 6,
	height: 6,
	playerSpawn: {
		x: 2,
		y: 4
	},
	goal: {
		x: 3,
		y: 1
	},
	tetrominos: [{
		type: 'I',
		orientation: 90,
		x: 1,
		y: 0
	}, {
		type: 'I',
		orientation: 0,
		x: 0,
		y: 1
	}, {
		type: 'I',
		orientation: 0,
		x: 5,
		y: 1
	}, {
		type: 'I',
		orientation: 90,
		x: 1,
		y: 5
	}]
}, {
	/*
	*  *  * [G] *
	*  O  o  *  *
	*  o  o  *  *
	O  o  *  O  o
	o  o  P  o  o
	*/
	width: 5,
	height: 5,
	playerSpawn: {
		x: 2,
		y: 4
	},
	goal: {
		x: 3,
		y: 0
	},
	tetrominos: [{
		type: 'O',
		orientation: 0,
		x: 0,
		y: 3
	}, {
		type: 'O',
		orientation: 0,
		x: 3,
		y: 3
	}, {
		type: 'O',
		orientation: 0,
		x: 1,
		y: 1
	}],
}, {
	/*
	B  B  B  B  *  B  B [G] B
	I  i  i  i     I  i  i  i
	*  *  *  *  I  *  *  *  *
	*  *  *  *  i  *  *  *  *
	*  *  *  *  i  *  *  *  *
	*  *  *  *  i  *  *  *  *
	*  *  *  *  *  *  *  *  *
	*  *  *  *  P  *  *  *  *
	*  *  *  *  *  *  *  *  *
	*/
	width: 9,
	height: 9,
	playerSpawn: {
		x: 4,
		y: 7
	},
	goal: {
		x: 7,
		y: 0
	},
	tetrominos: [{
		type: 'B',
		orientation: 0,
		x: 0,
		y: 0
	}, {
		type: 'B',
		orientation: 0,
		x: 1,
		y: 0
	}, {
		type: 'B',
		orientation: 0,
		x: 2,
		y: 0
	}, {
		type: 'B',
		orientation: 0,
		x: 3,
		y: 0
	}, {
		type: 'B',
		orientation: 0,
		x: 5,
		y: 0
	}, {
		type: 'B',
		orientation: 0,
		x: 6,
		y: 0
	}, {
		type: 'B',
		orientation: 0,
		x: 8,
		y: 0
	}, {
		type: 'I',
		orientation: 90,
		x: 0,
		y: 1
	}, {
		type: 'I',
		orientation: 90,
		x: 5,
		y: 1
	}, {
		type: 'I',
		orientation: 0,
		x: 4,
		y: 2
	}]
}, {
	/*
	J  j  B [G] B  B
	j  B  *  J  j  j
	j  *  t  *  B  j
	*  t  t  t  *  *
	*  *  *  *  *  *
	*  *  P  *  *  *
	*/
	width: 6,
	height: 6,
	playerSpawn: {
		x: 2,
		y: 5
	},
	goal: {
		x: 3,
		y: 0
	},
	tetrominos: [{
		type: 'J',
		orientation: 180,
		x: 0,
		y: 0
	}, {
		type: 'B',
		orientation: 0,
		x: 2,
		y: 0
	}, {
		type: 'B',
		orientation: 0,
		x: 4,
		y: 0
	}, {
		type: 'B',
		orientation: 0,
		x: 5,
		y: 0
	}, {
		type: 'B',
		orientation: 0,
		x: 1,
		y: 1
	}, {
		type: 'J',
		orientation: 270,
		x: 3,
		y: 1
	}, {
		type: 'B',
		orientation: 0,
		x: 4,
		y: 2
	}, {
		type: 'T',
		orientation: 180,
		x: 1,
		y: 2
	}]
}, {
	
}, {
	/*
	J  B  B  *  *  O  o [G] O  o  I
	j  j  j  *  *  o  o  B  o  o  i
	*  *  *  *  *  *  *  *  *  *  i
	*  *  *  *  *  *  *  *  *  *  i
	I  *  *  t  *  *  *  *  *  *  *
	i  *  t  t  t  *  *  *  *  O  o
	i  *  *  *  *  *  *  *  *  o  o
	i  *  *  P  *  *  *  *  *  *  B
	*/
	width: 11,
	height: 8,
	playerSpawn: {
		x: 3,
		y: 7
	},
	goal: {
		x: 7,
		y: 0
	},
	tetrominos: [{
		type: 'J',
		orientation: 90,
		x: 0,
		y: 0
	}, {
		type: 'B',
		orientation: 0,
		x: 1,
		y: 0
	}, {
		type: 'O',
		orientation: 0,
		x: 5,
		y: 0
	}, {
		type: 'O',
		orientation: 0,
		x: 8,
		y: 0
	}, {
		type: 'I',
		orientation: 0,
		x: 10,
		y: 0
	}, {
		type: 'B',
		orientation: 0,
		x: 7,
		y: 1
	}, {
		type: 'I',
		orientation: 0,
		x: 0,
		y: 4
	}, {
		type: 'T',
		orientation: 180,
		x: 2,
		y: 4
	}, {
		type: 'O',
		orientation: 0,
		x: 9,
		y: 5
	}, {
		type: 'B',
		orientation: 0,
		x: 10,
		y: 7
	}]
}];