import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import {
  COMPILE_CODE_EMPTY_I18N,
  COMPILE_WASM_UNSUPPORTED_BOARD_I18N,
} from '@core/constants/compile-i18n.const';
import { CompileOptions, CompileProgressUpdate, CompileResult } from '@core/models';
import { createProgressSimulator } from '@core/utils/compile-progress.util';
import {
  compileWasmToolchainMissingI18n,
  COMPILE_WASM_ESP32_UNSUPPORTED_LIB_I18N,
  COMPILE_WASM_TOOLCHAIN_UPDATING_I18N,
} from '../constants/compile-wasm-i18n.const';
import { formatWasmToolchainMissingError, WASM_ESP32_COMPILER } from '../constants/wasm-compiler-messages.const';
import { WasmFamily } from '../constants/wasm-family.types';
import { WasmRuntimePort } from '../ports/wasm-runtime.port';
import { WasmEsp32AssetProvider } from '../services/wasm-esp32-asset.provider';
import { WasmCompilerStrategy } from '../wasm-compiler-strategy.interface';
import { injectForwardDeclarations } from '../utils/sketch-preprocessor';
import {
  collectEsp32ClosurePaths,
  collectTierPrefetchPaths,
} from '../utils/wasm-tier-prefetch.util';
import { validateEsp32SketchIncludes } from '../utils/wasm-esp32-sketch-validator';
import { probeWasmToolchain } from '../utils/wasm-toolchain-probe.util';
import { normalizeFlashAppAddress } from '../utils/esp32-flash-offset.util';

export interface Esp32WasmBuildResult {
  bin: Uint8Array;
  binContent: string;
  binBytes: number;
  outputFormat?: string;
  flash?: { app?: string; bootloader?: string; partitions?: string };
  stderr?: string[];
  timings?: Record<string, number>;
}

type Esp32CompileFn = (args: {
  source: string;
  board?: string;
  assetsBase?: string;
}) => Promise<Esp32WasmBuildResult>;

/** WASM compile strategy for ESP32 (xtensa, app .bin output). */
@Injectable()
export class Esp32WasmCompilerStrategy implements WasmCompilerStrategy {
  readonly family: WasmFamily = 'esp32';

  static readonly SUPPORTED_FQBNS = ['esp32:esp32:esp32'] as const;

  private compileFn: Esp32CompileFn | null = null;

  constructor(
    private readonly wasmAssets: WasmEsp32AssetProvider,
    private readonly runtime: WasmRuntimePort,
  ) {}

  static normalizeFqbn(fqbn: string): string {
    return (fqbn || '').split(':').slice(0, 3).join(':');
  }

  static supportsFqbn(fqbn: string): boolean {
    return (Esp32WasmCompilerStrategy.SUPPORTED_FQBNS as readonly string[]).includes(
      Esp32WasmCompilerStrategy.normalizeFqbn(fqbn),
    );
  }

  static isEsp32Manifest(manifest: unknown): boolean {
    if (!manifest || typeof manifest !== 'object') {
      return false;
    }
    const record = manifest as { chip?: string; output?: string; boards?: object };
    return record.chip === 'esp32' && record.output === 'bin' && Boolean(record.boards);
  }

  static prepareSketch(code: string): string {
    let source = code.trim();
    if (!source) {
      return source;
    }

    if (!/#include\s*<Arduino\.h>/.test(source)) {
      source = `#include <Arduino.h>\n\n${source}`;
    }

    source = injectForwardDeclarations(source);

    if (!/\bvoid\s+setup\s*\(\s*\)/.test(source)) {
      source += '\n\nvoid setup() {}\n';
    }
    if (!/\bvoid\s+loop\s*\(\s*\)/.test(source)) {
      source += '\nvoid loop() {}\n';
    }

    return source;
  }

  supportsFqbn(fqbn: string): boolean {
    return Esp32WasmCompilerStrategy.supportsFqbn(fqbn);
  }

  compile(options: CompileOptions): Observable<CompileResult> {
    return from(this.compileAsync(options));
  }

  async checkTools(): Promise<boolean> {
    return (await this.probeTools()).ok;
  }

  installCore(_core: string): Observable<string> {
    return of(WASM_ESP32_COMPILER.installCoreMessage);
  }

  private async compileAsync(options: CompileOptions): Promise<CompileResult> {
    const fqbn = options.board;
    const profile = WASM_ESP32_COMPILER;

    if (!this.supportsFqbn(fqbn)) {
      return {
        success: false,
        output: '',
        error: COMPILE_WASM_UNSUPPORTED_BOARD_I18N,
        fqbn,
      };
    }

    this.reportProgress(options, { percent: 8, message: 'ui.compile_progress_checking_tools' });
    const tools = await this.probeTools(() => {
      this.reportProgress(options, {
        percent: 12,
        message: COMPILE_WASM_TOOLCHAIN_UPDATING_I18N,
      });
    });
    if (!tools.ok) {
      return {
        success: false,
        output: formatWasmToolchainMissingError(profile, tools.detail),
        error: compileWasmToolchainMissingI18n('esp32'),
        fqbn,
      };
    }

    this.reportProgress(options, { percent: 18, message: 'ui.compile_progress_preparing' });
    const source = Esp32WasmCompilerStrategy.prepareSketch(options.code || '');
    if (!source) {
      return { success: false, output: '', error: COMPILE_CODE_EMPTY_I18N, fqbn };
    }

    let progressSimulator: ReturnType<typeof createProgressSimulator> | null = null;

    try {
      const catalog = await this.wasmAssets.loadCatalog();
      const libraryCheck = validateEsp32SketchIncludes(source, catalog);
      if (libraryCheck.ok === false) {
        return {
          success: false,
          output: libraryCheck.output,
          error: COMPILE_WASM_ESP32_UNSUPPORTED_LIB_I18N,
          fqbn,
        };
      }

      this.reportProgress(options, { percent: 24, message: 'ui.compile_progress_loading' });
      const tierPaths = [
        ...collectTierPrefetchPaths(catalog, 'tools'),
        ...collectTierPrefetchPaths(catalog, 'core'),
        ...collectEsp32ClosurePaths(catalog),
      ];
      await this.wasmAssets.prefetchCatalogPaths([...new Set(tierPaths)], (progress) => {
        const percent = 24 + Math.round((progress.completed / Math.max(progress.total, 1)) * 12);
        this.reportProgress(options, { percent, message: 'ui.compile_progress_loading' });
      });

      this.reportProgress(options, { percent: 38, message: 'ui.compile_progress_compiling' });
      progressSimulator = createProgressSimulator((percent) => {
        this.reportProgress(options, { percent, message: 'ui.compile_progress_compiling' });
      });

      const assetsBase = await this.wasmAssets.resolveAssetsBase();
      const compile = await this.loadCompileFn();
      const wasmResult = await compile({
        source,
        board: profile.boardArg,
        assetsBase,
      });

      progressSimulator.stop();
      progressSimulator = null;
      this.reportProgress(options, { percent: 95, message: 'ui.compile_progress_finishing' });

      return this.toSuccessResult(fqbn, wasmResult);
    } catch (error: unknown) {
      progressSimulator?.stop();
      const message = error instanceof Error ? error.message : String(error);
      return { success: false, output: message, error: message, fqbn };
    }
  }

  private toSuccessResult(fqbn: string, wasmResult: Esp32WasmBuildResult): CompileResult {
    const log = (wasmResult.stderr ?? []).join('\n');
    const appOffset = normalizeFlashAppAddress(wasmResult.flash?.app);
    return {
      success: true,
      output: log,
      binContent: wasmResult.binContent,
      flashAppAddress: appOffset,
      flashBytes: wasmResult.binBytes,
      fitsTarget: true,
      fqbn,
      size: {
        text: wasmResult.binBytes,
        data: 0,
        bss: 0,
        total: wasmResult.binBytes,
      },
    };
  }

  private probeTools(onUpdating?: () => void): Promise<{ ok: boolean; detail: string }> {
    return probeWasmToolchain(
      this.wasmAssets,
      this.runtime,
      WASM_ESP32_COMPILER,
      (manifest) => Esp32WasmCompilerStrategy.isEsp32Manifest(manifest),
      { onUpdating },
    );
  }

  private async loadCompileFn(): Promise<Esp32CompileFn> {
    if (this.compileFn) {
      return this.compileFn;
    }

    const profile = WASM_ESP32_COMPILER;
    const assetsBase = await this.wasmAssets.resolveAssetsBase();
    const moduleUrl = new URL('index.js', assetsBase).href;
    const wasmModule = await this.runtime.importModule<{ compile?: unknown }>(moduleUrl);

    if (typeof wasmModule.compile !== 'function') {
      throw new Error(profile.moduleExportError);
    }

    this.compileFn = wasmModule.compile as Esp32CompileFn;
    return this.compileFn;
  }

  private reportProgress(options: CompileOptions, update: CompileProgressUpdate): void {
    options.onProgress?.(update);
  }
}
