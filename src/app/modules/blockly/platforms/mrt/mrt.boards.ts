import { IBoard } from "@app/modules/device/types/device-board.type";

export const MRT_BOARDS: Record<string, IBoard> = {
  MRTnode: {
    id: "MRTnode",
    name: "MRTnode ESP32",
    fqbn: "esp32:esp32:esp32",
    core: "esp32:esp32",
    uploadSpeed: 115200,
  },
  uno_mrtx: {
    id: "uno_mrtx",
    name: "MRTX-Uno",
    fqbn: "arduino:avr:uno",
    core: "arduino:avr",
    uploadSpeed: 115200,
  },
  mrtx: {
    id: "mrtx",
    name: "MRTX-Uno",
    fqbn: "arduino:avr:uno",
    core: "arduino:avr",
    uploadSpeed: 115200,
  },
};
