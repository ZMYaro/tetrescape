'use strict';

const electron = require('electron'),
	app = electron.app,
	screen = electron.screen,
	BrowserWindow = electron.BrowserWindow,
	path = require('path'),
	url = require('url');

const DEFAULT_WIDTH = 800,
	DEFAULT_HEIGHT = 500,
	MIN_DIM = 360,
	DEFAULT_SCREEN_AMOUNT = 0.8;

function createWindow() {
	var screenDims = screen.getPrimaryDisplay().workAreaSize,
		winWidth = Math.max(DEFAULT_WIDTH, Math.round(screenDims.width * DEFAULT_SCREEN_AMOUNT)),
		winHeight = Math.max(DEFAULT_HEIGHT, Math.round(screenDims.height * DEFAULT_SCREEN_AMOUNT));
	
	var win = new BrowserWindow({
		width: winWidth,
		height: winHeight,
		minWidth: MIN_DIM,
		minHeight: MIN_DIM,
		icon: path.join(__dirname, 'game', 'images', 'logo', 'favicon.ico')
	});
	win.setMenu(null);
	win.loadURL(url.format({
		pathname: path.join(__dirname, 'game', 'index.html'),
		protocol: 'file:',
		slashes: true
	}));
}

app.on('ready', () => {
	createWindow();
	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
