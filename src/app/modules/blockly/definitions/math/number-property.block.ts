import * as Blockly from "blockly";
import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

type NumberPropertyBlock = Blockly.Block & {
  updateShape_(divisorInput: boolean): void;
  mutationToDom(): Element;
  domToMutation(xmlElement: Element): void;
};

export const numberPropertyBlock = new BlockBuilder("math_number_property")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["math", "property"])
  .addValueInput("NUMBER_TO_CHECK", null, "Number")
  .setOutput("Boolean")
  .setInputsInline(true)
  .setTooltip("%{BKY_MATH_IS_TOOLTIP}")
  .setHelpUrl("https://docs.arduino.cc/learn/programming/reference/#math")
  .setArduinoGenerator((block, generator) => {
    const numberToCheck =
      generator.valueToCode(
        block,
        "NUMBER_TO_CHECK",
        generator.ORDER_MODULUS
      ) || "0";
    const property = block.getFieldValue("PROPERTY");

    if (property === "PRIME") {
      const functionName = (generator as any).provideFunction_("math_isPrime", [
        "boolean %1(int n) {",
        "  if (n == 2 || n == 3) {",
        "    return true;",
        "  }",
        "  if (n <= 1 || n % 2 == 0 || n % 3 == 0) {",
        "    return false;",
        "  }",
        "  for (int x = 6; x <= sqrt(n) + 1; x += 6) {",
        "    if (n % (x - 1) == 0 || n % (x + 1) == 0) {",
        "      return false;",
        "    }",
        "  }",
        "  return true;",
        "}",
      ]);
      return [
        functionName + "(" + numberToCheck + ")",
        generator.ORDER_FUNCTION_CALL,
      ];
    }

    let code: string;
    switch (property) {
      case "EVEN":
        code = `${numberToCheck} % 2 == 0`;
        break;
      case "ODD":
        code = `${numberToCheck} % 2 == 1`;
        break;
      case "WHOLE":
        code = `${numberToCheck} % 1 == 0`;
        break;
      case "POSITIVE":
        code = `${numberToCheck} > 0`;
        break;
      case "NEGATIVE":
        code = `${numberToCheck} < 0`;
        break;
      case "DIVISIBLE_BY": {
        const divisor =
          generator.valueToCode(block, "DIVISOR", generator.ORDER_MODULUS) ||
          "1";
        code = `${numberToCheck} % ${divisor} == 0`;
        break;
      }
      default:
        code = "false";
    }

    return [code, generator.ORDER_EQUALITY];
  })
  .build();

const originalInit = numberPropertyBlock.init;
numberPropertyBlock.init = function (this: Blockly.Block) {
  const block = this as NumberPropertyBlock;

  block.updateShape_ = function (divisorInput: boolean) {
    const inputExists = this.getInput("DIVISOR");
    if (divisorInput && !inputExists) {
      this.appendValueInput("DIVISOR").setCheck("Number");
    } else if (!divisorInput && inputExists) {
      this.removeInput("DIVISOR");
    }
  };

  block.mutationToDom = function () {
    const container = document.createElement("mutation");
    container.setAttribute(
      "divisor_input",
      String(this.getFieldValue("PROPERTY") === "DIVISIBLE_BY")
    );
    return container;
  };

  block.domToMutation = function (xmlElement: Element) {
    this.updateShape_(xmlElement.getAttribute("divisor_input") === "true");
  };

  originalInit.call(this);

  const PROPERTIES: [string, string][] = [
    [Blockly.Msg["MATH_IS_EVEN"] || "is even", "EVEN"],
    [Blockly.Msg["MATH_IS_ODD"] || "is odd", "ODD"],
    [Blockly.Msg["MATH_IS_PRIME"] || "is prime", "PRIME"],
    [Blockly.Msg["MATH_IS_WHOLE"] || "is whole", "WHOLE"],
    [Blockly.Msg["MATH_IS_POSITIVE"] || "is positive", "POSITIVE"],
    [Blockly.Msg["MATH_IS_NEGATIVE"] || "is negative", "NEGATIVE"],
    [
      Blockly.Msg["MATH_IS_DIVISIBLE_BY"] || "is divisible by",
      "DIVISIBLE_BY",
    ],
  ];

  const dropdown = new Blockly.FieldDropdown(PROPERTIES, function (option) {
    block.updateShape_(option === "DIVISIBLE_BY");
    return undefined;
  });

  this.appendDummyInput().appendField(dropdown, "PROPERTY");
};
