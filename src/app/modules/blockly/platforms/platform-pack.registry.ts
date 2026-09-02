import { IBoard } from "@app/modules/device/types/device-board.type";
import { IBoardProfile } from "@app/modules/device/types/device-board-profile.type";
import { IPlatformPack } from "./platform-pack.types";

/**
 * Central registry for platform packs (Otto, ByByte robots, MRT, etc.).
 * Packs must be registered before initializeAll() is called.
 */
export class PlatformPackRegistry {
  private static packs: IPlatformPack[] = [];
  private static initialized = false;

  static register(pack: IPlatformPack): void {
    if (this.initialized) {
      console.warn(
        `PlatformPackRegistry: cannot register "${pack.id}" after initialization`
      );
      return;
    }
    this.packs.push(pack);
  }

  static initializeAll(): void {
    if (this.initialized) return;

    for (const pack of this.packs) {
      pack.initializeCategories();
      pack.initializeBlocks();
    }

    this.initialized = true;
  }

  /** Collect board entries from all registered packs (used in Phase 1 device migration) */
  static getBoards(): IBoard[] {
    return this.packs.flatMap((pack) => pack.registerBoards());
  }

  /** Collect pin profiles from all registered packs (used in Phase 1 device migration) */
  static getProfiles(): IBoardProfile[] {
    return this.packs.flatMap((pack) => pack.registerProfiles());
  }

  static getAll(): readonly IPlatformPack[] {
    return this.packs;
  }

  static isInitialized(): boolean {
    return this.initialized;
  }

  /** @internal For tests only */
  static reset(): void {
    this.packs = [];
    this.initialized = false;
  }
}
