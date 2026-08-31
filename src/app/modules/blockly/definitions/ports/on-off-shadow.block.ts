import * as Blockly from "blockly";
import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
  getHighLowOptions,
} from "./config";

/** Shadow block for HIGH/LOW values — not shown in toolbox */
export const onOffShadowBlock = new BlockBuilder("inout_onoff")
  .setCategory("Shadow")
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["ports", "shadow", "hidden"])
  .setOutput("Boolean")
  .setTooltip("%{BKY_LOGIC_BOOLEAN_TOOLTIP}")
  .setHelpUrl("https://docs.arduino.cc/learn/programming/reference/")
  .setArduinoGenerator((block, generator) => {
    const value = block.getFieldValue("BOOL") === "HIGH" ? "HIGH" : "LOW";
    return [value, generator.ORDER_ATOMIC];
  })
  .build();

onOffShadowBlock.init = function (this: Blockly.Block) {
  this.setColour(45);
  this.appendDummyInput().appendField(
    new Blockly.FieldDropdown(getHighLowOptions()),
    "BOOL"
  );
  this.setOutput(true, "Boolean");
  this.setTooltip(
    Blockly.Msg["LOGIC_BOOLEAN_TOOLTIP"] || "True or false value."
  );
  this.setHelpUrl("https://docs.arduino.cc/learn/programming/reference/");
};
