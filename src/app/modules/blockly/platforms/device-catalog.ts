import { IBoard } from "@app/modules/device/types/device-board.type";
import { IBoardProfile } from "@app/modules/device/types/device-board-profile.type";
import { ARDUINO_EXT_BOARDS } from "./arduino-ext/arduino-ext.boards";
import { ARDUINO_EXT_PROFILES } from "./arduino-ext/arduino-ext.profiles";
import { OTTO_BOARDS } from "./otto/otto.boards";
import { OTTO_PROFILES } from "./otto/otto.profiles";
import { MRT_BOARDS } from "./mrt/mrt.boards";
import { MRT_PROFILES } from "./mrt/mrt.profiles";
import { BYBYTE_BOARDS } from "./bybyte/bybyte.boards";
import { BYBYTE_PROFILES } from "./bybyte/bybyte.profiles";

/** All board entries contributed by platform packs */
export const PLATFORM_BOARDS: Record<string, IBoard> = {
  ...ARDUINO_EXT_BOARDS,
  ...OTTO_BOARDS,
  ...MRT_BOARDS,
  ...BYBYTE_BOARDS,
};

/** All pin profiles contributed by platform packs */
export const PLATFORM_PROFILES: Record<string, IBoardProfile> = {
  ...ARDUINO_EXT_PROFILES,
  ...OTTO_PROFILES,
  ...MRT_PROFILES,
  ...BYBYTE_PROFILES,
};

export function getPlatformBoards(): IBoard[] {
  return Object.values(PLATFORM_BOARDS);
}

export function getPlatformProfiles(): IBoardProfile[] {
  return Object.values(PLATFORM_PROFILES);
}
