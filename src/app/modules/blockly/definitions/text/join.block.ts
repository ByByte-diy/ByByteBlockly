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

const JOIN_MUTATOR_MIXIN = {
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

    const itemCount = (this as any).itemCount_ ?? 0;
    if (itemCount === 0) {
      this.appendDummyInput("EMPTY").appendField('""');
    } else {
      for (let i = 0; i < itemCount; i++) {
        const input = this.appendValueInput("ADD" + i);
        if (i === 0) {
          input.appendField(
            Blockly.Msg["TEXT_JOIN_TITLE_CREATEWITH"] || "join"
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
    const containerBlock = workspace.newBlock("text_create_join_container");
    (containerBlock as any).initSvg();
    let connection = containerBlock.getInput("STACK")!.connection;

    const itemCount = (this as any).itemCount_ ?? 2;
    for (let i = 0; i < itemCount; i++) {
      const itemBlock = workspace.newBlock("text_create_join_item");
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
  name: "text_join_mutator",
  mixin: JOIN_MUTATOR_MIXIN,
  helperBlocks: ["text_create_join_container", "text_create_join_item"],
  init: function (this: Blockly.Block) {
    (this as any).itemCount_ = 2;
    (this as any).updateShape_();
  },
});

export const joinContainerBlock: BlockDefinition = {
  type: "text_create_join_container",
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
    type: "text_create_join_container",
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
      Blockly.Msg["TEXT_CREATE_JOIN_TITLE_JOIN"] || "join"
    );
    this.appendStatementInput("STACK");
    this.setTooltip(Blockly.Msg["CONTROLS_IF_IF_TOOLTIP"] || "");
    (this as any).contextMenu = false;
  },
  generator: () => "",
};

export const joinItemBlock: BlockDefinition = {
  type: "text_create_join_item",
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
    type: "text_create_join_item",
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
      Blockly.Msg["TEXT_CREATE_JOIN_ITEM_TITLE_ITEM"] || "item"
    );
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(
      Blockly.Msg["TEXT_CREATE_JOIN_ITEM_TOOLTIP"] || "Add an item to join."
    );
    (this as any).contextMenu = false;
  },
  generator: () => "",
};

export const joinBlock = new BlockBuilder("text_join")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["text", "join"])
  .setOutput("String")
  .setMutator("text_join_mutator")
  .setHelpUrl("https://www.arduino.cc/en/Reference/StringConstructor")
  .setTooltip("%{BKY_TEXT_JOIN_TOOLTIP}")
  .setArduinoGenerator((block, generator) => {
    const itemCount = (block as any).itemCount_ ?? 0;

    if (itemCount === 0) {
      return ['""', generator.ORDER_ATOMIC];
    }

    if (itemCount === 1) {
      const arg =
        generator.valueToCode(block, "ADD0", generator.ORDER_UNARY_POSTFIX) ||
        '""';
      return [`String(${arg})`, generator.ORDER_UNARY_POSTFIX];
    }

    const parts: string[] = [];
    for (let i = 0; i < itemCount; i++) {
      const arg = generator.valueToCode(
        block,
        "ADD" + i,
        generator.ORDER_NONE
      );
      parts.push(arg === "" ? '""' : `String(${arg})`);
    }

    return [parts.join(" + "), generator.ORDER_UNARY_POSTFIX];
  })
  .build();
