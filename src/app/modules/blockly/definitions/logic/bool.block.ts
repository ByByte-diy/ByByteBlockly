import { BlockBuilder } from "../../lib/builders/block-builder";
import { CATEGORY_COLOR, CATEGORY_NAME, CATEGORY_PLATFORMS } from "./config";
import { TOOLBOX_LEVEL } from "./config";

export const boolBlock = new BlockBuilder("logic_boolean")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["logic","boolean"])
  .setMessage("%1")
  .addDropdownField("BOOL", [
    ["true", "True"], ["false", "False"]
  ])
  .addDummyInput("")
  .setOutput("Boolean")
  .setTooltip("Boolean value")
  .setHelpUrl("https://docs.arduino.cc/learn/programming/reference/#data-types")
  .setArduinoGenerator((block, generator) => {
    const value = block.getFieldValue("BOOL") === "True" ? "true" : "false";
    return [value, generator.ORDER_ATOMIC || 0];
  })
  .build();