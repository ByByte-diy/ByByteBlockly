import * as Blockly from "blockly";

/** Remove extra dimension inputs D1..D4 when dimension dropdown changes. */
export function updateArrayDimensionInputs(
  block: Blockly.Block,
  dimension: string
): void {
  for (let i = 1; i < 7; i++) {
    if (block.getInput("D" + i)) {
      block.removeInput("D" + i);
    }
  }

  const dim = parseInt(dimension, 10);
  for (let i = 1; i < dim; i++) {
    block.appendValueInput("D" + i);
  }
}

/**
 * Blockly 13 JSON serialization uses saveExtraState/loadExtraState.
 * mutationToDom/domToMutation remain for legacy XML import.
 * BLOCK_CREATE sync covers older JSON saves that only stored the dim field.
 */
export function attachArrayDimensionSerialization(block: Blockly.Block): void {
  const b = block as Blockly.Block & {
    updateShape_: (dim: string) => void;
  };

  b.saveExtraState = function (this: Blockly.Block) {
    return { dim: this.getFieldValue("dim") || "1" };
  };

  b.loadExtraState = function (
    this: Blockly.Block,
    state: { dim?: string }
  ) {
    b.updateShape_.call(this, state?.dim || this.getFieldValue("dim") || "1");
  };

  b.mutationToDom = function (this: Blockly.Block) {
    const container = document.createElement("mutation");
    container.setAttribute("dim", this.getFieldValue("dim") || "1");
    return container;
  };

  b.domToMutation = function (this: Blockly.Block, xmlElement: Element) {
    b.updateShape_.call(this, xmlElement.getAttribute("dim") || "1");
  };

  block.setOnChange(function (this: Blockly.Block, event: Blockly.Events.Abstract) {
    if (
      event.type === Blockly.Events.BLOCK_CREATE &&
      (event as Blockly.Events.BlockCreate).blockId === this.id &&
      !this.isInFlyout
    ) {
      b.updateShape_.call(this, this.getFieldValue("dim") || "1");
    }
  });
}

export const DIMENSION_OPTIONS: [string, string][] = [
  ["1", "1"],
  ["2", "2"],
  ["3", "3"],
  ["4", "4"],
  ["5", "5"],
];
