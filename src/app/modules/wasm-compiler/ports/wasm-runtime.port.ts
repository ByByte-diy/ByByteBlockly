import { InjectionToken } from '@angular/core';

/**
 * Host runtime for WASM compile (browser, Electron renderer, …).
 * Keeps asset URL resolution and module loading out of compile strategies.
 */
export abstract class WasmRuntimePort {
  /** Base href for resolving relative asset/catalog URLs. */
  abstract getDocumentBase(): string;

  abstract fetch(url: string, init?: RequestInit): Promise<Response>;

  /** Dynamic import of the WASM bundle entry (index.js). */
  abstract importModule<T extends Record<string, unknown>>(moduleUrl: string): Promise<T>;
}

export const WASM_RUNTIME_PORT = new InjectionToken<WasmRuntimePort>('WASM_RUNTIME_PORT');
