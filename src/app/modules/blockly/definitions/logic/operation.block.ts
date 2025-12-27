import * as Blockly from "blockly";
import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

/**
 * Logic operation block (and, or, xor, shift)
 */
export const logicOperationBlock = new BlockBuilder("logic_operation")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["logic", "operation"])
  .setOutput("Boolean")
  .setHelpUrl("https://docs.arduino.cc/learn/programming/reference/#boolean-operators")
  .setArduinoGenerator((block, generator) => {
    const op = block.getFieldValue("OP");
    const a = generator.valueToCode(block, "A", generator.ORDER_NONE) || "false";
    const b = generator.valueToCode(block, "B", generator.ORDER_NONE) || "false";

    let code = "";
    let order = generator.ORDER_NONE;

    switch (op) {
      case "and":
        code = `${a} && ${b}`;
        order = generator.ORDER_LOGICAL_AND;
        break;
      case "or":
        code = `${a} || ${b}`;
        order = generator.ORDER_LOGICAL_OR;
        break;
      case "xor":
        code = `${a} ^ ${b}`;
        order = generator.ORDER_BITWISE_XOR;
        break;
      case "shiftL":
        code = `${a} << ${b}`;
        order = generator.ORDER_SHIFT;
        break;
      case "shiftR":
        code = `${a} >> ${b}`;
        order = generator.ORDER_SHIFT;
        break;
      default:
        code = `${a} && ${b}`;
    }

    return [code, order];
  })
  .build();

// Extend init to add dropdown with dynamic tooltip
const originalInit = logicOperationBlock.init;
logicOperationBlock.init = function (this: Blockly.Block) {
  originalInit.call(this);

  const OPERATORS: [string, string][] = [
    [Blockly.Msg["LOGIC_OPERATION_AND"] || "and", "and"],
    [Blockly.Msg["LOGIC_OPERATION_OR"] || "or", "or"],
    [Blockly.Msg["LOGIC_OPERATION_XOR"] || "xor", "xor"],
    [Blockly.Msg["LOGIC_OPERATION_SHIFTL"] || "<<", "shiftL"],
    [Blockly.Msg["LOGIC_OPERATION_SHIFTR"] || ">>", "shiftR"],
  ];

  this.appendValueInput("A");
  this.appendValueInput("B").appendField(
    new Blockly.FieldDropdown(OPERATORS),
    "OP"
  );
  this.setInputsInline(true);

  // Dynamic tooltip
  const thisBlock = this;
  this.setTooltip(function () {
    const op = thisBlock.getFieldValue("OP");
    const TOOLTIPS: { [key: string]: string } = {
      and: Blockly.Msg["LOGIC_OPERATION_TOOLTIP_AND"] || "Returns true if both inputs are true",
      or: Blockly.Msg["LOGIC_OPERATION_TOOLTIP_OR"] || "Returns true if at least one input is true",
      xor: Blockly.Msg["LOGIC_OPERATION_TOOLTIP_XOR"] || "Returns true if exactly one input is true",
      shiftL: Blockly.Msg["LOGIC_OPERATION_TOOLTIP_SHIFTL"] || "Shifts bits left",
      shiftR: Blockly.Msg["LOGIC_OPERATION_TOOLTIP_SHIFTR"] || "Shifts bits right",
    };
    return TOOLTIPS[op] || "";
  });
};

