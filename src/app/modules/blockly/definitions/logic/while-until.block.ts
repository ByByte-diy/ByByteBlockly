import * as Blockly from "blockly";
import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

export const whileUntilBlock = new BlockBuilder("controls_whileUntil")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["logic", "loop", "while"])
  .addValueInput("BOOL", null, "Boolean")
  .addStatementInput("DO")
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setInputsInline(true)
  .setHelpUrl("https://docs.arduino.cc/learn/programming/reference/#control-structure")
  .setArduinoGenerator((block, generator) => {
    let condition =
      generator.valueToCode(block, "BOOL", generator.ORDER_NONE) || "false";
    const branch = generator.statementToCode(block, "DO");

    if (block.getFieldValue("MODE") === "UNTIL") {
      if (!/^\w+$/.test(condition)) {
        condition = `(${condition})`;
      }
      condition = `!${condition}`;
    }

    return `while (${condition}) {\n${branch}}\n`;
  })
  .build();

const originalInit = whileUntilBlock.init;
whileUntilBlock.init = function (this: Blockly.Block) {
  originalInit.call(this);

  const OPERATORS: [string, string][] = [
    [
      Blockly.Msg["CONTROLS_WHILEUNTIL_OPERATOR_WHILE"] || "while",
      "WHILE",
    ],
    [
      Blockly.Msg["CONTROLS_WHILEUNTIL_OPERATOR_UNTIL"] || "until",
      "UNTIL",
    ],
  ];

  this.getInput("BOOL")!.appendField(
    new Blockly.FieldDropdown(OPERATORS),
    "MODE"
  );

  const thisBlock = this;
  this.setTooltip(function () {
    const mode = thisBlock.getFieldValue("MODE");
    const tooltips: Record<string, string> = {
      WHILE:
        Blockly.Msg["CONTROLS_WHILEUNTIL_TOOLTIP_WHILE"] ||
        "Repeat while condition is true",
      UNTIL:
        Blockly.Msg["CONTROLS_WHILEUNTIL_TOOLTIP_UNTIL"] ||
        "Repeat until condition is true",
    };
    return tooltips[mode] || "";
  });
};
