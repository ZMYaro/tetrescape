# TetrEscape

## General concept

Room escape meets block-pushing puzzles meets _Tetris_.


## Platform

_TetrEscape_ is designed for the web first, but the intent is to port it to other platforms in the future.


## Gameplay

* The player can move in four directions.
* If the player moves in the direction of a block, the player will push the block if possible.
* If a block is moved into another block, it will push the other block if possible.
* If a block is pushed against the edge of the game grid, it will remain immovable.
* If a complete row of blocks—horizontal or vertical—is created, all blocks in the row will vanish.
* A level is completed by the player reaching the exit/goal space.


## Controls

* Keyboard - arrow keys, WASD, or ,AOE
* Touch - directional swiping
* Gamepad - d-pad or analog stick


## Onboarding and teaching the game

The controls are simple enough to be displayed on the screen at start.  The first few levels are designed such that the player is forced into pushing blocks, clearing lines, etc. whether or not xe knows those mechanics.


## Code styling

* Commits should follow [standard Git commit guidelines](http://git-scm.com/book/ch5-2.html#Commit-Guidelines).
  - Commits should fit in the sentence, “If applied, this commit will ___.”
* Code will be intended with tabs, not spaces.
* Opening curly braces will be on the same line as control structures (`if`, `switch`, `for`, `function`, etc.), separated with a space, and never on the next line.
* Function and variable names will be in camelCase.
* Function and variable names meant to be treated as private will be prefixed with an underscore (e.g., `_privateVar`).
* Constants will be in ALL_CAPS.
* Object types will be in UpperCamelCase.
* Operators will have spaces on both sides.
* Functions should have documentation strings.  For example:

```
/**
 * Adds two numbers.
 * @param {Number} a - The first number to be added
 * @param {Number} b - The second number to be added
 * @returns {Number} The sum of a and b
 */
function sum(a, b) { ... }
```


## Libraries

* [Controller.js](https://samiare.github.io/Controller.js/)
* [Hammer.js](http://hammerjs.github.io)
* [MaterialZ](https://github.com/zmyaro/materialz)
* [Erik Möller and Paul Irish's requestAnimationFrame polyfill](https://gist.github.com/paulirish/1579671)


## Open-source _TetrEscape_ code

This code may be used as an educational reference, but may not be copied or redistributed without permission.


## Running as a web app

Prereq: `npm install -g http-server` (or your preferred local HTTP server).
1. `cd game`.
2. `http-server` (or start your preferred HTTP server).
3. Navigate to `http://localhost:8080` (or whichever port you specified if not 8080) in your browser.


## Buliding as a desktop app

Prereq: `npm install -g electron-builder`
1. `cp -r game electron`.
2. `cd electron`.
3. `electron-builder`.
  - Or [specify platform and architecture](https://www.electron.build/cli) (e.g., `electron-builder --win --arm64`).
