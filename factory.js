const { ipcRenderer } = require('electron')

function sendWindowCommand(command) {
	ipcRenderer.send('window-control', command)
}

window.addEventListener('load', function load(event) {
	document.getElementById('btn_quit').onclick = function(event) {
		sendWindowCommand('close')
	}
	document.getElementById('btn_max').onclick = function(event) {
		sendWindowCommand('toggle-maximize')
	}
	document.getElementById('btn_min').onclick = function(event) {
		sendWindowCommand('minimize')
	}
})