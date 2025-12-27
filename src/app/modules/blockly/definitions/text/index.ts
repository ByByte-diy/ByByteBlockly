import { BlockRegistry } from "../../lib/registry/block-registry";
import { IToolboxCategoryConfig } from "../../types/toolbox.types";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_ORDER,
  TOOLBOX_LEVEL,
} from "./config";
import { textBlock } from "./text.block";
import { charBlock } from "./char.block";
export const TEXT_BLOCKS = [textBlock, charBlock];

export function initialize(): void {
  BlockRegistry.registerMany(TEXT_BLOCKS);

  BlockRegistry.registerCategory(CATEGORY_NAME, {
    name: CATEGORY_NAME,
    colour: CATEGORY_COLOR.toString(),
    requiredPlatform: "both",
    order: CATEGORY_ORDER,
    minLevel: TOOLBOX_LEVEL,
  } as IToolboxCategoryConfig);
}

export {
  textBlock,
  charBlock
};
