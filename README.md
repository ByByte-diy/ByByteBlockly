[![License: GPL v2](https://img.shields.io/badge/License-GPL%20v2-blue.svg)](https://github.com/ByByte-diy/ByByteBlockly/blob/main/LICENSE)
[![Version](https://img.shields.io/badge/version-0.0.0-orange.svg)](https://github.com/ByByte-diy/ByByteBlockly/releases)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)](https://github.com/ByByte-diy/ByByteBlockly/releases)
[![Node.js](https://img.shields.io/badge/Node.js-22.0%2B-green.svg)](https://nodejs.org/)
[![Electron](https://img.shields.io/badge/Electron-39.2.3-blue.svg)](https://www.electronjs.org/)
[![Arduino](https://img.shields.io/badge/Arduino-Compatible-red.svg)](https://www.arduino.cc/)
[![Blockly](https://img.shields.io/badge/Blockly-Visual%20Programming-yellow.svg)](https://developers.google.com/blockly)
[![STEM](https://img.shields.io/badge/STEM-Education-purple.svg)](https://github.com/ByByte-diy)

# ByByte Blockly

This is a free and open source visual programming language based on Blockly from Google & MIT, to generate C/C++ code, 
compile and upload to multiple options of microcontrollers. Compatible with 
[ByByte DIY robots](https://github.com/ByByte-diy), Arduino, ESP8266 and ESP32 related boards.

## How to Use

1. Open any example.
2. Connect your microcontroller.
3. Select your board and the USB port where it is connected.
4. Click upload and the code will be automatically compiled, but it will take some time.

Drag, drop, connect, mix, play and create your own codes.

## Help us add your Language

Leave your mark by translating Blockly, you are welcome to contribute with any languages you know, by fixing mistakes you see, it will 
benefit you and everyone in your community.

The more people helping to translate the better, it is important to translate while understanding the context and what 
is the robot actually doing to be accurate.

1. Go to the [lang folder](https://github.com/ByByte-diy/ByByteBlockly/tree/master/www/lang) and duplicate the Arduino_en.js 
Blockly_en.js and msg_en.js files from English
2. Rename them according to your ISO language code, for example fr is for French, so the files are renamed like this:
Arduino_fr.js Blockly_fr.js and msg_fr.js  
3. Edit the files with any code editor software like [Visual Studio Code](https://code.visualstudio.com/) translating 
only the English part after = in between the quotes "" in visual studio is the text in red.
4. Then open a pull request [here in github](https://github.com/ByByte-diy/ByByteBlockly/pulls) or just attach the files in a
[new issue](https://github.com/ByByte-diy/ByByteBlockly/issues).

## How to run project

You will need to have Node.js installed on your computer. Recommended version is 22.0 or higher.

1. Clone or download the source code.
```bash
git clone https://github.com/ByByte-diy/ByByteBlockly.git
```

2. Navigate to the project folder
```bash
cd ByByteBlockly
```

3. Install required tools (optional, for native module building).
```bash
npm install -g node-gyp
```

4. Install required node modules. Execute following on the source code directory
```bash
npm install
```

5. Install Arduino CLI
Get arduino-cli from https://github.com/arduino/arduino-cli/releases 
and place it under compilation/arduino, or use the installation script:
```bash
cd compilation/arduino
curl -fsSL https://raw.githubusercontent.com/arduino/arduino-cli/master/install.sh | sh
mv bin/arduino-cli ./
rm -rf bin
```

6. Execute following to install required Arduino cores
```bash
cd compilation/arduino
arduino-cli core update-index
arduino-cli core install arduino:avr@1.8.3
arduino-cli core install arduino:samd@1.8.9
arduino-cli core install arduino:megaavr@1.8.6
arduino-cli core install esp8266:esp8266@2.7.4
arduino-cli core install esp32:esp32@1.0.4
arduino-cli core update-index
```

7. Build the application
You can use electron-builder to pack your electron app in zip, nsis (Installer), portable (App without installation) formats.
```bash
cd ../../     # go back to the repository's top directory
npm run compiler          # Windows 32-bit
npm run compilerWinX64    # Windows 64-bit
npm run compiler:mac      # macOS
npm run compiler:linux:x64 # Linux 64-bit
```

## How to Contribute

Contributing to this software is warmly welcomed. There are several ways you can contribute to this project:
1. Test and report. Let us know if there is something missing in the issue section.
2. Help us solve [current issues or other bugs](https://github.com/ByByte-diy/ByByteBlockly/issues).
3. Suggest or request new blocks.

You can do this basically by [forking](https://help.github.com/en/articles/fork-a-repo), committing modifications and 
then opening a [pull request](https://help.github.com/en/articles/about-pull-requests). Please explain the changes and
make sure they have been tested.

Just make sure to keep consistency in the naming and make a record of the change or improvement made.

Welcome to the ByByte DIY team!
Thanks for your contribution.

## About ByByte.DIY

ByByte.DIY is an open-source STEM robotics platform designed for educational purposes. This project is part of the ByByte ecosystem:

- [ByByteMega](https://github.com/ByByte-diy/ByByteMega) - Arduino-based robotic car platform
- [ByByteNano](https://github.com/ByByte-diy/ByByteNano) - Simplified robot platform based on Arduino Nano
- [ByByteLib](https://github.com/ByByte-diy/ByByteLib) - Simple and consistent API to control ByByte robots
- [ByByteLessons](https://github.com/ByByte-diy/ByByteLessons) - Open educational lessons for STEM Robotics

Visit [ByByte-diy on GitHub](https://github.com/ByByte-diy) for more information.

## Attribution

This project is based on the original [Otto Blockly](https://github.com/OttoDIY/blockly) project. Special thanks to the Otto DIY team for their excellent work and open-source contribution.

Thanks to all these great people and open projects, it has been possible to make this software:

### Original Project
- [Otto DIY Blockly](https://github.com/OttoDIY/blockly) - Original visual programming environment for Otto robots

### Core Technologies
- [Blockly](https://developers.google.com/blockly) - Visual programming editor
- [Blockly@rduino](https://github.com/technologiescollege/Blockly-at-rduino)
- [Blocklino](https://github.com/fontainejp/blocklino/)
- [BlocklyDuino](https://github.com/BlocklyDuino/BlocklyDuino)
- [Blocklyduino for MRTduino](https://logix5.com/Blockyduino-para-MRTDuino/)
- [Ardublockly](https://github.com/carlosperate/ardublockly)
- [masayloBlockly](https://github.com/agomezgar/masayloBlockly)

### Tools and Libraries
- [Node.js](https://nodejs.org/)
- [Bootstrap](http://getbootstrap.com)
- [Font Awesome](http://fontawesome.io)
- [jQuery](https://jquery.com)
- [Electron](https://electronjs.org/)
- [electron-builder](https://github.com/electron-userland/electron-builder)
- [Serialport](https://github.com/node-serialport/node-serialport)
- [arduino-builder](https://github.com/arduino/arduino-builder)
- [arduino-cli](https://github.com/arduino/arduino-cli)
- [winAVR](https://sourceforge.net/projects/winavr)
- [Avrdude](http://www.nongnu.org/avrdude)
- [microbit](https://microbit.org/)
- [micropython](https://wiki.mchobby.be/index.php?title=MicroPython-Accueil)
- [Python](https://docs.python.org/)
- [ampy](https://github.com/pycampers/ampy)
- [pyflakes](https://github.com/PyCQA/pyflakes)
- [NSIS](https://sourceforge.net/projects/nsis)
- [Escornabot](http://escornabot.com)

## License

This project is licensed under the GPL-2.0 License - see the [LICENSE](LICENSE) file for details.
