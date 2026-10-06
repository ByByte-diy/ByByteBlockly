import { InjectionToken } from '@angular/core';
import { WasmCompilerStrategy } from './wasm-compiler-strategy.interface';

/** Multi-provider token — register each {@link WasmCompilerStrategy} implementation. */
export const WASM_COMPILER_STRATEGIES = new InjectionToken<WasmCompilerStrategy[]>(
  'WASM_COMPILER_STRATEGIES',
);
