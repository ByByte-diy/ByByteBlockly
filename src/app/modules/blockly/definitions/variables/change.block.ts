import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

/**
 * Variables change block - change value of a variable by delta
 */
export const variablesChangeBlock = new BlockBuilder("math_change")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["variables"])
  .setInputsInline(true)
  .addDummyInput("DUMMY", "%{BKY_MATH_CHANGE_NAME}")
  .addVariableField("VAR", "", "DUMMY")
  .addValueInput("DELTA", "%{BKY_MATH_CHANGE_TO}", "Number")
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setHelpUrl("https://docs.arduino.cc/learn/programming/sketches")
  .setTooltip("%{BKY_MATH_CHANGE_TOOLTIP}")
  .setArduinoGenerator((block, generator) => {
    // Get variable name from field using variableDB
    const win = window as any;
    const variableId = block.getFieldValue("VAR");
    let variableName = "i"; // default fallback

    if (!(generator.nameDB_ && variableId)) return;
    variableName = generator.getVariableName(variableId);

    const delta =
      generator.valueToCode(block, "DELTA", generator.ORDER_NONE) || "1";
    return `${variableName} += ${delta};\n`;
  })
  .build();
