import { CATEGORY_PALETTE } from "../../constants/category-palette.const";
import { BlockLevelE } from "../../types";
import { IToolboxCategoryConfig } from "../../types/toolbox.types";
import {
  BYBYTE_EXCLUSIVE_BOARD_IDS,
  OTTO_EXCLUSIVE_BOARD_IDS,
} from "../shared/robot-boards.const";

/** Top-level Robot ByByte container. */
export const BYBYTE_CONTAINER_CATEGORY = "%{BKY_CAT_ROBOT_BYBYTE}";

/** Block category for ByByte-specific blocks (same flyout as container until subcats exist). */
export const CATEGORY_NAME = BYBYTE_CONTAINER_CATEGORY;

export const BYBYTE_BOARD_IDS = [...BYBYTE_EXCLUSIVE_BOARD_IDS] as const;

export const CATEGORY_ORDER = 14;
export const BYBYTE_SUB_ORDER = 0;

export const CATEGORY_COLOUR = CATEGORY_PALETTE.BYBYTE;

export const TOOLBOX_LEVEL = BlockLevelE.BEGINNER;

export const BYBYTE_CONTAINER_CATEGORY_CONFIG: IToolboxCategoryConfig = {
  name: BYBYTE_CONTAINER_CATEGORY,
  colour: CATEGORY_COLOUR,
  order: CATEGORY_ORDER,
  subOrder: BYBYTE_SUB_ORDER,
  minLevel: TOOLBOX_LEVEL,
  isContainer: true,
  hiddenBoardIds: [...OTTO_EXCLUSIVE_BOARD_IDS],
};
