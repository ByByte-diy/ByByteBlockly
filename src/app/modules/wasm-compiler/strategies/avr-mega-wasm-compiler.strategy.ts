import { Injectable } from '@angular/core';
import { WASM_AVR_MEGA_COMPILER } from '../constants/wasm-compiler-messages.const';
import type { AvrWasmFamily } from '../constants/wasm-family.types';
import { WasmRuntimePort } from '../ports/wasm-runtime.port';
import { WasmMegaAssetProvider } from '../services/wasm-mega-asset.provider';
import {
  AvrWasmCompilerStrategyBase,
  WasmCompileInvokeArgs,
  WasmSelectiveLoad,
} from './avr-wasm-compiler.strategy.base';

/** WASM compile strategy for ATmega2560 (Mega). */
@Injectable()
export class AvrMegaWasmCompilerStrategy extends AvrWasmCompilerStrategyBase {
  static override readonly family: AvrWasmFamily = 'avr-mega';

  static readonly SUPPORTED_FQBNS = ['arduino:avr:mega'] as const;

  static override supportsFqbn(fqbn: string): boolean {
    return (AvrMegaWasmCompilerStrategy.SUPPORTED_FQBNS as readonly string[]).includes(
      AvrWasmCompilerStrategyBase.normalizeFqbn(fqbn),
    );
  }

  constructor(wasmAssets: WasmMegaAssetProvider, runtime: WasmRuntimePort) {
    super(wasmAssets, runtime);
  }

  protected override getCompilerProfile() {
    return WASM_AVR_MEGA_COMPILER;
  }

  protected override isManifestValid(manifest: unknown): boolean {
    return AvrMegaWasmCompilerStrategy.isBybyteManifest(manifest);
  }

  protected override buildWasmCompileArgs(
    source: string,
    assetsBase: string,
    selectiveLoad: WasmSelectiveLoad,
  ): WasmCompileInvokeArgs {
    return {
      source,
      board: WASM_AVR_MEGA_COMPILER.boardArg,
      assetsBase,
      selectiveLoad,
    };
  }

  static isBybyteManifest(manifest: unknown): boolean {
    if (!manifest || typeof manifest !== 'object') {
      return false;
    }

    const record = manifest as { wave?: string; objectPaths?: string[] };
    return Boolean(record.wave && (record.objectPaths?.length ?? 0) > 0);
  }
}
