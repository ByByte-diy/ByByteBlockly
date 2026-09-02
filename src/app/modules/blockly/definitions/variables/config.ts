import { PLATFORMS_ALL } from "@app/modules/device/constants/device-boards.const";
import { BlockLevelE, PlatformT } from "../../types";

export const CATEGORY_NAME = "%{BKY_CAT_VARIABLES}";
export const CATEGORY_COLOR = 32; // HUE format (Blockly.Blocks.variables.HUE)
export const CATEGORY_PLATFORMS = Array.from(PLATFORMS_ALL) as PlatformT[];
export const TOOLBOX_LEVEL = BlockLevelE.INTERMEDIATE;
export const CATEGORY_ORDER = 8;

