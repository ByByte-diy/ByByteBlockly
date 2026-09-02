import { IPlatformPack } from "../platform-pack.types";
import { MRT_BOARDS } from "./mrt.boards";
import { MRT_PROFILES } from "./mrt.profiles";

export const mrtPack: IPlatformPack = {
  id: "mrt",
  supportedBoardIds: Object.keys(MRT_BOARDS),

  registerBoards() {
    return Object.values(MRT_BOARDS);
  },

  registerProfiles() {
    return Object.values(MRT_PROFILES);
  },

  initializeCategories() {},

  initializeBlocks() {},
};
