import { BlockBuilder } from "../../lib/builders/block-builder";
import { CATEGORY_LEVEL } from "../generic/config";
import { CATEGORY_COLOR, CATEGORY_NAME, CATEGORY_PLATFORMS } from "./config";

export const forBlock = new BlockBuilder("controls_for")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(CATEGORY_LEVEL)
  .setTags(["logic", "for"])
  .addDummyInput("FOR_DUMMY", "%{BKY_CONTROLS_FOR_MSG_FOR}")
  .addVariableField("VAR", "i", "FOR_DUMMY")
  .addValueInput("FROM", "%{BKY_CONTROLS_FOR_MSG_FROM}", "Number")
  .setShadowBlock("math_number", { NUM: 0 })
  .addValueInput("TO", "%{BKY_CONTROLS_FOR_MSG_TO}", "Number")
  .setShadowBlock("math_number", { NUM: 5 })
  .addValueInput("BY", "%{BKY_CONTROLS_FOR_MSG_BY}", "Number")
  .setShadowBlock("math_number", { NUM: 1 })
  .addDummyInput("")
  .addStatementInput("DO")
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setTooltip("%{BKY_CONTROLS_FOR_TOOLTIP}")
  .setHelpUrl("https://docs.arduino.cc/learn/programming/sketches") 
  .setArduinoGenerator((block, generator) => {
    // Get variable name from field using variableDB
    const win = window as any;
    const variableId = block.getFieldValue("VAR");
    let variableName = "i"; // default fallback
    
    if (generator.nameDB_ && variableId) {
      const variableType = win.Blockly?.Variables?.NAME_TYPE || null;
      console.log("variableType", variableType);
      variableName = generator.nameDB_.getName(variableId, variableType);
    } else if (variableId) {
      variableName = variableId;
    }
    
    const from = generator.valueToCode(block, "FROM", generator.ORDER_NONE) || "0";
    const to = generator.valueToCode(block, "TO", generator.ORDER_NONE) || "5";
    const by = generator.valueToCode(block, "BY", generator.ORDER_NONE) || "1";
    const branch = generator.statementToCode(block, "DO");
    return `for (int ${variableName} = ${from}; ${variableName} <= ${to}; ${variableName} += ${by}) {\n${branch}\n}`;
  })
  .build();