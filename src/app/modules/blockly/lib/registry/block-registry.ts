/**
 * Block Registry - Central storage and management for blocks
 */

import * as Blockly from "blockly";
import {
  BlockDefinition,
  ToolboxFilters,
  PlatformT,
  BlockLevelE,
} from "../../types/block.types";
import { IToolboxCategoryMetadata } from "../../types";
import { MutatorRegistry } from "./mutator-registry";

/**
 * Block Registry
 */
export class BlockRegistry {
  private static blocks = new Map<string, BlockDefinition>();
  private static categoriesMap = new Map<string, IToolboxCategoryMetadata>();
  private static initialized = false;

  /**
   * Register a block
   */
  static register(block: BlockDefinition): void {
    const config = block.config;

    // Register block definition in Blockly
    Blockly.Blocks[config.type] = {
      init: block.init,
    };

    // Register generators for each platform
    const win = window as any;
    for (const [platform, generator] of Object.entries(config.generators)) {
      if (platform === "arduino" && win.Blockly?.Arduino?.forBlock) {
        win.Blockly.Arduino.forBlock[config.type] = generator;
      } else if (platform === "python" && win.Blockly?.Python?.forBlock) {
        win.Blockly.Python.forBlock[config.type] = generator;
      }
    }

    // Store in registry
    this.blocks.set(config.type, block);
  }

  /**
   * Register multiple blocks
   */
  static registerMany(blocks: BlockDefinition[]): void {
    for (const block of blocks) {
      this.register(block);
    }
  }

  /**
   * Get block by type
   */
  static get(type: string): BlockDefinition | undefined {
    return this.blocks.get(type);
  }

  /**
   * Get all blocks
   */
  static getAll(): BlockDefinition[] {
    return Array.from(this.blocks.values());
  }

  /**
   * Get blocks by platform
   */
  static getByPlatform(platform: PlatformT): BlockDefinition[] {
    return Array.from(this.blocks.values()).filter((block) =>
      block.config.platforms.includes(platform)
    );
  }

  /**
   * Get blocks by board
   */
  static getByBoard(board: string): BlockDefinition[] {
    return Array.from(this.blocks.values()).filter(
      (block) => !block.config.boards || block.config.boards.includes(board)
    );
  }

  /**
   * Get blocks by level
   */
  static getByLevel(level: BlockLevelE): BlockDefinition[] {
    return Array.from(this.blocks.values()).filter(
      (block) => block.config.level === level
    );
  }

  /**
   * Get blocks by category
   */
  static getByCategory(category: string): BlockDefinition[] {
    return Array.from(this.blocks.values()).filter(
      (block) => block.config.category === category
    );
  }

  /**
   * Get blocks by tags
   */
  static getByTags(tags: string[]): BlockDefinition[] {
    return Array.from(this.blocks.values()).filter((block) => {
      if (!block.config.tags) return false;
      return tags.some((tag) => block.config.tags!.includes(tag));
    });
  }

  /**
   * Get blocks with filters applied
   */
  static getFiltered(filters: ToolboxFilters): BlockDefinition[] {
    let blocks = this.getAll();

    if (filters.platform) {
      blocks = blocks.filter((b) =>
        b.config.platforms.includes(filters.platform!)
      );
    }

    if (filters.board) {
      blocks = blocks.filter(
        (b) => !b.config.boards || b.config.boards.includes(filters.board!)
      );
    }

    if (filters.level) {
      blocks = blocks.filter((b) => b.config.level === filters.level);
    }

    if (filters.categories && filters.categories.length > 0) {
      blocks = blocks.filter((b) =>
        filters.categories!.includes(b.config.category)
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      blocks = blocks.filter((b) => {
        if (!b.config.tags) return false;
        return filters.tags!.some((tag) => b.config.tags!.includes(tag));
      });
    }

    return blocks;
  }

  /**
   * Register a category
   */
  static registerCategory(
    name: string,
    metadata: IToolboxCategoryMetadata
  ): void {
    this.categoriesMap.set(name, metadata);
  }

  /**
   * Get all categories
   */
  static getCategories(): string[] {
    return Array.from(this.categoriesMap.keys());
  }

  /**
   * Get category metadata by name
   */
  static getCategoryMetadata(
    name: string
  ): IToolboxCategoryMetadata | undefined {
    return this.categoriesMap.get(name);
  }

  /**
   * Clear all categories
   */
  static clearCategories(): void {
    this.categoriesMap.clear();
  }

  /**
   * Clear a category
   */
  static removeCategory(name: string): void {
    this.categoriesMap.delete(name);
  }

  /**
   * Get all tags
   */
  static getTags(): string[] {
    const tags = new Set<string>();
    for (const block of this.blocks.values()) {
      if (block.config.tags) {
        block.config.tags.forEach((tag) => tags.add(tag));
      }
    }
    return Array.from(tags).sort();
  }

  /**
   * Check if block is registered
   */
  static has(type: string): boolean {
    return this.blocks.has(type);
  }

  /**
   * Unregister a block
   */
  static unregister(type: string): void {
    this.blocks.delete(type);
    delete Blockly.Blocks[type];

    const win = window as any;
    if (win.Blockly?.Arduino?.forBlock) {
      delete win.Blockly.Arduino.forBlock[type];
    }
    if (win.Blockly?.Python?.forBlock) {
      delete win.Blockly.Python.forBlock[type];
    }
  }

  /**
   * Clear all blocks
   */
  static clear(): void {
    for (const type of this.blocks.keys()) {
      this.unregister(type);
    }
    this.blocks.clear();
  }

  /**
   * Get registry statistics
   */
  static getStats(): {
    total: number;
    byCategory: Record<string, number>;
    byPlatform: Record<string, number>;
    byLevel: Record<string, number>;
  } {
    const stats = {
      total: this.blocks.size,
      byCategory: {} as Record<string, number>,
      byPlatform: {} as Record<string, number>,
      byLevel: {} as Record<string, number>,
    };

    for (const block of this.blocks.values()) {
      // Count by category
      stats.byCategory[block.config.category] =
        (stats.byCategory[block.config.category] || 0) + 1;

      // Count by level
      stats.byLevel[block.config.level] =
        (stats.byLevel[block.config.level] || 0) + 1;

      // Count by platform
      for (const platform of block.config.platforms) {
        stats.byPlatform[platform] = (stats.byPlatform[platform] || 0) + 1;
      }
    }

    return stats;
  }

  /**
   * Mark registry as initialized
   */
  static setInitialized(): void {
    this.initialized = true;
  }

  /**
   * Check if registry is initialized
   */
  static isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Initialize all mutators
   * Should be called once before blocks are used
   */
  static initializeMutators(): void {
    MutatorRegistry.initializeAll();
  }
}
