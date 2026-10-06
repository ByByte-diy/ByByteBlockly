import { Injectable } from '@angular/core';
import { DeviceManagerService } from '@app/modules/device/services/device-manager.service';
import { IBoard } from '@app/modules/device/types/device-board.type';
import { UploadManagerService } from '@app/modules/upload/services/upload-manager.service';
import {
  WasmAssetProvider,
  WasmCompilerRegistry,
  WasmEsp32AssetProvider,
  WasmMegaAssetProvider,
  WasmPrefetchTier,
  collectTierPrefetchPaths,
} from '@modules/wasm-compiler';
import { buildWasmPrefetchProgressReport } from '../utils/wasm-prefetch-progress.util';

/** Web-only: prefetch WASM tools/core when the user selects a supported board. */
@Injectable()
export class WasmBoardPrefetchService {
  private prefetchGeneration = 0;

  constructor(
    private readonly deviceManager: DeviceManagerService,
    private readonly registry: WasmCompilerRegistry,
    private readonly wasmAssets328p: WasmAssetProvider,
    private readonly wasmAssetsMega: WasmMegaAssetProvider,
    private readonly wasmAssetsEsp32: WasmEsp32AssetProvider,
    private readonly uploadManager: UploadManagerService,
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
    const wasmAssets =
      family === 'esp32'
        ? this.wasmAssetsEsp32
        : family === 'avr-mega'
          ? this.wasmAssetsMega
          : this.wasmAssets328p;
    const generation = ++this.prefetchGeneration;
    try {
      await wasmAssets.syncBundle({ force: false, prefetchTiers: [] });
      const catalog = await wasmAssets.loadCatalog();
      const paths = [
        ...new Set(
          (['tools', 'core'] as WasmPrefetchTier[]).flatMap((tier) =>
            collectTierPrefetchPaths(catalog, tier),
          ),
        ),
      ];
      if (!paths.length) {
        return;
      }
      await wasmAssets.prefetchCatalogPaths(paths, (progress) => {
        if (generation !== this.prefetchGeneration) {
          return;
        }
        this.uploadManager.reportPrefetchProgress(
          buildWasmPrefetchProgressReport(catalog, paths, progress),
        );
      });
    } catch (error: unknown) {
      console.warn(
        `WASM tier prefetch skipped: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
    if (generation === this.prefetchGeneration) {
      this.uploadManager.finishPrefetch();
    }
  }
}
