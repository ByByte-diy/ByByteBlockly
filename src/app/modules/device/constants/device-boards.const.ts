import { IBoard } from "../types/device-board.type";
import { PLATFORM_BOARDS } from "@app/modules/blockly/platforms/device-catalog";

const CORE_BOARDS: Record<string, IBoard> = {
  uno: {
    id: "uno",
    name: "Arduino Uno",
    fqbn: "arduino:avr:uno",
    core: "arduino:avr",
    uploadSpeed: 115200,
  },
  nano: {
    id: "nano",
    name: "Arduino Nano (Old Bootloader)",
    fqbn: "arduino:avr:nano",
    core: "arduino:avr",
    uploadSpeed: 57600,
  },
  mega: {
    id: "mega",
    name: "Arduino Mega 2560",
    fqbn: "arduino:avr:mega",
    core: "arduino:avr",
    uploadSpeed: 115200,
  },
  esp32: {
    id: "esp32",
    name: "ESP32 Dev Module",
    fqbn: "esp32:esp32:esp32",
    core: "esp32:esp32",
    uploadSpeed: 921600,
  },
  esp8266: {
    id: "esp8266",
    name: "NodeMCU 1.0 (ESP-12E)",
    fqbn: "esp8266:esp8266:nodemcuv2",
    core: "esp8266:esp8266",
    uploadSpeed: 115200,
  },
};

/**
 * Predefined boards (core catalog + platform pack extensions)
 */
export const BOARDS: Record<string, IBoard> = Object.freeze({
  ...CORE_BOARDS,
  ...PLATFORM_BOARDS,
});

export const PLATFORMS_ALL = Object.keys(BOARDS);
