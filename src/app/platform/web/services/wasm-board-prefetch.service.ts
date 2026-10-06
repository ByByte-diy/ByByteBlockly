import { Injectable } from '@angular/core';
import { DeviceManagerService } from '@app/modules/device/services/device-manager.service';
import { IBoard } from '@app/modules/device/types/device-board.type';
import {
  WasmAssetProvider,
  WasmCompilerRegistry,
  WasmMegaAssetProvider,
  WasmPrefetchTier,
} from '@modules/wasm-compiler';

/** Web-only: prefetch WASM tools/core when the user selects a supported AVR board. */
@Injectable()
export class WasmBoardPrefetchService {
  private prefetchGeneration = 0;

  constructor(
    private readonly deviceManager: DeviceManagerService,
    private readonly registry: WasmCompilerRegistry,
    private readonly wasmAssets328p: WasmAssetProvider,
    private readonly wasmAssetsMega: WasmMegaAssetProvider,
  ) {
    this.deviceManager.selectedBoard$.subscribe((board) => {
      void this.prefetchForBoard(board);
    });
    void this.prefetchForBoard(this.deviceManager.getSelectedBoard());
  }

  private async prefetchForBoard(board: IBoard): Promise<void> {
    const family = this.registry.resolveFamily(board.fqbn);
    if (!family) {
      return;
    }

    const wasmAssets = family === 'avr-mega' ? this.wasmAssetsMega : this.wasmAssets328p;
    const generation = ++this.prefetchGeneration;

    try {
      await wasmAssets.ensureValid();
      const tiers: WasmPrefetchTier[] = ['tools', 'core'];
      for (const tier of tiers) {
        if (generation !== this.prefetchGeneration) {
          return;
        }
        await wasmAssets.prefetchTier(tier);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`WASM tier prefetch skipped: ${message}`);
    }
  }
}
