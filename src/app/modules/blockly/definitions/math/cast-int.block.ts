import { BlockBuilder } from "../../lib/builders/block-builder";
import { CATEGORY_COLOR, CATEGORY_NAME, CATEGORY_PLATFORMS, TOOLBOX_LEVEL } from "./config";

export const castIntBlock = new BlockBuilder('math_cast_int')
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["math", "casting"])
  .addValueInput('VALUE', "%{BKY_MATH_CAST_INT_MSG_CAST_INT}", 'Number')
  .setOutput('Number')
  .setHelpUrl("https://www.arduino.cc/en/Reference/IntCast")
  .setTooltip("%{BKY_MATH_CAST_INT_TOOLTIP}")
  .setArduinoGenerator((block, generator) => {
    const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
    return [`(int)(${value})`, generator.ORDER_ATOMIC];
  })
  .build();
