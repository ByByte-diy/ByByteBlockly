import { IBoard } from "@app/modules/device/types/device-board.type";

export const OTTO_BOARDS: Record<string, IBoard> = {
  OttoESP: {
    id: "OttoESP",
    name: "Otto ESP8266 (NodeMCU)",
    fqbn: "esp8266:esp8266:nodemcuv2",
    core: "esp8266:esp8266",
    uploadSpeed: 115200,
  },
  Ottoky: {
    id: "Ottoky",
    name: "Ottoky ESP32",
    fqbn: "esp32:esp32:esp32",
    core: "esp32:esp32",
    uploadSpeed: 115200,
  },
};
