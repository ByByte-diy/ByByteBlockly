import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import {
  appendMatrixLedGrid,
  isMatrixPixelOn,
  MATRIX_PIXEL_COUNT,
} from "../../../lib/helpers/matrix-grid.helper";
import {
  registerDefinition,
  registerGlobalVariable,
  registerUserFunction,
} from "../../../lib/generators/codegen-sections.helper";
import { attachShadowBlock } from "../../../lib/helpers/shadow-block.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  DEFAULT_MAX7219_PINS,
  MATRIX_CATEGORY,
  MAX7219_DISPLAY_COUNT_OPTIONS,
  MAX7219_DISPLAY_INDEX_OPTIONS,
  MAX7219_LED_POWER_OPTIONS,
  MAX7219_SHUTDOWN_OPTIONS,
  OTTO_MOVE_SPEED_OPTIONS,
  MATRIX_LEVEL,
} from "../config";
import {
  applyDefaultAllPinFields,
  createBlockIconField,
  createPinDropdownField,
  ensureMax7219Init,
  initBlockLabel,
  ledLabel,
} from "../led.helper";

function generateMax7219DrawCode(
  block: Blockly.Block,
  displayIndex: string
): string {
  let code = "";
  let rowCounter = 0;
  let rowValue = "B";
  let rowLine = 0;

  for (let i = 0; i < MATRIX_PIXEL_COUNT; i++) {
    rowValue += isMatrixPixelOn(block, i) ? "1" : "0";
    rowCounter += 1;
    if (rowCounter === 8) {
      code += `lclm.setRow(${displayIndex},${rowLine},${rowValue});`;
      rowCounter = 0;
      rowValue = "B";
      rowLine += 1;
    }
  }
  return `${code}\n`;
}

function buildMax7219Init() {
  const block = new BlockBuilder("Init_MAX7219_ledmatrix")
    .setCategory(MATRIX_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(MATRIX_LEVEL)
    .setTags(["led", "max7219", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setHelpUrl("https://playground.arduino.cc/Main/LedControl")
    .setArduinoGenerator((b, generator) => {
      const clk = b.getFieldValue("PIN_CLK");
      const cs = b.getFieldValue("PIN_CS");
      const dat = b.getFieldValue("PIN_DAT");
      const count = b.getFieldValue("NumberDisplays");
      ensureMax7219Init(generator, dat, clk, cs, count);
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("matrix8x8.png"))
      .appendField(initBlockLabel("MAX7219_LM_NAME", "LED Matrix"))
      .appendField(ledLabel("MAX7219_LM_Number", "#"))
      .appendField(
        new Blockly.FieldDropdown(MAX7219_DISPLAY_COUNT_OPTIONS),
        "NumberDisplays"
      );
    this.appendDummyInput()
      .appendField(ledLabel("MAX7219_LM_CLK", "CLK"))
      .appendField(createPinDropdownField(), "PIN_CLK");
    this.appendDummyInput()
      .appendField(ledLabel("MAX7219_LM_CS", "CS"))
      .appendField(createPinDropdownField(), "PIN_CS");
    this.appendDummyInput()
      .appendField(ledLabel("MAX7219_LM_DAT", "DIN"))
      .appendField(createPinDropdownField(), "PIN_DAT");
    applyDefaultAllPinFields(this, {
      PIN_CLK: DEFAULT_MAX7219_PINS.CLK,
      PIN_CS: DEFAULT_MAX7219_PINS.CS,
      PIN_DAT: DEFAULT_MAX7219_PINS.DAT,
    });
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Init the MAX7219 library to use the 8×8 LED matrix.");
    this.setHelpUrl("https://playground.arduino.cc/Main/LedControl");
  };
  return block;
}

function buildMax7219Brightness() {
  const block = new BlockBuilder("MAX7219_ledmatrix_brightness")
    .setCategory(MATRIX_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(MATRIX_LEVEL)
    .setTags(["led", "max7219"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setHelpUrl("https://playground.arduino.cc/Main/LedControl")
    .setArduinoGenerator((b, generator) => {
      const brightness =
        generator.valueToCode(b, "BRIGHTNESS", generator.ORDER_ATOMIC) || "0";
      const displayIndex = b.getFieldValue("NumberDisplays");
      return `lclm.setIntensity(${displayIndex},${brightness});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("matrix8x8.png", "medium"))
      .appendField(ledLabel("MAX7219_LM_Number", "#"))
      .appendField(
        new Blockly.FieldDropdown(MAX7219_DISPLAY_INDEX_OPTIONS),
        "NumberDisplays"
      );
    this.appendValueInput("BRIGHTNESS")
      .setCheck("Number")
      .appendField(ledLabel("MAX7219_LM_Brightness", "brightness"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Configure the brightness of the LEDs (0–15).");
    attachShadowBlock(this, "BRIGHTNESS", "math_number", { NUM: 8 });
  };
  return block;
}

function buildMax7219Shutdown() {
  const block = new BlockBuilder("MAX7219_ledmatrix_shutdown")
    .setCategory(MATRIX_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(MATRIX_LEVEL)
    .setTags(["led", "max7219"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setHelpUrl("https://playground.arduino.cc/Main/LedControl")
    .setArduinoGenerator((b, _generator) => {
      const power = b.getFieldValue("power");
      const displayIndex = b.getFieldValue("NumberDisplays");
      return `lclm.shutdown(${displayIndex},${power});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("matrix8x8.png", "medium"))
      .appendField(ledLabel("MAX7219_LM_Number", "#"))
      .appendField(
        new Blockly.FieldDropdown(MAX7219_DISPLAY_INDEX_OPTIONS),
        "NumberDisplays"
      )
      .appendField(ledLabel("MAX7219_LM_SHUTDOWN", "activate"))
      .appendField(new Blockly.FieldDropdown(MAX7219_SHUTDOWN_OPTIONS), "power");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Switch all matrix LEDs off or on (data is retained).");
  };
  return block;
}

function buildMax7219Clear() {
  const block = new BlockBuilder("MAX7219_ledmatrix_clear")
    .setCategory(MATRIX_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(MATRIX_LEVEL)
    .setTags(["led", "max7219"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setHelpUrl("https://playground.arduino.cc/Main/LedControl")
    .setArduinoGenerator((b, _generator) => {
      const displayIndex = b.getFieldValue("NumberDisplays");
      return `lclm.clearDisplay(${displayIndex});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("matrix8x8.png", "medium"))
      .appendField(ledLabel("MAX7219_LM_Number", "#"))
      .appendField(
        new Blockly.FieldDropdown(MAX7219_DISPLAY_INDEX_OPTIONS),
        "NumberDisplays"
      )
      .appendField(ledLabel("MAX7219_LM_CLEAR", "clear"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Clear the display.");
  };
  return block;
}

function buildMax7219Row() {
  const block = new BlockBuilder("MAX7219_ledmatrix_row")
    .setCategory(MATRIX_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(MATRIX_LEVEL)
    .setTags(["led", "max7219"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setHelpUrl("https://playground.arduino.cc/Main/LedControl")
    .setArduinoGenerator((b, generator) => {
      const displayIndex = b.getFieldValue("NumberDisplays");
      const row =
        generator.valueToCode(b, "Row", generator.ORDER_ATOMIC) || "0";
      const value =
        generator.valueToCode(b, "VALUE", generator.ORDER_ATOMIC) || "0";
      return `lclm.setRow(${displayIndex},${row},${value});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("matrix8x8.png", "medium"))
      .appendField(ledLabel("MAX7219_LM_Number", "#"))
      .appendField(
        new Blockly.FieldDropdown(MAX7219_DISPLAY_INDEX_OPTIONS),
        "NumberDisplays"
      );
    this.appendValueInput("Row")
      .setCheck("Number")
      .appendField(ledLabel("MAX7219_LM_Row", "row"));
    this.appendValueInput("VALUE")
      .setCheck("Number")
      .appendField(ledLabel("MAX7219_LM_value", "value"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    attachShadowBlock(this, "Row", "math_number", { NUM: 0 });
    attachShadowBlock(this, "VALUE", "math_number", { NUM: 0 });
  };
  return block;
}

function buildMax7219Column() {
  const block = new BlockBuilder("MAX7219_ledmatrix_column")
    .setCategory(MATRIX_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(MATRIX_LEVEL)
    .setTags(["led", "max7219"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setHelpUrl("https://playground.arduino.cc/Main/LedControl")
    .setArduinoGenerator((b, generator) => {
      const displayIndex = b.getFieldValue("NumberDisplays");
      const column =
        generator.valueToCode(b, "Column", generator.ORDER_ATOMIC) || "0";
      const value =
        generator.valueToCode(b, "VALUE", generator.ORDER_ATOMIC) || "0";
      return `lclm.setColumn(${displayIndex},${column},${value});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("matrix8x8.png", "medium"))
      .appendField(ledLabel("MAX7219_LM_Number", "#"))
      .appendField(
        new Blockly.FieldDropdown(MAX7219_DISPLAY_INDEX_OPTIONS),
        "NumberDisplays"
      );
    this.appendValueInput("Column")
      .setCheck("Number")
      .appendField(ledLabel("MAX7219_LM_Column", "column"));
    this.appendValueInput("VALUE")
      .setCheck("Number")
      .appendField(ledLabel("MAX7219_LM_value", "value"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    attachShadowBlock(this, "Column", "math_number", { NUM: 0 });
    attachShadowBlock(this, "VALUE", "math_number", { NUM: 0 });
  };
  return block;
}

function buildMax7219Led() {
  const block = new BlockBuilder("MAX7219_ledmatrix_led")
    .setCategory(MATRIX_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(MATRIX_LEVEL)
    .setTags(["led", "max7219"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setHelpUrl("https://playground.arduino.cc/Main/LedControl")
    .setArduinoGenerator((b, generator) => {
      const displayIndex = b.getFieldValue("NumberDisplays");
      const row =
        generator.valueToCode(b, "Row", generator.ORDER_ATOMIC) || "0";
      const column =
        generator.valueToCode(b, "Column", generator.ORDER_ATOMIC) || "0";
      const power = b.getFieldValue("power");
      return `lclm.setLed(${displayIndex},${row},${column},${power});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("matrix8x8.png", "medium"))
      .appendField(ledLabel("MAX7219_LM_Number", "#"))
      .appendField(
        new Blockly.FieldDropdown(MAX7219_DISPLAY_INDEX_OPTIONS),
        "NumberDisplays"
      );
    this.appendValueInput("Row")
      .setCheck("Number")
      .appendField(ledLabel("MAX7219_LM_Row", "row"));
    this.appendValueInput("Column")
      .setCheck("Number")
      .appendField(ledLabel("MAX7219_LM_Column", "column"));
    this.appendDummyInput()
      .appendField(ledLabel("MAX7219_LM_Led", "LED"))
      .appendField(new Blockly.FieldDropdown(MAX7219_LED_POWER_OPTIONS), "power");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    attachShadowBlock(this, "Row", "math_number", { NUM: 0 });
    attachShadowBlock(this, "Column", "math_number", { NUM: 0 });
  };
  return block;
}

function buildMax7219Draw() {
  const block = new BlockBuilder("MAX7219_ledmatrix_draw")
    .setCategory(MATRIX_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(MATRIX_LEVEL)
    .setTags(["led", "max7219", "draw"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setHelpUrl("https://playground.arduino.cc/Main/LedControl")
    .setArduinoGenerator((b, _generator) =>
      generateMax7219DrawCode(b, b.getFieldValue("NumberDisplays"))
    )
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("matrix8x8.png", "medium"))
      .appendField(ledLabel("MAX7219_LM_Number", "#"))
      .appendField(
        new Blockly.FieldDropdown(MAX7219_DISPLAY_INDEX_OPTIONS),
        "NumberDisplays"
      )
      .appendField(ledLabel("MAX7219_LM_PAINT", "draw"));
    appendMatrixLedGrid(this);
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Paint an image on the 8×8 matrix.");
  };
  return block;
}

function buildMax7219Animation() {
  const block = new BlockBuilder("MAX7219_animation")
    .setCategory(MATRIX_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(MATRIX_LEVEL)
    .setTags(["led", "max7219", "animation"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b, generator) => {
      const bitmap = b.getFieldValue("bitmap");
      const displayIndex = b.getFieldValue("NumberDisplays");
      const speed = b.getFieldValue("otto_move_speed");

      registerGlobalVariable(
        generator,
        "matrix_animation",
        "int ii = 0;",
        "Animation frame index for MAX7219 matrix."
      );
      registerDefinition(
        generator,
        "matrix_animation",
        `const uint64_t IMAGES[] = {${bitmap}};\nconst int IMAGES_LEN = sizeof(IMAGES)/8;`,
        "Bitmap frames for matrix animation."
      );
      registerUserFunction(
        generator,
        "matrix_animation",
        `void displayImage(uint64_t image) {for (int ii = 0; ii < 8; ii++) { byte row = (image >> ii * 8) & 0xFF; for (int jj = 0; jj < 8; jj++) { lclm.setLed(${displayIndex}, ii, jj, bitRead(row, jj)); } } }`,
        "Draw one 8×8 animation frame on the MAX7219 matrix."
      );

      return (
        "displayImage(IMAGES[ii]);\n" +
        "if (++ii >= IMAGES_LEN ) { ii = 0;} \n" +
        `delay(${speed});\n`
      );
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("matrix8x8.png", "medium"))
      .appendField(ledLabel("MAX7219_LM_Number", "#"))
      .appendField(
        new Blockly.FieldDropdown(MAX7219_DISPLAY_INDEX_OPTIONS),
        "NumberDisplays"
      );
    this.appendDummyInput().appendField(
      `${ledLabel("matrice", "matrix")} animation`
    );
    this.appendDummyInput().appendField(
      new Blockly.FieldTextInput(
        "0x0010107c10100000,0x0000003c00000000,0x006c38fe386c0000,0x00060c1830600000,0x60660c1830660600,0x00003c003c000000,0x000000365c000000"
      ),
      "bitmap"
    );
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(ledLabel("OTTO9_MOVE_SPEED_TEXT", "speed"))
      .appendField(
        new Blockly.FieldDropdown(OTTO_MOVE_SPEED_OPTIONS),
        "otto_move_speed"
      );
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      ledLabel(
        "matrice8x8_del_tooltip",
        "Play a bitmap animation on the MAX7219 matrix."
      )
    );
  };
  return block;
}

export const MAX7219_BLOCKS = [
  buildMax7219Init(),
  buildMax7219Brightness(),
  buildMax7219Shutdown(),
  buildMax7219Clear(),
  buildMax7219Row(),
  buildMax7219Column(),
  buildMax7219Led(),
  buildMax7219Draw(),
  buildMax7219Animation(),
];
