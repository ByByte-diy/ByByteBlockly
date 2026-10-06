import { NgModule } from '@angular/core';
import { ICompiler } from '@core/interfaces';
import { WasmCompilerModule, WasmCompilerService } from '@modules/wasm-compiler';
import { BrowserWasmRuntimePort } from './services/browser-wasm-runtime.port';
import { WasmBoardPrefetchService } from './services/wasm-board-prefetch.service';

/** Browser WASM compile runtime and tier prefetch. */
@NgModule({
  imports: [WasmCompilerModule.forRoot(BrowserWasmRuntimePort)],
  providers: [
    WasmBoardPrefetchService,
    { provide: ICompiler, useExisting: WasmCompilerService },
  ],
})
export class WebWasmModule {}
