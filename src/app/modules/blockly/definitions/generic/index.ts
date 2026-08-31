/**
 * Arduino Base Blocks
 * Essential blocks for Arduino programming
 */
import { BlockRegistry } from "../../lib/registry/block-registry";
import { setupLoopBlock } from "./setup-loop.block";
import { setupBlock } from "./setup.block";
import { loopBlock } from "./loop.block";
import { codeBlock } from "./code.block";
import { codeInputBlock } from "./code-input.block";
import { defineBlock } from "./define.block";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_ORDER,
} from "./config";
import { BlockLevelE } from "../../types/block.types";
import { IToolboxCategoryConfig } from "../../types";

/**
 * All generic blocks
 */
export const GENERIC_BLOCKS = [
  setupLoopBlock,
  setupBlock,
  loopBlock,
  codeBlock,
  codeInputBlock,
  defineBlock,
];

/**
 * Initialize and register all generic blocks
 */
export function initialize(): void {
  BlockRegistry.registerMany(GENERIC_BLOCKS);
  BlockRegistry.registerCategory(CATEGORY_NAME, {
    name: CATEGORY_NAME,
    colour: CATEGORY_COLOR.toString(),
    requiredPlatform: "both",
    order: CATEGORY_ORDER,
    minLevel: BlockLevelE.BEGINNER,
  } as IToolboxCategoryConfig);
}

// Export individual blocks
export {
  setupLoopBlock,
  setupBlock,
  loopBlock,
  codeBlock,
  codeInputBlock,
  defineBlock,
};
