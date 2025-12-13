import { BlockLevelE, PlatformT } from "../../types";
import { PLATFORMS_ALL } from "@app/modules/device/constants/device-boards.const";

export const CATEGORY_NAME = "CAT_LOGIC";
export const CATEGORY_COLOR = 40; // HUE format
export const CATEGORY_PLATFORMS = Array.from(PLATFORMS_ALL) as PlatformT[];
export const TOOLBOX_LEVEL = BlockLevelE.BEGINNER;
