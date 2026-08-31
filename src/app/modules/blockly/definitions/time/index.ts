import { BlockRegistry } from "../../lib/registry";
import { IToolboxCategoryConfig } from "../../types";
import { BlockLevelE } from "../../types/block.types";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_ORDER,
} from "./config";
import { delayBlock } from "./delay.block";
import { delayNonBlockingBlock } from "./delay-nonblocking.block";
import { millisStartBlock } from "./millis-start.block";
import { millisBlock } from "./millis.block";
import { pulseInBlock } from "./pulse-in.block";

export const TIME_BLOCKS = [
  delayBlock,
  delayNonBlockingBlock,
  millisStartBlock,
  millisBlock,
  pulseInBlock,
];

export function initialize(): void {
  BlockRegistry.registerMany(TIME_BLOCKS);

  BlockRegistry.registerCategory(CATEGORY_NAME, {
    name: CATEGORY_NAME,
    colour: CATEGORY_COLOR.toString(),
    requiredPlatform: "both",
    order: CATEGORY_ORDER,
    minLevel: BlockLevelE.BEGINNER,
  } as IToolboxCategoryConfig);
}

export {
  delayBlock,
  delayNonBlockingBlock,
  millisStartBlock,
  millisBlock,
  pulseInBlock,
};
