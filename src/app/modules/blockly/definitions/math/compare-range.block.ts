// Comparison with range (inf < valeur < sup)
import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

const OPERATORS: [string, string][] = [
  ["<", "LT"],
  ["≤", "LTE"],
  [">", "GT"],
  ["≥", "GTE"],
];

export const rangeCompareBlock = new BlockBuilder("math_range_compare")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["math", "compare", "range"])
  .addValueInput("inf", null, "Number")
  .addDummyInput("COMP_INF_DUMMY")
  .addDropdownField("comp_inf", OPERATORS, "LT", "COMP_INF_DUMMY")
  .addValueInput("valeur", null, null)
  .addDummyInput("COMP_SUP_DUMMY")
  .addDropdownField("comp_sup", OPERATORS, "LT", "COMP_SUP_DUMMY")
  .addValueInput("sup", null, "Number")
  .setInputsInline(true)
  .setOutput("Boolean")
  .setTooltip("%{BKY_MATH_RANGE_COMPARE_TOOLTIP}")
  .setHelpUrl("https://docs.arduino.cc/learn/programming/sketches")
  .setArduinoGenerator((block, generator) => {
    const OPERATORS_MAP: { [key: string]: string } = {
      LT: "<",
      LTE: "<=",
      GT: ">",
      GTE: ">=",
    };

    const valueInf = generator.valueToCode(block, "inf", generator.ORDER_ATOMIC) || "0";
    const compInf = block.getFieldValue("comp_inf");
    const valueValeur = generator.valueToCode(block, "valeur", generator.ORDER_ATOMIC) || "0";
    const compSup = OPERATORS_MAP[block.getFieldValue("comp_sup")] || "<";
    const valueSup = generator.valueToCode(block, "sup", generator.ORDER_ATOMIC) || "0";

    let code = "";
    // Invert operator for first comparison (inf < valeur becomes valeur > inf)
    if (compInf === "LT") {
      code += `(${valueValeur} > ${valueInf})`;
    } else if (compInf === "GT") {
      code += `(${valueValeur} < ${valueInf})`;
    } else if (compInf === "GTE") {
      code += `(${valueValeur} <= ${valueInf})`;
    } else if (compInf === "LTE") {
      code += `(${valueValeur} >= ${valueInf})`;
    }

    code += ` && (${valueValeur} ${compSup} ${valueSup})`;
    return [code, generator.ORDER_NONE];
  })
  .build();
