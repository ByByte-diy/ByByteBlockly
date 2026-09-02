import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import {
  registerDefinition,
  registerInclude,
} from "../../../lib/generators/codegen-sections.helper";
import {
  BUTTONS_CATEGORY,
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  DEFAULT_BUTTON_PIN,
  MRTNODE_BOARD_IDS,
  MRTX_BOARD_IDS,
  SENSING_SUBCATEGORY_LEVEL,
} from "../config";
import {
  applyDefaultAllPinFields,
  createAllPinDropdownField,
  createBlockIconField,
  registerDigitalInputSetup,
  sensingLabel,
} from "../sensing.helper";

function buildButtonDigital() {
  const block = new BlockBuilder("button_sensor2")
    .setCategory(BUTTONS_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "button", "digital"])
    .setOutput("Boolean")
    .setInputsInline(true)
    .setTooltip("%{BKY_BUTTON_SENSOR_TOOLTIP}")
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue("PIN_BUTTON");
      const logic = b.getFieldValue("LOGIC");
      registerDigitalInputSetup(generator, "setup_btn1white", pin);
      const code =
        logic === "TRUE" ? `(!digitalRead(${pin}))` : `digitalRead(${pin})`;
      return [code, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("button.png"))
      .appendField(sensingLabel("BUTTON_NAME", "button"))
      .appendField(sensingLabel("PIN", "PIN"))
      .appendField(createAllPinDropdownField(), "PIN_BUTTON");
    this.appendDummyInput()
      .appendField(sensingLabel("BUTTON_PRESSED", "pressed?"))
      .appendField(new Blockly.FieldCheckbox("FALSE"), "LOGIC");
    applyDefaultAllPinFields(this, { PIN_BUTTON: DEFAULT_BUTTON_PIN });
    this.setOutput(true, "Boolean");
    this.setInputsInline(true);
    this.setTooltip(
      sensingLabel(
        "BUTTON_SENSOR_TOOLTIP",
        "Digital button. Check LOGIC inverse for active-low wiring."
      )
    );
  };
  return block;
}

function buildButtonTouch() {
  const block = new BlockBuilder("button_touch_sensor2")
    .setCategory(BUTTONS_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "button", "touch"])
    .setOutput("Boolean")
    .setInputsInline(true)
    .setTooltip("%{BKY_BUTTON_TOUCH_TOOLTIP}")
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue("PIN_BUTTON");
      const logic = b.getFieldValue("LOGIC");
      registerDigitalInputSetup(generator, "setup_btntouch", pin);
      const code =
        logic === "TRUE" ? `digitalRead(${pin})` : `(!digitalRead(${pin}))`;
      return [code, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("sensor_touch.png"))
      .appendField(sensingLabel("BUTTON_TOUCH_NAME", "touch"))
      .appendField(sensingLabel("PIN", "PIN"))
      .appendField(createAllPinDropdownField(), "PIN_BUTTON");
    this.appendDummyInput()
      .appendField(sensingLabel("BUTTON_PRESSED", "pressed?"))
      .appendField(new Blockly.FieldCheckbox("FALSE"), "LOGIC");
    applyDefaultAllPinFields(this, { PIN_BUTTON: DEFAULT_BUTTON_PIN });
    this.setOutput(true, "Boolean");
    this.setInputsInline(true);
    this.setTooltip(
      sensingLabel("BUTTON_TOUCH_TOOLTIP", "Capacitive touch pad as digital input.")
    );
  };
  return block;
}

function buildMrtxButton() {
  const block = new BlockBuilder("MRTX_button")
    .setCategory(BUTTONS_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setBoards([...MRTX_BOARD_IDS])
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "button", "mrt"])
    .setOutput("Boolean")
    .setInputsInline(true)
    .setTooltip("%{BKY_MRTX_BUTTON_TOOLTIP}")
    .setArduinoGenerator((_b, generator) => {
      registerInclude(generator, "Adafruit_MCP23X08.h");
      registerDefinition(
        generator,
        "mcp",
        "Adafruit_MCP23X08 mcp;",
        "MCP23008 I/O expander for MRTX on-board button."
      );
      generator.setups_["mcp_begin"] = "mcp.begin_I2C();\n";
      generator.setups_["mcp0_pin"] = "mcp.pinMode(0, INPUT_PULLUP);";
      return ["!mcp.digitalRead(0)", generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("joystick.png"))
      .appendField(sensingLabel("MRTX_BUTTON", "MRTNode start button pressed?"));
    this.setOutput(true, "Boolean");
    this.setInputsInline(true);
    this.setTooltip(
      sensingLabel("MRTX_BUTTON_TOOLTIP", "On-board start button on MRTX-Uno (MCP23008).")
    );
  };
  return block;
}

function buildMrtNodeButton() {
  const block = new BlockBuilder("MRTNode_button")
    .setCategory(BUTTONS_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setBoards([...MRTNODE_BOARD_IDS])
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "button", "mrt"])
    .setOutput("Boolean")
    .setInputsInline(true)
    .setTooltip("%{BKY_MRTX_BUTTON_TOOLTIP}")
    .setArduinoGenerator((_b, generator) => {
      generator.setups_["buttonNode_pin"] = "pinMode(0, INPUT_PULLUP);";
      return ["!digitalRead(0)", generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("joystick.png"))
      .appendField(sensingLabel("MRTX_BUTTON", "MRTNode start button pressed?"));
    this.setOutput(true, "Boolean");
    this.setInputsInline(true);
    this.setTooltip(
      sensingLabel("MRTX_BUTTON_TOOLTIP", "On-board start button on MRTnode (GPIO 0).")
    );
  };
  return block;
}

export const BUTTONS_BLOCKS = [
  buildButtonDigital(),
  buildButtonTouch(),
  buildMrtxButton(),
  buildMrtNodeButton(),
];
