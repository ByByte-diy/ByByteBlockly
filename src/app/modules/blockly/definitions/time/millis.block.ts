import * as Blockly from "blockly";
import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
  getTimeUnitOptions,
} from "./config";

export const millisBlock = new BlockBuilder("millis")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["time", "millis"])
  .setOutput("Number")
  .setTooltip("%{BKY_ARDUINO_SINCE_PROGRAM_STARTED_TOOLTIP}")
  .setHelpUrl("https://www.arduino.cc/reference/en/language/functions/time/millis/")
  .setArduinoGenerator((block, generator) => {
    const unit = block.getFieldValue("unite");

    switch (unit) {
      case "u":
        return ["micros()", generator.ORDER_ATOMIC];
      case "s":
        return ["millis() / 1000", generator.ORDER_ATOMIC];
      default:
        return ["millis()", generator.ORDER_ATOMIC];
    }
  })
  .build();

millisBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOR);
  this.appendDummyInput()
    .appendField(Blockly.Msg["MILLIS1"] || "duration in")
    .appendField(
      new Blockly.FieldDropdown(getTimeUnitOptions()),
      "unite"
    )
    .appendField(Blockly.Msg["MILLIS2"] || "from the beginning");
  this.setOutput(true, "Number");
  this.setTooltip(
    Blockly.Msg["ARDUINO_SINCE_PROGRAM_STARTED_TOOLTIP"] ||
      "Returns the time elapsed since the program started."
  );
  this.setHelpUrl(
    "https://www.arduino.cc/reference/en/language/functions/time/millis/"
  );
};
