import * as Blockly from "blockly";
import { getAllPins } from "@app/modules/device/helpers/device-board-globals.helper";
import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

export const toggleBlock = new BlockBuilder("toggle")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["ports", "digital", "toggle"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setInputsInline(true)
  .setTooltip("%{BKY_TOGGLE_TOOLTIP}")
  .setHelpUrl("%{BKY_TEMPO_HELPURL}")
  .setArduinoGenerator((block, generator) => {
    const pin = block.getFieldValue("PIN");
    generator.definitions_[`toggle${pin}`] = `boolean etat_${pin} = LOW;`;
    generator.setups_[`setup_output_${pin}`] = `pinMode(${pin}, OUTPUT);`;
    return `digitalWrite(${pin}, etat_${pin});\netat_${pin} = !etat_${pin};\n`;
  })
  .build();

toggleBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOR);
  this.appendDummyInput()
    .appendField(Blockly.Msg["TOGGLE"] || "toggle state of PIN")
    .appendField(new Blockly.FieldDropdown(getAllPins()), "PIN");
  this.setInputsInline(true);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  this.setTooltip(
    Blockly.Msg["TOGGLE_TOOLTIP"] ||
      "Toggle the logical state on the specified output."
  );
  this.setHelpUrl(
    Blockly.Msg["TEMPO_HELPURL"] ||
      "https://www.arduino.cc/en/tutorial/blink"
  );
};
