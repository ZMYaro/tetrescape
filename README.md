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

* [AdMob Plus](https://admob-plus.github.io)
* [Controller.js](https://samiare.github.io/Controller.js/)
* [Cordova](https://cordova.apache.org)
* [Cordova in-app purchases plugin](https://github.com/AlexDisler/cordova-plugin-inapppurchase)
* [Electron](https://www.electronjs.org)
* [Freesound](https://freesound.org)
* [Hammer.js](https://hammerjs.github.io)
* [MaterialZ](https://materialz.dev)
* [Erik Möller and Paul Irish's requestAnimationFrame polyfill](https://gist.github.com/paulirish/1579671)


## Open-source _TetrEscape_ code

This code may be used as an educational reference, but may not be copied or redistributed without permission.  This project is not seeking and does not promise credit for unsolicited input or contributions.


## Running as a web app

Prereq: `npm install -g http-server` (or your preferred local HTTP server)
1. `cd game`
2. `http-server` (or start your preferred HTTP server)
3. Navigate to `http://localhost:8080` (or whichever port you specified if not 8080) in your browser.


## Building as a desktop app

Prereq: `npm install -g electron-builder`
1. Navigate to the `electron` directory (`cd electron`).
2. Symlink `game` (`ln -s ../game` or `mklink /D game ..\game`).
3. Build (`electron-builder`).
  - Or [specify platform and architecture](https://www.electron.build/cli) (e.g., `electron-builder --win --arm64`).


## Building as an Android app

Prereqs: [Cordova Android platform guide](https://cordova.apache.org/docs/en/11.x/guide/platforms/android/index.html)
1. Navigate to the `cordova` directory (`cd cordova`).
2. Install dependencies (`npm install`).
3. Set up Android project (`cordova platform add android`).
4. Symlink game directory as `www` (`ln -s ../game ./www` or `mklink /D www ..\game`)
5. Uncomment loading the Cordova script in `www/index.html` (`<script type="text/javascript" src="cordova.js"></script>`).
6. Add Google Play billing key to `www/manifest.json`.
  - Retrieve from Google Play Console → App → Monetization setup.
7. Add AdMob app ID to `platforms/android/app/src/main/AndroidManifest.xml` (`<meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX" />`).
  - Retrieve from AdMob → Apps → TetrEscape → Ad units.
8. Build (`cordova build android`).
  - To build for Google Play release, `cordova build android --release -- --keystore=path/to/android_keystore.keystore --storePassword=yourpassword --alias=keystore_name --password=yourpassword --packageType=bundle`.
  - To build and run on a connected device or emulator, run `cordova run` instead of `cordova build`.
