import { BlockRegistry } from "../../lib/registry/block-registry";
import { IPlatformPack } from "../platform-pack.types";
import { BYBYTE_BLOCKS } from "./bybyte.blocks";
import { BYBYTE_BOARDS } from "./bybyte.boards";
import { BYBYTE_PROFILES } from "./bybyte.profiles";
import { BYBYTE_BOARD_IDS, BYBYTE_CONTAINER_CATEGORY_CONFIG } from "./config";

export const bybytePack: IPlatformPack = {
  id: "bybyte",
  supportedBoardIds: [...BYBYTE_BOARD_IDS],

  registerBoards() {
    return Object.values(BYBYTE_BOARDS);
  },

  registerProfiles() {
    return Object.values(BYBYTE_PROFILES);
  },

  initializeCategories() {
    BlockRegistry.registerCategory(
      BYBYTE_CONTAINER_CATEGORY_CONFIG.name,
      BYBYTE_CONTAINER_CATEGORY_CONFIG
    );
  },

  initializeBlocks() {
    BlockRegistry.registerMany(BYBYTE_BLOCKS);
  },
};
