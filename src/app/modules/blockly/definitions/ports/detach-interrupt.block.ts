import * as Blockly from "blockly";
import { getInterruptPins } from "@app/modules/device/helpers/device-board-globals.helper";
import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

export const detachInterruptBlock = new BlockBuilder("inout_detachInterrupt")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["ports", "interrupt"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setTooltip("%{BKY_LKL_TOOLTIP_INOUT_DETACHINTERRUPT}")
  .setHelpUrl("https://www.arduino.cc/reference/en/language/functions/external-interrupts/detachinterrupt/")
  .setArduinoGenerator((block, _generator) => {
    const pin = block.getFieldValue("PIN");
    return `detachInterrupt(${pin});\n`;
  })
  .build();

detachInterruptBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOR);
  this.appendDummyInput()
    .appendField(
      Blockly.Msg["LKL_DETACHINTERRUPT_PIN"] || "disable interrupt on PIN"
    )
    .appendField(new Blockly.FieldDropdown(getInterruptPins()), "PIN");
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  this.setTooltip(
    Blockly.Msg["LKL_TOOLTIP_INOUT_DETACHINTERRUPT"] ||
      "Disable the previously specified external interrupt."
  );
  this.setHelpUrl(
    "https://www.arduino.cc/reference/en/language/functions/external-interrupts/detachinterrupt/"
  );
};
