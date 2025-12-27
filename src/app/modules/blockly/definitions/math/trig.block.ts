import * as Blockly from "blockly";
import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

/**
 * Math trig block (sin, cos, tan)
 */
export const mathTrigBlock = new BlockBuilder("math_trig")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["math", "trig"])
  .addValueInput("NUM", null, "Number")
  .addDropdownField(
    "OP",
    [
      ["%{BKY_MATH_TRIG_SIN}", "SIN"],
      ["%{BKY_MATH_TRIG_COS}", "COS"],
      ["%{BKY_MATH_TRIG_TAN}", "TAN"],
    ],
    "SIN",
    "NUM" // Attach dropdown to input NUM
  )
  .setOutput("Number")
  .setHelpUrl("https://docs.arduino.cc/learn/programming/reference/#mathematical-functions")
  .setTooltip(function (this: Blockly.Block) {
    try {
      const op = this.getFieldValue("OP");
      const TOOLTIPS: { [key: string]: string } = {
        SIN: Blockly.Msg["MATH_TRIG_TOOLTIP_SIN"],
        COS: Blockly.Msg["MATH_TRIG_TOOLTIP_COS"],
        TAN: Blockly.Msg["MATH_TRIG_TOOLTIP_TAN"],
      };
      return TOOLTIPS[op];
    } catch (e) {
      return Blockly.Msg["MATH_TRIG_TOOLTIP_SIN"];
    }
  })
  .setArduinoGenerator((block, generator) => {
    const op = block.getFieldValue("OP");
    // For trig functions, use ORDER_MULTIPLICATIVE (similar to ORDER_DIVISION in original)
    const arg = generator.valueToCode(block, "NUM", generator.ORDER_MULTIPLICATIVE) || "0";
    
    let code: string;
    switch (op) {
      case "SIN":
        code = `sin(${arg})`;
        break;
      case "COS":
        code = `cos(${arg})`;
        break;
      case "TAN":
        code = `tan(${arg})`;
        break;
      default:
        code = `sin(${arg})`;
    }

    return [code, generator.ORDER_ATOMIC];
  })
  .build();

