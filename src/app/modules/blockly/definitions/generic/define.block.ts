/**
 * Base Define Block - Preprocessor definitions
 */

import * as Blockly from "blockly";
import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_NAME,
  CATEGORY_COLOR,
  CATEGORY_LEVEL,
  CATEGORY_PLATFORMS,
} from "./config";

/**
 * Preprocessor define block for constants and macros
 */
export const defineBlock = new BlockBuilder("base_define")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(CATEGORY_LEVEL)
  .setTags(["preprocessor", "define"])

  .setTooltip("Define preprocessor constant or macro")
  .setHelpUrl(
    "https://docs.arduino.cc/learn/programming/reference/#further-syntax"
  )

  .setArduinoGenerator((block, generator) => {
    const text = block.getFieldValue("TEXT") || "";

    if (text) {
      const defineKey = "define_" + text.replace(/[^a-zA-Z0-9_]/g, "_");
      generator.definitions_[defineKey] = text;
    }

    return "";
  })

  .build();

// Custom init to add multiline text field
const originalInit = defineBlock.init;
defineBlock.init = function (this: Blockly.Block) {
  originalInit.call(this);

  // Add text field for define statement
  this.appendDummyInput().appendField(
    new Blockly.FieldTextInput("#define LED_PIN 13"),
    "TEXT"
  );
};
