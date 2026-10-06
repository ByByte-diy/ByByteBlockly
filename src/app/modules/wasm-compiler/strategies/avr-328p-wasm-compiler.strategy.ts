import { Injectable } from '@angular/core';
import { WASM_AVR_328P_COMPILER } from '../constants/wasm-compiler-messages.const';
import type { AvrWasmFamily } from '../constants/wasm-family.types';
import { WasmRuntimePort } from '../ports/wasm-runtime.port';
import { WasmAssetProvider } from '../services/wasm-asset.provider';
import { detectWasmSensors } from '../utils/wasm-library-resolver';
import {
  AvrWasmCompilerStrategyBase,
  WasmCompileInvokeArgs,
  WasmSelectiveLoad,
} from './avr-wasm-compiler.strategy.base';

/** WASM compile strategy for ATmega328p (Uno / Nano). */
@Injectable()
export class Avr328pWasmCompilerStrategy extends AvrWasmCompilerStrategyBase {
  static override readonly family: AvrWasmFamily = 'avr-328p';

  static readonly SUPPORTED_FQBNS = ['arduino:avr:uno', 'arduino:avr:nano'] as const;

  static override supportsFqbn(fqbn: string): boolean {
    return (Avr328pWasmCompilerStrategy.SUPPORTED_FQBNS as readonly string[]).includes(
      AvrWasmCompilerStrategyBase.normalizeFqbn(fqbn),
    );
  }

  constructor(wasmAssets: WasmAssetProvider, runtime: WasmRuntimePort) {
    super(wasmAssets, runtime);
  }

  protected override getCompilerProfile() {
    return WASM_AVR_328P_COMPILER;
  }

  protected override isManifestValid(manifest: unknown): boolean {
    return Avr328pWasmCompilerStrategy.isBybyteManifest(manifest);
  }

  protected override buildWasmCompileArgs(
    source: string,
    assetsBase: string,
    selectiveLoad: WasmSelectiveLoad,
  ): WasmCompileInvokeArgs {
    return {
      source,
      sensors: detectWasmSensors(source),
      assetsBase,
      selectiveLoad,
    };
  }

  /** True when manifest was produced by prepare-bybyte-assets (not stock npm only). */
  static isBybyteManifest(manifest: unknown): boolean {
    if (!manifest || typeof manifest !== 'object') {
      return false;
    }

    const record = manifest as {
      bybyte?: { wave?: string };
      headerFiles?: string[];
      objectGroups?: { bybyte?: string[] };
    };

    if (record.bybyte?.wave) {
      return true;
    }
    if ((record.objectGroups?.bybyte?.length ?? 0) > 0) {
      return true;
    }

    return (
      record.headerFiles?.includes('/arduino/libraries/SoftwareSerial/src/SoftwareSerial.h') ??
      false
    );
  }
}
