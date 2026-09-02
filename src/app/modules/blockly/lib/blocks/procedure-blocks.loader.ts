import * as Blockly from "blockly";
import { procedures } from "blockly/blocks";

let registered = false;

/** Register standard Blockly procedure blocks (def/call/mutator). */
export function registerProcedureBlocks(): void {
  if (registered) {
    return;
  }

  for (const [type, definition] of Object.entries(procedures.blocks)) {
    Blockly.Blocks[type] = definition as any;
  }

  registered = true;
}
