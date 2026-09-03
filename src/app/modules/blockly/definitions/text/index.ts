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
import { toCharBlock, toStringBlock, toString2Block } from "./conversion.block";
import {
  lengthBlock,
  isEmptyBlock,
  appendBlock,
  trimBlock,
  changeCaseBlock,
} from "./string-ops.block";
import { indexOfBlock } from "./index-of.block";
import {
  joinBlock,
  joinContainerBlock,
  joinItemBlock,
} from "./join.block";
import { charAtBlock } from "./char-at.block";
import { getSubstringBlock } from "./get-substring.block";

export const TEXT_BLOCKS = [
  textBlock,
  charBlock,
  toCharBlock,
  toStringBlock,
  toString2Block,
  lengthBlock,
  isEmptyBlock,
  appendBlock,
  indexOfBlock,
  charAtBlock,
  getSubstringBlock,
  changeCaseBlock,
  trimBlock,
  joinBlock,
];

export const TEXT_MUTATOR_BLOCKS = [joinContainerBlock, joinItemBlock];

export function initialize(): void {
  BlockRegistry.registerMany(TEXT_BLOCKS);
  BlockRegistry.registerMany(TEXT_MUTATOR_BLOCKS);

  BlockRegistry.registerCategory(CATEGORY_NAME, {
    name: CATEGORY_NAME,
    colour: CATEGORY_COLOR,
    requiredPlatform: "both",
    order: CATEGORY_ORDER,
    minLevel: TOOLBOX_LEVEL,
  } as IToolboxCategoryConfig);
}

export {
  textBlock,
  charBlock,
  toCharBlock,
  toStringBlock,
  toString2Block,
  lengthBlock,
  isEmptyBlock,
  appendBlock,
  indexOfBlock,
  charAtBlock,
  getSubstringBlock,
  changeCaseBlock,
  trimBlock,
  joinBlock,
};
