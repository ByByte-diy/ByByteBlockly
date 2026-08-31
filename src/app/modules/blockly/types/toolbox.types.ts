/**
 * Toolbox configuration types for Blockly
 */

import { BlockLevelE } from "./block.types";

/**
 * Toolbox kind
 */
export enum ToolboxKindE {
  CategoryToolbox = 'categoryToolbox',
  FlyoutToolbox = 'flyoutToolbox',
}

/**
 * Category kind
 */
export enum CategoryKindE {
  Category = 'category',
  FlyoutCategory = 'flyoutCategory',
  DynamicCategory = 'dynamicCategory',
}

/**
 * Block kind
 */
export enum BlockKindE {
  Block = 'block',
  Shadow = 'shadow',
}

/**
 * Category definition in toolbox
 */
export interface IToolboxCategory {
  kind: CategoryKindE;
  name: string;
  id?: string;
  colour?: string;
  categorystyle?: string;
  cssconfig?: {
    icon?: string;
    rowcontentcontainer?: string;
    label?: string;
  };
  contents: (IToolboxBlock | IToolboxCategory | IToolboxSeparator | IToolboxButton)[];
  expanded?: string;
  hidden?: string;
  custom?: string;
}

/**
 * Block definition in toolbox
 */
export interface IToolboxBlock {
  kind: BlockKindE.Block;
  type: string;
  fields?: Record<string, any>;
  inputs?: Record<string, any>;
  shadow?: IToolboxBlock;
}

/**
 * Separator in toolbox
 */
export interface IToolboxSeparator {
  kind: 'sep';
  gap?: string;
}

/**
 * Button in toolbox
 */
export interface IToolboxButton {
  kind: 'button';
  text: string;
  callbackKey: string;
}

/**
 * Full toolbox definition
 */
export interface IToolboxDefinition {
  kind: ToolboxKindE;
  contents: (IToolboxCategory | IToolboxBlock)[];
}

/**
 * Board type for toolbox generation
 */
export type BoardType = 'arduino' | 'esp32' | 'esp8266' | 'microbit' | 'python';

/**
 * Toolbox configuration options
 */
export interface ToolboxOptions {
  boardType: BoardType;
  includeStandardBlocks?: boolean;
  includeAdvancedBlocks?: boolean;
  customCategories?: string[];
  excludeCategories?: string[];
}

/**
 * Category metadata for toolbox
 */
export interface IToolboxCategoryConfig {
  name: string;
  colour: string;
  order: number;
  custom?: string;
  requiredPlatform?: 'web' | 'electron' | 'both';
  requiredBoardTypes?: BoardType[];
  minLevel?: BlockLevelE;
}

