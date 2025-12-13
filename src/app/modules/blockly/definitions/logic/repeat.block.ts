import { BlockBuilder } from "../../lib/builders/block-builder";
import { CATEGORY_COLOR, CATEGORY_NAME, CATEGORY_PLATFORMS, TOOLBOX_LEVEL } from "./config";

export const repeatBlock = new BlockBuilder("controls_repeat")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["logic", "loop"])
  .addDummyInput("REPEAT_DUMMY","🔁 Repeat")
  .addValueInput("TIMES", null, "Number")
  .setShadowBlock("math_number", { NUM: 5 })
  .addDummyInput("REPEAT_DUMMY_TIMES"," times")
  .addStatementInput("DO")
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setTooltip("Repeat statement")
  .setHelpUrl(
    "https://docs.arduino.cc/learn/programming/reference/#control-structure"
  )
  .setArduinoGenerator((block, generator) => {
    const repeats =
      generator.valueToCode(block, "TIMES", generator.ORDER_ASSIGNMENT) || "0";
    const branch = generator.statementToCode(block, "DO");
    return `for (int i = 0; i < ${repeats}; i++) {\n${branch}\n}`;
  })
  .build();