import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { COMPILE_WASM_UNSUPPORTED_BOARD_I18N } from '@core/constants/compile-i18n.const';
import { ICompiler } from '@core/interfaces';
import { CompileOptions, CompileResult } from '@core/models';
import { WasmCompilerRegistry } from './wasm-compiler-registry.service';

/**
 * WASM compile facade — delegates to the first matching {@link WasmCompilerStrategy}.
 * Platform-agnostic; bind to {@link ICompiler} in web or Electron platform modules.
 */
@Injectable()
export class WasmCompilerService implements ICompiler {
  constructor(private readonly registry: WasmCompilerRegistry) {}

  compile(options: CompileOptions): Observable<CompileResult> {
    const strategy = this.registry.resolve(options.board);
    if (!strategy) {
      return from(
        Promise.resolve({
          success: false,
          output: '',
          error: COMPILE_WASM_UNSUPPORTED_BOARD_I18N,
          fqbn: options.board,
        } satisfies CompileResult),
      );
    }
    return strategy.compile(options);
  }

  checkTools(): Promise<boolean> {
    return Promise.all(this.registry.all().map((strategy) => strategy.checkTools())).then(
      (results) => results.some(Boolean),
    );
  }

  installCore(core: string): Observable<string> {
    let strategy = this.registry.resolve(core);
    if (!strategy && core.includes('mega')) {
      strategy = this.registry.all().find((entry) => entry.family === 'avr-mega') ?? null;
    }
    strategy ??=
      this.registry.all().find((entry) => entry.family === 'avr-328p') ?? this.registry.all()[0];
    return strategy.installCore(core);
  }
}

/** @deprecated Use {@link WasmCompilerService}. */
export const WebWasmCompilerService = WasmCompilerService;
