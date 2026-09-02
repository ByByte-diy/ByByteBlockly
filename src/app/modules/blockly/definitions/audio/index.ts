import { BlockRegistry } from "../../lib/registry/block-registry";
import { IToolboxCategoryConfig } from "../../types/toolbox.types";
import { BlockLevelE } from "../../types/block.types";
import { BUZZER_BLOCKS } from "./buzzer/buzzer.blocks";
import {
  BUZZER_CATEGORY,
  BUZZER_LEVEL,
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_ORDER,
  DFPLAYER_CATEGORY,
  DFPLAYER_LEVEL,
  OPENSMART_CATEGORY,
  OPENSMART_LEVEL,
  RADIO_CATEGORY,
  RADIO_LEVEL,
  TOOLBOX_LEVEL,
} from "./config";
import { DFPLAYER_BLOCKS } from "./dfplayer/dfplayer.blocks";
import { OPENSMART_BLOCKS } from "./opensmart/opensmart.blocks";
import { RADIO_BLOCKS } from "./radio/radio.blocks";

export const AUDIO_BLOCKS = [
  ...BUZZER_BLOCKS,
  ...DFPLAYER_BLOCKS,
  ...OPENSMART_BLOCKS,
  ...RADIO_BLOCKS,
];

function registerSubcategory(
  name: string,
  subOrder: number,
  minLevel: BlockLevelE
): IToolboxCategoryConfig {
  return {
    name,
    colour: CATEGORY_COLOR.toString(),
    order: CATEGORY_ORDER,
    subOrder,
    parentCategory: CATEGORY_NAME,
    minLevel,
  } as IToolboxCategoryConfig;
}

export function initialize(): void {
  BlockRegistry.registerMany(AUDIO_BLOCKS);

  BlockRegistry.registerCategory(CATEGORY_NAME, {
    name: CATEGORY_NAME,
    colour: CATEGORY_COLOR.toString(),
    order: CATEGORY_ORDER,
    minLevel: TOOLBOX_LEVEL,
    isContainer: true,
  } as IToolboxCategoryConfig);

  BlockRegistry.registerCategory(
    BUZZER_CATEGORY,
    registerSubcategory(BUZZER_CATEGORY, 0, BUZZER_LEVEL)
  );
  BlockRegistry.registerCategory(
    DFPLAYER_CATEGORY,
    registerSubcategory(DFPLAYER_CATEGORY, 1, DFPLAYER_LEVEL)
  );
  BlockRegistry.registerCategory(
    OPENSMART_CATEGORY,
    registerSubcategory(OPENSMART_CATEGORY, 2, OPENSMART_LEVEL)
  );
  BlockRegistry.registerCategory(
    RADIO_CATEGORY,
    registerSubcategory(RADIO_CATEGORY, 3, RADIO_LEVEL)
  );
}

export { BUZZER_BLOCKS, DFPLAYER_BLOCKS, OPENSMART_BLOCKS, RADIO_BLOCKS };
