/**
 * Block Definitions - Barrel export
 */

import { BlockRegistry } from '../lib/registry/block-registry';
import * as generic from './generic/index';
import * as logic from './logic/index';
import * as math from './math/index';

/**
 * Initialize all block definitions
 */
export function initializeAllBlocks(): void {
  // Initialize mutators first (before blocks are registered)
  BlockRegistry.initializeMutators();

  // Register all blocks in the registry
  [generic, logic, math].forEach((module) => {
    module.initialize();
  });

  BlockRegistry.setInitialized();
} 