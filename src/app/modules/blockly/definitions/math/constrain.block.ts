import { BlockBuilder } from "../../lib/builders";
import { CATEGORY_COLOR, CATEGORY_NAME, CATEGORY_PLATFORMS, TOOLBOX_LEVEL } from "./config";

// Constrain function
export const constrainBlock = new BlockBuilder('math_constrain')
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["math", "constrain"])
  .addDummyInput("CONSTRAIN_DUMMY", "%{BKY_MATH_CONSTRAIN_MSG_CONSTRAIN}")
  .addValueInput('VALUE', null, 'Number')
  .addValueInput('LOW', "%{BKY_MATH_CONSTRAIN_MSG_LOW}", 'Number')
  .setShadowBlock("math_number", { NUM: 0 })
  .addValueInput('HIGH', "%{BKY_MATH_CONSTRAIN_MSG_HIGH}", 'Number')
  .setShadowBlock("math_number", { NUM: 100 })
  .setOutput('Number')
  .setInputsInline(true)
  .setTooltip("%{BKY_MATH_CONSTRAIN_TOOLTIP}")
  .setArduinoGenerator((block, generator) => {
    const value = generator.valueToCode(block, 'VALUE', generator.ORDER_ATOMIC) || '0';
    const low = generator.valueToCode(block, 'LOW', generator.ORDER_ATOMIC) || '0';
    const high = generator.valueToCode(block, 'HIGH', generator.ORDER_ATOMIC) || '100';

    return [`constrain(${value}, ${low}, ${high})`, generator.ORDER_ATOMIC];
  })
  .build();