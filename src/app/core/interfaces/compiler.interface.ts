import { Observable } from 'rxjs';
import { CompileOptions, CompileResult } from '../models/compilation.model';

/**
 * Compiler interface for Arduino/ESP code
 */
export abstract class ICompiler {
  /**
   * Compile code for a specified board
   * @param options Compile options
   * @returns Observable with the compile result
   */
  abstract compile(options: CompileOptions): Observable<CompileResult>;

  /**
   * Check if the necessary compilation tools are installed
   * @returns Promise with the result of the check
   */
  abstract checkTools(): Promise<boolean>;

  /**
   * Install core for a specified board
   * @param core Name of the core (e.g. 'arduino:avr')
   * @returns Observable with the progress of the installation
   */
  abstract installCore(core: string): Observable<string>;
}

