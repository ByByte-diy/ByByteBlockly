import * as Blockly from "blockly";
import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

/**
 * Math constant block (π, e, φ, √2, √½, ∞)
 */
export const mathConstantBlock = new BlockBuilder("math_constant")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["math", "constant"])
  .addDummyInput()
  .addDropdownField(
    "CONSTANT",
    [
      ["π", "PI"],
      ["e", "E"],
      ["φ", "GOLDEN_RATIO"],
      ["√2", "SQRT2"],
      ["√½", "SQRT1_2"],
      ["∞", "INFINITY"],
    ],
    "PI"
  )
  .setOutput("Number")
  .setHelpUrl("https://docs.arduino.cc/learn/programming/reference/#mathematical-functions")
  .setTooltip("%{BKY_MATH_CONSTANT_TOOLTIP}")
  .setArduinoGenerator((block, generator) => {
    const constant = block.getFieldValue("CONSTANT");
    const CONSTANTS: { [key: string]: [string, number] } = {
      PI: ["M_PI", generator.ORDER_MEMBER],
      E: ["M_E", generator.ORDER_MEMBER],
      GOLDEN_RATIO: ["(1 + sqrt(5)) / 2", generator.ORDER_MULTIPLICATIVE],
      SQRT2: ["M_SQRT2", generator.ORDER_MEMBER],
      SQRT1_2: ["M_SQRT1_2", generator.ORDER_MEMBER],
      INFINITY: ["INFINITY", generator.ORDER_ATOMIC],
    };
    return CONSTANTS[constant] || ["PI", generator.ORDER_MEMBER];
  })
  .build();

