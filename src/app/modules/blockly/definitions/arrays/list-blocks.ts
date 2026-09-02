import * as Blockly from "blockly";
import { BlockBuilder } from "../../lib/builders/block-builder";
import { createVariableField } from "../../lib/variables/variable-type.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

export const listCreateBlock = new BlockBuilder("list_create")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["arrays", "list"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setPythonGenerator((block, generator) => {
    const varName = generator.getVariableName(block.getFieldValue("VAR"));
    const list =
      generator.valueToCode(block, "list", generator.ORDER_ATOMIC) || "[]";
    return `${varName} = ${list}\n`;
  })
  .build();

listCreateBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOR);
  this.appendValueInput("list")
    .appendField(Blockly.Msg["LISTS_CREATE1"] || "create a list")
    .appendField(createVariableField(), "VAR")
    .appendField(Blockly.Msg["LISTS_CREATE2"] || "with");
  this.setInputsInline(true);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  this.setTooltip(
    Blockly.Msg["LISTS_CREATE_TOOLTIP"] ||
      "Create a list with the desired number of items."
  );
};

export const listAppendBlock = new BlockBuilder("list_append")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["arrays", "list"])
  .setMessage("%{BKY_LISTS_append}")
  .addValueInput("value")
  .addVariableField("VAR")
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setTooltip("%{BKY_LISTS_append_TOOLTIP}")
  .setPythonGenerator((block, generator) => {
    const varName = generator.getVariableName(block.getFieldValue("VAR"));
    const value =
      generator.valueToCode(block, "value", generator.ORDER_ATOMIC) || "0";
    return `${varName}.append(${value})\n`;
  })
  .build();

export const listSizeBlock = new BlockBuilder("list_size")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["arrays", "list"])
  .setOutput(null)
  .setPythonGenerator((block, generator) => {
    const varName = generator.getVariableName(block.getFieldValue("VAR"));
    return [`len(${varName})`, generator.ORDER_FUNCTION_CALL];
  })
  .build();

listSizeBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOR);
  this.appendDummyInput()
    .appendField(Blockly.Msg["ARRAY_dim"] || "size of")
    .appendField(createVariableField(), "VAR");
  this.setOutput(true, null);
  this.setInputsInline(true);
  this.setTooltip(
    Blockly.Msg["size_TOOLTIP"] || "Returns the size of the list or array."
  );
};

export const listSetBlock = new BlockBuilder("list_set")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["arrays", "list"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setPythonGenerator((block, generator) => {
    const varName = generator.getVariableName(block.getFieldValue("VAR"));
    const index =
      generator.valueToCode(block, "index", generator.ORDER_ATOMIC) || "0";
    const value =
      generator.valueToCode(block, "value", generator.ORDER_ATOMIC) || "0";
    return `${varName}[${index}] = ${value}\n`;
  })
  .build();

listSetBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOR);
  this.appendValueInput("index").appendField(
    Blockly.Msg["LISTS_SET_INDEX_SET"] || "put the element"
  );
  this.appendDummyInput()
    .appendField(Blockly.Msg["LISTS_of"] || "of")
    .appendField(createVariableField(), "VAR");
  this.appendValueInput("value")
    .setAlign(Blockly.inputs.Align.RIGHT)
    .appendField(Blockly.Msg["_AT"] || "to");
  this.setInputsInline(true);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  this.setTooltip(
    Blockly.Msg["ARRAY_GETINDEX_TOOLTIP3"] ||
      "Set an element of the list to the given value."
  );
};

export const listGetBlock = new BlockBuilder("list_get")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["arrays", "list"])
  .setOutput(null)
  .setPythonGenerator((block, generator) => {
    const varName = generator.getVariableName(block.getFieldValue("VAR"));
    const index =
      generator.valueToCode(block, "index", generator.ORDER_ATOMIC) || "0";
    return [`${varName}[${index}]`, generator.ORDER_ATOMIC];
  })
  .build();

listGetBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOR);
  this.appendValueInput("index").appendField(
    Blockly.Msg["LISTS_GET"] || "the element"
  );
  this.appendDummyInput()
    .appendField(Blockly.Msg["LISTS_of"] || "of")
    .appendField(createVariableField(), "VAR");
  this.setOutput(true, null);
  this.setInputsInline(true);
  this.setTooltip(
    Blockly.Msg["ARRAY_GETINDEX_TOOLTIP1"] ||
      "Returns the value stored in the list."
  );
};
