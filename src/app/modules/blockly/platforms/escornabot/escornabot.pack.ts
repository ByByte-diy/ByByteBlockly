import { BlockRegistry } from "../../lib/registry/block-registry";
import { IPlatformPack } from "../platform-pack.types";
import { ESCORNABOT_BLOCKS } from "./escornabot.blocks";
import { ESCORNABOT_BOARD_IDS, ESCORNABOT_CATEGORY_CONFIG } from "./config";
import { gateBlocksToBoards } from "../shared/pack-toolbox.helpers";

export const escornabotPack: IPlatformPack = {
  id: "escornabot",
  supportedBoardIds: [...ESCORNABOT_BOARD_IDS],

  registerBoards() {
    return [];
  },

  registerProfiles() {
    return [];
  },

  initializeCategories() {
    BlockRegistry.registerCategory(ESCORNABOT_CATEGORY_CONFIG.name, ESCORNABOT_CATEGORY_CONFIG);
  },

  initializeBlocks() {
    BlockRegistry.registerMany(gateBlocksToBoards(ESCORNABOT_BLOCKS, ESCORNABOT_BOARD_IDS));
  },
};
