import { BlockRegistry } from "../../lib/registry/block-registry";
import { IToolboxCategoryConfig } from "../../types/toolbox.types";
import { IPlatformPack } from "../platform-pack.types";
import { ESCORNABOT_BLOCKS } from "./escornabot.blocks";
import {
  CATEGORY_NAME,
  CATEGORY_ORDER,
  ESCORNABOT_BOARD_IDS,
  ESCORNABOT_SUB_ORDER,
  MOVEMENT_COLOR,
  ROBOT_CONTAINER_CATEGORY,
  TOOLBOX_LEVEL,
} from "./config";

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
    BlockRegistry.registerCategory(CATEGORY_NAME, {
      name: CATEGORY_NAME,
      colour: MOVEMENT_COLOR,
      order: CATEGORY_ORDER,
      subOrder: ESCORNABOT_SUB_ORDER,
      parentCategory: ROBOT_CONTAINER_CATEGORY,
      minLevel: TOOLBOX_LEVEL,
    } as IToolboxCategoryConfig);
  },

  initializeBlocks() {
    BlockRegistry.registerMany(ESCORNABOT_BLOCKS);
  },
};
