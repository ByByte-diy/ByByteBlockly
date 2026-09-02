import * as Blockly from "blockly";
import { BlockBuilder } from "../../lib/builders/block-builder";
import { createVariableField } from "../../lib/variables/variable-type.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";
import {
  DIMENSION_OPTIONS,
  updateArrayDimensionInputs,
  attachArrayDimensionSerialization,
} from "./array-dimension.helper";

function buildIndexCode(block: Blockly.Block, generator: any): string {
  let code = generator.getVariableName(block.getFieldValue("VAR"));
  const dimension = parseInt(block.getFieldValue("dim"), 10);
  for (let i = 0; i < dimension; i++) {
    const index =
      generator.valueToCode(block, "D" + i, generator.ORDER_ASSIGNMENT) || "0";
    code += `[${index}]`;
  }
  return code;
}

export const setArrayBlock = new BlockBuilder("array_set")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["arrays"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setArduinoGenerator((block, generator) => {
    const value =
      generator.valueToCode(block, "value", generator.ORDER_ATOMIC) || "0";
    return `${buildIndexCode(block, generator)}=${value};\n`;
  })
  .build();

setArrayBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOR);
  this.appendDummyInput()
    .appendField(Blockly.Msg["ARRAY_fixe"] || "put the element of the array")
    .appendField(createVariableField(), "VAR")
    .appendField(Blockly.Msg["ARRAY_dim"] || "size of")
    .appendField(
      new Blockly.FieldDropdown(DIMENSION_OPTIONS, (option) => {
        (this as any).updateShape_(option);
        return undefined;
      }),
      "dim"
    );
  this.appendValueInput("value")
    .appendField(Blockly.Msg["_AT"] || "to");
  this.appendValueInput("D0")
    .setCheck("Number")
    .appendField(Blockly.Msg["ARRAY_index"] || "index");
  this.setInputsInline(true);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  this.setTooltip(
    Blockly.Msg["ARRAY_GETINDEX_TOOLTIP3"] ||
      "Set an element of the array to the given value."
  );

  (this as any).updateShape_ = function (option: string) {
    updateArrayDimensionInputs(this, option);
  };
  attachArrayDimensionSerialization(this);
};

export const getIndexBlock = new BlockBuilder("array_getIndex")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["arrays"])
  .setOutput(null)
  .setArduinoGenerator((block, generator) => {
    return [buildIndexCode(block, generator), generator.ORDER_ATOMIC];
  })
  .build();

getIndexBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOR);
  this.appendDummyInput()
    .appendField(Blockly.Msg["ARRAY_GETINDEX_ITEM"] || "the element of the array")
    .appendField(createVariableField(), "VAR")
    .appendField(Blockly.Msg["ARRAY_dim"] || "size of")
    .appendField(
      new Blockly.FieldDropdown(DIMENSION_OPTIONS, (option) => {
        (this as any).updateShape_(option);
        return undefined;
      }),
      "dim"
    );
  this.appendValueInput("D0")
    .setCheck("Number")
    .appendField(Blockly.Msg["ARRAY_index"] || "index");
  this.setInputsInline(true);
  this.setOutput(true, null);
  this.setTooltip(
    Blockly.Msg["ARRAY_GETINDEX_TOOLTIP1"] ||
      "Returns the value stored in the array."
  );

  (this as any).updateShape_ = function (option: string) {
    updateArrayDimensionInputs(this, option);
  };
  attachArrayDimensionSerialization(this);
};

export const getSizeBlock = new BlockBuilder("array_getsize")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["arrays"])
  .setOutput("Number")
  .setArduinoGenerator((block, generator) => {
    const list = generator.getVariableName(block.getFieldValue("VAR"));
    return [
      `sizeof(${list})/sizeof(${list}[0])`,
      generator.ORDER_ATOMIC,
    ];
  })
  .build();

getSizeBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOR);
  this.appendDummyInput()
    .appendField(Blockly.Msg["size"] || "array size")
    .appendField(createVariableField(), "VAR");
  this.setOutput(true, "Number");
  this.setTooltip(
    Blockly.Msg["size_TOOLTIP"] || "Returns the size of the array."
  );
};
