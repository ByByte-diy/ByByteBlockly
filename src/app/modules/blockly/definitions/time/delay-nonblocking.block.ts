import * as Blockly from "blockly";
import { BlockBuilder } from "../../lib/builders/block-builder";
import { registerGlobalVariable } from "../../lib/generators/codegen-sections.helper";
import { attachShadowBlock } from "../../lib/helpers/shadow-block.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
  getTimeUnitOptions,
} from "./config";

export const delayNonBlockingBlock = new BlockBuilder("tempo_sans_delay")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["time", "delay", "nonblocking"])
  .addValueInput("DELAY_TIME", null, "Number")
  .setShadowBlock("math_number", { NUM: 1 })
  .addStatementInput("branche")
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setInputsInline(true)
  .setTooltip("%{BKY_TEMPO_TOOLTIP}")
  .setHelpUrl("%{BKY_TEMPO_HELPURL}")
  .setArduinoGenerator((block, generator) => {
    const unit = block.getFieldValue("unite");
    const delayTime =
      generator.valueToCode(block, "DELAY_TIME", generator.ORDER_ATOMIC) ||
      "0";
    const branch = generator.statementToCode(block, "branche");
    const timerVar = `temps${delayTime.replace(/\W/g, "_")}`;

    registerGlobalVariable(
      generator,
      `temporisation${delayTime}`,
      `long ${timerVar} = 0;`,
      `Non-blocking timer for interval ${delayTime} (does not use delay()).`
    );

    switch (unit) {
      case "u":
        return `if ((micros() - ${timerVar}) >= ${delayTime}) {\n  ${timerVar} = micros();\n${branch}}\n`;
      case "s":
        return `if ((millis() - ${timerVar}) >= ${delayTime} * 1000) {\n  ${timerVar} = millis();\n${branch}}\n`;
      default:
        return `if ((millis() - ${timerVar}) >= ${delayTime}) {\n  ${timerVar} = millis();\n${branch}}\n`;
    }
  })
  .build();

delayNonBlockingBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOR);
  this.appendValueInput("DELAY_TIME")
    .appendField(Blockly.Msg["TEMPO1"] || "every")
    .setCheck("Number");
  this.appendDummyInput().appendField(
    new Blockly.FieldDropdown(getTimeUnitOptions()),
    "unite"
  );
  this.appendStatementInput("branche").appendField(
    Blockly.Msg["CONTROLS_SWITCH_MSG_DO"] || "do"
  );
  this.setInputsInline(true);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  this.setTooltip(
    Blockly.Msg["TEMPO_TOOLTIP"] ||
    "Execute the blocks inside when the interval has elapsed. Non-blocking."
  );
  this.setHelpUrl(
    Blockly.Msg["TEMPO_HELPURL"] ||
    "https://www.arduino.cc/en/tutorial/blink"
  );

  attachShadowBlock(this, "DELAY_TIME", "math_number", { NUM: 1 });
};
