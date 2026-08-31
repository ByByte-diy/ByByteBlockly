import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

export const moduloBlock = new BlockBuilder("math_modulo")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["math", "modulo"])
  .setMessage("%{BKY_MATH_MODULO_TITLE}")
  .addValueInput("DIVIDEND", null, "Number")
  .addValueInput("DIVISOR", null, "Number")
  .setInputsInline(true)
  .setOutput("Number")
  .setTooltip("%{BKY_MATH_MODULO_TOOLTIP}")
  .setHelpUrl("https://docs.arduino.cc/learn/programming/reference/#math")
  .setArduinoGenerator((block, generator) => {
    const dividend =
      generator.valueToCode(block, "DIVIDEND", generator.ORDER_MODULUS) || "0";
    const divisor =
      generator.valueToCode(block, "DIVISOR", generator.ORDER_MODULUS) || "1";
    return [`(${dividend}) % (${divisor})`, generator.ORDER_MODULUS];
  })
  .build();
