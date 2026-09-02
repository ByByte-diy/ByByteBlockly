import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import {
  registerDefinition,
  registerInclude,
} from "../../../lib/generators/codegen-sections.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  MRTX_BOARD_IDS,
  RGB_CATEGORY,
  RGB_LEVEL,
} from "../config";
import {
  createBlockIconField,
  createPwmPinDropdownField,
  createColourField,
  ensureRgbPwmInit,
  initBlockLabel,
  ledLabel,
  parseHexColor,
} from "../led.helper";
import { attachShadowBlock } from "../../../lib/helpers/shadow-block.helper";

function buildRgbInit() {
  const block = new BlockBuilder("rgb_init")
    .setCategory(RGB_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(RGB_LEVEL)
    .setTags(["led", "rgb", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_rvb_init_tooltip}")
    .setArduinoGenerator((b, generator) => {
      const rouge = b.getFieldValue("rouge");
      const vert = b.getFieldValue("vert");
      const bleu = b.getFieldValue("bleu");
      ensureRgbPwmInit(generator, rouge, vert, bleu, false);
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("rgb.png"))
      .appendField(initBlockLabel("rvb_init", "RGB LED"));
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField("R")
      .appendField(createPwmPinDropdownField(), "rouge");
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField("G")
      .appendField(createPwmPinDropdownField(), "vert");
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField("B")
      .appendField(createPwmPinDropdownField(), "bleu");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      ledLabel("rvb_init_tooltip", "Select PWM pins for the RGB LED.")
    );
  };
  return block;
}

function buildRgbInitEsp32() {
  const block = new BlockBuilder("rgb_init_esp32")
    .setCategory(RGB_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(RGB_LEVEL)
    .setTags(["led", "rgb", "init", "esp32"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_rvb_init_tooltip}")
    .setArduinoGenerator((b, generator) => {
      const rouge = b.getFieldValue("rouge");
      const vert = b.getFieldValue("vert");
      const bleu = b.getFieldValue("bleu");
      ensureRgbPwmInit(generator, rouge, vert, bleu, true);
      return "";
    })
    .build();

  block.metadata = {
    ...block.metadata,
    requiredBoardTypes: ["esp32"],
  };

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("rgb.png"))
      .appendField(initBlockLabel("rvb_init", "RGB LED"));
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField("R")
      .appendField(createPwmPinDropdownField(), "rouge");
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField("G")
      .appendField(createPwmPinDropdownField(), "vert");
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField("B")
      .appendField(createPwmPinDropdownField(), "bleu");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      ledLabel("rvb_init_tooltip", "Select PWM pins for the RGB LED (ESP32 LEDC).")
    );
  };
  return block;
}

function buildRgbSet() {
  const block = new BlockBuilder("rgb_set")
    .setCategory(RGB_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(RGB_LEVEL)
    .setTags(["led", "rgb"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_rvb_set_tooltip}")
    .setArduinoGenerator((b, generator) => {
      const r = generator.valueToCode(b, "r", generator.ORDER_ATOMIC);
      const v = generator.valueToCode(b, "v", generator.ORDER_ATOMIC);
      const blue = generator.valueToCode(b, "b", generator.ORDER_ATOMIC);
      return `setColor(${r},${v},${blue});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField(ledLabel("rvb_set", "show color"));
    this.appendValueInput("r")
      .setCheck("Number")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField("R");
    this.appendValueInput("v")
      .setCheck("Number")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField("G");
    this.appendValueInput("b")
      .setCheck("Number")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField("B");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      ledLabel("rvb_set_tooltip", "Set RGB color from red, green and blue values.")
    );
    attachShadowBlock(this, "r", "math_number", { NUM: 255 });
    attachShadowBlock(this, "v", "math_number", { NUM: 0 });
    attachShadowBlock(this, "b", "math_number", { NUM: 0 });
  };
  return block;
}

function buildRgbSetColor() {
  const block = new BlockBuilder("rgb_setcolor")
    .setCategory(RGB_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(RGB_LEVEL)
    .setTags(["led", "rgb", "color"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_rvb_set_tooltip}")
    .setArduinoGenerator((block, _generator) => {
      const { r, g, b: blue } = parseHexColor(block.getFieldValue("color"));
      return `setColor(${r},${g},${blue});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(ledLabel("rvb_set", "show color"))
      .appendField(ledLabel("rvb_cathode", "common cathode"));
    this.appendDummyInput().appendField(createColourField("#ff0000"), "color");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      ledLabel("rvb_set_tooltip", "Set RGB color from a colour picker.")
    );
  };
  return block;
}

function buildRgbSetColorAnode() {
  const block = new BlockBuilder("rgb_setcolor_anode")
    .setCategory(RGB_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(RGB_LEVEL)
    .setTags(["led", "rgb", "color", "anode"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_rvb_set_tooltip}")
    .setArduinoGenerator((block, _generator) => {
      const { r, g, b: blue } = parseHexColor(block.getFieldValue("color"));
      return `setColor(${255 - r},${255 - g},${255 - blue});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(ledLabel("rvb_set", "show color"))
      .appendField(ledLabel("rvb_anode", "common anode"));
    this.appendDummyInput().appendField(createColourField("#ff0000"), "color");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      ledLabel("rvb_set_tooltip", "Set RGB color for common-anode wiring.")
    );
  };
  return block;
}

function buildMrtxLedSetColor() {
  const block = new BlockBuilder("MRTX_led_setcolor")
    .setCategory(RGB_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setBoards([...MRTX_BOARD_IDS])
    .setLevel(RGB_LEVEL)
    .setTags(["led", "rgb", "mrtx"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setTooltip("%{BKY_rvb_set_tooltip}")
    .setArduinoGenerator((b, generator) => {
      const color = b.getFieldValue("color");
      const red = color[1] === "f" ? 1 : 0;
      const green = color[3] === "f" ? 1 : 0;
      const blue = color[5] === "f" ? 1 : 0;

      registerInclude(generator, "Adafruit_MCP23X08.h");
      registerDefinition(
        generator,
        "define_MCP23X08",
        "Adafruit_MCP23X08 mcp;",
        "MCP23008 expander for MRTX on-board RGB LED."
      );
      generator.setups_["mcp_begin"] = "mcp.begin_I2C();\n";
      generator.setups_["setup_mcp1_pin_g_write"] = "mcp.pinMode(1, OUTPUT);";
      generator.setups_["setup_mcp2_pin_b_write"] = "mcp.pinMode(2, OUTPUT);";
      generator.setups_["setup_mcp3_pin_r_write"] = "mcp.pinMode(3, OUTPUT);";

      return (
        `mcp.digitalWrite(1, ${red});\n` +
        `  mcp.digitalWrite(2, ${green});\n` +
        `  mcp.digitalWrite(3, ${blue});\n`
      );
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    const field = createColourField("#ff0000");
    field.setColours([
      "#ff0000",
      "#ffff00",
      "#ff00ff",
      "#ffffff",
      "#000000",
      "#00ff00",
      "#00ffff",
      "#0000ff",
      "#ff0000",
    ]);
    field.setColumns(3);
    this.appendDummyInput().appendField(
      ledLabel("rvb_set_x", "board RGB LED show color")
    );
    this.appendDummyInput().appendField(field, "color");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      ledLabel("rvb_set_tooltip", "Set on-board RGB LED on MRTX via MCP23008.")
    );
  };
  return block;
}

export const RGB_BLOCKS = [
  buildRgbInit(),
  buildRgbInitEsp32(),
  buildRgbSet(),
  buildRgbSetColor(),
  buildRgbSetColorAnode(),
  buildMrtxLedSetColor(),
];
