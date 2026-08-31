import * as Blockly from "blockly";
import { getPWMPins } from "@app/modules/device/helpers/device-board-globals.helper";
import { BlockBuilder } from "../../lib/builders/block-builder";
import { attachShadowBlock } from "../../lib/helpers/shadow-block.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

export const analogWriteBlock = new BlockBuilder("inout_analog_write")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["ports", "analog", "output", "pwm"])
  .addValueInput("NUM", null, "Number")
  .setShadowBlock("math_number", { NUM: 0 })
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setInputsInline(true)
  .setTooltip("%{BKY_ARDUINO_INOUT_ANALOG_WRITE_TOOLTIP}")
  .setHelpUrl("https://www.arduino.cc/reference/en/language/functions/analog-io/analogwrite/")
  .setArduinoGenerator((block, generator) => {
    const pin = block.getFieldValue("broche");
    const value =
      generator.valueToCode(block, "NUM", generator.ORDER_ATOMIC) || "0";
    generator.setups_[`setup_output_${pin}`] = `pinMode(${pin}, OUTPUT);`;
    return `analogWrite(${pin}, ${value});\n`;
  })
  .build();

analogWriteBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOR);
  this.appendDummyInput()
    .appendField(
      Blockly.Msg["ARDUINO_INOUT_ANALOG_WRITE_INPUT1"] || "analog write PIN"
    )
    .appendField(new Blockly.FieldDropdown(getPWMPins()), "broche");
  this.appendValueInput("NUM")
    .appendField(Blockly.Msg["_AT"] || "to")
    .setCheck("Number");
  this.setInputsInline(true);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  this.setTooltip(
    Blockly.Msg["ARDUINO_INOUT_ANALOG_WRITE_TOOLTIP"] ||
      "Send a PWM value between 0 and 255 on a specific output."
  );
  this.setHelpUrl(
    "https://www.arduino.cc/reference/en/language/functions/analog-io/analogwrite/"
  );

  attachShadowBlock(this, "NUM", "math_number", { NUM: 0 });
};
