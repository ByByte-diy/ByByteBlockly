import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  DEFAULT_GAS_ANALOG_PIN,
  GAS_CATEGORY,
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

const DEFAULT_GAS_DIGITAL_PIN = "D2";

function buildGasAnalog(
  type: string,
  pinField: string,
  labelKey: string,
  labelFallback: string,
  tags: string[],
  iconFilename: string
) {
  const block = new BlockBuilder(type)
    .setCategory(GAS_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(tags)
    .setOutput("Number")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue(pinField);
      const mode = b.getFieldValue("OUTPUT_VALUE");
      ensureMrtnodeAnalogResolution(generator);
      return [analogReadExpression(pin, mode), generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(iconFilename))
      .appendField(sensingLabel(labelKey, labelFallback))
      .appendField(sensingLabel("PIN", "PIN"))
      .appendField(createAnalogPinDropdownField(), pinField);
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown(valuePercentOptions),
      "OUTPUT_VALUE"
    );
    applyDefaultAnalogPinFields(this, { [pinField]: DEFAULT_GAS_ANALOG_PIN });
    this.setOutput(true, "Number");
    this.setInputsInline(true);
  };
  return block;
}

function buildGasDigital(
  type: string,
  pinField: string,
  labelKey: string,
  labelFallback: string,
  detectedKey: string,
  setupPrefix: string,
  tags: string[],
  iconFilename: string
) {
  const block = new BlockBuilder(type)
    .setCategory(GAS_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(tags)
    .setOutput("Boolean")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue(pinField);
      registerDigitalInputSetup(generator, setupPrefix, pin);
      return [`digitalRead(${pin})`, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField(iconFilename))
      .appendField(sensingLabel(labelKey, labelFallback))
      .appendField(sensingLabel("PIN", "PIN"))
      .appendField(createAllPinDropdownField(), pinField)
      .appendField(sensingLabel(detectedKey, "detected"));
    applyDefaultAllPinFields(this, { [pinField]: DEFAULT_GAS_DIGITAL_PIN });
    this.setOutput(true, "Boolean");
    this.setInputsInline(true);
  };
  return block;
}

export const GAS_BLOCKS = [
  buildGasAnalog("Gas_sensor2", "PIN_GAS", "GAS_NAME", "gas CO", ["sensing", "gas", "mq"], "gas.png"),
  buildGasDigital(
    "Gas_status_sensor2",
    "PIN_GAS",
    "GAS_NAME",
    "gas CO",
    "GAS_DETECTED",
    "setup_gas",
    ["sensing", "gas", "mq"],
    "gas.png"
  ),
  buildGasAnalog(
    "Alcohol_sensor2",
    "PIN_ALCOHOL",
    "ALCOHOL_NAME",
    "alcohol",
    ["sensing", "gas", "alcohol", "mq"],
    "alcohol.png"
  ),
  buildGasDigital(
    "Alcohol_status_sensor2",
    "PIN_ALCOHOL",
    "ALCOHOL_NAME",
    "alcohol",
    "ALCOHOL_DETECTED",
    "setup_alcohol",
    ["sensing", "gas", "alcohol", "mq"],
    "alcohol.png"
  ),
];
