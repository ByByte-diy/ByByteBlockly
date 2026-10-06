import { Injectable } from '@angular/core';
import { WasmRuntimePort } from '@modules/wasm-compiler/ports/wasm-runtime.port';

/** Chromium runtime — ng serve, Chrome, Electron renderer. */
@Injectable()
export class BrowserWasmRuntimePort extends WasmRuntimePort {
  getDocumentBase(): string {
    return document.baseURI;
  }

  fetch(url: string, init?: RequestInit): Promise<Response> {
    return fetch(url, init);
  }

  importModule<T extends Record<string, unknown>>(moduleUrl: string): Promise<T> {
    return import(/* webpackIgnore: true */ moduleUrl) as Promise<T>;
  }
}
