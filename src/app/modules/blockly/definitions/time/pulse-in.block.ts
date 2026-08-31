import * as Blockly from "blockly";
import { BlockBuilder } from "../../lib/builders/block-builder";
import { attachShadowBlock } from "../../lib/helpers/shadow-block.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
  getPulseDirectionOptions,
} from "./config";

export const pulseInBlock = new BlockBuilder("inout_pulsein")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["time", "pulse"])
  .addValueInput("PIN", null, "Number")
  .setShadowBlock("math_number", { NUM: 10 })
  .setOutput("Number")
  .setInputsInline(true)
  .setTooltip("%{BKY_ARDUINO_INOUT_PULSEIN}")
  .setHelpUrl("https://www.arduino.cc/reference/en/language/functions/advanced-io/pulsein/")
  .setArduinoGenerator((block, generator) => {
    const pin =
      generator.valueToCode(block, "PIN", generator.ORDER_ATOMIC) || "0";
    const state = block.getFieldValue("STAT");
    generator.setups_[`setup_input_${pin}`] = `pinMode(${pin}, INPUT);`;
    return [`pulseIn(${pin}, ${state})`, generator.ORDER_ATOMIC];
  })
  .build();

pulseInBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOR);
  this.appendDummyInput()
    .appendField(Blockly.Msg["ARDUINO_PULSEIN"] || "state duration")
    .appendField(
      new Blockly.FieldDropdown(getPulseDirectionOptions()),
      "STAT"
    );
  this.appendValueInput("PIN")
    .appendField(Blockly.Msg["PIN"] || "PIN")
    .setCheck("Number");
  this.setInputsInline(true);
  this.setOutput(true, "Number");
  this.setTooltip(
    Blockly.Msg["ARDUINO_INOUT_PULSEIN"] ||
      "Returns the duration in microseconds of a pulse on a pin."
  );
  this.setHelpUrl(
    "https://www.arduino.cc/reference/en/language/functions/advanced-io/pulsein/"
  );

  attachShadowBlock(this, "PIN", "math_number", { NUM: 10 });
};
