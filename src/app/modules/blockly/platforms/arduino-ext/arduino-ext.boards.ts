import { IBoard } from "@app/modules/device/types/device-board.type";

/** Additional Arduino / ESP boards beyond the core catalog */
export const ARDUINO_EXT_BOARDS: Record<string, IBoard> = {
  nanooptiboot: {
    id: "nanooptiboot",
    name: "Arduino Nano",
    fqbn: "arduino:avr:nano",
    core: "arduino:avr",
    uploadSpeed: 115200,
  },
  leonardo: {
    id: "leonardo",
    name: "Arduino Leonardo",
    fqbn: "arduino:avr:leonardo",
    core: "arduino:avr",
    uploadSpeed: 57600,
  },
  micro: {
    id: "micro",
    name: "Arduino Micro",
    fqbn: "arduino:avr:micro",
    core: "arduino:avr",
    uploadSpeed: 57600,
  },
  pro8: {
    id: "pro8",
    name: "Arduino Pro Mini 3.3V",
    fqbn: "arduino:avr:pro:cpu=8MHzatmega328",
    core: "arduino:avr",
    uploadSpeed: 57600,
  },
  pro16: {
    id: "pro16",
    name: "Arduino Pro Mini 5V",
    fqbn: "arduino:avr:pro:cpu=16MHzatmega328",
    core: "arduino:avr",
    uploadSpeed: 57600,
  },
  mini: {
    id: "mini",
    name: "Arduino Mini",
    fqbn: "arduino:avr:mini",
    core: "arduino:avr",
    uploadSpeed: 115200,
  },
  yun: {
    id: "yun",
    name: "Arduino Yun",
    fqbn: "arduino:avr:yun",
    core: "arduino:avr",
    uploadSpeed: 57600,
  },
  uno_bt: {
    id: "uno_bt",
    name: "Arduino BT 328",
    fqbn: "arduino:avr:bt",
    core: "arduino:avr",
    uploadSpeed: 115200,
  },
  wemosD1miniPro: {
    id: "wemosD1miniPro",
    name: "WEMOS D1 mini Pro",
    fqbn: "esp8266:esp8266:d1_mini_pro",
    core: "esp8266:esp8266",
    uploadSpeed: 115200,
  },
  mkrwifi1010: {
    id: "mkrwifi1010",
    name: "Arduino MKR WiFi 1010",
    fqbn: "arduino:samd:mkrwifi1010",
    core: "arduino:samd",
    uploadSpeed: 115200,
  },
};
