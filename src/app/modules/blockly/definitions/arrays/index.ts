import { BlockRegistry } from "../../lib/registry/block-registry";
import { IToolboxCategoryConfig } from "../../types/toolbox.types";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_ORDER,
  TOOLBOX_LEVEL,
} from "./config";
import { createArrayBlock } from "./create-array.block";
import {
  setArrayBlock,
  getIndexBlock,
  getSizeBlock,
} from "./array-access.block";
import {
  arrayCreateWithBlock,
  arrayCreateWithContainerBlock,
  arrayCreateWithItemBlock,
} from "./array-create-with.block";
import {
  listAppendBlock,
  listCreateBlock,
  listGetBlock,
  listSetBlock,
  listSizeBlock,
} from "./list-blocks";

export const ARRAY_BLOCKS = [
  createArrayBlock,
  arrayCreateWithBlock,
  setArrayBlock,
  getIndexBlock,
  getSizeBlock,
  listCreateBlock,
  listSetBlock,
  listGetBlock,
  listAppendBlock,
  listSizeBlock,
];

export const ARRAY_MUTATOR_BLOCKS = [
  arrayCreateWithContainerBlock,
  arrayCreateWithItemBlock,
];

export function initialize(): void {
  BlockRegistry.registerMany(ARRAY_BLOCKS);
  BlockRegistry.registerMany(ARRAY_MUTATOR_BLOCKS);

  BlockRegistry.registerCategory(CATEGORY_NAME, {
    name: CATEGORY_NAME,
    colour: CATEGORY_COLOR.toString(),
    requiredPlatform: "both",
    order: CATEGORY_ORDER,
    minLevel: TOOLBOX_LEVEL,
  } as IToolboxCategoryConfig);
}
