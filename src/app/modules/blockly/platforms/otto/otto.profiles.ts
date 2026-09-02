import { IBoardProfile } from "@app/modules/device/types/device-board-profile.type";
import {
  STANDARD_SERIAL_PIN,
  STANDARD_SERIAL_SPEEDS,
} from "../shared/serial.const";

export const OTTO_PROFILES: Record<string, IBoardProfile> = {
  OttoESP: {
    id: "OttoESP",
    description: "ESP12E NodeMcu",
    BUILTIN_LED: 2,
    picture: "media/esp8266.jpg",
    dropdownAllPins: [
      ["A0", "A0"], ["D0", "16"], ["D1", "5"], ["D2", "4"], ["D3", "0"], ["D4", "2"],
      ["D5", "14"], ["D6", "12"], ["D7", "13"], ["D8", "15"], ["RX", "3"], ["TX", "1"],
    ],
    dropdownDigital: [
      ["D0", "16"], ["D1", "5"], ["D2", "4"], ["D3", "0"], ["D4", "2"],
      ["D5", "14"], ["D6", "12"], ["D7", "13"], ["D8", "15"],
    ],
    dropdownPWM: [
      ["D1", "5"], ["D2", "4"], ["D3", "0"], ["D4", "2"],
      ["D5", "14"], ["D6", "12"], ["D7", "13"], ["D8", "15"],
    ],
    dropdownAnalog: [["A0", "A0"]],
    interrupt: [
      ["0", "0"], ["2", "2"], ["4", "4"], ["5", "5"],
      ["12", "12"], ["13", "13"], ["14", "14"], ["15", "15"],
    ],
    serial: [...STANDARD_SERIAL_SPEEDS],
    serialPin: [...STANDARD_SERIAL_PIN],
    build: "",
    upload_arg: "esp8266:esp8266:nodemcuv2",
    cpu: "esp8266",
    speed: "115200",
    prog: "arduino",
    usb: "micro USB",
    voltage: "3,3V",
    inout: "11",
  },
  Ottoky: {
    id: "Ottoky",
    description: "Ottoky ESP32",
    BUILTIN_LED: 18,
    picture: "media/tokymaker.png",
    dropdownAllPins: [
      ["IN1", "34"], ["IN2", "33"], ["IN3", "32"], ["IN4", "39"], ["IN5", "35"],
      ["OUT1", "23"], ["OUT2", "26"], ["OUT3", "25"], ["OUT4", "5"], ["OUT5", "27"],
      ["ECHO", "17"], ["TRIG", "16"], ["SDA", "21"], ["SCL", "22"], ["LED", "18"],
      ["CAP1", "12"], ["CAP2", "14"], ["CAP3", "13"], ["BTN_A", "36"], ["BTN_B", "2"],
    ],
    dropdownDigital: [
      ["IN1", "34"], ["IN2", "33"], ["IN3", "32"], ["IN4", "39"], ["IN5", "35"],
      ["OUT1", "23"], ["OUT2", "26"], ["OUT3", "25"], ["OUT4", "5"], ["OUT5", "27"],
      ["ECHO", "17"], ["TRIG", "16"], ["SDA", "21"], ["SCL", "22"], ["LED", "18"],
      ["CAP1", "12"], ["CAP2", "14"], ["CAP3", "13"], ["BTN_A", "36"], ["BTN_B", "2"],
    ],
    dropdownPWM: [
      ["IN1", "34"], ["IN2", "33"], ["IN3", "32"], ["IN4", "39"], ["IN5", "35"],
      ["OUT1", "23"], ["OUT2", "26"], ["OUT3", "25"], ["OUT4", "5"], ["OUT5", "27"],
      ["ECHO", "17"], ["TRIG", "16"],
    ],
    dropdownAnalog: [
      ["IN1", "34"], ["IN2", "33"], ["IN3", "32"], ["IN4", "39"], ["IN5", "35"],
      ["OUT1", "23"], ["OUT2", "26"], ["OUT3", "25"], ["OUT4", "5"], ["OUT5", "27"],
      ["ECHO", "17"], ["TRIG", "16"],
    ],
    interrupt: [
      ["IN1", "34"], ["IN2", "33"], ["IN3", "32"], ["IN4", "39"], ["IN5", "35"],
      ["OUT1", "23"], ["OUT2", "26"], ["OUT3", "25"], ["OUT4", "5"], ["OUT5", "27"],
      ["ECHO", "17"], ["TRIG", "16"], ["CAP1", "12"], ["CAP2", "14"], ["CAP3", "13"],
      ["BTN_A", "36"], ["BTN_B", "2"],
    ],
    serial: [...STANDARD_SERIAL_SPEEDS],
    serialPin: [...STANDARD_SERIAL_PIN],
    build: "",
    upload_arg: "esp32:esp32:esp32",
    cpu: "esp32",
    speed: "115200",
    prog: "arduino",
    usb: "micro USB",
    voltage: "3,3V",
    inout: "20",
  },
};
