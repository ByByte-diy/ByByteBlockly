import { BlockBuilder } from "../../lib/builders/block-builder";
import { CATEGORY_COLOR, CATEGORY_NAME, CATEGORY_PLATFORMS, TOOLBOX_LEVEL } from "./config";

// Casting blocks
export const castByteBlock = new BlockBuilder('math_cast_byte')
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["math", "casting"])
  .addValueInput('VALUE', "%{BKY_MATH_CAST_BYTE_MSG_CAST_BYTE}", 'Number')
  .setOutput('Number')
  .setHelpUrl("https://www.arduino.cc/en/Reference/ByteCast")
  .setTooltip("%{BKY_MATH_CAST_BYTE_TOOLTIP}")
  .setArduinoGenerator((block, generator) => {
    const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
    return [`(byte)(${value})`, generator.ORDER_ATOMIC];
  })
  .build();
