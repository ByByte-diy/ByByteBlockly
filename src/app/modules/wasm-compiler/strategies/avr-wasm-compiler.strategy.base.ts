import { Observable, from, of } from 'rxjs';
import {
  COMPILE_CODE_EMPTY_I18N,
  COMPILE_WASM_TOOLCHAIN_MISSING_I18N,
  COMPILE_WASM_UNSUPPORTED_BOARD_I18N,
} from '@core/constants/compile-i18n.const';
import { CompileOptions, CompileProgressUpdate, CompileResult } from '@core/models';
import { createProgressSimulator } from '@core/utils/compile-progress.util';
import {
  formatWasmToolchainMissingError,
  WASM_PROBE_ASSET_CACHE_PREFIX,
  WasmCompilerProfile,
} from '../constants/wasm-compiler-messages.const';
import { WasmRuntimePort } from '../ports/wasm-runtime.port';
import { WasmCompilerStrategy } from '../wasm-compiler-strategy.interface';
import { WasmAssetProvider } from '../services/wasm-asset.provider';
import { injectForwardDeclarations } from '../utils/sketch-preprocessor';
import { resolveWasmLibraries } from '../utils/wasm-library-resolver';

export type WasmAvrFamily = 'avr-328p' | 'avr-mega';

export interface WasmSelectiveLoad {
  headerFiles: string[];
  bybyteObjects: string[];
  includePaths: string[];
}

export interface WasmBuildResult {
  hex: string;
  flashBytes: number;
  fitsTarget: boolean;
  stderr?: string[];
  timings?: Record<string, number>;
}

export interface WasmCompileInvokeArgs {
  source: string;
  sensors?: string[];
  board?: string;
  assetsBase?: string;
  selectiveLoad?: WasmSelectiveLoad;
}

type WasmCompileFn = (args: WasmCompileInvokeArgs) => Promise<WasmBuildResult>;

type WasmStrategyConstructor = typeof AvrWasmCompilerStrategyBase & {
  readonly family: WasmAvrFamily;
  supportsFqbn(fqbn: string): boolean;
};

/**
 * Shared WASM compile pipeline for AVR web targets (328p, Mega).
 * Concrete strategies declare supported FQBNs and board-specific profile / invoke args.
 */
export abstract class AvrWasmCompilerStrategyBase implements WasmCompilerStrategy {
  static readonly family: WasmAvrFamily | null = null;

  static normalizeFqbn(fqbn: string): string {
    return (fqbn || '').split(':').slice(0, 3).join(':');
  }

  /** Override in concrete strategies. */
  static supportsFqbn(_fqbn: string): boolean {
    return false;
  }

  /** Normalizes sketch source before WASM compile (Arduino.h, setup/loop, forward decls). */
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

  static formatCompileLog(result: { stderr?: string[]; timings?: Record<string, number> }): string {
    return (result.stderr ?? []).join('\n');
  }

  private compileFn: WasmCompileFn | null = null;

  constructor(
    protected readonly wasmAssets: WasmAssetProvider,
    protected readonly runtime: WasmRuntimePort,
  ) {}

  get family(): WasmAvrFamily {
    return (this.constructor as WasmStrategyConstructor).family;
  }

  supportsFqbn(fqbn: string): boolean {
    return (this.constructor as WasmStrategyConstructor).supportsFqbn(fqbn);
  }

  compile(options: CompileOptions): Observable<CompileResult> {
    return from(this.compileAsync(options));
  }

  async checkTools(): Promise<boolean> {
    return (await this.probeTools()).ok;
  }

  installCore(_core: string): Observable<string> {
    return of(this.getCompilerProfile().installCoreMessage);
  }

  protected abstract getCompilerProfile(): WasmCompilerProfile;

  protected abstract buildWasmCompileArgs(
    source: string,
    assetsBase: string,
    selectiveLoad: WasmSelectiveLoad,
  ): WasmCompileInvokeArgs;

  protected async probeTools(): Promise<{ ok: boolean; detail: string }> {
    const profile = this.getCompilerProfile();

    try {
      await this.wasmAssets.ensureValid();
      await this.wasmAssets.loadCatalog();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return { ok: false, detail: `${WASM_PROBE_ASSET_CACHE_PREFIX}: ${message}` };
    }

    const assetsBase = await this.wasmAssets.resolveAssetsBase();
    const manifestUrl = new URL(profile.manifestFile, assetsBase).href;

    try {
      const response = await this.runtime.fetch(manifestUrl, { method: 'GET' });
      if (!response.ok) {
        return { ok: false, detail: `${response.status} ${manifestUrl}` };
      }

      const manifest = await response.json();
      if (!this.isManifestValid(manifest)) {
        return { ok: false, detail: profile.invalidManifestDetail };
      }

      return { ok: true, detail: manifestUrl };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return { ok: false, detail: `${message} (${manifestUrl})` };
    }
  }

  protected abstract isManifestValid(manifest: unknown): boolean;

  private async compileAsync(options: CompileOptions): Promise<CompileResult> {
    const fqbn = options.board;
    const profile = this.getCompilerProfile();

    if (!this.supportsFqbn(fqbn)) {
      return {
        success: false,
        output: '',
        error: COMPILE_WASM_UNSUPPORTED_BOARD_I18N,
        fqbn,
      };
    }

    this.reportProgress(options, { percent: 8, message: 'ui.compile_progress_checking_tools' });
    const tools = await this.probeTools();
    if (!tools.ok) {
      return {
        success: false,
        output: formatWasmToolchainMissingError(profile, tools.detail),
        error: COMPILE_WASM_TOOLCHAIN_MISSING_I18N,
        fqbn,
      };
    }

    this.reportProgress(options, { percent: 18, message: 'ui.compile_progress_preparing' });
    const source = AvrWasmCompilerStrategyBase.prepareSketch(options.code || '');
    if (!source) {
      return { success: false, output: '', error: COMPILE_CODE_EMPTY_I18N, fqbn };
    }

    let progressSimulator: ReturnType<typeof createProgressSimulator> | null = null;

    try {
      const catalog = await this.wasmAssets.loadCatalog();
      const resolved = resolveWasmLibraries(source, catalog);

      this.reportProgress(options, { percent: 24, message: 'ui.compile_progress_loading' });
      await this.wasmAssets.prefetchCatalogPaths(resolved.prefetchPaths, (progress) => {
        const percent = 24 + Math.round((progress.completed / Math.max(progress.total, 1)) * 10);
        this.reportProgress(options, { percent, message: 'ui.compile_progress_loading' });
      });

      this.reportProgress(options, { percent: 28, message: 'ui.compile_progress_loading' });
      this.compileFn = null;
      const compile = await this.loadCompileFn();

      this.reportProgress(options, { percent: 35, message: 'ui.compile_progress_compiling' });
      progressSimulator = createProgressSimulator((percent) => {
        this.reportProgress(options, { percent, message: 'ui.compile_progress_compiling' });
      });

      const assetsBase = await this.wasmAssets.resolveAssetsBase();
      const wasmResult = await compile(
        this.buildWasmCompileArgs(source, assetsBase, {
          headerFiles: resolved.headerFiles,
          bybyteObjects: resolved.bybyteObjects,
          includePaths: resolved.includePaths,
        }),
      );

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

  private toSuccessResult(fqbn: string, wasmResult: WasmBuildResult): CompileResult {
    return {
      success: true,
      output: AvrWasmCompilerStrategyBase.formatCompileLog(wasmResult),
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
  }

  private async loadCompileFn(): Promise<WasmCompileFn> {
    if (this.compileFn) {
      return this.compileFn;
    }

    const profile = this.getCompilerProfile();
    const assetsBase = await this.wasmAssets.resolveAssetsBase();
    const moduleUrl = new URL('index.js', assetsBase).href;
    const wasmModule = await this.runtime.importModule<{ compile?: unknown }>(moduleUrl);

    if (typeof wasmModule.compile !== 'function') {
      throw new Error(profile.moduleExportError);
    }

    this.compileFn = wasmModule.compile as WasmCompileFn;
    return this.compileFn;
  }

  private reportProgress(options: CompileOptions, update: CompileProgressUpdate): void {
    options.onProgress?.(update);
  }
}
