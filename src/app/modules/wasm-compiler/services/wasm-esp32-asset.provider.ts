import { Injectable } from '@angular/core';
import { WASM_ESP32_BUNDLE_ID } from '../constants/wasm-asset.const';
import { WasmAssetProvider } from './wasm-asset.provider';

/** WASM asset provider for ESP32 (wasm-toolchains Xtensa bundle). */
@Injectable()
export class WasmEsp32AssetProvider extends WasmAssetProvider {
  protected override readonly bundleId = WASM_ESP32_BUNDLE_ID;
}
