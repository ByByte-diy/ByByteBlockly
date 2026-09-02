import { PLATFORMS_ALL } from "@app/modules/device/constants/device-boards.const";
import { BlockLevelE, PlatformT } from "../../types";

export const CATEGORY_NAME = "%{BKY_CAT_ARRAYS}";
/** Legacy CAT_TAB colour (#FF8900) */
export const CATEGORY_COLOR = 20;
export const CATEGORY_PLATFORMS = Array.from(PLATFORMS_ALL) as PlatformT[];
export const TOOLBOX_LEVEL = BlockLevelE.ADVANCED;
export const CATEGORY_ORDER = 9;
