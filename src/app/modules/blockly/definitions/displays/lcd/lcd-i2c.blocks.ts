import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import { attachShadowBlock } from "../../../lib/helpers/shadow-block.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  LCD_CATEGORY,
  LCD_I2C_ADDRESS_OPTIONS,
  LCD_LEVEL,
} from "../config";
import {
  createBlockIconField,
  displayLabel,
  ensureLcdI2cInit,
  lcdCursorIndex,
} from "../displays.helper";

function buildLcdI2cSetup() {
  const block = new BlockBuilder("lcdi2c_setup")
    .setCategory(LCD_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(LCD_LEVEL)
    .setTags(["displays", "lcd", "i2c", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const address = b.getFieldValue("NAME");
      const columns = generator.valueToCode(
        b,
        "COLUMNS",
        generator.ORDER_ATOMIC
      );
      const rows = generator.valueToCode(b, "ROWS", generator.ORDER_ATOMIC);
      ensureLcdI2cInit(generator, address, columns, rows);
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("LCD.png"))
      .appendField(
        displayLabel("OTTO_HOME_TEXT", "⚙️") +
          displayLabel("LCD_I2C_setup", "LCD I²C address")
      );
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown(LCD_I2C_ADDRESS_OPTIONS),
      "NAME"
    );
    this.appendValueInput("COLUMNS")
      .setCheck("Number")
      .appendField(displayLabel("LCDP_Column", "columns"));
    this.appendValueInput("ROWS")
      .setCheck("Number")
      .appendField(displayLabel("LCDP_Row", "rows"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    attachShadowBlock(this, "COLUMNS", "math_number", { NUM: 16 });
    attachShadowBlock(this, "ROWS", "math_number", { NUM: 2 });
  };
  return block;
}

function buildLcdI2cSetBacklight() {
  const block = new BlockBuilder("lcdi2c_setBacklight")
    .setCategory(LCD_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(LCD_LEVEL)
    .setTags(["displays", "lcd", "i2c"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b) => {
      const option = b.getFieldValue("OUTPUT_DISPLAY");
      return option === "1" ? "lcd.backlight();\n" : "lcd.noBacklight();\n";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField("📟" + displayLabel("LCDP_setBcklight", "LCD I²C set backlight "))
      .appendField(
        new Blockly.FieldDropdown([
          ["ON", "1"],
          ["OFF", "0"],
        ]),
        "OUTPUT_DISPLAY"
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  return block;
}

function buildLcdI2cClear() {
  const block = new BlockBuilder("lcdi2c_clear")
    .setCategory(LCD_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(LCD_LEVEL)
    .setTags(["displays", "lcd", "i2c"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setHelpUrl("https://www.arduino.cc/en/Reference/LiquidCrystalClear")
    .setArduinoGenerator(() => "lcd.clear();\n")
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField(
      "📟" + displayLabel("LCDP_Clear", "LCD I²C clear")
    );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl("https://www.arduino.cc/en/Reference/LiquidCrystalClear");
  };
  return block;
}

function buildLcdI2cHome() {
  const block = new BlockBuilder("lcdi2c_home")
    .setCategory(LCD_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(LCD_LEVEL)
    .setTags(["displays", "lcd", "i2c"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setHelpUrl("https://www.arduino.cc/en/Reference/LiquidCrystalHome")
    .setArduinoGenerator(() => "lcd.home();\n")
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField(
      "📟" + displayLabel("LCDP_Home", "LCD I²C home")
    );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl("https://www.arduino.cc/en/Reference/LiquidCrystalHome");
  };
  return block;
}

function buildLcdI2cDisplay() {
  const block = new BlockBuilder("lcdi2c_display")
    .setCategory(LCD_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(LCD_LEVEL)
    .setTags(["displays", "lcd", "i2c"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setHelpUrl("https://www.arduino.cc/en/Reference/LiquidCrystalDisplay")
    .setArduinoGenerator((b) => {
      const option = b.getFieldValue("OUTPUT_DISPLAY");
      return option === "1" ? "lcd.display();\n" : "lcd.noDisplay();\n";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField("📟" + displayLabel("LCDP_Display", "LCD I²C "))
      .appendField(
        new Blockly.FieldDropdown([
          ["Display", "1"],
          ["No Display", "0"],
        ]),
        "OUTPUT_DISPLAY"
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl("https://www.arduino.cc/en/Reference/LiquidCrystalDisplay");
  };
  return block;
}

function buildLcdI2cSetCursor() {
  const block = new BlockBuilder("lcdi2c_setcursor")
    .setCategory(LCD_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(LCD_LEVEL)
    .setTags(["displays", "lcd", "i2c", "text"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setHelpUrl("https://www.arduino.cc/en/Reference/LiquidCrystalSetCursor")
    .setArduinoGenerator((b, generator) => {
      let column = generator.valueToCode(b, "column", generator.ORDER_ATOMIC);
      let row = generator.valueToCode(b, "row", generator.ORDER_ATOMIC);
      column = lcdCursorIndex(column);
      row = lcdCursorIndex(row);
      const text = generator.valueToCode(
        b,
        "texttoprint",
        generator.ORDER_ATOMIC
      );
      return (
        `lcd.setCursor(${column}, ${row});\n` + `lcd.print(${text});\n`
      );
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField(
      "📟" + displayLabel("LCDP_SetCursor", "LCD I²C set cursor")
    );
    this.appendValueInput("column")
      .setCheck("Number")
      .appendField(displayLabel("LCDP_Column2", "column"));
    this.appendValueInput("row")
      .setCheck("Number")
      .appendField(displayLabel("LCDP_Row2", "row"));
    this.appendValueInput("texttoprint")
      .setCheck(null)
      .appendField(displayLabel("LCDP_Print", "print"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl("https://www.arduino.cc/en/Reference/LiquidCrystalSetCursor");
    attachShadowBlock(this, "column", "math_number", { NUM: 1 });
    attachShadowBlock(this, "row", "math_number", { NUM: 1 });
    attachShadowBlock(this, "texttoprint", "text", { TEXT: "I am a Robot" });
  };
  return block;
}

function buildLcdI2cSetCursorAlone() {
  const block = new BlockBuilder("lcdi2c_setcursoralone")
    .setCategory(LCD_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(LCD_LEVEL)
    .setTags(["displays", "lcd", "i2c"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setHelpUrl("https://www.arduino.cc/en/Reference/LiquidCrystalSetCursor")
    .setArduinoGenerator((b, generator) => {
      let column = generator.valueToCode(b, "column", generator.ORDER_ATOMIC);
      let row = generator.valueToCode(b, "row", generator.ORDER_ATOMIC);
      column = lcdCursorIndex(column);
      row = lcdCursorIndex(row);
      return `lcd.setCursor(${column}, ${row});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField(
      "📟" + displayLabel("LCDP_SetCursor", "LCD I²C set cursor")
    );
    this.appendValueInput("column")
      .setCheck("Number")
      .appendField(displayLabel("LCDP_Column2", "column"));
    this.appendValueInput("row")
      .setCheck("Number")
      .appendField(displayLabel("LCDP_Row2", "row"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setHelpUrl("https://www.arduino.cc/en/Reference/LiquidCrystalSetCursor");
    attachShadowBlock(this, "column", "math_number", { NUM: 1 });
    attachShadowBlock(this, "row", "math_number", { NUM: 1 });
  };
  return block;
}

function buildLcdI2cScrollDisplay() {
  const block = new BlockBuilder("lcdi2c_scrollDisplay")
    .setCategory(LCD_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(LCD_LEVEL)
    .setTags(["displays", "lcd", "i2c"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b) => {
      const option = b.getFieldValue("OUTPUT_DISPLAY");
      return option === "1"
        ? "lcd.scrollDisplayLeft();\n"
        : "lcd.scrollDisplayRight();\n";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(
        "📟" + displayLabel("LCDP_scrollDisplay", "LCD I²C scroll display ")
      )
      .appendField(
        new Blockly.FieldDropdown([
          ["Left", "1"],
          ["Right", "0"],
        ]),
        "OUTPUT_DISPLAY"
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  return block;
}

function buildLcdI2cShowCursor() {
  const block = new BlockBuilder("lcdi2c_showCursor")
    .setCategory(LCD_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(LCD_LEVEL)
    .setTags(["displays", "lcd", "i2c"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b) => {
      const option = b.getFieldValue("OUTPUT_DISPLAY");
      return option === "1" ? "lcd.cursor();\n" : "lcd.noCursor();\n";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(
        "📟" + displayLabel("LCDP_showCursor", "LCD I²C show cursor ")
      )
      .appendField(
        new Blockly.FieldDropdown([
          ["ON", "1"],
          ["OFF", "0"],
        ]),
        "OUTPUT_DISPLAY"
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  return block;
}

function buildLcdI2cBlinkCursor() {
  const block = new BlockBuilder("lcdi2c_blinkCursor")
    .setCategory(LCD_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(LCD_LEVEL)
    .setTags(["displays", "lcd", "i2c"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b) => {
      const option = b.getFieldValue("OUTPUT_DISPLAY");
      return option === "1" ? "lcd.blink();\n" : "lcd.noBlink();\n";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(
        "📟" + displayLabel("LCDP_blinkCursor", "LCD I²C blink cursor ")
      )
      .appendField(
        new Blockly.FieldDropdown([
          ["ON", "1"],
          ["OFF", "0"],
        ]),
        "OUTPUT_DISPLAY"
      );
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  return block;
}

export const LCD_I2C_BLOCKS = [
  buildLcdI2cSetup(),
  buildLcdI2cSetBacklight(),
  buildLcdI2cClear(),
  buildLcdI2cHome(),
  buildLcdI2cDisplay(),
  buildLcdI2cSetCursor(),
  buildLcdI2cSetCursorAlone(),
  buildLcdI2cScrollDisplay(),
  buildLcdI2cShowCursor(),
  buildLcdI2cBlinkCursor(),
];
