/**
 * Base Code Block - Free-form code input
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
 * Free-form code block for custom Arduino code
 */
export const codeBlock = new BlockBuilder("base_code")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(CATEGORY_LEVEL)
  .setTags(["custom", "code"])

  .setPreviousStatement(null)
  .setNextStatement(null)

  .setTooltip("Enter custom Arduino code")
  .setHelpUrl("https://docs.arduino.cc/learn/programming/sketches")

  .setArduinoGenerator((block, generator) => {
    const win = window as any;
    const Blockly = win.Blockly;

    // Get field value
    const code = block.getFieldValue("CODE") || "";
    return code + "\n";
  })

  .build();

// Custom init to add text field
const originalInit = codeBlock.init;
codeBlock.init = function (this: Blockly.Block) {
  originalInit.call(this);

  // Add text field for code
  this.appendDummyInput().appendField(
    new Blockly.FieldTextInput("// Your code here"),
    "CODE"
  );
};
