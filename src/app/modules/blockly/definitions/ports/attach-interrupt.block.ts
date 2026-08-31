import * as Blockly from "blockly";
import { getInterruptPins } from "@app/modules/device/helpers/device-board-globals.helper";
import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
  getInterruptModeOptions,
} from "./config";

export const attachInterruptBlock = new BlockBuilder("inout_attachInterrupt")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["ports", "interrupt"])
  .addStatementInput("DO")
  .setTooltip("%{BKY_LKL_TOOLTIP_INOUT_ATTACHINTERRUPT}")
  .setHelpUrl("https://www.arduino.cc/reference/en/language/functions/external-interrupts/attachinterrupt/")
  .setArduinoGenerator((block, generator) => {
    const pin = block.getFieldValue("PIN");
    const mode = block.getFieldValue("mode");
    const funcName = `interrupt_${pin}`;
    generator.setups_[`setup_Interrupt_${pin}`] =
      `pinMode(${pin}, INPUT);\n  attachInterrupt(${pin}, ${funcName}, ${mode});`;
    const branch = generator.statementToCode(block, "DO");
    generator.codeFunctions_[funcName] = `void ${funcName}() {\n${branch}}`;
    return "";
  })
  .build();

attachInterruptBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOR);
  this.appendDummyInput()
    .appendField(Blockly.Msg["LKL_ATTACHINTERRUPT_PIN"] || "interrupt: when a")
    .appendField(
      new Blockly.FieldDropdown(getInterruptModeOptions()),
      "mode"
    );
  this.appendDummyInput()
    .appendField(Blockly.Msg["LKL_MODE"] || "detected on PIN")
    .appendField(new Blockly.FieldDropdown(getInterruptPins()), "PIN");
  this.appendStatementInput("DO").appendField(
    Blockly.Msg["CONTROLS_IF_MSG_THEN"] || "do"
  );
  this.setInputsInline(false);
  this.setPreviousStatement(false);
  this.setNextStatement(false);
  this.setTooltip(
    Blockly.Msg["LKL_TOOLTIP_INOUT_ATTACHINTERRUPT"] ||
      "Run code when an external interrupt occurs on the pin."
  );
  this.setHelpUrl(
    "https://www.arduino.cc/reference/en/language/functions/external-interrupts/attachinterrupt/"
  );
};
