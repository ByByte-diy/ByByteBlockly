import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { ICompiler } from '@core/interfaces';
import { CompileOptions, CompileProgressUpdate, CompileResult } from '@core/models';
import { createProgressSimulator } from '@core/utils/compile-progress.util';
import {
  detectWasmSensors,
  formatWasmCompileLog,
  isAvr328pFqbn,
  isBybyteWasmManifest,
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
      const manifest = await response.json();
      if (!isBybyteWasmManifest(manifest)) {
        return {
          ok: false,
          detail:
            'stock npm manifest (missing ByByte waves). Run npm run prepare:wasm-avr and restart ng serve',
        };
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

  private reportProgress(options: CompileOptions, update: CompileProgressUpdate): void {
    options.onProgress?.(update);
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

    this.reportProgress(options, { percent: 8, message: 'ui.compile_progress_checking_tools' });
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

    this.reportProgress(options, { percent: 18, message: 'ui.compile_progress_preparing' });
    const source = prepareSketchForWasm(options.code || '');
    if (!source) {
      return {
        success: false,
        output: 'Code is empty or not generated',
        error: 'Code is empty or not generated',
        fqbn,
      };
    }

    let progressSimulator: ReturnType<typeof createProgressSimulator> | null = null;

    try {
      this.reportProgress(options, { percent: 28, message: 'ui.compile_progress_loading' });
      const compile = await this.loadCompileFn();

      this.reportProgress(options, { percent: 35, message: 'ui.compile_progress_compiling' });
      progressSimulator = createProgressSimulator((percent) => {
        this.reportProgress(options, { percent, message: 'ui.compile_progress_compiling' });
      });

      const wasmResult = await compile({
        source,
        sensors: detectWasmSensors(source),
        assetsBase: resolveWasmAssetsBase(),
      });

      progressSimulator.stop();
      progressSimulator = null;
      this.reportProgress(options, { percent: 95, message: 'ui.compile_progress_finishing' });

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
      progressSimulator?.stop();
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
