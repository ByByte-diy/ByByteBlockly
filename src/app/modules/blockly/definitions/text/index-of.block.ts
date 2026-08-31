import * as Blockly from "blockly";
import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

export const indexOfBlock = new BlockBuilder("text_indexOf")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["text"])
  .addValueInput("VALUE", "%{BKY_TEXT_INDEXOF_INPUT_INTEXT}", "String")
  .addValueInput("FIND", null, "String")
  .setOutput("Number")
  .setInputsInline(true)
  .setHelpUrl("https://www.arduino.cc/en/Reference/StringIndexOf")
  .setArduinoGenerator((block, generator) => {
    const operator =
      block.getFieldValue("END") === "FIRST" ? ".indexOf" : ".lastIndexOf";
    const substring =
      generator.valueToCode(block, "FIND", generator.ORDER_UNARY_POSTFIX) ||
      '""';
    const text =
      generator.valueToCode(block, "VALUE", generator.ORDER_UNARY_POSTFIX) ||
      '""';
    return [`${text}${operator}(${substring})`, generator.ORDER_UNARY_POSTFIX];
  })
  .build();

const originalIndexOfInit = indexOfBlock.init;
indexOfBlock.init = function (this: Blockly.Block) {
  originalIndexOfInit.call(this);

  const OPERATORS: [string, string][] = [
    [Blockly.Msg["TEXT_INDEXOF_OPERATOR_FIRST"] || "first", "FIRST"],
    [Blockly.Msg["TEXT_INDEXOF_OPERATOR_LAST"] || "last", "LAST"],
  ];

  this.getInput("FIND")!.appendField(
    new Blockly.FieldDropdown(OPERATORS),
    "END"
  );

  if (Blockly.Msg["TEXT_INDEXOF_TAIL"]) {
    this.appendDummyInput().appendField(Blockly.Msg["TEXT_INDEXOF_TAIL"]);
  }

  const thisBlock = this;
  this.setTooltip(function () {
    const indexHint = thisBlock.workspace.options.oneBasedIndex ? "0" : "-1";
    return (
      Blockly.Msg["TEXT_INDEXOF_TOOLTIP"] ||
      `Returns index of substring, or ${indexHint} if not found.`
    ).replace("%1", indexHint);
  });
};
