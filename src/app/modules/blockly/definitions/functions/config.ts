import { PLATFORMS_ALL } from "@app/modules/device/constants/device-boards.const";
import { BlockLevelE, PlatformT } from "../../types";

export const CATEGORY_NAME = "%{BKY_CAT_FUNCTIONS}";
/** Legacy CAT_FUNCTIONS colour (#FF6680) */
export const CATEGORY_COLOR = 330;
export const CATEGORY_PLATFORMS = Array.from(PLATFORMS_ALL) as PlatformT[];
export const TOOLBOX_LEVEL = BlockLevelE.INTERMEDIATE;
export const CATEGORY_ORDER = 7;
