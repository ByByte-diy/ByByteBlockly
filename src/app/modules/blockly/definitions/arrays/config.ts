import { PLATFORMS_ALL } from "@app/modules/device/constants/device-boards.const";
import { CATEGORY_PALETTE } from "../../constants/category-palette.const";
import { BlockLevelE, PlatformT } from "../../types";

export const CATEGORY_NAME = "%{BKY_CAT_ARRAYS}";
export const CATEGORY_COLOR = CATEGORY_PALETTE.ARRAYS;
export const CATEGORY_PLATFORMS = Array.from(PLATFORMS_ALL) as PlatformT[];
export const TOOLBOX_LEVEL = BlockLevelE.ADVANCED;
export const CATEGORY_ORDER = 9;
