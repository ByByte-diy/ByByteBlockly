var { electron, ipcMain, app, BrowserWindow, globalShortcut, dialog } = require('electron')
var { autoUpdater } = require("electron-updater")
var path = require('path')
var fs = require('fs')

function getStaticPath() {
	var segments = Array.prototype.slice.call(arguments)
	var candidates = [
		path.join(__dirname, 'dist', 'electron'),
		path.join(process.resourcesPath, 'dist', 'electron'),
	]
	var base = candidates.find(function (candidate) {
		return fs.existsSync(candidate)
	})
	if (!base) {
		throw new Error('Angular Electron build not found. Run npm run build:electron:dev first.')
	}
	return path.join.apply(path, [base].concat(segments))
}

function getWindowIcon() {
	var iconPath = path.join(__dirname, 'build', 'app.ico')
	return fs.existsSync(iconPath) ? iconPath : undefined
}

var mainWindow
autoUpdater.autoDownload = false
autoUpdater.logger = null
ipcMain.handle('app:getVersion', function () {
	return app.getVersion()
})
ipcMain.handle('app:getUserDataPath', function () {
	return app.getPath('userData')
})
ipcMain.on('window-control', function (event, action) {
	var targetWindow = BrowserWindow.fromWebContents(event.sender)
	if (!targetWindow) return
	switch (action) {
		case 'close':
			targetWindow.close()
			break
		case 'minimize':
			targetWindow.minimize()
			break
		case 'toggle-maximize':
			if (targetWindow.isMaximized()) {
				targetWindow.unmaximize()
			} else {
				targetWindow.maximize()
			}
			break
		default:
			break
	}
})
var defaultWebPreferences = {
	nodeIntegration: true,
	contextIsolation: false,
	enableRemoteModule: true,
	preload: undefined,
	sandbox: false
}
function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1240,
		height: 700,
		icon: getWindowIcon(),
		frame: false,
		movable: true,
		webPreferences: defaultWebPreferences
	})

	var indexPath = getStaticPath('index.html')
	console.log('Loading app from:', indexPath)

	if (process.platform == 'win32' && process.argv.length >= 2) {
		mainWindow.loadFile(indexPath, { query: { url: process.argv[1] } })
	} else {
		mainWindow.loadFile(indexPath)
	}

	// Open DevTools in development mode
	if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
		mainWindow.webContents.openDevTools()
	}

	mainWindow.webContents.on('did-fail-load', function (event, errorCode, errorDescription) {
		console.error('Failed to load:', errorCode, errorDescription)
	})

	mainWindow.webContents.on('console-message', function (event, level, message, line, sourceId) {
		console.log('Console:', message)
	})

	mainWindow.setMenu(null)
	mainWindow.on('closed', function () {
		mainWindow = null
	})
}
function open_console(mainWindow = BrowserWindow.getFocusedWindow()) {
	if (mainWindow) mainWindow.webContents.toggleDevTools()
}
function refresh(mainWindow = BrowserWindow.getFocusedWindow()) {
	if (mainWindow) mainWindow.webContents.reloadIgnoringCache()
}
app.on('ready', function () {
	createWindow()
	globalShortcut.register('F8', open_console)
	globalShortcut.register('F5', refresh)
})
app.on('activate', function () {
	if (mainWindow === null) createWindow()
})
app.on('window-all-closed', function () {
	globalShortcut.unregisterAll()
	if (process.platform !== 'darwin') app.quit()
})
ipcMain.on("version", function () {
	autoUpdater.checkForUpdates()
})
ipcMain.on('save-bin', function (event) {
	dialog.showSaveDialog(mainWindow, {
		title: 'Exporter les binaires',
		defaultPath: 'ByByte_hex',
		filters: [{ name: 'Binary', extensions: ['hex'] }]
	},
		function (filename) {
			event.sender.send('saved-bin', filename)
		})
})
ipcMain.on('save-ino', function (event) {
	dialog.showSaveDialog(mainWindow, {
		title: 'Save format .INO',
		defaultPath: 'ByByte_Arduino',
		filters: [{ name: 'Arduino', extensions: ['ino'] }]
	},
		function (filename) {
			event.sender.send('saved-ino', filename)
		})
})
ipcMain.on('save-py', function (event) {
	dialog.showSaveDialog(mainWindow, {
		title: 'Save format .PY',
		defaultPath: 'ByByte_python',
		filters: [{ name: 'python', extensions: ['py'] }]
	},
		function (filename) {
			event.sender.send('saved-py', filename)
		})
})
ipcMain.on('save-bloc', function (event) {
	dialog.showSaveDialog(mainWindow, {
		title: 'Save format .BLOC',
		defaultPath: 'ByByte_block',
		filters: [{ name: 'ByByteBlockly', extensions: ['bloc'] }]
	},
		function (filename) {
			event.sender.send('saved-bloc', filename)
		})
})
ipcMain.on('save-csv', function (event) {
	dialog.showSaveDialog(mainWindow, {
		title: 'Save format CSV',
		defaultPath: 'ByByte_csv',
		filters: [{ name: 'data', extensions: ['csv'] }]
	},
		function (filename) {
			event.sender.send('saved-csv', filename)
		})
})
autoUpdater.on('error', function (error) {
	dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString())
})
autoUpdater.on('update-available', function () {
	dialog.showMessageBox(mainWindow, {
		type: 'none',
		title: 'Update',
		message: "A new version is available, do you want to download and install it now?",
		buttons: ['Yes', 'No'],
		cancelId: 1,
		noLink: true
	},
		function (buttonIndex) {
			if (buttonIndex === 0) {
				autoUpdater.downloadUpdate()
			}
			else {
				return
			}
		})
})
autoUpdater.on('update-not-available', function () {
	dialog.showMessageBox(mainWindow, {
		title: 'Updated',
		message: 'Your version is up to date.'
	})
})
autoUpdater.on('update-downloaded', function () {
	dialog.showMessageBox(mainWindow, {
		title: 'Updated',
		message: "Download finished, the application will install then restart.."
	}, function () {
		setImmediate(function () {
			autoUpdater.quitAndInstall()
		})
	})
})
module.exports.open_console = open_console
module.exports.refresh = refresh
