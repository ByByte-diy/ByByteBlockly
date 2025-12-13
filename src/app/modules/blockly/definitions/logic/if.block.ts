import { BlockBuilder } from "../../lib/builders/block-builder";
import { CATEGORY_COLOR, CATEGORY_NAME, CATEGORY_PLATFORMS, TOOLBOX_LEVEL } from "./config";


export const ifBlock = new BlockBuilder("controls_if")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["logic"])

  .setMessage("if %1 is %2 then %3")
  .addValueInput("IF0", "If", "Boolean")
  .addStatementInput("DO0", "Then")
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setMutator("controls_if_mutator")

  .setTooltip("If statement")
  .setHelpUrl(
    "https://docs.arduino.cc/learn/programming/reference/#control-structure"
  )

  .setArduinoGenerator((block, generator) => {
    // Base IF statement
    let n = 0;
    let condition = generator.valueToCode(block, "IF0", generator.ORDER_NONE || 0);
    let branch = generator.statementToCode(block, "DO0");
    let code = "";
    if (condition || branch) {
      if (!condition) condition = "false";
      code = `if (${condition}) {\n${branch}\n}`;
    }

    // ELSE IF branches added by mutator
    const anyBlock = block as any;
    const elseifCount = anyBlock.elseifCount_ || 0;
    for (n = 1; n <= elseifCount; n++) {
      condition = generator.valueToCode(block, `IF${n}`, generator.ORDER_NONE || 0);
      branch = generator.statementToCode(block, `DO${n}`);
      if (!condition) condition = "false";
      code += ` else if (${condition}) {\n${branch}\n}`;
    }

    // ELSE branch if exists
    if (anyBlock.elseCount_) {
      branch = generator.statementToCode(block, "ELSE");
      code += ` else {\n${branch}\n}`;
    }

    return code ? code + "\n" : "";
  })
  .build();