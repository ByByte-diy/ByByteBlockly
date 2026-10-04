import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { ICompiler } from '@core/interfaces';
import { CompileOptions, CompileResult } from '@core/models';
import {
  formatWasmCompileLog,
  isAvr328pFqbn,
  prepareSketchForWasm,
  resolveWasmAssetsBase,
  WASM_AVR_UNSUPPORTED_MESSAGE,
} from './web-avr-wasm.util';

interface WasmCompileFn {
  (options: {
    source: string;
    sensors?: string[];
    assetsBase?: string;
  }): Promise<WasmBuildResult>;
}

interface WasmBuildResult {
  hex: string;
  flashBytes: number;
  fitsTarget: boolean;
  stderr?: string[];
  timings?: Record<string, number>;
}

@Injectable()
export class WebAvrWasmCompilerService implements ICompiler {
  private compileFn: WasmCompileFn | null = null;

  compile(options: CompileOptions): Observable<CompileResult> {
    return from(this.compileAsync(options));
  }

  async checkTools(): Promise<boolean> {
    return (await this.probeTools()).ok;
  }

  private async probeTools(): Promise<{ ok: boolean; detail: string }> {
    const manifestUrl = new URL('assets/manifest.json', resolveWasmAssetsBase()).href;
    try {
      const response = await fetch(manifestUrl, { method: 'GET' });
      if (!response.ok) {
        return { ok: false, detail: `${response.status} ${manifestUrl}` };
      }
      return { ok: true, detail: manifestUrl };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return { ok: false, detail: `${message} (${manifestUrl})` };
    }
  }

  installCore(_core: string): Observable<string> {
    return of('AVR WASM assets are bundled; core install is not required on web.');
  }

  private async compileAsync(options: CompileOptions): Promise<CompileResult> {
    const fqbn = options.board;

    if (!isAvr328pFqbn(fqbn)) {
      return {
        success: false,
        output: WASM_AVR_UNSUPPORTED_MESSAGE,
        error: WASM_AVR_UNSUPPORTED_MESSAGE,
        fqbn,
      };
    }

    const tools = await this.probeTools();
    if (!tools.ok) {
      const error =
        `AVR WASM toolchain is missing (${tools.detail}). ` +
        `Run npm run prepare:wasm-avr and restart the web app.`;
      return {
        success: false,
        output: error,
        error,
        fqbn,
      };
    }

    const source = prepareSketchForWasm(options.code || '');
    if (!source) {
      return {
        success: false,
        output: 'Code is empty or not generated',
        error: 'Code is empty or not generated',
        fqbn,
      };
    }

    try {
      const compile = await this.loadCompileFn();
      const wasmResult = await compile({
        source,
        sensors: [],
        assetsBase: resolveWasmAssetsBase(),
      });

      const output = formatWasmCompileLog(wasmResult);

      return {
        success: true,
        output,
        hexContent: wasmResult.hex,
        flashBytes: wasmResult.flashBytes,
        fitsTarget: wasmResult.fitsTarget,
        fqbn,
        size: {
          text: wasmResult.flashBytes,
          data: 0,
          bss: 0,
          total: wasmResult.flashBytes,
        },
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        success: false,
        output: message,
        error: message,
        fqbn,
      };
    }
  }

  private async loadCompileFn(): Promise<WasmCompileFn> {
    if (this.compileFn) {
      return this.compileFn;
    }

    const moduleUrl = new URL('index.js', resolveWasmAssetsBase()).href;
    const wasmModule = await import(/* webpackIgnore: true */ moduleUrl);
    if (typeof wasmModule.compile !== 'function') {
      throw new Error('AVR WASM module does not export compile()');
    }

    this.compileFn = wasmModule.compile as WasmCompileFn;
    return this.compileFn;
  }
}
