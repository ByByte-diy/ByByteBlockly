import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import { MATRIX_LED_ON_HEX } from "../../../lib/fields/field-matrix-led";
import {
  appendMatrixLedGrid,
  isMatrixPixelOn,
  MATRIX_PIXEL_COUNT,
} from "../../../lib/helpers/matrix-grid.helper";
import {
  registerDefinition,
  registerInclude,
} from "../../../lib/generators/codegen-sections.helper";
import { attachShadowBlock } from "../../../lib/helpers/shadow-block.helper";
import { formatPinMode } from "../../../lib/generators/pin-definitions.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  NEOMATRIX_CATEGORY,
  NEOMATRIX_LEVEL,
} from "../config";
import {
  createBlockIconField,
  createPinDropdownField,
  initBlockLabel,
  ledLabel,
} from "../led.helper";

function buildMatrixInit() {  const block = new BlockBuilder("MatrixLED_WS2812B_init_2")
    .setCategory(NEOMATRIX_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(NEOMATRIX_LEVEL)
    .setTags(["led", "neomatrix", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_pixel1_tooltip}")
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue("pin");
      registerInclude(
        generator,
        "Adafruit_NeoPixel.h",
        "Adafruit NeoPixel library for WS2812B matrices."
      );
      registerDefinition(
        generator,
        "define_Matrix_ledRGB_WS2812B NeoMatrix",
        `Adafruit_NeoPixel NeoMatrix = Adafruit_NeoPixel(${MATRIX_PIXEL_COUNT}, ${pin}, NEO_GRB + NEO_KHZ800);`,
        "8×8 WS2812B NeoPixel matrix instance."
      );
      generator.setups_["setup_Matrix_ledRGB_WS2812B NeoMatrix "] =
        formatPinMode(pin, "OUTPUT") + "NeoMatrix.begin();";
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("neopixelmatrix.png"))
      .appendField(
        `${initBlockLabel("pixel1", "NeoPixel")} ${ledLabel("matrice", "matrix")} 8x8`
      )
      .appendField(createPinDropdownField(), "pin");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      ledLabel("pixel1_tooltip", "Initialize 8×8 WS2812B NeoPixel matrix.")
    );
  };
  return block;
}

function buildMatrixSetPixelColor() {
  const block = new BlockBuilder("MatrixLED_WS2812B_setPixelColor")
    .setCategory(NEOMATRIX_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(NEOMATRIX_LEVEL)
    .setTags(["led", "neomatrix"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b, generator) => {
      const pixelNumber =
        generator.valueToCode(b, "Pixel_number", generator.ORDER_ATOMIC) ||
        "0";
      const red = generator.valueToCode(b, "Red", generator.ORDER_ATOMIC);
      const green = generator.valueToCode(b, "Green", generator.ORDER_ATOMIC);
      const blue = generator.valueToCode(b, "Blue", generator.ORDER_ATOMIC);
      const lumin = generator.valueToCode(
        b,
        "brightness",
        generator.ORDER_ATOMIC
      );
      return (
        `NeoMatrix.setPixelColor(${pixelNumber},NeoMatrix.Color(${red},${green},${blue},${lumin}));\n` +
        "NeoMatrix.show();\n"
      );
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(`${ledLabel("pixel1", "NeoPixel")} ${ledLabel("matrice", "matrix")}`);
    this.appendValueInput("Pixel_number")
      .setCheck("Number")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(ledLabel("pixel6", "pixel #"));
    this.appendValueInput("Red")
      .setCheck("Number")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField("R");
    this.appendValueInput("Green")
      .setCheck("Number")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField("G");
    this.appendValueInput("Blue")
      .setCheck("Number")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField("B");
    this.appendValueInput("brightness")
      .setCheck("Number")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(ledLabel("pixel5", "brightness"));
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    attachShadowBlock(this, "Pixel_number", "math_number", { NUM: 0 });
    attachShadowBlock(this, "Red", "math_number", { NUM: 255 });
    attachShadowBlock(this, "Green", "math_number", { NUM: 0 });
    attachShadowBlock(this, "Blue", "math_number", { NUM: 0 });
    attachShadowBlock(this, "brightness", "math_number", { NUM: 255 });
  };
  return block;
}

function buildMatrixSetBrightness() {
  const block = new BlockBuilder("MatrixLED_WS2812B_setBrightness")
    .setCategory(NEOMATRIX_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(NEOMATRIX_LEVEL)
    .setTags(["led", "neomatrix"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const lumin = generator.valueToCode(
        b,
        "brightness",
        generator.ORDER_ATOMIC
      );
      return `NeoMatrix.setBrightness(${lumin});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(`${ledLabel("pixel1", "NeoPixel")} ${ledLabel("matrice", "matrix")}`);
    this.appendValueInput("brightness")
      .setCheck("Number")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(ledLabel("pixel5", "brightness"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    attachShadowBlock(this, "brightness", "math_number", { NUM: 128 });
  };
  return block;
}

function buildMatrixClean() {
  const block = new BlockBuilder("MatrixLED_WS2812B_CLEAN")
    .setCategory(NEOMATRIX_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(NEOMATRIX_LEVEL)
    .setTags(["led", "neomatrix"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((_b, _generator) => "NeoMatrix.clear();\nNeoMatrix.show();\n")
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField(
      `clear ${ledLabel("pixel1", "NeoPixel")} ${ledLabel("matrice", "matrix")}`
    );
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  return block;
}

function buildMatrixDraw() {
  const block = new BlockBuilder("MatrixLED_WS2812B_draw")
    .setCategory(NEOMATRIX_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(NEOMATRIX_LEVEL)
    .setTags(["led", "neomatrix", "draw"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setArduinoGenerator((b, _generator) => {
      let code = "";
      for (let i = 0; i < MATRIX_PIXEL_COUNT; i++) {
        if (isMatrixPixelOn(b, i)) {
          code += `NeoMatrix.setPixelColor(${i}, 0x${MATRIX_LED_ON_HEX});\n`;
        }
      }
      code += "NeoMatrix.show();\n";
      return code;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    appendMatrixLedGrid(this);
    this.setInputsInline(false);    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  return block;
}

export const NEOMATRIX_BLOCKS = [
  buildMatrixInit(),
  buildMatrixSetPixelColor(),
  buildMatrixSetBrightness(),
  buildMatrixClean(),
  buildMatrixDraw(),
];
