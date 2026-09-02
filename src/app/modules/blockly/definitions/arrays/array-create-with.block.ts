import * as Blockly from "blockly";
import { BlockBuilder } from "../../lib/builders/block-builder";
import { MutatorRegistry } from "../../lib/registry/mutator-registry";
import { BlockDefinition } from "../../types/block.types";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";

const ARRAY_CREATE_WITH_MUTATOR = {
  updateShape_: function (this: Blockly.Block) {
    if (this.getInput("EMPTY")) {
      this.removeInput("EMPTY");
    } else {
      let i = 0;
      while (this.getInput("ADD" + i)) {
        this.removeInput("ADD" + i);
        i++;
      }
    }

    const itemCount = (this as any).itemCount_ ?? 2;
    if (itemCount === 0) {
      this.appendDummyInput("EMPTY").appendField(
        Blockly.Msg["ARRAY_CREATE_EMPTY_TITLE"] || "empty!"
      );
    } else {
      for (let i = 0; i < itemCount; i++) {
        const input = this.appendValueInput("ADD" + i);
        if (i === 0) {
          input.appendField(
            Blockly.Msg["ARRAY_CREATE_WITH_INPUT_WITH"] || "elements"
          );
        }
      }
    }
  },

  mutationToDom: function (this: Blockly.Block) {
    const container = document.createElement("mutation");
    container.setAttribute("items", String((this as any).itemCount_ ?? 2));
    return container;
  },

  domToMutation: function (this: Blockly.Block, xmlElement: Element) {
    (this as any).itemCount_ = parseInt(
      xmlElement.getAttribute("items") || "2",
      10
    );
    (this as any).updateShape_();
  },

  decompose: function (this: Blockly.Block, workspace: Blockly.Workspace) {
    const containerBlock = workspace.newBlock("array_create_with_container");
    (containerBlock as any).initSvg();
    let connection = containerBlock.getInput("STACK")!.connection;

    const itemCount = (this as any).itemCount_ ?? 2;
    for (let i = 0; i < itemCount; i++) {
      const itemBlock = workspace.newBlock("array_create_with_item");
      (itemBlock as any).initSvg();
      connection!.connect(itemBlock.previousConnection!);
      connection = itemBlock.nextConnection;
    }

    return containerBlock;
  },

  compose: function (this: Blockly.Block, containerBlock: Blockly.Block) {
    let itemBlock = containerBlock.getInputTargetBlock("STACK");
    const connections: (Blockly.Connection | null)[] = [];

    while (itemBlock) {
      connections.push((itemBlock as any).valueConnection_ ?? null);
      itemBlock =
        itemBlock.nextConnection?.targetBlock() as Blockly.Block | null;
    }

    (this as any).itemCount_ = connections.length;
    (this as any).updateShape_();

    for (let i = 0; i < connections.length; i++) {
      if (connections[i]) {
        this.getInput("ADD" + i)!.connection!.connect(connections[i]!);
      }
    }
  },

  saveConnections: function (
    this: Blockly.Block,
    containerBlock: Blockly.Block
  ) {
    let itemBlock = containerBlock.getInputTargetBlock("STACK");
    let i = 0;
    while (itemBlock) {
      const input = this.getInput("ADD" + i);
      (itemBlock as any).valueConnection_ =
        input?.connection?.targetConnection ?? null;
      i++;
      itemBlock =
        itemBlock.nextConnection?.targetBlock() as Blockly.Block | null;
    }
  },
};

MutatorRegistry.define({
  name: "array_create_with_mutator",
  mixin: ARRAY_CREATE_WITH_MUTATOR,
  helperBlocks: ["array_create_with_container", "array_create_with_item"],
  init: function (this: Blockly.Block) {
    (this as any).itemCount_ = 2;
    (this as any).updateShape_();
  },
});

export const arrayCreateWithContainerBlock: BlockDefinition = {
  type: "array_create_with_container",
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
    type: "array_create_with_container",
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
      Blockly.Msg["ARRAY_CREATE_WITH_CONTAINER_TITLE_ADD"] || "list or array"
    );
    this.appendStatementInput("STACK");
    this.setTooltip(
      Blockly.Msg["ARRAY_CREATE_WITH_CONTAINER_TOOLTIP"] ||
        "Add, delete, or reorder items."
    );
    (this as any).contextMenu = false;
  },
  generator: () => "",
};

export const arrayCreateWithItemBlock: BlockDefinition = {
  type: "array_create_with_item",
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
    type: "array_create_with_item",
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
      Blockly.Msg["ARRAY_CREATE_WITH_ITEM_TITLE"] || "element"
    );
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(
      Blockly.Msg["LISTS_CREATE_WITH_ITEM_TOOLTIP"] || "Add an item."
    );
    (this as any).contextMenu = false;
  },
  generator: () => "",
};

export const arrayCreateWithBlock = new BlockBuilder("array_create_with")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["arrays", "create"])
  .setOutput(null)
  .setMutator("array_create_with_mutator")
  .setHelpUrl("https://www.arduino.cc/reference/en/language/variables/variable-types-and-constants/")
  .setTooltip("%{BKY_ARRAY_CREATE_WITH_TOOLTIP}")
  .setArduinoGenerator((block, generator) => {
    const itemCount = (block as any).itemCount_ ?? 0;
    const code: string[] = new Array(itemCount);
    for (let n = 0; n < itemCount; n++) {
      code[n] =
        generator.valueToCode(block, "ADD" + n, generator.ORDER_COMMA) ||
        "0";
    }
    return ["{" + code.join(",") + "}", generator.ORDER_ATOMIC];
  })
  .build();
