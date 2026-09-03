/**
 * Shared test harness for Blockly contract, matrix, and golden tests.
 */

import * as Blockly from "blockly";
import { BlockRegistry } from "../lib/registry/block-registry";
import { initializeAllBlocks } from "../definitions";
import { initializeArduinoGenerator } from "../lib/generators/arduino-generator";
import { registerProcedureBlocks } from "../lib/blocks/procedure-blocks.loader";
import { registerProcedureGenerators } from "../lib/generators/procedure-generators";

let envReady = false;

/** Minimal Blockly globals required by BlockRegistry.register(). */
function ensureBlocklyGlobals(): void {
  const win = window as Window & {
    Blockly?: typeof Blockly & {
      Arduino?: Blockly.CodeGenerator & { forBlock: Record<string, unknown> };
      Python?: { forBlock: Record<string, unknown> };
    };
  };

  if (!win.Blockly) {
    win.Blockly = Blockly as typeof win.Blockly;
  }
}

/**
 * Initialize Blockly registry, all blocks, and the Arduino generator once per test run.
 */
export function setupBlocklyTestEnv(options?: { withGenerator?: boolean }): void {
  if (envReady) {
    return;
  }

  ensureBlocklyGlobals();

  const arduinoGenerator = initializeArduinoGenerator();
  registerProcedureBlocks();
  registerProcedureGenerators(arduinoGenerator);

  BlockRegistry.clearCategories();
  BlockRegistry.clear();
  initializeAllBlocks();

  if (options?.withGenerator === false) {
    envReady = true;
    return;
  }

  envReady = true;
}

/** Reset registry state between isolated test files (optional). */
export function teardownBlocklyTestEnv(): void {
  BlockRegistry.clear();
  BlockRegistry.clearCategories();
  envReady = false;
}

/** Returns the initialized Arduino code generator. */
export function getArduinoGenerator(): Blockly.CodeGenerator {
  setupBlocklyTestEnv();
  const win = window as Window & { Blockly?: { Arduino?: Blockly.CodeGenerator } };
  if (!win.Blockly?.Arduino) {
    throw new Error("Arduino generator not initialized");
  }
  return win.Blockly.Arduino;
}
