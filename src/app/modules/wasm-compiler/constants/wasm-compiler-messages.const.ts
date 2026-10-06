/** Build-log and probe messages for AVR WASM compiler backends. */

export interface WasmCompilerProfile {
  manifestFile: string;
  invalidManifestDetail: string;
  toolchainLabel: string;
  toolchainHint: string;
  moduleExportError: string;
  installCoreMessage: string;
  /** wasm-toolchains board argument (Mega only). */
  boardArg?: string;
}

export const WASM_PROBE_ASSET_CACHE_PREFIX = 'asset cache';

export const WASM_AVR_328P_COMPILER: WasmCompilerProfile = {
  manifestFile: 'assets/manifest.json',
  invalidManifestDetail:
    'stock npm manifest (missing ByByte waves). Run npm run prepare:wasm-avr and restart ng serve',
  toolchainLabel: 'AVR WASM toolchain is missing',
  toolchainHint: 'Run npm run prepare:wasm-avr and restart the web app.',
  moduleExportError: 'AVR WASM module does not export compile()',
  installCoreMessage: 'AVR WASM assets are bundled; core install is not required on web.',
};

export const WASM_AVR_MEGA_COMPILER: WasmCompilerProfile = {
  manifestFile: 'bybyte-manifest.json',
  invalidManifestDetail:
    'missing ByByte Mega manifest — run npm run prepare:wasm-avr -- prepare mega',
  toolchainLabel: 'AVR Mega WASM toolchain is missing',
  toolchainHint: 'Run npm run prepare:wasm-avr -- prepare mega and restart the web app.',
  moduleExportError: 'Mega WASM module does not export compile()',
  installCoreMessage: 'AVR Mega WASM assets are bundled; core install is not required on web.',
  boardArg: 'mega',
};

export function formatWasmToolchainMissingError(
  profile: Pick<WasmCompilerProfile, 'toolchainLabel' | 'toolchainHint'>,
  detail: string,
): string {
  return `${profile.toolchainLabel} (${detail}). ${profile.toolchainHint}`;
}
