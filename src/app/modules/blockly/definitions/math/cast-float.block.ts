import { BlockBuilder } from "../../lib/builders/block-builder";
import { CATEGORY_COLOR, CATEGORY_NAME, CATEGORY_PLATFORMS, TOOLBOX_LEVEL } from "./config";

export const castFloatBlock = new BlockBuilder("math_cast_float")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["math", "casting"])
  .addValueInput("VALUE", "%{BKY_MATH_CAST_FLOAT_MSG_CAST_FLOAT}", "Number")
  .setOutput("Number")
  .setTooltip("%{BKY_MATH_CAST_FLOAT_TOOLTIP}")
  .setArduinoGenerator((block, generator) => {
    const value =
      generator.valueToCode(block, "VALUE", generator.ORDER_ATOMIC) || "0";
    return [`(float)(${value})`, generator.ORDER_ATOMIC];
  })
  .build();
