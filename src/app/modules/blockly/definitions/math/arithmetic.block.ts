import * as Blockly from "blockly";
import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

/**
 * Math arithmetic block (+, -, *, /, pow)
 */
export const mathArithmeticBlock = new BlockBuilder("math_arithmetic")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["math", "arithmetic"])
  .addValueInput("A", null, "Number")
  .addValueInput("B", null, "Number")
  .addDropdownField(
    "OP",
    [
      ["+", "ADD"],
      ["-", "MINUS"],
      ["×", "MULTIPLY"],
      ["÷", "DIVIDE"],
      ["^", "POWER"],
    ],
    "ADD",
    "B" // Attach dropdown to input B
  )
  .setInputsInline(true)
  .setOutput("Number")
  .setHelpUrl("https://docs.arduino.cc/learn/programming/reference/#arithmetic-operators")
  .setTooltip(function (this: Blockly.Block) {
    const op = this.getFieldValue("OP");
    const TOOLTIPS: { [key: string]: string } = {
      ADD: Blockly.Msg["MATH_ARITHMETIC_TOOLTIP_ADD"] || "Return the sum of the two numbers",
      MINUS: Blockly.Msg["MATH_ARITHMETIC_TOOLTIP_MINUS"] || "Return the difference of the two numbers",
      MULTIPLY: Blockly.Msg["MATH_ARITHMETIC_TOOLTIP_MULTIPLY"] || "Return the product of the two numbers",
      DIVIDE: Blockly.Msg["MATH_ARITHMETIC_TOOLTIP_DIVIDE"] || "Return the quotient of the two numbers",
      POWER: Blockly.Msg["MATH_ARITHMETIC_TOOLTIP_POWER"] || "Return the first number raised to the power of the second",
    };
    return TOOLTIPS[op] || "";
  })
  .setArduinoGenerator((block, generator) => {
    const op = block.getFieldValue("OP");
    const OPERATORS: { [key: string]: [string | null, number] } = {
      ADD: [" + ", generator.ORDER_ADDITIVE],
      MINUS: [" - ", generator.ORDER_ADDITIVE],
      MULTIPLY: [" * ", generator.ORDER_MULTIPLICATIVE],
      DIVIDE: [" / ", generator.ORDER_MULTIPLICATIVE],
      POWER: [null, generator.ORDER_NONE],
    };

    const tuple = OPERATORS[op] || [" + ", generator.ORDER_ADDITIVE];
    const operator = tuple[0];
    const order = tuple[1];

    const a = generator.valueToCode(block, "A", order) || "0";
    const b = generator.valueToCode(block, "B", order) || "0";

    let code: string;
    if (!operator) {
      // Power uses pow() function
      code = `pow(${a}, ${b})`;
      return [code, generator.ORDER_UNARY_POSTFIX];
    }

    code = `${a}${operator}${b}`;
    return [code, order];
  })
  .build();

