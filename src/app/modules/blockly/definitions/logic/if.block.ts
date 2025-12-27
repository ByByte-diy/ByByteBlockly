import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";
import * as Blockly from "blockly";
import { MutatorRegistry } from "../../lib/registry/mutator-registry";
import { BlockDefinition } from "../../types/block.types";

/**
 * Mixin for the controls_if block mutator
 */
const CONTROLS_IF_MUTATOR_MIXIN = {
  mutationToDom: function (this: Blockly.Block) {
    const elseifCount = (this as any).elseifCount_ || 0;
    const elseCount = (this as any).elseCount_ || 0;
    if (!elseifCount && !elseCount) return null;

    const container = document.createElement("mutation");
    if (elseifCount) {
      container.setAttribute("elseif", elseifCount.toString());
    }
    if (elseCount) {
      container.setAttribute("else", "1");
    }
    return container;
  },

  domToMutation: function (this: Blockly.Block, xmlElement: Element) {
    const elseifCount = parseInt(xmlElement.getAttribute("elseif") || "0", 10);
    const elseCount = parseInt(xmlElement.getAttribute("else") || "0", 10);

    (this as any).elseifCount_ = elseifCount;
    (this as any).elseCount_ = elseCount;

    for (let i = 1; i <= elseifCount; i++) {
      (this as any)
        .appendValueInput("IF" + i)
        .setCheck("Boolean")
        .appendField(Blockly.Msg["CONTROLS_IF_MSG_ELSEIF"] || "else if");
      (this as any)
        .appendStatementInput("DO" + i)
        .appendField(Blockly.Msg["CONTROLS_IF_MSG_THEN"] || "do");
    }

    if (elseCount) {
      (this as any)
        .appendStatementInput("ELSE")
        .appendField(Blockly.Msg["CONTROLS_IF_MSG_ELSE"] || "else");
    }
  },

  decompose: function (this: Blockly.Block, workspace: Blockly.Workspace) {
    const containerBlock = workspace.newBlock("controls_if_if");
    (containerBlock as any).initSvg();
    let connection = containerBlock.nextConnection;

    const elseifCount = (this as any).elseifCount_ || 0;
    for (let i = 1; i <= elseifCount; i++) {
      const elseifBlock = workspace.newBlock("controls_if_elseif");
      (elseifBlock as any).initSvg();
      connection!.connect(elseifBlock.previousConnection!);
      connection = elseifBlock.nextConnection;
    }

    const elseCount = (this as any).elseCount_ || 0;
    if (elseCount) {
      const elseBlock = workspace.newBlock("controls_if_else");
      (elseBlock as any).initSvg();
      connection!.connect(elseBlock.previousConnection!);
    }

    return containerBlock;
  },

  compose: function (this: Blockly.Block, containerBlock: Blockly.Block) {
    // Remove old else
    const oldElseCount = (this as any).elseCount_ || 0;
    if (oldElseCount) {
      (this as any).removeInput("ELSE");
    }
    (this as any).elseCount_ = 0;

    // Remove old elseifs
    const oldElseifCount = (this as any).elseifCount_ || 0;
    for (let i = oldElseifCount; i > 0; i--) {
      (this as any).removeInput("IF" + i);
      (this as any).removeInput("DO" + i);
    }
    (this as any).elseifCount_ = 0;

    // Rebuild from mutator dialog
    let clauseBlock = containerBlock.nextConnection?.targetBlock() || null;
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case "controls_if_elseif":
          (this as any).elseifCount_++;
          const elseifNum = (this as any).elseifCount_;
          const ifInput = (this as any)
            .appendValueInput("IF" + elseifNum)
            .setCheck("Boolean")
            .appendField(Blockly.Msg["CONTROLS_IF_MSG_ELSEIF"] || "else if");
          const doInput = (this as any)
            .appendStatementInput("DO" + elseifNum)
            .appendField(Blockly.Msg["CONTROLS_IF_MSG_THEN"] || "do");

          if ((clauseBlock as any).valueConnection_) {
            ifInput.connection!.connect((clauseBlock as any).valueConnection_);
          }
          if ((clauseBlock as any).statementConnection_) {
            doInput.connection!.connect(
              (clauseBlock as any).statementConnection_
            );
          }
          break;

        case "controls_if_else":
          (this as any).elseCount_++;
          const elseInput = (this as any)
            .appendStatementInput("ELSE")
            .appendField(Blockly.Msg["CONTROLS_IF_MSG_ELSE"] || "else");

          if ((clauseBlock as any).statementConnection_) {
            elseInput.connection!.connect(
              (clauseBlock as any).statementConnection_
            );
          }
          break;
      }
      clauseBlock = clauseBlock.nextConnection?.targetBlock() || null;
    }
  },

  saveConnections: function (
    this: Blockly.Block,
    containerBlock: Blockly.Block
  ) {
    let clauseBlock = containerBlock.nextConnection?.targetBlock() || null;
    let i = 1;

    while (clauseBlock) {
      switch (clauseBlock.type) {
        case "controls_if_elseif":
          const inputIf = (this as any).getInput("IF" + i);
          const inputDo = (this as any).getInput("DO" + i);
          (clauseBlock as any).valueConnection_ =
            inputIf?.connection?.targetConnection || null;
          (clauseBlock as any).statementConnection_ =
            inputDo?.connection?.targetConnection || null;
          i++;
          break;

        case "controls_if_else":
          const inputElse = (this as any).getInput("ELSE");
          (clauseBlock as any).statementConnection_ =
            inputElse?.connection?.targetConnection || null;
          break;
      }
      clauseBlock = clauseBlock.nextConnection?.targetBlock() || null;
    }
  },
};

/**
 * Register if mutator in the central registry
 */
MutatorRegistry.define({
  name: "custom_controls_if_mutator",
  mixin: CONTROLS_IF_MUTATOR_MIXIN,
  helperBlocks: ["controls_if_elseif", "controls_if_else"],
  init: function (this: Blockly.Block) {
    (this as any).elseifCount_ = 0;
    (this as any).elseCount_ = 0;
  },
});

export const ifBlock = new BlockBuilder("controls_if")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["logic"])

  .setMessage("%{BKY_CONTROLS_IF_MSG_IF}")
  .addValueInput("IF0", "%{BKY_CONTROLS_IF_MSG_IF}", "Boolean")
  .addStatementInput("DO0", "%{BKY_CONTROLS_IF_MSG_THEN}")
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setMutator("custom_controls_if_mutator")

  .setTooltip("%{BKY_CONTROLS_IF_TOOLTIP}")
  .setHelpUrl(
    "https://docs.arduino.cc/learn/programming/reference/#control-structure"
  )

  .setArduinoGenerator((block, generator) => {
    // Base IF statement
    let n = 0;
    let condition = generator.valueToCode(
      block,
      "IF0",
      generator.ORDER_NONE || 0
    );
    let branch = generator.statementToCode(block, "DO0");
    let code = "";
    if (condition || branch) {
      if (!condition) condition = "false";
      code = `if (${condition}) {\n${branch}\n}`;
    }

    // ELSE IF branches added by mutator
    const anyBlock = block as any;
    const elseifCount = anyBlock.elseifCount_ || 0;
    for (n = 1; n <= elseifCount; n++) {
      condition = generator.valueToCode(
        block,
        `IF${n}`,
        generator.ORDER_NONE || 0
      );
      branch = generator.statementToCode(block, `DO${n}`);
      if (!condition) condition = "false";
      code += ` else if (${condition}) {\n${branch}\n}`;
    }

    // ELSE branch if exists
    if (anyBlock.elseCount_) {
      branch = generator.statementToCode(block, "ELSE");
      code += ` else {\n${branch}\n}`;
    }

    return code ? code + "\n" : "";
  })
  .build();

// Helper blocks for mutator dialog
export const ifIfBlock: BlockDefinition = {
  type: "controls_if_if",
  category: "Mutator",
  level: TOOLBOX_LEVEL,
  platform: CATEGORY_PLATFORMS[0],
  metadata: {
    requiredPlatform: CATEGORY_PLATFORMS[0],
    minLevel: TOOLBOX_LEVEL,
    tags: ["mutator", "hidden"],
    deprecated: false,
  },
  config: {
    type: "controls_if_if",
    category: CATEGORY_NAME,
    color: CATEGORY_COLOR,
    platforms: CATEGORY_PLATFORMS,
    level: TOOLBOX_LEVEL,
    inputs: [],
    fields: [],
    generators: {},
  },
  init: function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField(
      Blockly.Msg["CONTROLS_IF_IF_TITLE_IF"] || "if"
    );
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg["CONTROLS_IF_IF_TOOLTIP"] || "");
    (this as any).contextMenu = false;
  },
  generator: () => "",
};

export const ifElseifBlock: BlockDefinition = {
  type: "controls_if_elseif",
  category: "Mutator",
  level: TOOLBOX_LEVEL,
  platform: CATEGORY_PLATFORMS[0],
  metadata: {
    requiredPlatform: CATEGORY_PLATFORMS[0],
    minLevel: TOOLBOX_LEVEL,
    tags: ["mutator", "hidden"],
    deprecated: false,
  },
  config: {
    type: "controls_if_elseif",
    category: CATEGORY_NAME,
    color: CATEGORY_COLOR,
    platforms: CATEGORY_PLATFORMS,
    level: TOOLBOX_LEVEL,
    inputs: [],
    fields: [],
    generators: {},
  },
  init: function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField(
      Blockly.Msg["CONTROLS_IF_ELSEIF_TITLE_ELSEIF"] || "else if"
    );
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg["CONTROLS_IF_ELSEIF_TOOLTIP"] || "");
    (this as any).contextMenu = false;
  },
  generator: () => "",
};

export const ifElseBlock: BlockDefinition = {
  type: "controls_if_else",
  category: "Mutator",
  level: TOOLBOX_LEVEL,
  platform: CATEGORY_PLATFORMS[0],
  metadata: {
    requiredPlatform: CATEGORY_PLATFORMS[0],
    minLevel: TOOLBOX_LEVEL,
    tags: ["mutator", "hidden"],
    deprecated: false,
  },
  config: {
    type: "controls_if_else",
    category: CATEGORY_NAME,
    color: CATEGORY_COLOR,
    platforms: CATEGORY_PLATFORMS,
    level: TOOLBOX_LEVEL,
    inputs: [],
    fields: [],
    generators: {},
  },
  init: function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput().appendField(
      Blockly.Msg["CONTROLS_IF_ELSE_TITLE_ELSE"] || "else"
    );
    this.setPreviousStatement(true);
    this.setTooltip(Blockly.Msg["CONTROLS_IF_ELSE_TOOLTIP"] || "");
    (this as any).contextMenu = false;
  },
  generator: () => "",
};
