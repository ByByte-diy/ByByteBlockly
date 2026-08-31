import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

export const negateBlock = new BlockBuilder("logic_negate")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["logic", "negate"])
  .setMessage("%{BKY_LOGIC_NEGATE_TITLE}")
  .addValueInput("BOOL", null, "Boolean")
  .setOutput("Boolean")
  .setTooltip("%{BKY_LOGIC_NEGATE_TOOLTIP}")
  .setHelpUrl("https://docs.arduino.cc/learn/programming/reference/#boolean-operators")
  .setArduinoGenerator((block, generator) => {
    const value =
      generator.valueToCode(block, "BOOL", generator.ORDER_UNARY_PREFIX) ||
      "true";
    return [`!${value}`, generator.ORDER_UNARY_PREFIX];
  })
  .build();
