import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  DEFAULT_JOYSTICK_AXIS_PIN,
  DEFAULT_JOYSTICK_BUTTON_PIN,
  JOYSTICK_CATEGORY,
  SENSING_SUBCATEGORY_LEVEL,
} from "../config";
import {
  analogReadExpression,
  applyDefaultAllPinFields,
  applyDefaultAnalogPinFields,
  createAllPinDropdownField,
  createAnalogPinDropdownField,
  createBlockIconField,
  ensureMrtnodeAnalogResolution,
  registerPullupInputSetup,
  sensingLabel,
  valuePercentOptions,
} from "../sensing.helper";

function joystickAxisOptions(): [string, string][] {
  return [
    ["X", "0"],
    ["Y", "1"],
  ];
}

function buildJoystickAxis() {
  const block = new BlockBuilder("Joystick_axis_sensor2")
    .setCategory(JOYSTICK_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "joystick", "analog"])
    .setOutput("Number")
    .setInputsInline(true)
    .setTooltip("%{BKY_JOYSTICK_AXIS_TOOLTIP}")
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue("PIN_JOYSTICK");
      const mode = b.getFieldValue("OUTPUT_VALUE");
      ensureMrtnodeAnalogResolution(generator);
      return [analogReadExpression(pin, mode), generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("joystick.png"))
      .appendField(sensingLabel("JOYSTICK_NAME", "joystick axis"))
      .appendField(new Blockly.FieldDropdown(joystickAxisOptions), "OUTPUT_AXIS")
      .appendField(sensingLabel("PIN", "PIN"))
      .appendField(createAnalogPinDropdownField(), "PIN_JOYSTICK");
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown(valuePercentOptions),
      "OUTPUT_VALUE"
    );
    applyDefaultAnalogPinFields(this, { PIN_JOYSTICK: DEFAULT_JOYSTICK_AXIS_PIN });
    this.setOutput(true, "Number");
    this.setInputsInline(true);
    this.setTooltip(
      sensingLabel("JOYSTICK_AXIS_TOOLTIP", "Analog joystick axis value.")
    );
  };
  return block;
}

function buildJoystickButton() {
  const block = new BlockBuilder("joystick_button_sensor2")
    .setCategory(JOYSTICK_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "joystick", "button"])
    .setOutput("Boolean")
    .setInputsInline(true)
    .setTooltip("%{BKY_JOYSTICK_BUTTON_TOOLTIP}")
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue("PIN_JOYSTICK2");
      registerPullupInputSetup(generator, "setup_btntouch", pin);
      return [`digitalRead(${pin})`, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("joystick.png"))
      .appendField(sensingLabel("JOYSTICK_BUTTON", "joystick button"))
      .appendField(sensingLabel("PIN", "PIN"))
      .appendField(createAllPinDropdownField(), "PIN_JOYSTICK2");
    applyDefaultAllPinFields(this, { PIN_JOYSTICK2: DEFAULT_JOYSTICK_BUTTON_PIN });
    this.setOutput(true, "Boolean");
    this.setInputsInline(true);
    this.setTooltip(
      sensingLabel(
        "JOYSTICK_BUTTON_TOOLTIP",
        "Joystick push button (INPUT_PULLUP, active LOW)."
      )
    );
  };
  return block;
}

export const JOYSTICK_BLOCKS = [buildJoystickAxis(), buildJoystickButton()];
