import * as Blockly from "blockly";
import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

/**
 * Math round block (round, round up, round down)
 */
export const mathRoundBlock = new BlockBuilder("math_round")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["math", "round"])
  .addValueInput("NUM", null, "Number")
  .addDropdownField(
    "OP",
    [
      ["%{BKY_MATH_ROUND_MSG_ROUND}", "ROUND"],
      ["%{BKY_MATH_ROUND_MSG_ROUNDUP}", "ROUNDUP"],
      ["%{BKY_MATH_ROUND_MSG_ROUNDDOWN}", "ROUNDDOWN"],
    ],
    "ROUND",
    "NUM" // Attach dropdown to input NUM
  )
  .setOutput("Number")
  .setHelpUrl("https://docs.arduino.cc/learn/programming/reference/#mathematical-functions")
  .setTooltip(function (this: Blockly.Block) {
    try {
      const op = this.getFieldValue("OP");
      const TOOLTIPS: { [key: string]: string } = {
        ROUND: Blockly.Msg["MATH_ROUND_TOOLTIP"],
        ROUNDUP: Blockly.Msg["MATH_ROUND_TOOLTIP_ROUNDUP"],
        ROUNDDOWN: Blockly.Msg["MATH_ROUND_TOOLTIP_ROUNDDOWN"],
      };
      return TOOLTIPS[op];
    } catch (e) {
      return Blockly.Msg["MATH_ROUND_TOOLTIP"];
    }
  })
  .setArduinoGenerator((block, generator) => {
    const op = block.getFieldValue("OP");
    const arg = generator.valueToCode(block, "NUM", generator.ORDER_NONE) || "0";

    let code: string;
    switch (op) {
      case "ROUND":
        code = `round(${arg})`;
        break;
      case "ROUNDUP":
        code = `ceil(${arg})`;
        break;
      case "ROUNDDOWN":
        code = `floor(${arg})`;
        break;
      default:
        code = `round(${arg})`;
    }

    return [code, generator.ORDER_ATOMIC];
  })
  .build();

