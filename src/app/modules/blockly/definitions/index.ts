/**
 * Block Definitions - Barrel export
 */

import { BlockRegistry } from "../lib/registry/block-registry";
import * as generic from "./generic/index";
import * as time from "./time/index";
import * as ports from "./ports/index";
import * as logic from "./logic/index";
import * as math from "./math/index";
import * as variables from "./variables/index";
import * as text from "./text/index";

/**
 * Initialize all block definitions
 */
export function initializeAllBlocks(): void {
  // Initialize mutators first (before blocks are registered)
  BlockRegistry.initializeMutators();

  // Register all blocks in the registry
  [generic, time, ports, logic, math, variables, text].forEach((module) => {
    module.initialize();
  });

  BlockRegistry.setInitialized();
}
