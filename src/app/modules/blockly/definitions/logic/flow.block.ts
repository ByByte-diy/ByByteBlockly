import * as Blockly from "blockly";
import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

/**
 * Flow control statements block (break/continue)
 */
export const flowStatementsBlock = new BlockBuilder("controls_flow_statements")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["logic", "flow", "break", "continue"])
  .setPreviousStatement(true)
  .setHelpUrl("https://docs.arduino.cc/learn/programming/reference/#control-structure")
  .setArduinoGenerator((block) => {
    const flow = block.getFieldValue("FLOW");
    switch (flow) {
      case "BREAK":
        return "break;\n";
      case "CONTINUE":
        return "continue;\n";
      default:
        return "";
    }
  })
  .build();

// Extend init to add dropdown with dynamic tooltip and onchange
const originalInit = flowStatementsBlock.init;
flowStatementsBlock.init = function (this: Blockly.Block) {
  // Don't call original init - we override completely
  this.setColour(CATEGORY_COLOR);

  const OPERATORS: [string, string][] = [
    [Blockly.Msg["CONTROLS_FLOW_STATEMENTS_OPERATOR_BREAK"] || "break out of loop", "BREAK"],
    [Blockly.Msg["CONTROLS_FLOW_STATEMENTS_OPERATOR_CONTINUE"] || "continue with next iteration", "CONTINUE"],
  ];

  this.appendDummyInput().appendField(
    new Blockly.FieldDropdown(OPERATORS),
    "FLOW"
  );
  this.setPreviousStatement(true);
  this.setHelpUrl("https://docs.arduino.cc/learn/programming/reference/#control-structure");

  // Dynamic tooltip
  const thisBlock = this;
  this.setTooltip(function () {
    const op = thisBlock.getFieldValue("FLOW");
    const TOOLTIPS: { [key: string]: string } = {
      BREAK: Blockly.Msg["CONTROLS_FLOW_STATEMENTS_TOOLTIP_BREAK"] || "Break out of the containing loop",
      CONTINUE: Blockly.Msg["CONTROLS_FLOW_STATEMENTS_TOOLTIP_CONTINUE"] || "Skip the rest of this loop, and continue with the next iteration",
    };
    return TOOLTIPS[op] || "";
  });

  // Onchange - warn if not in loop
  this.setOnChange(function (this: Blockly.Block) {
    let legal = false;
    let block: Blockly.Block | null = this;
    const loopTypes = [
      "controls_repeat",
      "controls_repeat_ext",
      "controls_forEach",
      "controls_for",
      "controls_whileUntil",
      "base_loop",
    ];

    do {
      if (loopTypes.includes(block.type)) {
        legal = true;
        break;
      }
      block = block.getSurroundParent();
    } while (block);

    if (legal) {
      this.setWarningText(null);
    } else {
      this.setWarningText(
        Blockly.Msg["CONTROLS_FLOW_STATEMENTS_WARNING"] ||
          "Warning: This block may only be used within a loop."
      );
    }
  });
};
