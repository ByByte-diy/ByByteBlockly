import { BlockRegistry } from "../../lib/registry/block-registry";
import { variablesGetBlock } from "./get.block";
import { variablesSetInitBlock } from "./set-init.block";
import { variablesChangeBlock } from "./change.block";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_ORDER,
  TOOLBOX_LEVEL,
} from "./config";
import { variablesSetBlock } from "./set.block";
import { IToolboxCategoryConfig } from "../../types/toolbox.types";

/**
 * All variable blocks
 */
export const VARIABLES_BLOCKS = [
  variablesSetInitBlock,
  variablesChangeBlock,
  variablesSetBlock,
  variablesGetBlock,
];

/**
 * Initialize and register all variable blocks
 * Variables category is registered as a dynamic category
 * Blockly will automatically populate it with variable blocks based on workspace variables
 */
export function initialize(): void {
  BlockRegistry.registerMany(VARIABLES_BLOCKS);

  // Register Variables as a dynamic category
  // Blockly will automatically populate this category with blocks for each variable
  BlockRegistry.registerCategory(CATEGORY_NAME, {
    name: CATEGORY_NAME,
    colour: CATEGORY_COLOR.toString(),
    order: CATEGORY_ORDER,
    // custom: "VARIABLE", // Blockly's built-in variable category type
    requiredPlatform: "both",
    minLevel: TOOLBOX_LEVEL,
  } as IToolboxCategoryConfig);
}

// Export individual blocks
export {
  variablesGetBlock,
  variablesChangeBlock,
  variablesSetInitBlock,
  variablesSetBlock,
};

