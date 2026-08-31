import { BlockRegistry } from "../../lib/registry";
import { IToolboxCategoryConfig } from "../../types";
import { BlockDefinition, BlockLevelE } from "../../types/block.types";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_ORDER,
} from "./config";
import { onOffShadowBlock } from "./on-off-shadow.block";
import { digitalWriteBlock } from "./digital-write.block";
import { digitalReadBlock } from "./digital-read.block";
import { analogWriteBlock } from "./analog-write.block";
import { analogReadBlock } from "./analog-read.block";
import { toggleBlock } from "./toggle.block";
import { attachInterruptBlock } from "./attach-interrupt.block";
import { detachInterruptBlock } from "./detach-interrupt.block";
import { mrtduinoPinBlock } from "./mrtduino-pin.block";

/** Blocks shown in the Ports toolbox category */
export const PORTS_BLOCKS: BlockDefinition[] = [
  digitalWriteBlock,
  digitalReadBlock,
  analogWriteBlock,
  analogReadBlock,
  toggleBlock,
  attachInterruptBlock,
  detachInterruptBlock,
  mrtduinoPinBlock,
];

/** Shadow/helper blocks — registered but hidden from toolbox */
export const PORTS_SHADOW_BLOCKS: BlockDefinition[] = [onOffShadowBlock];

export function initialize(): void {
  BlockRegistry.registerMany([...PORTS_BLOCKS, ...PORTS_SHADOW_BLOCKS]);

  BlockRegistry.registerCategory(CATEGORY_NAME, {
    name: CATEGORY_NAME,
    colour: CATEGORY_COLOR.toString(),
    requiredPlatform: "both",
    order: CATEGORY_ORDER,
    minLevel: BlockLevelE.BEGINNER,
  } as IToolboxCategoryConfig);
}

export {
  digitalWriteBlock,
  digitalReadBlock,
  analogWriteBlock,
  analogReadBlock,
  toggleBlock,
  attachInterruptBlock,
  detachInterruptBlock,
  mrtduinoPinBlock,
  onOffShadowBlock,
};
