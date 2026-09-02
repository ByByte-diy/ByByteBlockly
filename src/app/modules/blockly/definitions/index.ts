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
import * as functions from "./functions/index";
import * as arrays from "./arrays/index";
import * as storage from "./storage/index";
import * as communication from "./communication/index";
import * as motors from "./motors/index";
import * as led from "./led/index";
import * as displays from "./displays/index";
import * as audio from "./audio/index";
import * as sensing from "./sensing/index";
import * as iot from "./iot/index";
import { initializePlatformPacks } from "../platforms";

/**
 * Initialize all block definitions
 */
export function initializeAllBlocks(): void {
  // Initialize mutators first (before blocks are registered)
  BlockRegistry.initializeMutators();

  // Register all blocks in the registry
  [
    generic,
    time,
    ports,
    logic,
    math,
    variables,
    text,
    functions,
    arrays,
    communication,
    storage,
    motors,
    led,
    displays,
    audio,
    sensing,
    iot,
  ].forEach((module) => {
    module.initialize();
  });

  initializePlatformPacks();

  BlockRegistry.setInitialized();
}
