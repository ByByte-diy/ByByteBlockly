import { PLATFORMS_ALL } from "@app/modules/device/constants/device-boards.const";
import { BlockLevelE, PlatformT } from "../../types";

export const CATEGORY_NAME = "%{BKY_CAT_STORAGE}";
/** Legacy CAT_STOCKAGE colour */
export const CATEGORY_COLOUR = "#154360";
export const CATEGORY_PLATFORMS = Array.from(PLATFORMS_ALL) as PlatformT[];
export const TOOLBOX_LEVEL = BlockLevelE.ADVANCED;
export const CATEGORY_ORDER = 11;
