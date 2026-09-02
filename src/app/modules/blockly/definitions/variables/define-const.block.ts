import { BlockBuilder } from "../../lib/builders/block-builder";
import { registerGlobalVariable } from "../../lib/generators/codegen-sections.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

export const baseDefineConstBlock = new BlockBuilder("base_define_const")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["variables"])
  .setInputsInline(true)
  .addDummyInput("DUMMY", "%{BKY_BASE_DEF_CONST}")
  .addVariableField("VAR", "", "DUMMY")
  .addDummyInput("DUMMY2", "%{BKY_BASE_DEFINE_CONST}")
  .addValueInput("TEXT2")
  .setShadowBlock("math_number", { NUM: 0 })
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setHelpUrl("https://docs.arduino.cc/learn/programming/sketches")
  .setTooltip("%{BKY_BASE_DEFINE_CONST_TOOLTIP}")
  .setArduinoGenerator((block, generator) => {
    const varId = block.getFieldValue("VAR");
    const varName = generator.getVariableName(varId);
    const value =
      generator.valueToCode(block, "TEXT2", generator.ORDER_ATOMIC) || "0";
    registerGlobalVariable(
      generator,
      varName,
      `#define ${varName} ${value}`,
      `#define constant ${varName} — replaced at compile time.`
    );
    return "";
  })
  .build();
