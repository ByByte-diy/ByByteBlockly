/**
 * Arduino Logic Blocks
 * Logic blocks for Arduino programming
 */
import { BlockRegistry } from "../../lib/registry";
import { IToolboxCategoryConfig } from "../../types";
import { BlockLevelE } from "../../types/block.types";
import { CATEGORY_COLOR, CATEGORY_NAME, CATEGORY_ORDER } from "./config";
import {
  switchBlock,
  switchVarBlock,
  caseBreakBlock,
  caseDefaultBlock,
} from "./switch.block";
import { ifBlock, ifIfBlock, ifElseifBlock, ifElseBlock } from "./if.block";
import { boolBlock } from "./bool.block";
import { repeatBlock } from "./repeat.block";
import { forBlock } from "./for.block";
import { flowStatementsBlock } from "./flow.block";
import { logicOperationBlock } from "./operation.block";

/**
 * All base blocks (only blocks that appear in toolbox)
 */
export const LOGIC_BLOCKS = [
  ifBlock,
  switchBlock,
  repeatBlock,
  forBlock,
  flowStatementsBlock,
  logicOperationBlock,
  boolBlock,
];

/**
 * Mutator helper blocks (not shown in toolbox, only in mutator dialog)
 */
export const MUTATOR_BLOCKS = [
  // Switch mutator helpers
  switchVarBlock,
  caseBreakBlock,
  caseDefaultBlock,
  // If mutator helpers
  ifIfBlock,
  ifElseifBlock,
  ifElseBlock,
];

/**
 * Initialize and register all base blocks
 */
export function initialize(): void {
  // Register blocks that appear in toolbox
  BlockRegistry.registerMany(LOGIC_BLOCKS);

  // Register mutator helper blocks (won't appear in toolbox)
  // These are only used within mutator dialogs
  BlockRegistry.registerMany(MUTATOR_BLOCKS);

  BlockRegistry.registerCategory(CATEGORY_NAME, {
    name: CATEGORY_NAME,
    colour: CATEGORY_COLOR.toString(),
    requiredPlatform: "both",
    order: CATEGORY_ORDER,
    minLevel: BlockLevelE.INTERMEDIATE,
  } as IToolboxCategoryConfig);
}

// Export individual blocks
export {
  ifBlock,
  boolBlock,
  switchBlock,
  repeatBlock,
  forBlock,
  flowStatementsBlock,
  logicOperationBlock,
};
