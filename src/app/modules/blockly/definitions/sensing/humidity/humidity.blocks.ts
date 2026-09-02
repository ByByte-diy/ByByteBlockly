import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  DEFAULT_HUMIDITY_ANALOG_PIN,
  HUMIDITY_CATEGORY,
  SENSING_SUBCATEGORY_LEVEL,
} from "../config";
import {
  analogReadInvertedExpression,
  applyDefaultAnalogPinFields,
  createAnalogPinDropdownField,
  createBlockIconField,
  ensureMrtnodeAnalogResolution,
  sensingLabel,
  valuePercentOptions,
} from "../sensing.helper";

function buildInvertedAnalogHumidityBlock(
  type: string,
  pinField: string,
  labelKey: string,
  labelFallback: string,
  tags: string[],
  iconFilename: string
) {
  const block = new BlockBuilder(type)
    .setCategory(HUMIDITY_CATEGORY)
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
      return [analogReadInvertedExpression(pin, mode), generator.ORDER_ATOMIC];
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
    applyDefaultAnalogPinFields(this, {
      [pinField]: DEFAULT_HUMIDITY_ANALOG_PIN,
    });
    this.setOutput(true, "Number");
    this.setInputsInline(true);
  };
  return block;
}

export const HUMIDITY_BLOCKS = [
  buildInvertedAnalogHumidityBlock(
    "Water_sensor2",
    "PIN_WATER",
    "WATER_NAME",
    "water level",
    ["sensing", "humidity", "water"],
    "water.png"
  ),
  buildInvertedAnalogHumidityBlock(
    "Moisture_sensor2",
    "PIN_MOISTURE",
    "MOISTURE_NAME",
    "soil moisture",
    ["sensing", "humidity", "moisture"],
    "moisture.png"
  ),
  buildInvertedAnalogHumidityBlock(
    "Vapor_sensor2",
    "PIN_VAPOR",
    "VAPOR_NAME",
    "steam",
    ["sensing", "humidity", "vapor"],
    "vapor.png"
  ),
];
