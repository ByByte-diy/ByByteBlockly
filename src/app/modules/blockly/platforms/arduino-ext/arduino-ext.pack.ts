import { IPlatformPack } from "../platform-pack.types";
import { ARDUINO_EXT_BOARDS } from "./arduino-ext.boards";
import { ARDUINO_EXT_PROFILES } from "./arduino-ext.profiles";

export const arduinoExtPack: IPlatformPack = {
  id: "arduino-ext",
  supportedBoardIds: Object.keys(ARDUINO_EXT_BOARDS),

  registerBoards() {
    return Object.values(ARDUINO_EXT_BOARDS);
  },

  registerProfiles() {
    return Object.values(ARDUINO_EXT_PROFILES);
  },

  initializeCategories() {},

  initializeBlocks() {},
};
