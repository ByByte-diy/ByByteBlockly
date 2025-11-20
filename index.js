var { ipcRenderer, shell, clipboard } = require("electron")
var { exec } = require('child_process')
var { SerialPort } = require('serialport')
var fs = require('fs')
var path = require('path')
var appVersion = ''
var resourceRoot = (function() {
	var candidate = path.join(__dirname, 'compilation')
	if (fs.existsSync(candidate)) {
		return __dirname
	}
	if (process && process.resourcesPath) {
		return process.resourcesPath
	}
	return __dirname
})()

// Helper to get the app root directory (where config.json, index.js, etc. are located)
var appRoot = (function() {
	var locations = [
		// Development mode
		__dirname,
		// Production - app files are in resources/app
		process.resourcesPath ? path.join(process.resourcesPath, 'app') : null,
	].filter(Boolean)
	
	for (var i = 0; i < locations.length; i++) {
		var candidate = locations[i]
		if (fs.existsSync(path.join(candidate, 'config.json'))) {
			return candidate
		}
	}
	
	// Fallback
	return __dirname
})()

var configPath = path.join(appRoot, 'config.json')

var isWin = process.platform === 'win32'
function resolveResourcePath() {
	var segments = Array.prototype.slice.call(arguments)
	return path.join.apply(path, [resourceRoot].concat(segments))
}
var arduino_basepath = resolveResourcePath('compilation', 'arduino')
var arduino_ide_cmd = isWin ? "arduino-cli.exe" : "arduino-cli";
var python_basepath = resolveResourcePath('compilation', 'python')
var python_exec = isWin ? 'python' : 'python3'

function ensureDefaultPortOption(portserie) {
	if (!portserie.options.length || portserie.options[0].value !== 'com') {
		var defaultOpt = document.createElement('option')
		defaultOpt.value = "com"
		defaultOpt.text = Blockly.Msg.com1
		portserie.insertBefore(defaultOpt, portserie.firstChild)
	}
}

async function refreshSerialPorts(portserie, { autoSelect = false } = {}) {
	try {
		var previousValue = portserie.value
		var ports = await SerialPort.list()
		ensureDefaultPortOption(portserie)
		while (portserie.options.length > 1) {
			portserie.remove(1)
		}
		var matchedExistingSelection = false
		ports.forEach(function(port) {
			if (port.vendorId) {
				var opt = document.createElement('option')
				opt.value = port.path || port.comName
				opt.text = port.path || port.comName || port.friendlyName || port.manufacturer || 'Unknown'
				portserie.appendChild(opt)
				if (previousValue && opt.value === previousValue) {
					matchedExistingSelection = true
				}
			}
		})
		localStorage.setItem("nb_com", ports.length)
		if (matchedExistingSelection) {
			portserie.value = previousValue
			localStorage.setItem("com", previousValue)
		} else if (autoSelect && portserie.options.length > 1) {
			portserie.selectedIndex = 1
			localStorage.setItem("com", portserie.options[1].value)
		} else {
			if (portserie.selectedIndex > 0) {
				localStorage.setItem("com", portserie.options[portserie.selectedIndex].value)
			} else {
				portserie.selectedIndex = 0
				localStorage.setItem("com", "com")
			}
		}
	} catch (err) {
		console.error('Unable to list serial ports', err)
		localStorage.setItem("nb_com", 0)
	}
}

window.addEventListener('load', function load(event) {
	ipcRenderer.invoke('app:getVersion').then(function(version){
		appVersion = version
		document.getElementById('versionapp').textContent = " ByByte Blockly V" + appVersion
	})
	var quitDiv = '<button type="button" class="close" data-dismiss="modal" aria-label="Close">&#215;</button>'
	var checkBox = document.getElementById('verifyUpdate')
	var portserie = document.getElementById('portserie')
	var messageDiv = document.getElementById('messageDIV')
	localStorage.setItem("verif",false)
	var btnQuit = document.getElementById('btn_quit')
	var btnMin = document.getElementById('btn_min')
	var btnMax = document.getElementById('btn_max')
	if (btnQuit) {
		btnQuit.addEventListener('click', function(){
			ipcRenderer.send('window-control', 'close')
		})
	}
	if (btnMin) {
		btnMin.addEventListener('click', function(){
			ipcRenderer.send('window-control', 'minimize')
		})
	}
	if (btnMax) {
		btnMax.addEventListener('click', function(){
			ipcRenderer.send('window-control', 'toggle-maximize')
		})
	}
	function uploadOK(){
		messageDiv.style.color = '#009000'
		messageDiv.innerHTML = Blockly.Msg.upload + ': ✅ OK code uploaded' + quitDiv
		$('#message').modal('show');
		setTimeout(function() {
		$('#message').modal('hide');
		}, 3000);
	}
	$('#btn_forum').on('click', function(){
		shell.openExternal('https://discord.gg/t5wnTq3C')
	})
	$('#btn_site').on('click', function(){
		shell.openExternal('https://bybyte-diy.github.io/ByByteSite/')
	})
	$('#btn_contact').on('click', function(){
		shell.openExternal('https://github.com/ByByte-diy/ByByteBlockly/issues')
	})
	$('#portserie').on('mouseover', function(){
		refreshSerialPorts(portserie)
	})
	$('#portserie').on('change', function(){
		localStorage.setItem("com", portserie.value)
	})
	$('#btn_copy').on('click', function(){
		clipboard.writeText($('#pre_previewArduino').text())
	})
	$('#btn_bin').on('click', function(){
		if (localStorage.getItem('verif') == "false"){
			$("#message").modal("show")
			messageDiv.style.color = '#000000'
			messageDiv.innerHTML = Blockly.Msg.verif + quitDiv
			return
		}
		localStorage.setItem("verif",false)
		ipcRenderer.send('save-bin')
	})
	// Load config.json
	try {
		var configData = fs.readFileSync(configPath, 'utf8')
		var data = JSON.parse(configData)
		$.each(data, function(i, update){
			if (update=="true") {
				$('#verifyUpdate').prop('checked', true)
				checkBox.dispatchEvent(new Event('change'))
				ipcRenderer.send("version", "")
			} else {
				$('#verifyUpdate').prop('checked', false)
				checkBox.dispatchEvent(new Event('change'))
			}
		})
	} catch(err) {
		console.log('Error loading config:', err)
	}
	checkBox.addEventListener('change', function(event){
		if (event.target.checked) {
			fs.writeFile(configPath, '{ "update": "true" }', function(err){
				if (err) return console.log(err)
			})
		} else {
			fs.writeFile(configPath, '{ "update": "false" }', function(err){
				if (err) return console.log(err)
			})
		}
	})
	refreshSerialPorts(portserie, { autoSelect: true })
	$('#btn_version').on('click', function(){
		$('#aboutModal').modal('hide')
		ipcRenderer.send("version", "")
	})
	$('#btn_term').on('click', function(){
		if (portserie.value=="com"){
			$("#message").modal("show")
			messageDiv.style.color = '#ff0000'
			messageDiv.innerHTML = Blockly.Msg.com2 + quitDiv
			return
		}
		if (localStorage.getItem("prog") == "python") { ipcRenderer.send("repl", "") } else { ipcRenderer.send("prompt", "") }
	})
	$('#btn_factory').on('click', function(){
		ipcRenderer.send("factory", "")
	})
	$('#btn_verify').on('click', function(){
		if (localStorage.getItem('content') == "off") {
			var data = editor.getValue()
		} else {
			var data = $('#pre_previewArduino').text()
		}
		var carte = localStorage.getItem('card')
		var prog = localStorage.getItem('prog')
		var com = portserie.value
		messageDiv.style.color = '#000000'
		messageDiv.innerHTML = Blockly.Msg.check + '<i class="fa fa-spinner fa-pulse fa-1_5x fa-fw"></i>'

		if (prog == "python") {
			fs.writeFile(path.join(python_basepath, 'py', 'sketch.py'), data, function(err){
				if (err) return console.log(err)
			})
			exec(`${python_exec} -m pyflakes ./py/sketch.py`, {cwd: python_basepath}, function(err, stdout, stderr){
				if (stderr) {
					rech=RegExp('token')
					if (rech.test(stderr)){
						messageDiv.style.color = '#ff0000'
						messageDiv.innerHTML = Blockly.Msg.error + quitDiv
					} else {
						messageDiv.style.color = '#ff0000'
						messageDiv.innerHTML = err.toString() + quitDiv
					}
					return
				}
				messageDiv.style.color = '#009000'
				messageDiv.innerHTML = Blockly.Msg.check + ':✅ OK' + quitDiv
			})
		} else {
			//fs.writeFile('./compilation/arduino/ino/sketch.ino', data, function(err){

		fs.writeFile(`${arduino_basepath}/sketch/sketch.ino`, data, function(err){

			if (err) return console.log(err)
		})

		var upload_arg = window.profile[carte].upload_arg
		var cmd = `${arduino_ide_cmd} compile --fqbn ` + upload_arg +' sketch/sketch.ino'

		/*
		   exec( cmd, {cwd: arduino_basepath}, function(err, stdout, stderr){
			//exec('verify.bat ' + carte, {cwd:'./compilation/arduino'}, function(err, stdout, stderr){
				if (stderr) {
					rech=RegExp('token')
					if (rech.test(stderr)){
						messageDiv.style.color = '#ff0000'
						messageDiv.innerHTML = Blockly.Msg.error + quitDiv
					} else {
						messageDiv.style.color = '#ff0000'
						messageDiv.innerHTML = err.toString() + quitDiv
					}
					return
				}

				messageDiv.style.color = '#009000'
				messageDiv.innerHTML = Blockly.Msg.check + ': OK' + quitDiv
			}) */

			exec(cmd , {cwd: arduino_basepath} , (error, stdout, stderr) => {
			if (error) {

						messageDiv.style.color = '#ff0000'
						messageDiv.innerHTML = error.toString() + quitDiv
						return
						}

			    messageDiv.style.color = '#009000'
				messageDiv.innerHTML = Blockly.Msg.check + ': ✅ Code is ready to upload' + quitDiv
				$('#message').modal('show');
				setTimeout(function() {
    			$('#message').modal('hide');
				}, 3000);

		    })


		}
		localStorage.setItem("verif",true)
	})
	$('#btn_flash').on('click', function(){

		var data = $('#pre_previewArduino').text()
		var carte = localStorage.getItem('card')
		var prog = profile[carte].prog
		var speed = profile[carte].speed
		var cpu = profile[carte].cpu
		var com = portserie.value
		var upload_arg = window.profile[carte].upload_arg

		if ( com == "com" ){
			messageDiv.style.color = '#ff0000'
			messageDiv.innerHTML = Blockly.Msg.com2 + quitDiv
			return
		}
		if ( localStorage.getItem('verif') == "false" ){
			messageDiv.style.color = '#000000'
			messageDiv.innerHTML = Blockly.Msg.check + '<i class="fa fa-spinner fa-pulse fa-1_5x fa-fw"></i>'
			//fs.writeFile('./compilation/arduino/ino/sketch.ino', data, function(err){
			fs.writeFile(`${arduino_basepath}/sketch/sketch.ino`, data, function(err){

				if (err) return console.log(err)
			})


			var cmd = `${arduino_ide_cmd} compile --fqbn ` + upload_arg +' sketch/sketch.ino'


			exec(cmd , {cwd: `${arduino_basepath}`} , (error, stdout, stderr) => {
			if (error) {

						messageDiv.style.color = '#ff0000'
						messageDiv.innerHTML = error.toString() + quitDiv
						return
						}

			    messageDiv.style.color = '#009000'
				messageDiv.innerHTML = Blockly.Msg.check + ': ✅ OK' + quitDiv

			/*
		    exec( cmd, {cwd: arduino_basepath}, function(err, stdout, stderr){
			//exec('verify.bat ' + carte, {cwd:'./compilation/arduino'}, function(err, stdout, stderr){
				if (stderr) {
					rech=RegExp('token')
					if (rech.test(stderr)){
						messageDiv.style.color = '#ff0000'
						messageDiv.innerHTML = Blockly.Msg.error + quitDiv
					} else {
						messageDiv.style.color = '#ff0000'
						messageDiv.innerHTML = err.toString() + quitDiv
					}
					return
				}
				messageDiv.style.color = '#009000'
				messageDiv.innerHTML = Blockly.Msg.check + ': OK' + quitDiv */

			messageDiv.style.color = '#000000'
			messageDiv.innerHTML = Blockly.Msg.upload + '<i class="fa fa-spinner fa-pulse fa-1_5x fa-fw"></i>'

			cmd = `${arduino_ide_cmd} upload --port `+portserie.value +' --fqbn ' + upload_arg +' sketch/sketch.ino'
		    exec( cmd, {cwd:`${arduino_basepath}`}, function(err, stdout, stderr){
			//exec('flash.bat ' + cpu + ' ' + prog + ' '+ com + ' ' + speed, {cwd: './compilation/arduino'} , function(err, stdout, stderr){
				if (err) {
					messageDiv.style.color = '#ff0000'
					messageDiv.innerHTML = err.toString() + quitDiv
					return
				}
				uploadOK()
			}) })
			localStorage.setItem("verif",false)
			return
		}
		messageDiv.style.color = '#000000'
		messageDiv.innerHTML = Blockly.Msg.upload + '<i class="fa fa-spinner fa-pulse fa-1_5x fa-fw"></i>'
		if ( prog == "python" ) {
			if ( cpu == "cortexM0" ) {
				var cheminFirmware = path.join(python_basepath, 'firmware.hex')
				var fullHexStr = ""
				exec('wmic logicaldisk get volumename', function(err, stdout){
					if (err) return console.log(err)
					localStorage.setItem("volumename", stdout.split('\r\r\n').map(value => value.trim()))
				})
				exec('wmic logicaldisk get name', function(err, stdout){
					if (err) return console.log(err)
					localStorage.setItem("name", stdout.split('\r\r\n').map(value => value.trim()))
				})
				var volume = localStorage.getItem("volumename")
				var drive = localStorage.getItem("name")
				var volumeN = volume.split(',')
				var driveN = drive.split(',')
				var count = volumeN.length
				var disk = ""
				for (var i = 0 ; i < count ; i++) {
					if (volumeN[i]=="MICROBIT") disk = driveN[i]
				}
				if (disk!="") {
					fs.readFile(cheminFirmware, function(err, firmware){
						firmware = String(firmware)
						fullHexStr = upyhex.injectPyStrIntoIntelHex(firmware, data)
						fs.writeFile(disk + '\sketch.hex', fullHexStr, function(err){
							if (err) {
								messageDiv.style.color = '#ff0000'
								messageDiv.innerHTML = err.toString() + quitDiv
							}
						})
					})
					setTimeout(uploadOK, 7000)
				} else {
					messageDiv.style.color = '#000000'
					messageDiv.innerHTML = 'Connect micro:bit!' + quitDiv
				}
			} else {


				exec( `${python_exec} -m ampy -p ${com} -b 115200 -d 1 run --no-output ./py/sketch.py`, {cwd: python_basepath} , function(err, stdout, stderr){
					if (err) {
						messageDiv.style.color = '#ff0000'
						messageDiv.innerHTML = err.toString() + quitDiv
						return
					}
					uploadOK()
				})
			}
		} else {


			cmd = `${arduino_ide_cmd} upload --port `+portserie.value +' --fqbn ' + upload_arg +' sketch/sketch.ino'
		    exec( cmd, {cwd:`${arduino_basepath}`}, function(err, stdout, stderr){
			//exec('flash.bat ' + cpu + ' ' + prog + ' '+ com + ' ' + speed, {cwd: './compilation/arduino'} , function(err, stdout, stderr){
				if (err) {
					messageDiv.style.color = '#ff0000'
					messageDiv.innerHTML = err.toString() + quitDiv
					return
				}
				uploadOK()
			})
		}
		localStorage.setItem("verif",false)
	})
	$('#btn_saveino').on('click', function(){
		if (localStorage.getItem("prog") == "python") { ipcRenderer.send('save-py') } else { ipcRenderer.send('save-ino') }
	})
	$('#btn_saveXML').on('click', function(){
		if (localStorage.getItem("content") == "on") {
			ipcRenderer.send('save-bloc')
		} else {
			if (localStorage.getItem("prog") == "python") { ipcRenderer.send('save-py') } else { ipcRenderer.send('save-ino') }
		}
	})
	ipcRenderer.on('saved-ino', function(event, path){
		var code = $('#pre_previewArduino').text()
		if (path === null) {
			return
		} else {
			fs.writeFile(path, code, function(err){
				if (err) return console.log(err)
			})
		}
	})
	ipcRenderer.on('saved-py', function(event, path){
		var code = $('#pre_previewArduino').text()
		if (path === null) {
			return
		} else {
			fs.writeFile(path, code, function(err){
				if (err) return console.log(err)
			})
		}
	})
	ipcRenderer.on('saved-bloc', function(event, path){
		if (path === null) {
			return
		} else {
			var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace)
			var toolbox = localStorage.getItem("toolbox")
			if (!toolbox) {
				toolbox = $("#toolboxes").val()
			}
			if (toolbox) {
				var newel = document.createElement("toolbox")
				newel.appendChild(document.createTextNode(toolbox))
				xml.insertBefore(newel, xml.childNodes[0])
			}
			var toolboxids = localStorage.getItem("toolboxids")
			if (toolboxids === undefined || toolboxids === "") {
				if ($('#defaultCategories').length) {
					toolboxids = $('#defaultCategories').html()
				}
			}
			var code = Blockly.Xml.domToPrettyText(xml)
			fs.writeFile(path, code, function(err){
				if (err) return console.log(err)
			})
		}
	})
	ipcRenderer.on('saved-bin', function(event, path){
		if (path === null) {
			return
		} else {
			var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace)
			var toolbox = localStorage.getItem("toolbox")
			if (!toolbox) {
				toolbox = $("#toolboxes").val()
			}
			if (toolbox) {
				var newel = document.createElement("toolbox")
				newel.appendChild(document.createTextNode(toolbox))
				xml.insertBefore(newel, xml.childNodes[0])
			}
			var toolboxids = localStorage.getItem("toolboxids")
			if (toolboxids === undefined || toolboxids === "") {
				if ($('#defaultCategories').length) {
					toolboxids = $('#defaultCategories').html()
				}
			}
			var code = Blockly.Xml.domToPrettyText(xml)
			var res = path.split(".")
			fs.writeFile(res[0]+'.bloc', code, function(err){
				if (err) return console.log(err)
			})
			fs.copyFile(`${arduino_basepath}/build/sketch.ino.with_bootloader.hex`, res[0]+'_with_bootloader.hex', (err) => {if (err) throw err})
			fs.copyFile(`${arduino_basepath}/build/sketch.ino.hex`, res[0]+'.hex', (err) => {if (err) throw err})
			fs.copyFile(`${arduino_basepath}/ino/sketch.ino`, res[0]+'.ino', (err) => {if (err) throw err})
		}
	})
})
