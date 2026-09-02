import { BlockRegistry } from "../../lib/registry/block-registry";
import { IPlatformPack } from "../platform-pack.types";
import { ARMS_BLOCKS } from "./arms/arms.blocks";
import { BIPED_BLOCKS } from "./biped/biped.blocks";
import {
  OTTO_ARMS_CATEGORY_CONFIG,
  OTTO_BIPED_CATEGORY_CONFIG,
  OTTO_CONTAINER_CATEGORY_CONFIG,
  OTTO_NINJA_CATEGORY_CONFIG,
  OTTO_QUAD_CATEGORY_CONFIG,
  OTTO_WHEELS_CATEGORY_CONFIG,
} from "./config";
import { NINJA_BLOCKS } from "./ninja/ninja.blocks";
import { OTTO_BOARDS } from "./otto.boards";
import { OTTO_PROFILES } from "./otto.profiles";
import { QUAD_BLOCKS } from "./quad/quad.blocks";
import { WHEELS_BLOCKS } from "./wheels/wheels.blocks";

export const ottoPack: IPlatformPack = {
  id: "otto",
  supportedBoardIds: Object.keys(OTTO_BOARDS),

  registerBoards() {
    return Object.values(OTTO_BOARDS);
  },

  registerProfiles() {
    return Object.values(OTTO_PROFILES);
  },

  initializeCategories() {
    BlockRegistry.registerCategory(
      OTTO_CONTAINER_CATEGORY_CONFIG.name,
      OTTO_CONTAINER_CATEGORY_CONFIG
    );
    BlockRegistry.registerCategory(
      OTTO_BIPED_CATEGORY_CONFIG.name,
      OTTO_BIPED_CATEGORY_CONFIG
    );
    BlockRegistry.registerCategory(
      OTTO_ARMS_CATEGORY_CONFIG.name,
      OTTO_ARMS_CATEGORY_CONFIG
    );
    BlockRegistry.registerCategory(
      OTTO_QUAD_CATEGORY_CONFIG.name,
      OTTO_QUAD_CATEGORY_CONFIG
    );
    BlockRegistry.registerCategory(
      OTTO_WHEELS_CATEGORY_CONFIG.name,
      OTTO_WHEELS_CATEGORY_CONFIG
    );
    BlockRegistry.registerCategory(
      OTTO_NINJA_CATEGORY_CONFIG.name,
      OTTO_NINJA_CATEGORY_CONFIG
    );
  },

  initializeBlocks() {
    BlockRegistry.registerMany([
      ...BIPED_BLOCKS,
      ...ARMS_BLOCKS,
      ...QUAD_BLOCKS,
      ...WHEELS_BLOCKS,
      ...NINJA_BLOCKS,
    ]);
  },
};
