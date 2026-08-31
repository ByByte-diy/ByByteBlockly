import * as Blockly from "blockly";
import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

function getWhereOptions(): [string, string][] {
  return [
    [Blockly.Msg["TEXT_CHARAT_FROM_START"] || "from start", "FROM_START"],
    [Blockly.Msg["TEXT_CHARAT_FROM_END"] || "from end", "FROM_END"],
    [Blockly.Msg["TEXT_CHARAT_FIRST"] || "first", "FIRST"],
    [Blockly.Msg["TEXT_CHARAT_LAST"] || "last", "LAST"],
  ];
}

export const charAtBlock = new BlockBuilder("text_charAt")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["text"])
  .setOutput("String")
  .setInputsInline(true)
  .setHelpUrl("https://www.arduino.cc/en/Reference/StringCharAt")
  .setArduinoGenerator((block, generator) => {
    const where = block.getFieldValue("WHERE") || "FROM_START";
    const text =
      generator.valueToCode(block, "VALUE", generator.ORDER_UNARY_POSTFIX) ||
      '""';

    switch (where) {
      case "FIRST":
        return [`${text}.charAt(0)`, generator.ORDER_UNARY_POSTFIX];
      case "LAST":
        return [
          `${text}.charAt(${text}.length()-1)`,
          generator.ORDER_UNARY_POSTFIX,
        ];
      case "FROM_START": {
        const at =
          generator.valueToCode(block, "AT", generator.ORDER_UNARY_POSTFIX) ||
          "1";
        return [`${text}.charAt(${at}-1)`, generator.ORDER_UNARY_POSTFIX];
      }
      case "FROM_END": {
        const at =
          generator.valueToCode(block, "AT", generator.ORDER_UNARY_POSTFIX) ||
          "1";
        return [
          `${text}.charAt(${text}.length()-${at})`,
          generator.ORDER_UNARY_POSTFIX,
        ];
      }
      default:
        return [`${text}.charAt(0)`, generator.ORDER_UNARY_POSTFIX];
    }
  })
  .build();

charAtBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOR);
  this.appendValueInput("VALUE")
    .setCheck("String")
    .appendField(Blockly.Msg["TEXT_CHARAT_INPUT_INTEXT"] || "in text");
  this.appendDummyInput("AT");
  this.setInputsInline(true);
  this.setOutput(true, "String");
  this.setHelpUrl("https://www.arduino.cc/en/Reference/StringCharAt");

  (this as any).updateAt_ = function (isAt: boolean) {
    this.removeInput("AT");
    this.removeInput("ORDINAL", true);

    if (isAt) {
      this.appendValueInput("AT").setCheck("Number");
      if (Blockly.Msg["ORDINAL_NUMBER_SUFFIX"]) {
        this.appendDummyInput("ORDINAL").appendField(
          Blockly.Msg["ORDINAL_NUMBER_SUFFIX"]
        );
      }
    } else {
      this.appendDummyInput("AT");
    }

    if (Blockly.Msg["TEXT_CHARAT_TAIL"]) {
      this.removeInput("TAIL", true);
      this.appendDummyInput("TAIL").appendField(
        Blockly.Msg["TEXT_CHARAT_TAIL"]
      );
    }

    const blockRef = this;
    const menu = new Blockly.FieldDropdown(getWhereOptions(), function (value) {
      const newAt = value === "FROM_START" || value === "FROM_END";
      if (newAt !== isAt) {
        blockRef.updateAt_(newAt);
        blockRef.setFieldValue(value, "WHERE");
        return null;
      }
      return undefined;
    });

    this.getInput("AT")!.appendField(menu, "WHERE");
  };

  (this as any).mutationToDom = function () {
    const container = document.createElement("mutation");
    const isAt = this.getInput("AT")!.type === Blockly.INPUT_VALUE;
    container.setAttribute("at", String(isAt));
    return container;
  };

  (this as any).domToMutation = function (xmlElement: Element) {
    const isAt = xmlElement.getAttribute("at") !== "false";
    this.updateAt_(isAt);
  };

  (this as any).updateAt_(true);

  const thisBlock = this;
  this.setTooltip(function () {
    let tooltip = Blockly.Msg["TEXT_CHARAT_TOOLTIP"] || "Get character from text.";
    const where = thisBlock.getFieldValue("WHERE");
    if (where === "FROM_START" || where === "FROM_END") {
      const msg =
        where === "FROM_START"
          ? Blockly.Msg["LISTS_INDEX_FROM_START_TOOLTIP"]
          : Blockly.Msg["LISTS_INDEX_FROM_END_TOOLTIP"];
      if (msg) {
        tooltip +=
          "  " +
          msg.replace(
            "%1",
            thisBlock.workspace.options.oneBasedIndex ? "#1" : "#0"
          );
      }
    }
    return tooltip;
  });
};
