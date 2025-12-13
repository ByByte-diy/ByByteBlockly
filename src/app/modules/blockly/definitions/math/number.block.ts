import { BlockBuilder } from "../../lib/builders/block-builder";
import { CATEGORY_COLOR, CATEGORY_NAME, CATEGORY_PLATFORMS, TOOLBOX_LEVEL } from "./config";

export const numberBlock = new BlockBuilder("math_number")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["math", "number"])
  .addDummyInput("")
  .addTextField("NUM", "10")
  .setOutput("Number")
  .setTooltip("This block returns a number value.")
  .setHelpUrl("https://docs.arduino.cc/learn/programming/sketches")
  .setArduinoGenerator((block, generator) => {
    const code = block.getFieldValue("NUM") || "0";
    return [code, generator.ORDER_ATOMIC];
  })
  .build();