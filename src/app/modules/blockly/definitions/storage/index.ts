import { BlockRegistry } from "../../lib/registry/block-registry";
import { IToolboxCategoryConfig } from "../../types/toolbox.types";
import {
  CATEGORY_COLOUR,
  CATEGORY_NAME,
  CATEGORY_ORDER,
  TOOLBOX_LEVEL,
} from "./config";
import { eepromReadBlock, eepromWriteBlock } from "./eeprom.blocks";

export const STORAGE_BLOCKS = [eepromReadBlock, eepromWriteBlock];

export function initialize(): void {
  BlockRegistry.registerMany(STORAGE_BLOCKS);

  BlockRegistry.registerCategory(CATEGORY_NAME, {
    name: CATEGORY_NAME,
    colour: CATEGORY_COLOUR,
    requiredPlatform: "both",
    order: CATEGORY_ORDER,
    minLevel: TOOLBOX_LEVEL,
  } as IToolboxCategoryConfig);
}
