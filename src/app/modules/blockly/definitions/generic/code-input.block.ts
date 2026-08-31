/**
 * Code input block - returns raw code expression as a value
 * Legacy: base_code_entree
 */

import * as Blockly from "blockly";
import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_LEVEL,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
} from "./config";

export const codeInputBlock = new BlockBuilder("base_code_entree")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(CATEGORY_LEVEL)
  .setTags(["custom", "code", "input"])
  .setOutput(null)
  .setTooltip("%{BKY_code_tooltip}")
  .setHelpUrl("https://docs.arduino.cc/learn/programming/sketches")
  .setArduinoGenerator((block, generator) => {
    const code = block.getFieldValue("TEXT") || "";
    return [code, generator.ORDER_ATOMIC];
  })
  .build();

const originalInit = codeInputBlock.init;
codeInputBlock.init = function (this: Blockly.Block) {
  originalInit.call(this);

  const defaultValue =
    Blockly.Msg["GENERIC_CODE_INPUT_DEFAULT"] || "code arduino";
  this.appendDummyInput().appendField(
    new Blockly.FieldTextInput(defaultValue),
    "TEXT"
  );
};
