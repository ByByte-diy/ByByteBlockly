import { BlockRegistry } from "../../lib/registry/block-registry";
import { IToolboxCategoryConfig } from "../../types/toolbox.types";
import { BlockLevelE } from "../../types/block.types";
import { BASIC_LED_BLOCKS } from "./basic/basic-led.blocks";
import {
  BASIC_CATEGORY,
  BASIC_LEVEL,
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_ORDER,
  MATRIX_CATEGORY,
  MATRIX_LEVEL,
  NEOMATRIX_CATEGORY,
  NEOMATRIX_LEVEL,
  NEOPIXEL_CATEGORY,
  NEOPIXEL_LEVEL,
  RGB_CATEGORY,
  RGB_LEVEL,
  TOOLBOX_LEVEL,
} from "./config";
import { MAX7219_BLOCKS } from "./max7219/max7219.blocks";
import { NEOMATRIX_BLOCKS } from "./neomatrix/neomatrix.blocks";
import { NEOPIXEL_BLOCKS } from "./neopixel/neopixel.blocks";
import { RGB_BLOCKS } from "./rgb/rgb.blocks";

export const LED_BLOCKS = [
  ...BASIC_LED_BLOCKS,
  ...RGB_BLOCKS,
  ...NEOPIXEL_BLOCKS,
  ...NEOMATRIX_BLOCKS,
  ...MAX7219_BLOCKS,
];

function registerSubcategory(
  name: string,
  subOrder: number,
  minLevel: BlockLevelE
): IToolboxCategoryConfig {
  return {
    name,
    colour: CATEGORY_COLOR,
    order: CATEGORY_ORDER,
    subOrder,
    parentCategory: CATEGORY_NAME,
    minLevel,
  } as IToolboxCategoryConfig;
}

export function initialize(): void {
  BlockRegistry.registerMany(LED_BLOCKS);

  BlockRegistry.registerCategory(CATEGORY_NAME, {
    name: CATEGORY_NAME,
    colour: CATEGORY_COLOR,
    order: CATEGORY_ORDER,
    minLevel: TOOLBOX_LEVEL,
    isContainer: true,
  } as IToolboxCategoryConfig);

  BlockRegistry.registerCategory(
    BASIC_CATEGORY,
    registerSubcategory(BASIC_CATEGORY, 0, BASIC_LEVEL)
  );
  BlockRegistry.registerCategory(
    RGB_CATEGORY,
    registerSubcategory(RGB_CATEGORY, 1, RGB_LEVEL)
  );
  BlockRegistry.registerCategory(
    NEOPIXEL_CATEGORY,
    registerSubcategory(NEOPIXEL_CATEGORY, 2, NEOPIXEL_LEVEL)
  );
  BlockRegistry.registerCategory(
    NEOMATRIX_CATEGORY,
    registerSubcategory(NEOMATRIX_CATEGORY, 3, NEOMATRIX_LEVEL)
  );
  BlockRegistry.registerCategory(
    MATRIX_CATEGORY,
    registerSubcategory(MATRIX_CATEGORY, 4, MATRIX_LEVEL)
  );
}

export {
  BASIC_LED_BLOCKS,
  RGB_BLOCKS,
  NEOPIXEL_BLOCKS,
  NEOMATRIX_BLOCKS,
  MAX7219_BLOCKS,
};
