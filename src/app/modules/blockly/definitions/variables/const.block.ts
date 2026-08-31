import { BlockBuilder } from "../../lib/builders/block-builder";
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

export const variablesConstBlock = new BlockBuilder("variables_const")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["variables"])
  .setInputsInline(true)
  .addDummyInput("DUMMY", "%{BKY_ARDUINO_VAR_CONST}")
  .addVariableField("VAR", "", "DUMMY")
  .addDummyInput("DUMMY2", "%{BKY_VARIABLES_AS}")
  .addDropdownField("TYPE", VARIABLE_TYPE_OPTIONS, "INTEGER", "DUMMY2")
  .addValueInput("VAL_CONST", "%{BKY_VARIABLES_AT}")
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setHelpUrl("https://docs.arduino.cc/learn/programming/sketches")
  .setTooltip("%{BKY_ARDUINO_VAR_CONST_TOOLTIP}")
  .setOnChange(syncVariableTypeOnChange)
  .setArduinoGenerator((block, generator) => {
    const typeValue = block.getFieldValue("TYPE");
    const value =
      generator.valueToCode(block, "VAL_CONST", generator.ORDER_ASSIGNMENT) ||
      defaultValueForVariableType(typeValue);
    const varId = block.getFieldValue("VAR");
    const varName = generator.getVariableName(varId);
    const type = generator.getArduinoType_(typeValue);
    generator.variables_[varName] = `const ${type} ${varName} = ${value};`;
    return "";
  })
  .build();
