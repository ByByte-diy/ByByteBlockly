import { Injectable } from '@angular/core';
import { DeviceManagerService } from '@app/modules/device/services/device-manager.service';
import { IBoard } from '@app/modules/device/types/device-board.type';
import { isAvr328pFqbn } from './web-avr-wasm.util';
import { WasmAssetProvider } from './wasm-asset.provider';
import { WasmPrefetchTier } from './wasm-tier-prefetch.util';

/**
 * Background prefetch of WASM tools/core tiers when user selects an AVR 328p board.
 */
@Injectable()
export class WasmBoardPrefetchService {
  private prefetchGeneration = 0;

  constructor(
    private readonly deviceManager: DeviceManagerService,
    private readonly wasmAssets: WasmAssetProvider,
  ) {
    this.deviceManager.selectedBoard$.subscribe((board) => {
      void this.prefetchForBoard(board);
    });
    void this.prefetchForBoard(this.deviceManager.getSelectedBoard());
  }

  private async prefetchForBoard(board: IBoard): Promise<void> {
    if (!isAvr328pFqbn(board.fqbn)) {
      return;
    }

    const generation = ++this.prefetchGeneration;

    try {
      await this.wasmAssets.ensureValid();
      const tiers: WasmPrefetchTier[] = ['tools', 'core'];
      for (const tier of tiers) {
        if (generation !== this.prefetchGeneration) {
          return;
        }
        await this.wasmAssets.prefetchTier(tier);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`WASM tier prefetch skipped: ${message}`);
    }
  }
}
