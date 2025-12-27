import * as Blockly from "blockly";
import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

/**
 * Logic compare block (=, ≠, <, ≤, >, ≥)
 */
export const logicCompareBlock = new BlockBuilder("logic_compare")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["logic", "compare"])
  .addValueInput("A")
  .addValueInput("B")
  .addDropdownField(
    "OP",
    [
      ["=", "EQ"],
      ["≠", "NEQ"],
      ["<", "LT"],
      ["≤", "LTE"],
      [">", "GT"],
      ["≥", "GTE"],
    ],
    "EQ",
    "B" // Attach dropdown to input B
  )
  .setInputsInline(true)
  .setOutput("Boolean")
  .setHelpUrl(
    "https://docs.arduino.cc/learn/programming/reference/#comparison-operators"
  )
  .setTooltip(function (this: Blockly.Block) {
    const op = this.getFieldValue("OP");
    const TOOLTIPS: { [key: string]: string } = {
      EQ: Blockly.Msg["LOGIC_COMPARE_TOOLTIP_EQ"] || "",
      NEQ: Blockly.Msg["LOGIC_COMPARE_TOOLTIP_NEQ"] || "",
      LT: Blockly.Msg["LOGIC_COMPARE_TOOLTIP_LT"] || "",
      LTE: Blockly.Msg["LOGIC_COMPARE_TOOLTIP_LTE"] || "",
      GT: Blockly.Msg["LOGIC_COMPARE_TOOLTIP_GT"] || "",
      GTE: Blockly.Msg["LOGIC_COMPARE_TOOLTIP_GTE"] || "",
    };
    return TOOLTIPS[op] || "";
  })
  .setOnChange(function (this: Blockly.Block, e: Blockly.Events.Abstract) {
    if (
      e.type === Blockly.Events.BLOCK_MOVE ||
      e.type === Blockly.Events.BLOCK_CHANGE
    ) {
      const blockA = this.getInputTargetBlock("A");
      const blockB = this.getInputTargetBlock("B");
      if (
        blockA &&
        blockB &&
        !(blockA.outputConnection as any).checkType_(blockB.outputConnection)
      ) {
        const prevBlocks = (this as any).prevBlocks_ as (Blockly.Block | null)[];
        if (prevBlocks) {
          for (let i = 0; i < prevBlocks.length; i++) {
            const block = prevBlocks[i];
            if (block === blockA || block === blockB) {
              block.setParent(null);
              block.bumpNeighbours();
            }
          }
        }
      }
      (this as any).prevBlocks_ = [blockA, blockB];
    }
  })
  .setArduinoGenerator((block, generator) => {
    const op = block.getFieldValue("OP");
    const OPERATORS: { [key: string]: string } = {
      EQ: "==",
      NEQ: "!=",
      LT: "<",
      LTE: "<=",
      GT: ">",
      GTE: ">=",
    };

    const operator = OPERATORS[op] || "==";
    const order =
      operator === "==" || operator === "!="
        ? generator.ORDER_EQUALITY
        : generator.ORDER_RELATIONAL;

    const a = generator.valueToCode(block, "A", order) || "0";
    const b = generator.valueToCode(block, "B", order) || "0";

    const code = `${a} ${operator} ${b}`;
    return [code, order];
  })
  .build();

// Initialize prevBlocks_ for type checking
const originalInit = logicCompareBlock.init;
logicCompareBlock.init = function (this: Blockly.Block) {
  originalInit.call(this);
  (this as any).prevBlocks_ = [null, null];
};
