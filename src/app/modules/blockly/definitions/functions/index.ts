import { BlockRegistry } from "../../lib/registry/block-registry";
import { IToolboxCategoryConfig } from "../../types/toolbox.types";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_ORDER,
  TOOLBOX_LEVEL,
} from "./config";

/**
 * Functions category uses Blockly's built-in procedure blocks
 * (registered via registerProcedureBlocks) and PROCEDURE custom flyout.
 */
export function initialize(): void {
  BlockRegistry.registerCategory(CATEGORY_NAME, {
    name: CATEGORY_NAME,
    colour: CATEGORY_COLOR.toString(),
    custom: "PROCEDURE",
    requiredPlatform: "both",
    order: CATEGORY_ORDER,
    minLevel: TOOLBOX_LEVEL,
  } as IToolboxCategoryConfig);
}
