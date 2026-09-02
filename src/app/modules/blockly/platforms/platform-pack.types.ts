import { IBoard } from "@app/modules/device/types/device-board.type";
import { IBoardProfile } from "@app/modules/device/types/device-board-profile.type";

/**
 * Self-contained module for a hardware platform (robot kit, custom board family, etc.).
 * Each pack registers its boards, pin profiles, toolbox categories, and blocks.
 */
export interface IPlatformPack {
  readonly id: string;
  readonly supportedBoardIds: readonly string[];

  /** Board entries merged into the device catalog (Phase 1+) */
  registerBoards(): IBoard[];

  /** Pin profiles merged into BOARD_PROFILES (Phase 1+) */
  registerProfiles(): IBoardProfile[];

  /** Register toolbox categories (container + subcategories) */
  initializeCategories(): void;

  /** Register Blockly block definitions and generators */
  initializeBlocks(): void;
}
