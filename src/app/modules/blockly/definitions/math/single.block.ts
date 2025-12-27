import * as Blockly from "blockly";
import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

/**
 * Math single block (sqrt, abs, -)
 */
export const mathSingleBlock = new BlockBuilder("math_single")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["math", "single"])
  .addValueInput("NUM", null, "Number")
  .addDropdownField(
    "OP",
    [
      ["%{BKY_MATH_SINGLE_OP_ROOT}", "ROOT"],
      ["%{BKY_MATH_SINGLE_OP_ABSOLUTE}", "ABS"],
      ["-", "NEG"],
    ],
    "ROOT",
    "NUM" // Attach dropdown to input NUM
  )
  .setOutput("Number")
  .setHelpUrl("https://docs.arduino.cc/learn/programming/reference/#mathematical-functions")
  .setTooltip(function (this: Blockly.Block) {
    try {
      const op = this.getFieldValue("OP");
      const TOOLTIPS: { [key: string]: string } = {
        ROOT: Blockly.Msg["MATH_SINGLE_TOOLTIP_ROOT"],
        ABS: Blockly.Msg["MATH_SINGLE_TOOLTIP_ABS"],
        NEG: Blockly.Msg["MATH_SINGLE_TOOLTIP_NEG"],
      };
      return TOOLTIPS[op];
    } catch (e) {
      return Blockly.Msg["MATH_SINGLE_TOOLTIP_ROOT"];
    }
  })
  .setArduinoGenerator((block, generator) => {
    const op = block.getFieldValue("OP");

    if (op === "NEG") {
      // Special handling for negation
      let arg = generator.valueToCode(block, "NUM", generator.ORDER_UNARY_NEGATION) || "0";
      // If arg already starts with "-", add space to avoid double negative
      if (arg[0] === "-") {
        arg = " " + arg;
      }
      const code = "-" + arg;
      return [code, generator.ORDER_UNARY_NEGATION];
    }

    const arg = generator.valueToCode(block, "NUM", generator.ORDER_NONE) || "0";
    let code: string;
    switch (op) {
      case "ABS":
        code = `abs(${arg})`;
        break;
      case "ROOT":
        code = `sqrt(${arg})`;
        break;
      default:
        code = `sqrt(${arg})`;
    }

    return [code, generator.ORDER_ATOMIC];
  })
  .build();

