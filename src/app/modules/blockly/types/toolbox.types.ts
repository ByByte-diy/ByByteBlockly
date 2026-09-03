/**
 * Toolbox configuration types for Blockly
 */

import { BlockLevelE } from "./block.types";
import { CategoryHue } from "../constants/category-colour.const";

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
  /** Concrete board ID from device catalog (e.g. uno, Ottoky, MRTnode) */
  boardId?: string;
  includeStandardBlocks?: boolean;
  /** Maximum toolbox difficulty level visible to the user */
  userLevel?: BlockLevelE;
  customCategories?: string[];
  excludeCategories?: string[];
}

/**
 * Category metadata for toolbox
 */
export interface IToolboxCategoryConfig {
  name: string;
  /** Blockly HSV hue (0–360); saturation/value are project-wide constants. */
  colour: CategoryHue;
  order: number;
  custom?: string;
  /** Parent category message key (e.g. CAT_COMMUNICATION) for nested toolbox groups */
  parentCategory?: string;
  /** When true, category holds subcategories only (no direct blocks) */
  isContainer?: boolean;
  /** Sort order among sibling subcategories */
  subOrder?: number;
  requiredPlatform?: 'web' | 'electron' | 'both';
  requiredBoardTypes?: BoardType[];
  /** When set, category is visible only for these board IDs */
  requiredBoardIds?: string[];
  /** When set, category is hidden on these board IDs (general boards show both robot families) */
  hiddenBoardIds?: string[];
  minLevel?: BlockLevelE;
}

