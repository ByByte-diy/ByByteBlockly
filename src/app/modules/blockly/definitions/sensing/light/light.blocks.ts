import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  LIGHT_CATEGORY,
  SENSING_SUBCATEGORY_LEVEL,
} from "../config";
import {
  analogReadExpression,
  applyDefaultAnalogPinFields,
  createAnalogPinDropdownField,
  createBlockIconField,
  createDigitalPinDropdownField,
  ensureMrtnodeAnalogResolution,
  registerDigitalInputSetup,
  sensingLabel,
  valuePercentOptions,
} from "../sensing.helper";

const DEFAULT_ANALOG_LIGHT_PIN = "A0";

function buildAnalogLightBlock(
  type: string,
  pinField: string,
  labelKey: string,
  labelFallback: string,
  setupPrefix: string,
  tags: string[],
  iconFilename: string
) {
  const block = new BlockBuilder(type)
    .setCategory(LIGHT_CATEGORY)
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
    applyDefaultAnalogPinFields(this, { [pinField]: DEFAULT_ANALOG_LIGHT_PIN });
    this.setOutput(true, "Number");
    this.setInputsInline(true);
  };
  return block;
}

function buildDigitalLightBlock(
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
    .setCategory(LIGHT_CATEGORY)
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
      .appendField(createDigitalPinDropdownField(), pinField)
      .appendField(sensingLabel(detectedKey, "detected"));
    this.setOutput(true, "Boolean");
    this.setInputsInline(true);
  };
  return block;
}

export const LIGHT_BLOCKS = [
  buildAnalogLightBlock(
    "LDR_sensor2",
    "PIN_LDR",
    "LDR_NAME",
    "photocell",
    "setup_ldr",
    ["sensing", "light", "ldr"],
    "light.png"
  ),
  buildDigitalLightBlock(
    "LDR_status_sensor2",
    "PIN_LDR",
    "LDR_NAME",
    "photocell",
    "LDR_DETECTED",
    "setup_ldr",
    ["sensing", "light", "ldr"],
    "light.png"
  ),
  buildAnalogLightBlock(
    "AmbientLight_sensor2",
    "PIN_ALIGHT",
    "ALIGHT_NAME",
    "ambient Light",
    "setup_alight",
    ["sensing", "light", "ambient"],
    "alight.png"
  ),
  buildAnalogLightBlock(
    "IR_sensor2",
    "PIN_IR",
    "IR_NAME",
    "infrared",
    "setup_ir",
    ["sensing", "light", "ir"],
    "linefollow.png"
  ),
  buildDigitalLightBlock(
    "IR_status_sensor2",
    "PIN_IR",
    "IR_NAME",
    "infrared",
    "IR_DETECTED",
    "setup_ir",
    ["sensing", "light", "ir"],
    "linefollow.png"
  ),
  buildDigitalLightBlock(
    "pir_sensor2",
    "PIN_PIR",
    "PIR_NAME",
    "PIR motion",
    "PIR_DETECTED",
    "setup_pir",
    ["sensing", "light", "pir"],
    "pir.png"
  ),
  buildDigitalLightBlock(
    "photointerrupter_sensor2",
    "PIN_BUTTON",
    "PHOTO_NAME",
    "photo interrupter",
    "PHOTO_DETECTED",
    "setup_photointerrupter",
    ["sensing", "light", "photointerrupter"],
    "photointerrupter.png"
  ),
];
