import { BlockDefinition } from '../../types/block.types';
import { IToolboxCategoryConfig } from '../../types/toolbox.types';
import { IPlatformPack } from '../platform-pack.types';

/** Apply pack supportedBoardIds as category whitelist when the pack targets specific boards. */
export function withPackBoardGate(
  config: IToolboxCategoryConfig,
  pack: Pick<IPlatformPack, 'supportedBoardIds'>,
): IToolboxCategoryConfig {
  if (!pack.supportedBoardIds.length) {
    return config;
  }
  return {
    ...config,
    requiredBoardIds: [...pack.supportedBoardIds],
  };
}

/** Restrict blocks to the same board IDs as their platform pack. */
export function gateBlocksToBoards(
  blocks: BlockDefinition[],
  boardIds: readonly string[],
): BlockDefinition[] {
  if (!boardIds.length) {
    return blocks;
  }
  for (const block of blocks) {
    block.config.boards = [...boardIds];
  }
  return blocks;
}
