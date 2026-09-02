import * as Blockly from "blockly";
import { getDigitalPins } from "@app/modules/device/helpers/device-board-globals.helper";
import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

export const digitalReadBlock = new BlockBuilder("inout_digital_read")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["ports", "digital", "input"])
  .setOutput("Boolean")
  .setInputsInline(true)
  .setTooltip("%{BKY_IN_PULLUP_TOOLTIP}")
  .setHelpUrl("https://www.arduino.cc/reference/en/language/functions/digital-io/digitalread/")
  .setArduinoGenerator((block, generator) => {
    const pin = block.getFieldValue("PIN");
    const pullUp = block.getFieldValue("pullup") === "TRUE";
    generator.setups_[`setup_input_${pin}`] = pullUp
      ? `pinMode(${pin}, INPUT_PULLUP);`
      : `pinMode(${pin}, INPUT);`;
    return [`digitalRead(${pin})`, generator.ORDER_ATOMIC];
  })
  .build();

digitalReadBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOR);
  this.appendDummyInput()
    .appendField(
      Blockly.Msg["ARDUINO_INOUT_DIGITAL_READ_INPUT"] || "digital state PIN"
    )
    .appendField(new Blockly.FieldDropdown(getDigitalPins()), "PIN")
    .appendField(Blockly.Msg["IN_PULLUP"] || "pull-up")
    .appendField(new Blockly.FieldCheckbox("FALSE"), "pullup");
  this.setInputsInline(true);
  this.setOutput(true, "Boolean");
  this.setTooltip(
    Blockly.Msg["IN_PULLUP_TOOLTIP"] ||
      "Read logical state 0 or 1 of the digital pin."
  );
  this.setHelpUrl(
    "https://www.arduino.cc/reference/en/language/functions/digital-io/digitalread/"
  );
};
