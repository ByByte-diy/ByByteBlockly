import { BlockRegistry } from "../../lib/registry/block-registry";
import { IToolboxCategoryConfig } from "../../types/toolbox.types";
import { BlockLevelE } from "../../types/block.types";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_ORDER,
  LCD_CATEGORY,
  LCD_LEVEL,
  OLED_CATEGORY,
  OLED_LEVEL,
  TFT_CATEGORY,
  TFT_LEVEL,
  TOOLBOX_LEVEL,
} from "./config";
import { LCD_I2C_BLOCKS } from "./lcd/lcd-i2c.blocks";
import { TM1637_BLOCKS } from "./lcd/tm1637.blocks";
import { OLED_BLOCKS } from "./oled/oled.blocks";
import { ST7735_BLOCKS } from "./tft/st7735.blocks";

export const DISPLAY_BLOCKS = [
  ...OLED_BLOCKS,
  ...ST7735_BLOCKS,
  ...LCD_I2C_BLOCKS,
  ...TM1637_BLOCKS,
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
  BlockRegistry.registerMany(DISPLAY_BLOCKS);

  BlockRegistry.registerCategory(CATEGORY_NAME, {
    name: CATEGORY_NAME,
    colour: CATEGORY_COLOR.toString(),
    order: CATEGORY_ORDER,
    minLevel: TOOLBOX_LEVEL,
    isContainer: true,
  } as IToolboxCategoryConfig);

  BlockRegistry.registerCategory(
    OLED_CATEGORY,
    registerSubcategory(OLED_CATEGORY, 0, OLED_LEVEL)
  );
  BlockRegistry.registerCategory(
    TFT_CATEGORY,
    registerSubcategory(TFT_CATEGORY, 1, TFT_LEVEL)
  );
  BlockRegistry.registerCategory(
    LCD_CATEGORY,
    registerSubcategory(LCD_CATEGORY, 2, LCD_LEVEL)
  );
}

export { OLED_BLOCKS, ST7735_BLOCKS, LCD_I2C_BLOCKS, TM1637_BLOCKS };
