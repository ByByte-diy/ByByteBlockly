import { Observable } from 'rxjs';
import { CompileOptions, CompileResult } from '@core/models';
import { WasmAvrFamily } from './strategies/avr-wasm-compiler.strategy.base';

/** One WASM compile backend (328p, Mega, future ESP, …). */
export interface WasmCompilerStrategy {
  readonly family: WasmAvrFamily;
  supportsFqbn(fqbn: string): boolean;
  compile(options: CompileOptions): Observable<CompileResult>;
  checkTools(): Promise<boolean>;
  installCore(core: string): Observable<string>;
}
