import * as Blockly from "blockly";
import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

/**
 * Variables set block - set value of a variable
 */
export const variablesSetInitBlock = new BlockBuilder("variables_set_init")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["variables"])
  .setInputsInline(true)
  .addDummyInput("DUMMY", "%{BKY_VARIABLES_SET_INIT_NAME}")
  .addVariableField("VAR", "i", "DUMMY")
  .addDummyInput("DUMMY2", "%{BKY_VARIABLES_TYPE}")
  .addDropdownField(
    "TYPE",
    [
      ["character", "CHARACTER"],
      ["text", "TEXT"],
      ["boolean", "BOOL"],
      ["byte", "BYTE"],
      ["integer", "INTEGER"],
      ["unsigned integer", "UNUMBER"],
      ["long integer", "LARGE_NUMBER"],
      ["floating point number", "DECIMAL"],
    ],
    "INTEGER",
    "DUMMY2"
  )
  .addValueInput("VAL", "%{BKY_VARIABLES_SET_TO}")
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setHelpUrl("https://docs.arduino.cc/learn/programming/sketches")
  .setTooltip("%{BKY_VARIABLES_SET_INIT_TOOLTIP}")
  .setOnChange(function (this: Blockly.Block, e: Blockly.Events.Abstract) {
    // if the block is not changed, return
    if (
      e.type !== Blockly.Events.BLOCK_CHANGE &&
      e.type !== Blockly.Events.BLOCK_CREATE
    )
      return;
    
    // get the variable id and type value
    const variableId = this.getFieldValue("VAR");
    const typeValue = this.getFieldValue("TYPE");

    // if variableId or typeValue is not set, return
    if (!(variableId && typeValue) || !this.workspace) return;
    const [workspace, win] = [this.workspace, window as any];
    const arduinoGenerator = win.Blockly?.Arduino;

    // get the type and variable map
    const type = arduinoGenerator?.getArduinoType_(typeValue);
    const variableMap = workspace.getVariableMap();
    if (!variableMap) return;

    // get the variable and set the type
    const variable = variableMap.getVariableById(variableId);
    if (!variable) return;
    variable.setType(type).save();
  })
  .setArduinoGenerator((block, generator) => {
    const value = generator.valueToCode(block, "VAL", generator.ORDER_NONE);
    const varId = block.getFieldValue("VAR");
    const varName = generator.getVariableName(varId);
    return `${varName} = ${value};\n`;
  })
  .build();