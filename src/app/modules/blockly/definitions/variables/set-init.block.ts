import { BlockBuilder } from "../../lib/builders/block-builder";
import { registerGlobalVariable } from "../../lib/generators/codegen-sections.helper";
import {
  defaultValueForVariableType,
  syncVariableTypeOnChange,
  VARIABLE_TYPE_OPTIONS,
} from "../../lib/variables/variable-type.helper";
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
  .addVariableField("VAR", "", "DUMMY")
  .addDummyInput("DUMMY2", "%{BKY_VARIABLES_TYPE}")
  .addDropdownField("TYPE", VARIABLE_TYPE_OPTIONS, "INTEGER", "DUMMY2")
  .addValueInput("VAL", "%{BKY_VARIABLES_SET_TO}")
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setHelpUrl("https://docs.arduino.cc/learn/programming/sketches")
  .setTooltip("%{BKY_VARIABLES_SET_INIT_TOOLTIP}")
  .setOnChange(syncVariableTypeOnChange)
  .setArduinoGenerator((block, generator) => {
    const typeValue = block.getFieldValue("TYPE");
    const defaultValue = defaultValueForVariableType(typeValue);
    const value =
      generator.valueToCode(block, "VAL", generator.ORDER_ASSIGNMENT) ||
      defaultValue;
    const varId = block.getFieldValue("VAR");
    const varName = generator.getVariableName(varId);
    const type = generator.getArduinoType_(typeValue);
    // Legacy: declare + initialize at global scope, not in setup()
    registerGlobalVariable(
      generator,
      varName,
      `${type} ${varName} = ${value};`,
      `Variable ${varName} — initial value from create-variable block.`
    );
    return "";
  })
  .build();