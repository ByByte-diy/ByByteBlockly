import * as Blockly from "blockly";
import {
  applyDefaultDropdownFields,
  getAllPins,
  getCurrentBoardId,
} from "@app/modules/device/helpers/device-board-globals.helper";
import {
  registerDefinition,
  registerInclude,
} from "../../lib/generators/codegen-sections.helper";
import {
  INIT_BLOCK_PREFIX,
  initBlockLabel,
} from "../../lib/helpers/block-label.helper";

export { createBlockIconField } from "../../lib/helpers/block-icon.helper";
export { INIT_BLOCK_PREFIX, initBlockLabel };

/** Localized display block label with English fallback. */
export function displayLabel(key: string, fallback: string): string {
  return Blockly.Msg[key] || fallback;
}

export function createPinDropdownField(): Blockly.FieldDropdown {
  return new Blockly.FieldDropdown(getAllPins);
}

export function applyDefaultAllPinFields(
  block: Blockly.Block,
  defaults: Record<string, string>
): void {
  applyDefaultDropdownFields(block, defaults, getAllPins);
}

/** Parse #RRGGBB from colour field value. */
export function parseHexColor(fieldValue: string): {
  r: number;
  g: number;
  b: number;
} {
  const hex = fieldValue.replace("#", "");
  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16),
  };
}

/** Adafruit SSD1306 OLED (128×32 or 128×64). */
export function ensureOledSsd1306Init(
  generator: any,
  height: string,
  address: string
): void {
  registerInclude(
    generator,
    "Adafruit_GFX.h",
    "Adafruit GFX graphics library."
  );
  registerInclude(
    generator,
    "Adafruit_SSD1306.h",
    "Adafruit SSD1306 monochrome OLED driver."
  );
  registerDefinition(
    generator,
    "OLED",
    `#define SCREEN_WIDTH 128 // OLED display width, in pixels\n` +
      `#define SCREEN_HEIGHT ${height}  // OLED display height, in pixels\n` +
      `#define OLED_RESET  -1 // sharing Arduino reset pin\n` +
      `Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);`,
    "Global SSD1306 OLED display instance."
  );
  generator.setups_["OLED"] =
    `display.begin(SSD1306_SWITCHCAPVCC, ${address});\n` +
    "display.clearDisplay();\n" +
    "display.display();\n";
}

/** Adafruit SH1106 OLED (128×64, 1.3\"). */
export function ensureOledSh1106Init(generator: any, address: string): void {
  registerInclude(
    generator,
    "Adafruit_GFX.h",
    "Adafruit GFX graphics library."
  );
  registerInclude(
    generator,
    "Adafruit_SH1106.h",
    "Adafruit SH1106 monochrome OLED driver."
  );
  registerDefinition(
    generator,
    "OLED",
    `#define SCREEN_WIDTH 128 // OLED display width, in pixels\n` +
      `#define SCREEN_HEIGHT 64  // OLED display height, in pixels\n` +
      `#define OLED_RESET  -1 // sharing Arduino reset pin\n` +
      `Adafruit_SH1106 display(OLED_RESET);`,
    "Global SH1106 OLED display instance."
  );
  generator.setups_["OLED"] =
    `display.begin(SH1106_SWITCHCAPVCC, ${address});\n` +
    "display.clearDisplay();\n" +
    "display.display();\n";
}

/** Adafruit ST7735 TFT (object name tft1). */
export function ensureSt7735Init(
  generator: any,
  cs: string,
  dc: string,
  rst: string,
  wrap: string
): void {
  registerInclude(generator, "SPI.h", "SPI bus for TFT display.");
  registerInclude(
    generator,
    "Adafruit_GFX.h",
    "Adafruit GFX graphics library."
  );
  registerInclude(
    generator,
    "Adafruit_ST7735.h",
    "Adafruit ST7735 TFT driver."
  );
  registerDefinition(
    generator,
    "define_st7735",
    `Adafruit_ST7735 tft1=Adafruit_ST7735(${cs},${dc},${rst});`,
    "Global ST7735 TFT instance (tft1)."
  );
  generator.setups_["setup_st7735"] = `tft1.initR(${wrap});\n`;
}

/** LiquidCrystal I2C LCD (object name lcd). */
export function ensureLcdI2cInit(
  generator: any,
  address: string,
  columns: string,
  rows: string
): void {
  registerInclude(generator, "Wire.h", "I2C bus for LCD.");
  registerInclude(
    generator,
    "LiquidCrystal_I2C.h",
    "LiquidCrystal I2C LCD driver."
  );
  registerDefinition(
    generator,
    "define_lcdpins",
    `LiquidCrystal_I2C lcd(${address},${columns},${rows});`,
    "Global I2C LCD instance."
  );
  generator.setups_["setup_lcdi2c"] = "lcd.init();\n";
}

/** TM1637 7-segment display. */
export function ensureTm1637Init(
  generator: any,
  number: string,
  clk: string,
  dio: string
): void {
  registerDefinition(
    generator,
    "define_TM1637_library",
    "#include <TM1637Display.h>",
    "TM1637 7-segment display library."
  );
  registerDefinition(
    generator,
    `define_TM1637_segment_variable${number}`,
    `uint8_t segmentTM1637_${number}[] = { 0x00, 0x00, 0x00, 0x00 };`,
    `Segment buffer for TM1637 display #${number}.`
  );
  registerDefinition(
    generator,
    `define_TM1637_${number}`,
    `TM1637Display tm1637_${number}(${clk},${dio});`,
    `TM1637 display #${number} instance.`
  );
}

const MRTNODE_BOARD_IDS = ["MRTnode"] as const;

/** Register PROGMEM icon array (AVR boards only). */
export function registerProgmemIcon(
  generator: any,
  iconName: string,
  hexCodes: string
): void {
  if (
    !MRTNODE_BOARD_IDS.includes(
      getCurrentBoardId() as (typeof MRTNODE_BOARD_IDS)[number]
    )
  ) {
    registerInclude(
      generator,
      "avr/pgmspace.h",
      "PROGMEM support for icon bitmaps."
    );
  }
  registerDefinition(
    generator,
    `define_iconvalus_${iconName}`,
    `const unsigned char ${iconName}[] PROGMEM= {${hexCodes}};`,
    `PROGMEM icon bitmap: ${iconName}.`
  );
}

/** OLED draw checkbox: TRUE → WHITE, FALSE → BLACK. */
export function oledDrawColor(block: Blockly.Block): string {
  return block.getFieldValue("draw") === "TRUE" ? "WHITE" : "BLACK";
}

/** OLED rectangle draw checkbox: TRUE → 1, FALSE → 0 (legacy). */
export function oledRectDrawColor(block: Blockly.Block): string {
  return block.getFieldValue("draw") === "TRUE" ? "1" : "0";
}

/** Convert 1-based LCD cursor to 0-based (legacy lcdi2c_setcursor). */
export function lcdCursorIndex(value: string): string {
  const num = Number(value);
  if (num <= 0) {
    return "1";
  }
  return String(num - 1);
}
