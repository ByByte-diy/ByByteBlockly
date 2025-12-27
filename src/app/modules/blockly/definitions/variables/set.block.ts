import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

export const variablesSetBlock = new BlockBuilder("variables_set")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["variables"])
  .setInputsInline(true)
  .addDummyInput("DUMMY", "%{BKY_VARIABLES_SET_NAME}")
  .addVariableField("VAR", "i", "DUMMY")
  .addValueInput("VAL", "%{BKY_VARIABLES_SET_TO}")
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setHelpUrl("https://docs.arduino.cc/learn/programming/sketches")
  .setTooltip("%{BKY_VARIABLES_SET_TOOLTIP}")
  .setArduinoGenerator((block, generator) => {
    // Get variable name from field using variableDB
    const win = window as any;
    const variableId = block.getFieldValue("VAR");
    let variableName = "i"; // default fallback

    if (!(generator.nameDB_ && variableId)) return;
    variableName = generator.getVariableName(variableId);

    const value =
      generator.valueToCode(block, "VAL", generator.ORDER_NONE);
    return `${variableName} = ${value};\n`;
  })
  .build();
