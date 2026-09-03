import * as Blockly from "blockly";
import { getArduinoGenerator, setupBlocklyTestEnv } from "../blockly-test-harness";

export interface GoldenBlockContext {
  workspace: Blockly.Workspace;
  block: Blockly.Block;
  generator: Blockly.CodeGenerator;
}

/**
 * Create a headless Blockly workspace block for generator golden tests.
 */
export function createGoldenBlock(
  type: string,
  configure?: (block: Blockly.Block, workspace: Blockly.Workspace) => void
): GoldenBlockContext {
  setupBlocklyTestEnv();
  const workspace = new Blockly.Workspace();
  const block = workspace.newBlock(type);
  if (configure) {
    configure(block, workspace);
  }
  const generator = getArduinoGenerator();
  generator.init(workspace);
  return { workspace, block, generator };
}

/** Generate Arduino code for a single block (statement or value). */
export function generateBlockCode(context: GoldenBlockContext): string {
  const { block, generator } = context;
  const result = generator.blockToCode(block);
  return Array.isArray(result) ? result[0] : result;
}

/** Attach a shadow math_number block to a value input. */
export function attachNumberShadow(
  workspace: Blockly.Workspace,
  parent: Blockly.Block,
  inputName: string,
  value: number
): void {
  const shadow = workspace.newBlock("math_number");
  shadow.setFieldValue(String(value), "NUM");
  parent.getInput(inputName)?.connection?.connect(shadow.outputConnection);
}
