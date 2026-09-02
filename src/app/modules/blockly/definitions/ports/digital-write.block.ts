import * as Blockly from "blockly";
import { getDigitalPins } from "@app/modules/device/helpers/device-board-globals.helper";
import { BlockBuilder } from "../../lib/builders/block-builder";
import { formatPinMode } from "../../lib/generators/pin-definitions.helper";
import { attachShadowBlock } from "../../lib/helpers/shadow-block.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

export const digitalWriteBlock = new BlockBuilder("inout_digital_write")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["ports", "digital", "output"])
  .addValueInput("STAT", null, "Boolean")
  .setShadowBlock("inout_onoff", { BOOL: "HIGH" })
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setInputsInline(true)
  .setTooltip("%{BKY_ARDUINO_INOUT_DIGITAL_WRITE_TOOLTIP}")
  .setHelpUrl("https://www.arduino.cc/reference/en/language/functions/digital-io/digitalwrite/")
  .setArduinoGenerator((block, generator) => {
    const pin = block.getFieldValue("PIN");
    const stat =
      generator.valueToCode(block, "STAT", generator.ORDER_ATOMIC) || "LOW";
    return (
      formatPinMode(pin, "OUTPUT") + `digitalWrite(${pin}, ${stat});\n`
    );
  })
  .build();

digitalWriteBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOR);
  this.appendDummyInput()
    .appendField(
      Blockly.Msg["ARDUINO_INOUT_DIGITAL_WRITE_INPUT1"] || "digital write PIN"
    )
    .appendField(new Blockly.FieldDropdown(getDigitalPins()), "PIN");
  this.appendValueInput("STAT")
    .appendField(Blockly.Msg["_AT"] || "to")
    .setCheck("Boolean");
  this.setInputsInline(true);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  this.setTooltip(
    Blockly.Msg["ARDUINO_INOUT_DIGITAL_WRITE_TOOLTIP"] ||
      "Write a 0 or 1 logical state to a specific output."
  );
  this.setHelpUrl(
    "https://www.arduino.cc/reference/en/language/functions/digital-io/digitalwrite/"
  );

  attachShadowBlock(this, "STAT", "inout_onoff", { BOOL: "HIGH" });
};
