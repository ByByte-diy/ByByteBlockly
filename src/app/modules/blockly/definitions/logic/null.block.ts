import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

export const nullBlock = new BlockBuilder("logic_null")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["logic", "null"])
  .setMessage("%{BKY_LOGIC_NULL}")
  .setOutput(null)
  .setTooltip("%{BKY_LOGIC_NULL_TOOLTIP}")
  .setHelpUrl("https://docs.arduino.cc/learn/programming/reference/")
  .setArduinoGenerator((_block, generator) => {
    return ["NULL", generator.ORDER_ATOMIC];
  })
  .build();
