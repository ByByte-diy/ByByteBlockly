import { BlockBuilder } from "../../lib/builders/block-builder";
import { CATEGORY_COLOR, CATEGORY_NAME, CATEGORY_PLATFORMS, TOOLBOX_LEVEL } from "./config";

export const castUintBlock = new BlockBuilder('math_cast_uint')
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["math", "casting"])
  .addValueInput('VALUE', "%{BKY_MATH_CAST_UINT_MSG_CAST_UINT}", 'Number')
  .setOutput('Number')
  .setHelpUrl("https://www.arduino.cc/en/Reference/UnsignedIntCast")
  .setTooltip("%{BKY_MATH_CAST_UINT_TOOLTIP}")
  .setArduinoGenerator((block, generator) => {
    const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
    return [`(unsigned int)(${value})`, generator.ORDER_ATOMIC];
  })
  .build();
