import { IBoardProfile } from '../types/device-board-profile.type';

/**
 * Standard Serial port baud rates
 */
const STANDARD_SERIAL_SPEEDS: [string, string][] = [
  ['300', '300'], ['600', '600'], ['1200', '1200'],
  ['2400', '2400'], ['4800', '4800'], ['9600', '9600'],
  ['14400', '14400'], ['19200', '19200'], ['28800', '28800'],
  ['31250', '31250'], ['38400', '38400'], ['57600', '57600'],
  ['115200', '115200']
];

/**
 * Standard Rx/Tx Serial port
 */
const STANDARD_SERIAL_PIN: [string, string][] = [["Rx/Tx", "0"]];

/**
 * Configurations of all supported boards
 */
export const BOARD_PROFILES: Record<string, IBoardProfile> = {
  uno: {
    id: 'uno',
    description: "Arduino Uno",
    BUILTIN_LED: 13,
    picture: "media/uno.jpg",
    dropdownAllPins: [["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"], ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"], ["A6", "A6"], ["A7", "A7"]],
    dropdownDigital: [["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
    dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"]],
    dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"], ["A6", "A6"], ["A7", "A7"]],
    interrupt: [["2", "2"], ["3", "3"]],
    serial: [...STANDARD_SERIAL_SPEEDS],
    serialPin: [...STANDARD_SERIAL_PIN],
    build: "uno",
    upload_arg: "arduino:avr:uno",
    cpu: "atmega328p",
    speed: "115200",
    prog: "arduino",
    usb: "USB B",
    voltage: "5V",
    inout: "18"
  },
  
  nano: {
    id: 'nano',
    description: "Arduino Nano (Old Bootloader)",
    BUILTIN_LED: 13,
    picture: "media/nano.jpg",
    dropdownAllPins: [["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"], ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"], ["A6", "A6"], ["A7", "A7"]],
    dropdownDigital: [["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
    dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"]],
    dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"], ["A6", "A6"], ["A7", "A7"]],
    interrupt: [["2", "2"], ["3", "3"]],
    serial: [...STANDARD_SERIAL_SPEEDS],
    serialPin: [...STANDARD_SERIAL_PIN],
    build: "nano",
    upload_arg: "arduino:avr:nano:cpu=atmega328old",
    cpu: "atmega328p",
    speed: "57600",
    prog: "arduino",
    usb: "mini USB",
    voltage: "5V",
    inout: "20"
  },
  
  nanooptiboot: {
    id: 'nanooptiboot',
    description: "Arduino Nano",
    BUILTIN_LED: 13,
    picture: "media/nano_optiboot.jpg",
    dropdownAllPins: [["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"], ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"], ["A6", "A6"], ["A7", "A7"]],
    dropdownDigital: [["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
    dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"]],
    dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"], ["A6", "A6"], ["A7", "A7"]],
    interrupt: [["2", "2"], ["3", "3"]],
    serial: [...STANDARD_SERIAL_SPEEDS],
    serialPin: [...STANDARD_SERIAL_PIN],
    build: "nanooptiboot",
    upload_arg: "arduino:avr:nano",
    cpu: "atmega328p",
    speed: "115200",
    prog: "arduino",
    usb: "mini USB",
    voltage: "5V",
    inout: "20"
  },

  mega: {
    id: 'mega',
    description: "Arduino Méga 2560 / ADK",
    BUILTIN_LED: 13,
    picture: "media/mega.jpg",
    dropdownAllPins: [["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"], ["14","14"], ["15","15"], ["16","16"], ["17","17"], ["18","18"], ["19","19"], ["20","20"], ["21","21"], ["22","22"], ["23","23"], ["24","24"], ["25","25"], ["26","26"], ["27","27"], ["28","28"], ["29","29"], ["30","30"], ["31","31"], ["32","32"], ["33","33"], ["34","34"], ["35","35"], ["36","36"], ["37","37"], ["38","38"], ["39","39"], ["40","40"], ["41","41"], ["42","42"], ["43","43"], ["44","44"], ["45","45"], ["46","46"], ["47","47"], ["48","48"], ["49","49"], ["50","50"], ["51","51"], ["52","52"], ["53","53"], ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"], ["A6", "A6"], ["A7", "A7"], ["A8", "A8"], ["A9", "A9"], ["A10", "A10"], ["A11", "A11"], ["A12", "A12"], ["A13", "A13"], ["A14", "A14"], ["A15", "A15"]],
    dropdownDigital: [["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"], ["14","14"], ["15","15"], ["16","16"], ["17","17"], ["18","18"], ["19","19"], ["20","20"], ["21","21"], ["22","22"], ["23","23"], ["24","24"], ["25","25"], ["26","26"], ["27","27"], ["28","28"], ["29","29"], ["30","30"], ["31","31"], ["32","32"], ["33","33"], ["34","34"], ["35","35"], ["36","36"], ["37","37"], ["38","38"], ["39","39"], ["40","40"], ["41","41"], ["42","42"], ["43","43"], ["44","44"], ["45","45"], ["46","46"], ["47","47"], ["48","48"], ["49","49"], ["50","50"], ["51","51"], ["52","52"], ["53","53"]],
    dropdownPWM: [["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"], ["44", "44"], ["45", "45"], ["46", "46"]],
    dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"], ["A6", "A6"], ["A7", "A7"], ["A8", "A8"], ["A9", "A9"], ["A10", "A10"], ["A11", "A11"], ["A12", "A12"], ["A13", "A13"], ["A14", "A14"], ["A15", "A15"]],
    interrupt: [["21", "21"], ["20", "20"], ["19", "19"], ["18", "18"], ["6", "6"], ["7", "7"]],
    serial: [...STANDARD_SERIAL_SPEEDS],
    serialPin: [["Rx/Tx", "0"], ["Rx1/Tx1", "19"], ["Rx2/Tx2", "17"], ["Rx3/Tx3", "15"]],
    build: "mega",
    upload_arg: "arduino:avr:mega:cpu=atmega2560",
    cpu: "atmega2560",
    speed: "115200",
    prog: "arduino",
    usb: "USB B",
    voltage: "5V",
    inout: "70"
  },

  leonardo: {
    id: 'leonardo',
    description: "Arduino Léonardo",
    BUILTIN_LED: 13,
    picture: "media/leonardo.jpg",
    dropdownAllPins: [["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"], ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]],
    dropdownDigital: [["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
    dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"], ["13", "13"]],
    dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]],
    interrupt: [["3", "3"], ["2", "2"], ["0", "0"], ["1", "1"], ["7", "7"]],
    serial: [...STANDARD_SERIAL_SPEEDS],
    serialPin: [...STANDARD_SERIAL_PIN],
    build: "leonardo",
    upload_arg: "arduino:avr:leonardo",
    cpu: "atmega32u4",
    speed: "57600",
    prog: "arduino",
    usb: "micro USB",
    voltage: "5V",
    inout: "20"
  },

  micro: {
    id: 'micro',
    description: "Arduino Micro",
    BUILTIN_LED: 13,
    picture: "media/micro.jpg",
    dropdownAllPins: [["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"], ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]],
    dropdownDigital: [["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],
    dropdownPWM: [["3", "3"], ["5", "5"], ["6", "6"], ["9", "9"], ["10", "10"], ["11", "11"], ["13", "13"]],
    dropdownAnalog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"], ["A6(4)", "4"], ["A7(6)", "6"], ["A8(8)", "8"], ["A9(9)", "9"], ["A10(10)", "10"], ["A11(12)", "12"]],
    interrupt: [["3", "3"], ["2", "2"], ["0", "0"], ["1", "1"], ["7", "7"]],
    serial: [...STANDARD_SERIAL_SPEEDS],
    serialPin: [...STANDARD_SERIAL_PIN],
    build: "micro",
    upload_arg: "arduino:avr:micro",
    cpu: "atmega32u4",
    speed: "57600",
    prog: "arduino",
    usb: "micro USB",
    voltage: "5V",
    inout: "20"
  },

  // ESP плати
  esp32: {
    id: 'esp32',
    description: "ESP32",
    BUILTIN_LED: 2,
    picture: "media/esp32.jpg",
    dropdownAllPins: [["0", "0"], ["2", "2"], ["4", "4"], ["5", "5"], ["12", "12"], ["13", "13"], ["14", "14"], ["15", "15"]],
    dropdownDigital: [["0", "0"], ["2", "2"], ["4", "4"], ["5", "5"], ["12", "12"], ["13", "13"], ["14", "14"], ["15", "15"]],
    dropdownPWM: [["0", "0"], ["2", "2"], ["4", "4"], ["5", "5"], ["12", "12"], ["13", "13"], ["14", "14"], ["15", "15"]],
    dropdownAnalog: [["A0", "A0"]],
    interrupt: [["0", "0"], ["2", "2"], ["4", "4"], ["5", "5"], ["12", "12"], ["13", "13"], ["14", "14"], ["15", "15"]],
    serial: [...STANDARD_SERIAL_SPEEDS],
    serialPin: [...STANDARD_SERIAL_PIN],
    build: "",
    upload_arg: "esp32:esp32:esp32",
    cpu: "esp32",
    speed: "115200",
    prog: "python",
    usb: "micro USB",
    voltage: "3,3V",
    inout: "34"
  },

  esp8266: {
    id: 'esp8266',
    description: "ESP8266",
    BUILTIN_LED: 2,
    picture: "media/esp8266.jpg",
    dropdownAllPins: [["0", "0"], ["2", "2"], ["4", "4"], ["5", "5"], ["12", "12"], ["13", "13"], ["14", "14"], ["15", "15"]],
    dropdownDigital: [["0", "0"], ["2", "2"], ["4", "4"], ["5", "5"], ["12", "12"], ["13", "13"], ["14", "14"], ["15", "15"]],
    dropdownPWM: [["0", "0"], ["2", "2"], ["4", "4"], ["5", "5"], ["12", "12"], ["13", "13"], ["14", "14"], ["15", "15"]],
    dropdownAnalog: [["A0", "A0"]],
    interrupt: [["0", "0"], ["2", "2"], ["4", "4"], ["5", "5"], ["12", "12"], ["13", "13"], ["14", "14"], ["15", "15"]],
    serial: [...STANDARD_SERIAL_SPEEDS],
    serialPin: [...STANDARD_SERIAL_PIN],
    build: "",
    upload_arg: "esp8266:esp8266",
    cpu: "esp8266",
    speed: "115200",
    prog: "python",
    usb: "micro USB",
    voltage: "3,3V",
    inout: "11"
  }
};

/**
 * Helper function to get all board IDs
 */
export function getAllBoardIds(): string[] {
  return Object.keys(BOARD_PROFILES);
}

/**
 * Helper function to check if a board exists
 */
export function boardProfileExists(boardId: string): boolean {
  return boardId in BOARD_PROFILES;
}

/**
 * Fallback board profile (Arduino Uno) for cases when the board is not found
 */
export const DEFAULT_BOARD_PROFILE = BOARD_PROFILES.uno;

