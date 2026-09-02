import { IPlatformPack } from "../platform-pack.types";
import { BYBYTE_PROFILES } from "./bybyte.profiles";

export const bybytePack: IPlatformPack = {
  id: "bybyte",
  supportedBoardIds: ["bybyte_nano", "bybyte_mega"],

  registerBoards() {
    return [];
  },

  registerProfiles() {
    return Object.values(BYBYTE_PROFILES);
  },

  initializeCategories() {},

  initializeBlocks() {},
};
