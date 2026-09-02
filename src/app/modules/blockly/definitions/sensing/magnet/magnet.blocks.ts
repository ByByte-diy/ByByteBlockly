import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  DEFAULT_HUMIDITY_ANALOG_PIN,
  MAGNET_CATEGORY,
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
  registerDigitalInputSetup,
  sensingLabel,
  valuePercentOptions,
} from "../sensing.helper";

function buildHallDigital() {
  const block = new BlockBuilder("hall_sensor2")
    .setCategory(MAGNET_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "magnet", "hall"])
    .setOutput("Boolean")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue("PIN_HALL");
      registerDigitalInputSetup(generator, "setup_hall", pin);
      return [`digitalRead(${pin})`, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("hall.png"))
      .appendField(sensingLabel("HALL_NAME", "hall magnetic"))
      .appendField(sensingLabel("PIN", "PIN"))
      .appendField(createAllPinDropdownField(), "PIN_HALL")
      .appendField(sensingLabel("HALL_DETECTED", "detected"));
    applyDefaultAllPinFields(this, { PIN_HALL: "D2" });
    this.setOutput(true, "Boolean");
    this.setInputsInline(true);
  };
  return block;
}

function buildHallAnalog() {
  const block = new BlockBuilder("hall_sensor2_analog")
    .setCategory(MAGNET_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "magnet", "hall", "analog"])
    .setOutput("Number")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue("PIN_MAG");
      const mode = b.getFieldValue("OUTPUT_VALUE");
      ensureMrtnodeAnalogResolution(generator);
      return [analogReadExpression(pin, mode), generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("hall.png"))
      .appendField(sensingLabel("HALL_NAME", "hall magnetic"))
      .appendField(sensingLabel("PIN", "PIN"))
      .appendField(createAnalogPinDropdownField(), "PIN_MAG");
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown(valuePercentOptions),
      "OUTPUT_VALUE"
    );
    applyDefaultAnalogPinFields(this, { PIN_MAG: DEFAULT_HUMIDITY_ANALOG_PIN });
    this.setOutput(true, "Number");
    this.setInputsInline(true);
  };
  return block;
}

export const MAGNET_BLOCKS = [buildHallDigital(), buildHallAnalog()];
