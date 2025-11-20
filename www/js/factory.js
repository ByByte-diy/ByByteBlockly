// Перевірка чи ми в Electron або браузері
var isElectron = typeof require !== 'undefined' && typeof process !== 'undefined' && process.versions && process.versions.electron;

var ipcRenderer;
if (isElectron) {
	ipcRenderer = require('electron').ipcRenderer;
} else {
	// Браузер - створюємо заглушку
	ipcRenderer = {
		send: function() {}
	};
}

function sendWindowCommand(command) {
	if (isElectron && ipcRenderer) {
		ipcRenderer.send('window-control', command);
	} else {
		// В браузері просто закриваємо вікно
		if (command === 'close') {
			window.close();
		}
	}
}

window.addEventListener('load', function load(event) {
	var btnQuit = document.getElementById('btn_quit');
	var btnMax = document.getElementById('btn_max');
	var btnMin = document.getElementById('btn_min');
	
	if (btnQuit) {
		btnQuit.onclick = function(event) {
			sendWindowCommand('close');
		};
	}
	if (btnMax) {
		btnMax.onclick = function(event) {
			sendWindowCommand('toggle-maximize');
		};
	}
	if (btnMin) {
		btnMin.onclick = function(event) {
			sendWindowCommand('minimize');
		};
	}
	
	// В браузері приховуємо кнопки керування вікном
	if (!isElectron) {
		if (btnQuit) btnQuit.style.display = 'none';
		if (btnMax) btnMax.style.display = 'none';
		if (btnMin) btnMin.style.display = 'none';
	}
})