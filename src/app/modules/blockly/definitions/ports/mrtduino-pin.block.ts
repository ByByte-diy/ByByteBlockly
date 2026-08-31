import * as Blockly from "blockly";
import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

const MRTDUINO_PIN_OPTIONS: [string, string][] = [
  ["Port1", "13"],
  ["Port2", "15"],
  ["Port3", "16"],
  ["Port4", "14"],
  ["Port5", "18"],
  ["Port6", "19"],
  ["Port7", "20"],
  ["Port8", "21"],
  ["Port9", "5"],
  ["Port10", "9"],
  ["Port11", "11"],
  ["Port12", "12"],
  ["Port13", "2"],
  ["Port14", "3"],
  ["Port15", "0"],
  ["Port16", "1"],
  ["RC -", "10"],
  ["RC +", "22"],
  ["RC S", "23"],
];

export const mrtduinoPinBlock = new BlockBuilder("mrtduino_pin")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["ports", "mrtduino"])
  .setBoards(["mrtduino", "MRTnode", "mrtx"])
  .setOutput("Number")
  .setTooltip("%{BKY_MRTDUINO_PIN_TOOLTIP}")
  .setHelpUrl("https://www.logix5.com/roboticaeducativa/mrtduino-board/")
  .setArduinoGenerator((block, generator) => {
    const pin = block.getFieldValue("MRTPIN");
    return [pin, generator.ORDER_ATOMIC];
  })
  .build();

mrtduinoPinBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOR);
  this.appendDummyInput().appendField(
    new Blockly.FieldDropdown(MRTDUINO_PIN_OPTIONS),
    "MRTPIN"
  );
  this.setOutput(true, "Number");
  this.setTooltip(
    Blockly.Msg["MRTDUINO_PIN_TOOLTIP"] ||
      "MRTduino port to Arduino pin conversion."
  );
  this.setHelpUrl("https://www.logix5.com/roboticaeducativa/mrtduino-board/");
};
