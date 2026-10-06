import { Observable } from 'rxjs';
import { CompileOptions, CompileResult } from '@core/models';
import { WasmFamily } from './constants/wasm-family.types';

/** One WASM compile backend (328p, Mega, ESP32, …). */
export interface WasmCompilerStrategy {
  readonly family: WasmFamily;
  supportsFqbn(fqbn: string): boolean;
  compile(options: CompileOptions): Observable<CompileResult>;
  checkTools(): Promise<boolean>;
  installCore(core: string): Observable<string>;
}
