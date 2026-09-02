import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { BlockLevelE } from "../types/block.types";
import { WorkspaceStorageService } from "@app/modules/storage/workspace-storage.service";

const LEGACY_LEVEL_KEY = "level";

/** User-facing toolbox difficulty level (maps to BlockLevelE). */
export type ToolboxUserLevel = BlockLevelE;

@Injectable({
  providedIn: "root",
})
export class ToolboxLevelService {
  private readonly levelSubject = new BehaviorSubject<BlockLevelE>(
    this.readInitialLevel()
  );

  readonly level$: Observable<BlockLevelE> = this.levelSubject.asObservable();

  constructor(private readonly storage: WorkspaceStorageService) {
    void this.restoreFromAppSettings();
  }

  getLevel(): BlockLevelE {
    return this.levelSubject.value;
  }

  async setLevel(level: BlockLevelE): Promise<void> {
    if (this.levelSubject.value === level) {
      return;
    }

    this.levelSubject.next(level);
    this.persistLevel(level);
    await this.storage.saveSettings({ toolboxLevel: level });
  }

  /** Restore from app settings when available (overrides localStorage on startup). */
  private async restoreFromAppSettings(): Promise<void> {
    const settings = await this.storage.loadSettings();
    if (settings?.toolboxLevel === undefined) {
      return;
    }

    const level = this.normalizeLevel(settings.toolboxLevel);
    if (level !== this.levelSubject.value) {
      this.levelSubject.next(level);
      this.persistLevel(level);
    }
  }

  private readInitialLevel(): BlockLevelE {
    const legacy = localStorage.getItem(LEGACY_LEVEL_KEY);
    if (legacy) {
      return this.legacyNumberToLevel(Number(legacy));
    }

    return BlockLevelE.BEGINNER;
  }

  private persistLevel(level: BlockLevelE): void {
    localStorage.setItem(LEGACY_LEVEL_KEY, String(this.levelToLegacyNumber(level)));
  }

  private legacyNumberToLevel(value: number): BlockLevelE {
    switch (value) {
      case 2:
        return BlockLevelE.INTERMEDIATE;
      case 3:
        return BlockLevelE.ADVANCED;
      default:
        return BlockLevelE.BEGINNER;
    }
  }

  private levelToLegacyNumber(level: BlockLevelE): number {
    switch (level) {
      case BlockLevelE.INTERMEDIATE:
        return 2;
      case BlockLevelE.ADVANCED:
        return 3;
      default:
        return 1;
    }
  }

  private normalizeLevel(value: unknown): BlockLevelE {
    if (typeof value === "number" && value >= 0 && value <= 2) {
      return value as BlockLevelE;
    }
    return BlockLevelE.BEGINNER;
  }
}
