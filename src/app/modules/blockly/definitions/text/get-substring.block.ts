import * as Blockly from "blockly";
import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

const WHERE_OPTIONS_1: [string, string][] = [
  [
    Blockly.Msg["TEXT_GET_SUBSTRING_START_FROM_START"] || "from start",
    "FROM_START",
  ],
  [
    Blockly.Msg["TEXT_GET_SUBSTRING_START_FROM_END"] || "from end",
    "FROM_END",
  ],
  [Blockly.Msg["TEXT_GET_SUBSTRING_START_FIRST"] || "first", "FIRST"],
];

const WHERE_OPTIONS_2: [string, string][] = [
  [
    Blockly.Msg["TEXT_GET_SUBSTRING_END_FROM_START"] || "from start",
    "FROM_START",
  ],
  [
    Blockly.Msg["TEXT_GET_SUBSTRING_END_FROM_END"] || "from end",
    "FROM_END",
  ],
  [Blockly.Msg["TEXT_GET_SUBSTRING_END_LAST"] || "last", "LAST"],
];

export const getSubstringBlock = new BlockBuilder("text_getSubstring")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["text"])
  .setOutput("String")
  .setInputsInline(true)
  .setHelpUrl("https://www.arduino.cc/en/Reference/StringSubstring")
  .setTooltip("%{BKY_TEXT_GET_SUBSTRING_TOOLTIP}")
  .setArduinoGenerator((block, generator) => {
    const where1 = block.getFieldValue("WHERE1");
    const where2 = block.getFieldValue("WHERE2");
    const text =
      generator.valueToCode(block, "STRING", generator.ORDER_UNARY_POSTFIX) ||
      '""';

    let at1: string;
    switch (where1) {
      case "FROM_START":
        at1 =
          (generator.valueToCode(block, "AT1", generator.ORDER_UNARY_POSTFIX) ||
            "1") + " - 1";
        break;
      case "FROM_END":
        at1 = `${text}.length()-` +
          (generator.valueToCode(block, "AT1", generator.ORDER_UNARY_POSTFIX) ||
            "1");
        break;
      case "FIRST":
        at1 = "0";
        break;
      default:
        at1 = "0";
    }

    let at2: string;
    switch (where2) {
      case "FROM_START":
        at2 =
          (generator.valueToCode(block, "AT2", generator.ORDER_UNARY_POSTFIX) ||
            "1") + " - 1";
        break;
      case "FROM_END":
        at2 = `${text}.length()-` +
          (generator.valueToCode(block, "AT2", generator.ORDER_UNARY_POSTFIX) ||
            "1");
        break;
      case "LAST":
        at2 = `${text}.length()-1`;
        break;
      default:
        at2 = `${text}.length()-1`;
    }

    return [`${text}.substring(${at1}, ${at2})`, generator.ORDER_UNARY_POSTFIX];
  })
  .build();

getSubstringBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOR);
  this.appendValueInput("STRING")
    .setCheck("String")
    .appendField(
      Blockly.Msg["TEXT_GET_SUBSTRING_INPUT_IN_TEXT"] || "in text"
    );
  this.appendDummyInput("AT1");
  this.appendDummyInput("AT2");

  if (Blockly.Msg["TEXT_GET_SUBSTRING_TAIL"]) {
    this.appendDummyInput("TAIL").appendField(
      Blockly.Msg["TEXT_GET_SUBSTRING_TAIL"]
    );
  }

  this.setInputsInline(true);
  this.setOutput(true, "String");
  this.setHelpUrl("https://www.arduino.cc/en/Reference/StringSubstring");
  this.setTooltip(
    Blockly.Msg["TEXT_GET_SUBSTRING_TOOLTIP"] || "Get substring from text."
  );

  (this as any).updateAt_ = function (n: number, isAt: boolean) {
    this.removeInput("AT" + n);
    this.removeInput("ORDINAL" + n, true);

    if (isAt) {
      this.appendValueInput("AT" + n).setCheck("Number");
      if (Blockly.Msg["ORDINAL_NUMBER_SUFFIX"]) {
        this.appendDummyInput("ORDINAL" + n).appendField(
          Blockly.Msg["ORDINAL_NUMBER_SUFFIX"]
        );
      }
    } else {
      this.appendDummyInput("AT" + n);
    }

    if (n === 2 && Blockly.Msg["TEXT_GET_SUBSTRING_TAIL"]) {
      this.removeInput("TAIL", true);
      this.appendDummyInput("TAIL").appendField(
        Blockly.Msg["TEXT_GET_SUBSTRING_TAIL"]
      );
    }

    const options = n === 1 ? WHERE_OPTIONS_1 : WHERE_OPTIONS_2;
    const blockRef = this;
    const menu = new Blockly.FieldDropdown(options, function (value) {
      const newAt = value === "FROM_START" || value === "FROM_END";
      if (newAt !== isAt) {
        blockRef.updateAt_(n, newAt);
        blockRef.setFieldValue(value, "WHERE" + n);
        return null;
      }
      return undefined;
    });

    this.getInput("AT" + n)!.appendField(menu, "WHERE" + n);
  };

  (this as any).mutationToDom = function () {
    const container = document.createElement("mutation");
    container.setAttribute(
      "at1",
      String(this.getInput("AT1")!.type === Blockly.INPUT_VALUE)
    );
    container.setAttribute(
      "at2",
      String(this.getInput("AT2")!.type === Blockly.INPUT_VALUE)
    );
    return container;
  };

  (this as any).domToMutation = function (xmlElement: Element) {
    this.updateAt_(1, xmlElement.getAttribute("at1") === "true");
    this.updateAt_(2, xmlElement.getAttribute("at2") === "true");
  };

  (this as any).updateAt_(1, true);
  (this as any).updateAt_(2, true);
};
