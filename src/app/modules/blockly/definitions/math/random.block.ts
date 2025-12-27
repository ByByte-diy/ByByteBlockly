import { BlockBuilder } from "../../lib/builders/block-builder";
import { CATEGORY_COLOR, CATEGORY_NAME, CATEGORY_PLATFORMS, TOOLBOX_LEVEL } from "./config";

// Random integer
export const randomIntBlock = new BlockBuilder('math_random_int')
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["math", "random"])
  .addDummyInput("RANDOM_INT_DUMMY", "%{BKY_MATH_RANDOM_INT_MSG_RANDOM_INT}")
  .addValueInput('FROM', null, 'Number')
  .setShadowBlock("math_number", { NUM: 0 })
  .addValueInput('TO', "&", 'Number')
  .setShadowBlock("math_number", { NUM: 99 })
  .setOutput('Number')
  .setInputsInline(true)
  .setTooltip("%{BKY_MATH_RANDOM_INT_TOOLTIP}")
  .setArduinoGenerator((block, generator) => {
    const from = generator.valueToCode(block, 'FROM', generator.ORDER_ATOMIC) || '0';
    const to = generator.valueToCode(block, 'TO', generator.ORDER_ATOMIC) || '99';

    return [`random(${from}, ${to})`, generator.ORDER_ATOMIC];
  })
  .build();
