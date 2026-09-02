import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import { attachShadowBlock } from "../../../lib/helpers/shadow-block.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  NEOPIXEL_CATEGORY,
  NEOPIXEL_LEVEL,
} from "../config";
import {
  createBlockIconField,
  createPinDropdownField,
  createColourField,
  ensureNeoPixelInit,
  initBlockLabel,
  ledLabel,
  parseHexColor,
} from "../led.helper";

function buildPixelInit() {
  const block = new BlockBuilder("pixel_init")
    .setCategory(NEOPIXEL_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(NEOPIXEL_LEVEL)
    .setTags(["led", "neopixel", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_pixel1_tooltip}")
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue("pin");
      const count = generator.valueToCode(b, "num", generator.ORDER_ASSIGNMENT);
      ensureNeoPixelInit(generator, pin, count);
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("neopixel.png"))
      .appendField(initBlockLabel("pixel1", "NeoPixel"));
    this.appendDummyInput()
      .appendField(createPinDropdownField(), "pin");
    this.appendValueInput("num")
      .setCheck("Number")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(ledLabel("pixel4", "# of pixels"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      ledLabel("pixel1_tooltip", "NeoPixel: select data pin and pixel count.")
    );
    attachShadowBlock(this, "num", "math_number", { NUM: 8 });
  };
  return block;
}

function buildPixelShow() {
  const block = new BlockBuilder("pixel_show")
    .setCategory(NEOPIXEL_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(NEOPIXEL_LEVEL)
    .setTags(["led", "neopixel"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setTooltip("%{BKY_pixel2_tooltip}")
    .setArduinoGenerator((_b, _generator) => "pixel.show();\n")
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField(ledLabel("pixel2", "show pixels"));
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(ledLabel("pixel2_tooltip", "Push pixel buffer to the strip."));
  };
  return block;
}

function buildPixelClear() {
  const block = new BlockBuilder("pixel_clear")
    .setCategory(NEOPIXEL_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(NEOPIXEL_LEVEL)
    .setTags(["led", "neopixel"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setTooltip("%{BKY_pixel2_tooltip}")
    .setArduinoGenerator((_b, _generator) => "pixel.clear();\n")
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField("clear");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(ledLabel("pixel2_tooltip", "Clear all NeoPixel colors."));
  };
  return block;
}

function buildPixelSetBrightness() {
  const block = new BlockBuilder("pixel_setbrightness")
    .setCategory(NEOPIXEL_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(NEOPIXEL_LEVEL)
    .setTags(["led", "neopixel"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_pixel5_tooltip}")
    .setArduinoGenerator((b, generator) => {
      const brightness = generator.valueToCode(
        b,
        "brightness",
        generator.ORDER_ATOMIC
      );
      return `pixel.setBrightness(${brightness});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendValueInput("brightness")
      .setCheck("Number")
      .appendField(ledLabel("pixel5", "set brightness"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      ledLabel("pixel5_tooltip", "Adjust pixel brightness (0–255).")
    );
    attachShadowBlock(this, "brightness", "math_number", { NUM: 128 });
  };
  return block;
}

function buildPixelSetColor() {
  const block = new BlockBuilder("pixel_setcolor")
    .setCategory(NEOPIXEL_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(NEOPIXEL_LEVEL)
    .setTags(["led", "neopixel", "color"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_pixel3_tooltip}")
    .setArduinoGenerator((block, generator) => {
      const index = generator.valueToCode(block, "pin", generator.ORDER_ASSIGNMENT);
      const { r, g, b: blue } = parseHexColor(block.getFieldValue("color"));
      return `pixel.setPixelColor(${index}, ${r}, ${g}, ${blue});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendValueInput("pin")
      .setCheck("Number")
      .appendField(ledLabel("pixel6", "pixel #"));
    this.appendDummyInput()
      .appendField(ledLabel("pixel3", "color"))
      .appendField(createColourField("#ff0000"), "color");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      ledLabel("pixel3_tooltip", "Set one pixel color (index starts at 0).")
    );
    attachShadowBlock(this, "pin", "math_number", { NUM: 0 });
  };
  return block;
}

function buildPixelRgb() {
  const block = new BlockBuilder("pixel_rgb")
    .setCategory(NEOPIXEL_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(NEOPIXEL_LEVEL)
    .setTags(["led", "neopixel", "rgb"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_pixel3_tooltip}")
    .setArduinoGenerator((b, generator) => {
      const index = generator.valueToCode(b, "pin", generator.ORDER_ASSIGNMENT);
      const r = generator.valueToCode(b, "R", generator.ORDER_ATOMIC);
      const g = generator.valueToCode(b, "G", generator.ORDER_ATOMIC);
      const blue = generator.valueToCode(b, "B", generator.ORDER_ATOMIC);
      return `pixel.setPixelColor(${index},${r},${g},${blue});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendValueInput("pin")
      .setCheck("Number")
      .appendField(ledLabel("pixel6", "pixel #"));
    this.appendValueInput("R")
      .setCheck("Number")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField("R");
    this.appendValueInput("G")
      .setCheck("Number")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField("G");
    this.appendValueInput("B")
      .setCheck("Number")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField("B");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      ledLabel("pixel3_tooltip", "Set one pixel from R, G, B values.")
    );
    attachShadowBlock(this, "pin", "math_number", { NUM: 0 });
    attachShadowBlock(this, "R", "math_number", { NUM: 255 });
    attachShadowBlock(this, "G", "math_number", { NUM: 0 });
    attachShadowBlock(this, "B", "math_number", { NUM: 0 });
  };
  return block;
}

function buildPixelFill() {
  const block = new BlockBuilder("pixel_fill")
    .setCategory(NEOPIXEL_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(NEOPIXEL_LEVEL)
    .setTags(["led", "neopixel", "fill"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_pixel3_tooltip}")
    .setArduinoGenerator((block, _generator) => {
      const { r, g, b: blue } = parseHexColor(block.getFieldValue("color"));
      return (
        "pixel.clear();\n" +
        `pixel.fill(pixel.Color(${r}, ${g}, ${blue}));\n` +
        "pixel.show();\n"
      );
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField("fill")
      .appendField(ledLabel("pixel3", "color"))
      .appendField(createColourField("#ff0000"), "color");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(ledLabel("pixel3_tooltip", "Fill all pixels with one color."));
  };
  return block;
}

function buildPixelFill2() {
  const block = new BlockBuilder("pixel_fill2")
    .setCategory(NEOPIXEL_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(NEOPIXEL_LEVEL)
    .setTags(["led", "neopixel", "fill"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_pixel3_tooltip}")
    .setArduinoGenerator((b, generator) => {
      const r = generator.valueToCode(b, "R", generator.ORDER_ATOMIC);
      const g = generator.valueToCode(b, "G", generator.ORDER_ATOMIC);
      const blue = generator.valueToCode(b, "B", generator.ORDER_ATOMIC);
      return `pixel.fill(pixel.Color(${r}, ${g}, ${blue}));\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField("fill")
      .appendField(ledLabel("pixel3", "color"));
    this.appendValueInput("R")
      .setCheck("Number")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField("R");
    this.appendValueInput("G")
      .setCheck("Number")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField("G");
    this.appendValueInput("B")
      .setCheck("Number")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField("B");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(ledLabel("pixel3_tooltip", "Fill all pixels from R, G, B."));
    attachShadowBlock(this, "R", "math_number", { NUM: 255 });
    attachShadowBlock(this, "G", "math_number", { NUM: 0 });
    attachShadowBlock(this, "B", "math_number", { NUM: 0 });
  };
  return block;
}

export const NEOPIXEL_BLOCKS = [
  buildPixelInit(),
  buildPixelShow(),
  buildPixelClear(),
  buildPixelSetBrightness(),
  buildPixelSetColor(),
  buildPixelRgb(),
  buildPixelFill(),
  buildPixelFill2(),
];
