import {
  WASM_PROBE_ASSET_CACHE_PREFIX,
  WasmCompilerProfile,
} from '../constants/wasm-compiler-messages.const';
import { WasmRuntimePort } from '../ports/wasm-runtime.port';
import { WasmAssetProvider } from '../services/wasm-asset.provider';

export interface WasmToolchainProbeOptions {
  /** When true (default), reload manifest and prefetch tiers once before giving up. */
  recover?: boolean;
  onUpdating?: () => void;
}

export function isWasmProbeRecoverable(detail: string): boolean {
  if (detail.includes('Unknown asset bundle')) {
    return false;
  }
  if (detail.includes(WASM_PROBE_ASSET_CACHE_PREFIX)) {
    return true;
  }
  if (/^\d{3}\s/.test(detail) || detail.includes('Failed to load')) {
    return true;
  }
  return false;
}

async function probeWasmToolchainOnce(
  wasmAssets: WasmAssetProvider,
  runtime: WasmRuntimePort,
  profile: WasmCompilerProfile,
  isManifestValid: (manifest: unknown) => boolean,
  forceRefresh: boolean,
): Promise<{ ok: boolean; detail: string }> {
  try {
    await wasmAssets.ensureValid(forceRefresh);
    await wasmAssets.loadCatalog(forceRefresh);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, detail: `${WASM_PROBE_ASSET_CACHE_PREFIX}: ${message}` };
  }

  const assetsBase = await wasmAssets.resolveAssetsBase();
  const manifestUrl = new URL(profile.manifestFile, assetsBase).href;

  try {
    const response = await runtime.fetch(manifestUrl, { method: 'GET', cache: 'no-store' });
    if (!response.ok) {
      return { ok: false, detail: `${response.status} ${manifestUrl}` };
    }

    const manifest = await response.json();
    if (!isManifestValid(manifest)) {
      return { ok: false, detail: profile.invalidManifestDetail };
    }

    return { ok: true, detail: manifestUrl };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, detail: `${message} (${manifestUrl})` };
  }
}

/** Probe WASM toolchain; on stale cache / fetch errors, sync bundle from server and retry once. */
export async function probeWasmToolchain(
  wasmAssets: WasmAssetProvider,
  runtime: WasmRuntimePort,
  profile: WasmCompilerProfile,
  isManifestValid: (manifest: unknown) => boolean,
  options?: WasmToolchainProbeOptions,
): Promise<{ ok: boolean; detail: string }> {
  const recover = options?.recover !== false;
  let result = await probeWasmToolchainOnce(wasmAssets, runtime, profile, isManifestValid, false);

  if (result.ok || !recover || !isWasmProbeRecoverable(result.detail)) {
    return result;
  }

  options?.onUpdating?.();

  try {
    await wasmAssets.syncBundle({
      force: true,
      prefetchTiers: ['tools', 'core'],
    });
    result = await probeWasmToolchainOnce(wasmAssets, runtime, profile, isManifestValid, false);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      ok: false,
      detail: `${WASM_PROBE_ASSET_CACHE_PREFIX}: recovery failed — ${message}`,
    };
  }

  return result;
}
