/**
 * Mutator Registry - Central registration for all Blockly mutators
 * 
 * This registry ensures mutators are registered once before blocks are used.
 * Each mutator is registered with Blockly.Extensions.registerMutator.
 */

import * as Blockly from "blockly";

type MutatorDefinition = {
  name: string;
  mixin: any;
  helperBlocks: string[];
  init?: (this: Blockly.Block) => void;
};

/**
 * Mutator Registry
 */
export class MutatorRegistry {
  private static mutators = new Map<string, MutatorDefinition>();
  private static registered = false;

  /**
   * Register a mutator definition (doesn't register with Blockly yet)
   */
  static define(definition: MutatorDefinition): void {
    if (this.registered) {
      console.warn(
        `Cannot define mutator "${definition.name}" after initialization. Call define() before initializeAll().`
      );
      return;
    }
    this.mutators.set(definition.name, definition);
  }

  /**
   * Initialize all registered mutators with Blockly
   * This should be called once during application initialization
   */
  static initializeAll(): void {
    if (this.registered) {
      return; // Already initialized
    }

    for (const [name, definition] of this.mutators.entries()) {
      try {
        Blockly.Extensions.registerMutator(
          name,
          definition.mixin,
          definition.init,
          definition.helperBlocks
        );
      } catch (error) {
        console.error(`Failed to register mutator "${name}":`, error);
      }
    }

    this.registered = true;
  }

  /**
   * Check if mutators are initialized
   */
  static isInitialized(): boolean {
    return this.registered;
  }

  /**
   * Get all registered mutator names
   */
  static getAll(): string[] {
    return Array.from(this.mutators.keys());
  }

  /**
   * Check if a mutator is defined
   */
  static has(name: string): boolean {
    return this.mutators.has(name);
  }

  /**
   * Reset the registry (for testing purposes)
   * @internal
   */
  static _reset(): void {
    this.mutators.clear();
    this.registered = false;
  }
}

