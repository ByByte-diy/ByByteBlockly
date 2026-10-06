import { ModuleWithProviders, NgModule, Type } from '@angular/core';
import { WasmRuntimePort } from './ports/wasm-runtime.port';
import { Avr328pWasmCompilerStrategy } from './strategies/avr-328p-wasm-compiler.strategy';
import { AvrMegaWasmCompilerStrategy } from './strategies/avr-mega-wasm-compiler.strategy';
import { WasmCompilerRegistry } from './services/wasm-compiler-registry.service';
import { WasmCompilerService } from './services/wasm-compiler.service';
import { WasmAssetProvider } from './services/wasm-asset.provider';
import { WasmMegaAssetProvider } from './services/wasm-mega-asset.provider';
import { WASM_COMPILER_STRATEGIES } from './wasm-compiler.tokens';

const WASM_COMPILER_PROVIDERS = [
  WasmAssetProvider,
  WasmMegaAssetProvider,
  Avr328pWasmCompilerStrategy,
  AvrMegaWasmCompilerStrategy,
  {
    provide: WASM_COMPILER_STRATEGIES,
    useFactory: (avr328p: Avr328pWasmCompilerStrategy, avrMega: AvrMegaWasmCompilerStrategy) => [
      avrMega,
      avr328p,
    ],
    deps: [Avr328pWasmCompilerStrategy, AvrMegaWasmCompilerStrategy],
  },
  WasmCompilerRegistry,
  WasmCompilerService,
];

/**
 * Portable WASM compiler (strategies + registry + assets).
 * Call {@link forRoot} from each platform module with a {@link WasmRuntimePort} implementation.
 */
@NgModule({})
export class WasmCompilerModule {
  static forRoot(runtimePort: Type<WasmRuntimePort>): ModuleWithProviders<WasmCompilerModule> {
    return {
      ngModule: WasmCompilerModule,
      providers: [{ provide: WasmRuntimePort, useClass: runtimePort }, ...WASM_COMPILER_PROVIDERS],
    };
  }
}

/** @deprecated Use {@link WasmCompilerModule}. */
export const WebWasmCompilerModule = WasmCompilerModule;
