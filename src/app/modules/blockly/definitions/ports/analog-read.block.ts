import * as Blockly from "blockly";
import { getAnalogPins } from "@app/modules/device/helpers/device-board-globals.helper";
import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

export const analogReadBlock = new BlockBuilder("inout_analog_read")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["ports", "analog", "input"])
  .setOutput("Number")
  .setTooltip("%{BKY_ARDUINO_INOUT_ANALOG_READ_TOOLTIP}")
  .setHelpUrl("https://www.arduino.cc/reference/en/language/functions/analog-io/analogread/")
  .setArduinoGenerator((block, generator) => {
    const pin = block.getFieldValue("broche");
    return [`analogRead(${pin})`, generator.ORDER_ATOMIC];
  })
  .build();

analogReadBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOR);
  this.appendDummyInput()
    .appendField(
      Blockly.Msg["ARDUINO_INOUT_ANALOG_READ_INPUT"] || "analog read PIN"
    )
    .appendField(new Blockly.FieldDropdown(getAnalogPins()), "broche");
  this.setOutput(true, "Number");
  this.setTooltip(
    Blockly.Msg["ARDUINO_INOUT_ANALOG_READ_TOOLTIP"] ||
      "Returns a value between 0 and 1023."
  );
  this.setHelpUrl(
    "https://www.arduino.cc/reference/en/language/functions/analog-io/analogread/"
  );
};
