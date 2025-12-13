/**
 * Arduino Logic Blocks
 * Logic blocks for Arduino programming
 */
import { BlockRegistry } from "../../lib/registry";
import { IToolboxCategoryMetadata } from "../../types";
import { BlockLevelE } from "../../types/block.types";
import { CATEGORY_COLOR, CATEGORY_NAME } from "./config";
import {
  switchBlock,
  switchVarBlock,
  caseBreakBlock,
  caseDefaultBlock,
} from "./switch.block";
import { ifBlock } from "./if.block";
import { boolBlock } from "./bool.block";
import { repeatBlock } from "./repeat.block";
import { forBlock } from "./for.block";

export const CATEGORY_ORDER = 4;

/**
 * All base blocks (only blocks that appear in toolbox)
 */
export const LOGIC_BLOCKS = [
  ifBlock,
  switchBlock,
  repeatBlock,
  forBlock,
  boolBlock,
];

/**
 * Mutator helper blocks (not shown in toolbox, only in mutator dialog)
 */
export const MUTATOR_BLOCKS = [
  switchVarBlock,
  caseBreakBlock,
  caseDefaultBlock,
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
  } as IToolboxCategoryMetadata);
}

// Export individual blocks
export { ifBlock, boolBlock, switchBlock, repeatBlock, forBlock };
