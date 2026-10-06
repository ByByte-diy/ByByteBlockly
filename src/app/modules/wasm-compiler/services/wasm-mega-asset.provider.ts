import { Injectable } from '@angular/core';
import { WASM_AVR_MEGA_BUNDLE_ID } from '../constants/wasm-asset.const';
import { WasmAssetProvider } from './wasm-asset.provider';

/** WASM asset provider for ATmega2560 (wasm-toolchains bundle). */
@Injectable()
export class WasmMegaAssetProvider extends WasmAssetProvider {
  protected override readonly bundleId = WASM_AVR_MEGA_BUNDLE_ID;
}
