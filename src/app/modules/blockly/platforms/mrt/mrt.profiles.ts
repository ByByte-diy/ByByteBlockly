import { IBoardProfile } from "@app/modules/device/types/device-board-profile.type";
import {
  STANDARD_SERIAL_PIN,
  STANDARD_SERIAL_SPEEDS,
} from "../shared/serial.const";

const MRTX_UNO_PROFILE: Omit<IBoardProfile, "id"> = {
  description: "MRTX-Uno",
  BUILTIN_LED: 13,
  picture: "media/MRTX-Uno.png",
  dropdownAllPins: [
    ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["8", "8"],
    ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A4", "A4"], ["A5", "A5"],
  ],
  dropdownDigital: [
    ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["8", "8"],
    ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A4", "A4"], ["A5", "A5"],
  ],
  dropdownPWM: [["3", "3"]],
  dropdownMCPPins: [["Mcp4", "4"], ["Mcp5", "5"], ["Mcp6", "6"], ["Mcp7", "7"]],
  dropdownAnalog: [
    ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"],
    ["A6", "A6"], ["A7", "A7"],
  ],
  interrupt: [["2", "2"], ["3", "3"]],
  serial: [...STANDARD_SERIAL_SPEEDS],
  serialPin: [...STANDARD_SERIAL_PIN],
  build: "uno",
  upload_arg: "arduino:avr:uno",
  cpu: "atmega328p-x",
  speed: "115200",
  prog: "arduino",
  usb: "USB B",
  voltage: "5V",
  inout: "18",
};

export const MRT_PROFILES: Record<string, IBoardProfile> = {
  MRTnode: {
    id: "MRTnode",
    description: "MRTnode ESP32",
    BUILTIN_LED: 18,
    picture: "media/mrtnode.jpg",
    dropdownAllPins: [
      ["RX (1)", "1"], ["TX (3)", "3"], ["4", "4"], ["5", "5"], ["13", "13"], ["21", "21"],
      ["22", "22"], ["OUT1", "23"], ["OUT2", "25"], ["OUT3", "26"], ["OUT4", "27"], ["OUT5", "32"],
      ["IN1", "33"], ["IN2 only read", "34"], ["IN3 only read", "35"],
      ["IN4 only read", "36"], ["IN5 only read", "39"],
    ],
    dropdownDigital: [
      ["RX (1)", "1"], ["TX (3)", "3"], ["4", "4"], ["5", "5"], ["13", "13"], ["21", "21"],
      ["22", "22"], ["OUT1", "23"], ["OUT2", "25"], ["OUT3", "26"], ["OUT4", "27"], ["OUT5", "32"],
      ["IN1", "33"], ["IN2 only read", "34"], ["IN3 only read", "35"],
      ["IN4 only read", "36"], ["IN5 only read", "39"],
    ],
    dropdownPWM: [
      ["4", "4"], ["5", "5"], ["13", "13"], ["21", "21"], ["22", "22"],
      ["OUT1", "23"], ["OUT2", "25"], ["OUT3", "26"], ["OUT4", "27"], ["OUT5", "32"], ["IN1", "33"],
    ],
    dropdownAnalog: [
      ["4", "4"], ["13", "13"], ["OUT2", "25"], ["OUT3", "26"], ["OUT4", "27"], ["OUT5", "32"],
      ["IN1", "33"], ["IN2 only read", "34"], ["IN3 only read", "35"],
      ["IN4 only read", "36"], ["IN5 only read", "39"],
    ],
    interrupt: [
      ["0", "0"], ["4", "4"], ["5", "5"], ["13", "13"], ["21", "21"], ["22", "22"],
      ["OUT1", "23"], ["OUT2", "25"], ["OUT3", "26"], ["OUT4", "27"], ["OUT5", "32"], ["IN1", "33"],
      ["IN2 only read", "34"], ["IN3 only read", "35"], ["IN4 only read", "36"], ["IN5 only read", "39"],
    ],
    touch: [["4", "4"], ["13", "13"], ["OUT4", "27"], ["OUT5", "32"], ["IN1", "33"]],
    serial: [...STANDARD_SERIAL_SPEEDS],
    serialPin: [...STANDARD_SERIAL_PIN],
    build: "",
    upload_arg: "esp32:esp32:esp32",
    cpu: "mrtnode-esp32",
    speed: "115200",
    prog: "arduino",
    usb: "micro USB",
    voltage: "3,3V",
    inout: "20",
  },
  uno_mrtx: {
    id: "uno_mrtx",
    ...MRTX_UNO_PROFILE,
  },
  mrtx: {
    id: "mrtx",
    ...MRTX_UNO_PROFILE,
  },
  mrtduino: {
    id: "mrtduino",
    description: "Arduino MRTduino",
    BUILTIN_LED: 13,
    picture: "media/mrtduino.jpg",
    dropdownAllPins: [
      ["Port1", "13"], ["Port2", "15"], ["Port3", "16"], ["Port4", "14"], ["Port5", "18"],
      ["Port6", "19"], ["Port7", "20"], ["Port8", "21"], ["Port9", "5"], ["Port10", "9"],
      ["Port11", "11"], ["Port12", "12"], ["Port13", "2"], ["Port14", "3"], ["Port15", "0"],
      ["Port16", "1"], ["Pin Remote control 1", "A10"], ["Pin Remote control 2", "A4"],
      ["Pin Remote control 3", "A5"],
    ],
    dropdownDigital: [
      ["Port1", "13"], ["Port2", "15"], ["Port3", "16"], ["Port4", "14"], ["Port5", "18"],
      ["Port6", "19"], ["Port7", "20"], ["Port8", "21"], ["Port9", "5"], ["Port10", "9"],
      ["Port11", "11"], ["Port12", "12"], ["Port13", "2"], ["Port14", "3"], ["Port15", "0"],
      ["Port16", "1"],
    ],
    dropdownPWM: [
      ["Port1", "13"], ["Port9", "5"], ["Port10", "9"], ["Port11", "11"], ["Port14", "3"],
      ["Pin Remote control 1", "10"],
    ],
    dropdownAnalog: [
      ["Port5", "A0"], ["Port6", "A1"], ["Port7", "A2"], ["Port8", "A3"], ["Port10", "A9"],
      ["Port12", "A11"], ["Pin Remote control 1", "A10"], ["Pin Remote control 2", "A4"],
      ["Pin Remote control 3", "A5"],
    ],
    interrupt: [["Port13", "2"], ["Port14", "3"], ["Port15", "0"], ["Port16", "1"]],
    serial: [...STANDARD_SERIAL_SPEEDS],
    serialPin: [...STANDARD_SERIAL_PIN],
    build: "leonardo",
    upload_arg: "arduino:avr:leonardo",
    cpu: "atmega32u4",
    speed: "57600",
    prog: "arduino",
    usb: "micro USB",
    voltage: "5V",
    inout: "20",
  },
};
