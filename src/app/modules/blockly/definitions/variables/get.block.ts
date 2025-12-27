import * as Blockly from "blockly";
import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

/**
 * Variables get block - get value of a variable
 */
export const variablesGetBlock = new BlockBuilder("variables_get")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["variables"])
  .setInputsInline(true)
  .addDummyInput("DUMMY", "%{BKY_VARIABLES_GET_NAME}")
  .addVariableField("VAR", "i", "DUMMY")
  .setOutput(null)
  .setHelpUrl("https://docs.arduino.cc/learn/programming/sketches")
  .setTooltip("%{BKY_VARIABLES_GET_TOOLTIP}")
  .setArduinoGenerator((block, generator) => {
    const variableId = block.getFieldValue("VAR");
    if (!(generator.nameDB_ && variableId)) return;
    const variableName = generator.getVariableName(variableId);
    return [variableName, generator.ORDER_ATOMIC];
  })
  .build();

