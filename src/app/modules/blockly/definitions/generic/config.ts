import { BlockLevelE, PlatformT } from "../../types";
import { PLATFORMS_ALL } from "@app/modules/device/constants/device-boards.const";

export const CATEGORY_NAME = "%{BKY_CAT_GENERIC}";
export const CATEGORY_COLOR = 240; // HUE format
export const CATEGORY_LEVEL = BlockLevelE.BEGINNER;
export const CATEGORY_PLATFORMS = Array.from(PLATFORMS_ALL) as PlatformT[];
export const CATEGORY_ORDER = 0;
