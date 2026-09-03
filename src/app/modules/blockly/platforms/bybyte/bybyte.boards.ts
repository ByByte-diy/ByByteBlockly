import { IBoard } from "@app/modules/device/types/device-board.type";

export const BYBYTE_BOARDS: Record<string, IBoard> = {
  bybyte_nano: {
    id: "bybyte_nano",
    name: "ByByte Nano",
    fqbn: "arduino:avr:nano",
    core: "arduino:avr",
    uploadSpeed: 115200,
  },
  bybyte_mega: {
    id: "bybyte_mega",
    name: "ByByte Mega",
    fqbn: "arduino:avr:mega",
    core: "arduino:avr",
    uploadSpeed: 115200,
  },
};
