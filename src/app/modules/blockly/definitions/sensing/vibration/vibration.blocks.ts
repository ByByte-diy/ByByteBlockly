import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  DEFAULT_HUMIDITY_ANALOG_PIN,
  SENSING_SUBCATEGORY_LEVEL,
  VIBRATION_CATEGORY,
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

const DEFAULT_VIBRATION_DIGITAL_PIN = "D2";

function buildVibrationAnalog() {
  const block = new BlockBuilder("Vibration_sensor2")
    .setCategory(VIBRATION_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "vibration"])
    .setOutput("Number")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue("PIN_VIBRATION");
      const mode = b.getFieldValue("OUTPUT_VALUE");
      ensureMrtnodeAnalogResolution(generator);
      return [analogReadExpression(pin, mode), generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("vibration.png"))
      .appendField(sensingLabel("VIBRATION_NAME", "vibration"))
      .appendField(sensingLabel("PIN", "PIN"))
      .appendField(createAnalogPinDropdownField(), "PIN_VIBRATION");
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown(valuePercentOptions),
      "OUTPUT_VALUE"
    );
    applyDefaultAnalogPinFields(this, {
      PIN_VIBRATION: DEFAULT_HUMIDITY_ANALOG_PIN,
    });
    this.setOutput(true, "Number");
    this.setInputsInline(true);
  };
  return block;
}

function buildVibrationDigital() {
  const block = new BlockBuilder("Vibration_status_sensor2")
    .setCategory(VIBRATION_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "vibration"])
    .setOutput("Boolean")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue("PIN_VIBRATION");
      registerDigitalInputSetup(generator, "setup_vibration", pin);
      return [`digitalRead(${pin})`, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("vibration.png"))
      .appendField(sensingLabel("VIBRATION_NAME", "vibration"))
      .appendField(sensingLabel("PIN", "PIN"))
      .appendField(createAllPinDropdownField(), "PIN_VIBRATION")
      .appendField(sensingLabel("VIBRATION_DETECTED", "detected"));
    applyDefaultAllPinFields(this, { PIN_VIBRATION: DEFAULT_VIBRATION_DIGITAL_PIN });
    this.setOutput(true, "Boolean");
    this.setInputsInline(true);
  };
  return block;
}

function buildTiltSensor() {
  const block = new BlockBuilder("tilt_sensor2")
    .setCategory(VIBRATION_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "vibration", "tilt"])
    .setOutput("Boolean")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue("PIN_BUTTON");
      registerDigitalInputSetup(generator, "setup_tilt", pin);
      return [`digitalRead(${pin})`, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("tilt.png"))
      .appendField(sensingLabel("TILT_NAME", "tilt"))
      .appendField(sensingLabel("PIN", "PIN"))
      .appendField(createAllPinDropdownField(), "PIN_BUTTON")
      .appendField(sensingLabel("TILT_DETECTED", "detected"));
    applyDefaultAllPinFields(this, { PIN_BUTTON: DEFAULT_VIBRATION_DIGITAL_PIN });
    this.setOutput(true, "Boolean");
    this.setInputsInline(true);
  };
  return block;
}

function buildKnockSensor() {
  const block = new BlockBuilder("knock_sensor2")
    .setCategory(VIBRATION_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "vibration", "knock"])
    .setOutput("Boolean")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue("PIN_BUTTON");
      registerDigitalInputSetup(generator, "setup_knock", pin);
      return [`digitalRead(${pin})`, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("knock.png"))
      .appendField(sensingLabel("KNOCK_NAME", "knock"))
      .appendField(sensingLabel("PIN", "PIN"))
      .appendField(createAllPinDropdownField(), "PIN_BUTTON")
      .appendField(sensingLabel("KNOCK_DETECTED", "detected"));
    applyDefaultAllPinFields(this, { PIN_BUTTON: DEFAULT_VIBRATION_DIGITAL_PIN });
    this.setOutput(true, "Boolean");
    this.setInputsInline(true);
  };
  return block;
}

export const VIBRATION_BLOCKS = [
  buildVibrationAnalog(),
  buildVibrationDigital(),
  buildTiltSensor(),
  buildKnockSensor(),
];
