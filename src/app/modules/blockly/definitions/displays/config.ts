import { PLATFORMS_ALL } from "@app/modules/device/constants/device-boards.const";
import { CATEGORY_PALETTE } from "../../constants/category-palette.const";
import { BlockLevelE, PlatformT } from "../../types";

export const CATEGORY_NAME = "%{BKY_CAT_DISPLAYS}";
export const OLED_CATEGORY = "%{BKY_CAT_DISPLAYS_OLED}";
export const TFT_CATEGORY = "%{BKY_CAT_DISPLAYS_TFT}";
export const LCD_CATEGORY = "%{BKY_CAT_DISPLAYS_LCD}";

export const CATEGORY_COLOR = CATEGORY_PALETTE.DISPLAYS;
export const CATEGORY_PLATFORMS = Array.from(PLATFORMS_ALL) as PlatformT[];
export const TOOLBOX_LEVEL = BlockLevelE.BEGINNER;
export const OLED_LEVEL = BlockLevelE.BEGINNER;
export const TFT_LEVEL = BlockLevelE.INTERMEDIATE;
export const LCD_LEVEL = BlockLevelE.INTERMEDIATE;
export const CATEGORY_ORDER = 14;

export const OLED_HEIGHT_OPTIONS: [string, string][] = [
  ["64", "64"],
  ["32", "32"],
];

export const OLED_ADDRESS_OPTIONS: [string, string][] = [
  ["0x3C", "0x3C"],
  ["0x3D", "0x3D"],
  ["0x7A", "0x7A"],
  ["0x7B", "0x7B"],
];

export const ST7735_WRAP_OPTIONS: [string, string][] = [
  ['1.8" Black Tab', "INITR_BLACKTAB"],
  ['1.8" Green Tab ', "INITR_GREENTAB"],
  ['1.8"  Red Tab', "INITR_REDTAB"],
  ['0.96" Mini TFT', "INITR_MINI160x80"],
];

export const ST7735_COLOR_OPTIONS: [string, string][] = [
  ["Black", "ST7735_BLACK"],
  ["Green", "ST7735_GREEN"],
  ["Red", "ST7735_RED"],
  ["Blue", "ST7735_BLUE"],
  ["Cyan", "ST7735_CYAN"],
  ["Magenta", "ST7735_MAGENTA"],
  ["Yellow", "ST7735_YELLOW"],
  ["White", "ST7735_WHITE"],
];

export const LCD_I2C_DEFAULT_ADDRESS = "0x27";

export const LCD_I2C_ADDRESS_OPTIONS: [string, string][] = [
  ["0x27", "0x27"],
  ["0x3F", "0x3F"],
];

export const TM1637_NUMBER_OPTIONS: [string, string][] = [
  ["1", "1"],
  ["2", "2"],
  ["3", "3"],
  ["4", "4"],
];

/** Typical ST7735 wiring on Uno (from legacy toolbox) */
export const DEFAULT_ST7735_PINS = {
  CS: "A1",
  DC: "A2",
  RST: "A3",
} as const;

/** Typical TM1637 wiring on Uno */
export const DEFAULT_TM1637_PINS = {
  CLK: "D2",
  DIO: "D3",
} as const;
