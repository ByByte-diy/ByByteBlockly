import { Inject, Injectable } from '@angular/core';
import { WasmCompilerStrategy } from '../wasm-compiler-strategy.interface';
import { WASM_COMPILER_STRATEGIES } from '../wasm-compiler.tokens';
import { WasmFamily } from '../constants/wasm-family.types';

/** Resolves the WASM compile strategy for a board FQBN. */
@Injectable()
export class WasmCompilerRegistry {
  constructor(
    @Inject(WASM_COMPILER_STRATEGIES) private readonly strategies: WasmCompilerStrategy[],
  ) {}

  resolve(fqbn: string): WasmCompilerStrategy | null {
    return this.strategies.find((strategy) => strategy.supportsFqbn(fqbn)) ?? null;
  }

  resolveFamily(fqbn: string): WasmFamily | null {
    return this.resolve(fqbn)?.family ?? null;
  }

  all(): readonly WasmCompilerStrategy[] {
    return this.strategies;
  }
}
