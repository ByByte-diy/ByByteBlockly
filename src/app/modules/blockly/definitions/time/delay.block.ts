import * as Blockly from "blockly";
import { BlockBuilder } from "../../lib/builders/block-builder";
import { attachShadowBlock } from "../../lib/helpers/shadow-block.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
  getTimeUnitOptions,
} from "./config";

export const delayBlock = new BlockBuilder("base_delay")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["time", "delay"])
  .addValueInput("DELAY_TIME", null, "Number")
  .setShadowBlock("math_number", { NUM: 1 })
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setInputsInline(true)
  .setTooltip("%{BKY_ARDUINO_BASE_DELAY_TOOLTIP}")
  .setHelpUrl("https://www.arduino.cc/reference/en/language/functions/time/delay/")
  .setArduinoGenerator((block, generator) => {
    const unit = block.getFieldValue("unite");
    const delayTime =
      generator.valueToCode(block, "DELAY_TIME", generator.ORDER_ATOMIC) ||
      "0";

    switch (unit) {
      case "u":
        return `delayMicroseconds(${delayTime});\n`;
      case "s":
        return `delay(${delayTime} * 1000);\n`;
      default:
        return `delay(${delayTime});\n`;
    }
  })
  .build();

delayBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOR);
  this.appendValueInput("DELAY_TIME")
    .appendField(Blockly.Msg["ARDUINO_BASE_DELAY"] || "⏲ wait")
    .setCheck("Number");
  this.appendDummyInput().appendField(
    new Blockly.FieldDropdown(getTimeUnitOptions()),
    "unite"
  );
  this.setInputsInline(true);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  this.setTooltip(
    Blockly.Msg["ARDUINO_BASE_DELAY_TOOLTIP"] ||
    "Wait for the specified time. The program does nothing else during this time."
  );
  this.setHelpUrl(
    "https://www.arduino.cc/reference/en/language/functions/time/delay/"
  );

  if (this.workspace && !this.getInputTargetBlock("DELAY_TIME")) {
    attachShadowBlock(this, "DELAY_TIME", "math_number", { NUM: 1 });
  }
};
