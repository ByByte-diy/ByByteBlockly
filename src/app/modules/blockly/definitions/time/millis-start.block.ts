import * as Blockly from "blockly";
import { BlockBuilder } from "../../lib/builders/block-builder";
import { registerGlobalVariable } from "../../lib/generators/codegen-sections.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
  getTimeUnitOptions,
} from "./config";

export const millisStartBlock = new BlockBuilder("millis_start")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["time", "millis"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setTooltip("%{BKY_MILLIS_START_TOOLTIP}")
  .setHelpUrl("https://www.arduino.cc/reference/en/language/functions/time/millis/")
  .setArduinoGenerator((block, generator) => {
    const unit = block.getFieldValue("unite");

    registerGlobalVariable(
      generator,
      "chrono_start",
      "unsigned long chronoStart = 0;",
      "Timestamp for stopwatch (millis)."
    );

    switch (unit) {
      case "u":
        return "chronoStart = micros();\n";
      case "s":
        return "chronoStart = millis() * 1000UL;\n";
      default:
        return "chronoStart = millis();\n";
    }
  })
  .build();

millisStartBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOR);
  this.appendDummyInput()
    .appendField(Blockly.Msg["MILLIS_START"] || "start a timekeeping in")
    .appendField(
      new Blockly.FieldDropdown(getTimeUnitOptions()),
      "unite"
    );
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  this.setTooltip(
    Blockly.Msg["MILLIS_START_TOOLTIP"] ||
      "Record the current time as a reference point."
  );
  this.setHelpUrl(
    "https://www.arduino.cc/reference/en/language/functions/time/millis/"
  );
};
