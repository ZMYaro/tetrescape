'use strict';

// ([A-Z]),([0-9]+),([0-9]+),([0-9]+)\n
// type: '\1',\norientation: \2,\nx: \3,\ny: \4\n\n

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
	staticBlocks: [],
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
	staticBlocks: [],
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
	*  *  * [G] *  *
	*  B  B  *  *  *
	*  B  B  *  *  *
	O  o  *  O  o  *
	o  o  P  o  o  *
	*/
	width: 6,
	height: 5,
	playerSpawn: {
		x: 2,
		y: 4
	},
	goal: {
		x: 3,
		y: 0
	},
	staticBlocks: [
		{x: 1, y: 1},
		{x: 2, y: 1},
		{x: 1, y: 2},
		{x: 2, y: 2}
	],
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
	}]
}, {
	/*
	B  B  B  B  *  B  B [G] B
	I  i  i  i     I  i  i  i
	*  *  *  *  I  *  *  *  *
	*  *  *  *  i  *  *  *  *
	*  *  *  *  i  *  *  *  *
	*  *  *  *  i  *  *  *  *
	O  o  O  o  *  O  o  O  o
	o  o  o  o  P  o  o  o  o
	*/
	width: 9,
	height: 8,
	playerSpawn: {
		x: 4,
		y: 7
	},
	goal: {
		x: 7,
		y: 0
	},
	staticBlocks: [
		{x: 0, y: 0},
		{x: 1, y: 0},
		{x: 2, y: 0},
		{x: 3, y: 0},
		{x: 5, y: 0},
		{x: 6, y: 0},
		{x: 8, y: 0}
	],
	tetrominos: [{
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
	}, {
		type: 'O',
		orientation: 0,
		x: 0,
		y: 6
	}, {
		type: 'O',
		orientation: 0,
		x: 2,
		y: 6
	}, {
		type: 'O',
		orientation: 0,
		x: 5,
		y: 6
	}, {
		type: 'O',
		orientation: 0,
		x: 7,
		y: 6
	}]
}, {
	/*
	J  j  B [G] B  B
	j  B  *  J  j  j
	j  *  t  *  B  j
	*  t  t  t  *  *
	O  o  *  L  *  *
	o  o  P  l  l  l
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
	staticBlocks: [
		{x: 2, y: 0},
		{x: 4, y: 0},
		{x: 5, y: 0},
		{x: 1, y: 1},
		{x: 4, y: 2}
	],
	tetrominos: [{
		type: 'J',
		orientation: 180,
		x: 0,
		y: 0
	}, {
		type: 'J',
		orientation: 270,
		x: 3,
		y: 1
	}, {
		type: 'T',
		orientation: 180,
		x: 1,
		y: 2
	}, {
		type: 'O',
		orientation: 0,
		x: 0,
		y: 4
	}, {
		type: 'J',
		orientation: 90,
		x: 3,
		y: 4
	}]
}, {
	/*
	I  i  i  i [G] B  B
	J  j  *  I  i  i  i
	j  *  *  *  L  l  l
	j  T  t  t  *  *  l
	*  *  t  *  *  *  *
	O  o  *  I  i  i  i
	o  o  P  I  i  i  i
	*/
	width: 7,
	height: 7,
	playerSpawn: {
		x: 2,
		y: 6
	},
	goal: {
		x: 4,
		y: 0
	},
	staticBlocks: [
	],
	tetrominos: [{
		type: 'I',
		orientation: 90,
		x: 0,
		y: 0
	}, {
		type: 'J',
		orientation: 180,
		x: 0,
		y: 1
	}, {
		type: 'I',
		orientation: 90,
		x: 3,
		y: 1
	}, {
		type: 'J',
		orientation: 270,
		x: 4,
		y: 2
	}, {
		type: 'T',
		orientation: 0,
		x: 1,
		y: 3
	}, {
		type: 'O',
		orientation: 0,
		x: 0,
		y: 5
	}, {
		type: 'I',
		orientation: 90,
		x: 3,
		y: 5
	}, {
		type: 'I',
		orientation: 90,
		x: 3,
		y: 6
	}]
}, {
	/*
	*  *  *  *  *  *  * [G] *
	Z  z  *  *  *  *  J  j  j
	I  z  z  *  *  J  j  j  j
	i  O  o  *  S  Z  z  j  I
	i  o  o  *  s  s  z  z  i
	i  z  *  *  J  s  L  l  i
	z  z  *  *  j  j  j  l  i
	z  z  O  o  *  *  *  l  *
	z  z  o  o  *  *  *  *  *
	z  z  *  L  *  *  *  z  *
	z  z  *  l  *  *  z  z  *
	z  z  *  l  l  *  z  z  *
	z  z  I  i  i  i  z  z  *
	z  I  i  i  i  P  z  B  *
	*/
	width: 9,
	height: 14,
	playerSpawn: {x: 5, y: 13},
	goal: {x: 7, y: 0},
	staticBlocks: [{x: 7, y: 13}],
	tetrominos: [{
		type: 'Z',
		orientation: 0,
		x: 0,
		y: 1
	}, {
		type: 'J',
		orientation: 270,
		x: 6,
		y: 1
	}, {
		type: 'I',
		orientation: 0,
		x: 0,
		y: 2
	}, {
		type: 'J',
		orientation: 270,
		x: 5,
		y: 2
	}, {
		type: 'O',
		orientation: 0,
		x: 1,
		y: 3
	}, {
		type: 'S',
		orientation: 90,
		x: 4,
		y: 3
	}, {
		type: 'Z',
		orientation: 0,
		x: 5,
		y: 3
	}, {
		type: 'I',
		orientation: 0,
		x: 8,
		y: 3
	}, {
		type: 'Z',
		orientation: 90,
		x: 0,
		y: 5
	}, {
		type: 'J',
		orientation: 90,
		x: 4,
		y: 5
	}, {
		type: 'L',
		orientation: 180,
		x: 6,
		y: 5
	}, {
		type: 'Z',
		orientation: 90,
		x: 0,
		y: 7
	}, {
		type: 'O',
		orientation: 0,
		x: 2,
		y: 7
	}, {
		type: 'T',
		orientation: 270,
		x: 6,
		y: 7
	}, {
		type: 'Z',
		orientation: 90,
		x: 0,
		y: 9
	}, {
		type: 'L',
		orientation: 0,
		x: 3,
		y: 9
	}, {
		type: 'Z',
		orientation: 90,
		x: 6,
		y: 9
	}, {
		type: 'Z',
		orientation: 90,
		x: 0,
		y: 11
	}, {
		type: 'Z',
		orientation: 90,
		x: 6,
		y: 11
	}, {
		type: 'I',
		orientation: 90,
		x: 2,
		y: 12
	}, {
		type: 'I',
		orientation: 90,
		x: 1,
		y: 13
	}]
}, {
	/*
	*  *  B  j  *  *  *  *  *  I  I  *  *
	*  *  B  j  *  *  *  *  *  i  i  *  *
	*  *  j  j  *  *  *  *  *  i  i  *  z
	L  l  *  *  *  *  *  *  *  i  i  z  z
	*  l  I  I  *  I  i  i  i  * [P] z  z
	*  l  i  i  *  *  *  *  *  J  j  z  z
	*  *  i  i  *  *  *  *  *  j  J  z [G]
	*  *  i  i  *  *  *  *  *  j  j  j  j
	*/
	width: 13,
	height: 8,
	playerSpawn: {x: 10, y: 4},
	goal: {x: 12, y: 6},
	staticBlocks: [
		{x: 2, y: 0},
		{x: 2, y: 1}
	],
	tetrominos: [{
		type: 'J',
		orientation: 0,
		x: 2,
		y: 0
	}, {
		type: 'I',
		orientation: 0,
		x: 9,
		y: 0
	}, {
		type: 'I',
		orientation: 0,
		x: 10,
		y: 0
	}, {
		type: 'Z',
		orientation: 90,
		x: 11,
		y: 2
	}, {
		type: 'L',
		orientation: 180,
		x: 0,
		y: 3
	}, {
		type: 'I',
		orientation: 0,
		x: 2,
		y: 4
	}, {
		type: 'I',
		orientation: 0,
		x: 3,
		y: 4
	}, {
		type: 'I',
		orientation: 90,
		x: 5,
		y: 4
	}, {
		type: 'Z',
		orientation: 90,
		x: 11,
		y: 4
	}, {
		type: 'J',
		orientation: 180,
		x: 9,
		y: 5
	}, {
		type: 'J',
		orientation: 90,
		x: 10,
		y: 6
	}]
}, {
	/*
	J  *  *  *  *  O  o [G] O  o  I
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
	staticBlocks: [
		{x: 7, y: 1},
		{x: 10, y: 7}
	],
	tetrominos: [{
		type: 'J',
		orientation: 90,
		x: 0,
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
	}]
}, {
	/*
	B  B  B  I  i  i  i [G] Z  z  L  l
	I  i  i  i  *  I  i  i  i  z  z  l
	*  O  o  O  o  *  *  *  *  *  *  l
	I  o  o  o  o  *  *  *  *  *  *  *
	i  O  o  *  T  t  t  *  *  *  *  I
	i  o  o  *  *  t  *  *  *  *  *  i
	i  *  *  *  *  *  *  *  *  O  o  i
	B  *  *  P  *  *  *  *  *  o  o  i
	*/
	width: 12,
	height: 8,
	playerSpawn: {
		x: 3,
		y: 7
	},
	goal: {
		x: 7,
		y: 0
	},
	staticBlocks: [
		{x: 0, y: 0},
		{x: 1, y: 0},
		{x: 2, y: 0},
		{x: 0, y: 7}
	],
	tetrominos: [{
		type: 'I',
		orientation: 90,
		x: 3,
		y: 0
	}, {
		type: 'Z',
		orientation: 0,
		x: 8,
		y: 0
	}, {
		type: 'L',
		orientation: 180,
		x: 10,
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
		type: 'O',
		orientation: 0,
		x: 1,
		y: 2
	}, {
		type: 'O',
		orientation: 0,
		x: 3,
		y: 2
	}, {
		type: 'I',
		orientation: 0,
		x: 0,
		y: 3
	}, {
		type: 'O',
		orientation: 0,
		x: 1,
		y: 4
	}, {
		type: 'T',
		orientation: 0,
		x: 4,
		y: 4
	}, {
		type: 'I',
		orientation: 0,
		x: 11,
		y: 4
	}, {
		type: 'O',
		orientation: 0,
		x: 9,
		y: 6
	}]
}, {
	/*
	*  *  *  *  *  *  *  *  *  I  J  *  *
	*  *  *  J  j  *  *  *  *  i  j  j  j
	*  *  *  j  B  B  *  *  *  i  *  t  *
	P  B  *  j [G] s  s  *  *  i  t  t  t
	*  B  *  J  s  s  B  *  *  *  *  *  *
	*  B  B  j  j  j  *  *  *  *  *  *  *
	*  T  t  t  *  *  *  *  *  O  o  O  o
	*  *  t  *  *  *  *  *  *  o  o  o  o
	*/
	width: 13,
	height: 8,
	playerSpawn: {
		x: 0,
		y: 3
	},
	goal: {
		x: 4,
		y: 3
	},
	staticBlocks: [
		{x: 4, y: 2},
		{x: 5, y: 2},
		{x: 1, y: 3},
		{x: 1, y: 4},
		{x: 6, y: 4},
		{x: 1, y: 5},
		{x: 2, y: 5}
	],
	tetrominos: [{
		type: 'I',
		orientation: 0,
		x: 9,
		y: 0
	}, {
		type: 'J',
		orientation: 90,
		x: 10,
		y: 0
	}, {
		type: 'J',
		orientation: 180,
		x: 3,
		y: 1
	}, {
		type: 'T',
		orientation: 180,
		x: 10,
		y: 2
	}, {
		type: 'S',
		orientation: 0,
		x: 4,
		y: 3
	}, {
		type: 'J',
		orientation: 90,
		x: 3,
		y: 4
	}, {
		type: 'T',
		orientation: 0,
		x: 1,
		y: 6
	}, {
		type: 'O',
		orientation: 0,
		x: 9,
		y: 6
	}, {
		type: 'O',
		orientation: 0,
		x: 11,
		y: 6
	}]
}];
