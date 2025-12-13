import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Service for managing the Blockly workspace
 */
@Injectable({
  providedIn: 'root'
})
export class BlocklyService {
  private codeSubject = new BehaviorSubject<string>('');
  private jsonSubject = new BehaviorSubject<object>({});

  /**
   * Observable of the generated code
   */
  public code$: Observable<string> = this.codeSubject.asObservable();

  /**
   * Observable JSON representation of the workspace
   */
  public json$: Observable<object> = this.jsonSubject.asObservable();

  /**
   * Updates the generated code
   */
  updateCode(code: string): void {
    this.codeSubject.next(code);
  }

  /**
   * Updates the JSON workspace
   */
  updateJson(json: object): void {
    this.jsonSubject.next(json);
  }

  /**
   * Gets the current code
   */
  getCurrentCode(): string {
    return this.codeSubject.value;
  }

  /**
   * Gets the current JSON
   */
  getCurrentJson(): object {
    return this.jsonSubject.value;
  }

  /**
   * Gets the current JSON as a string
   */
  getCurrentJsonString(): string {
    return JSON.stringify(this.jsonSubject.value, null, 2);
  }

  /**
   * Loads the existing blocks and generators
   * TODO: Load from www/blocks&generators
   */
  loadCustomBlocks(): Promise<void> {
    return new Promise((resolve) => {
      // Here will be the logic to load the existing blocks
      resolve();
    });
  }

  /**
   * Loads the toolbox configuration
   * TODO: Load from www/toolbox
   */
  loadToolbox(board: string): Promise<any> {
    return new Promise((resolve) => {
      // Here will be the logic to load the toolbox
      resolve({});
    });
  }
}

