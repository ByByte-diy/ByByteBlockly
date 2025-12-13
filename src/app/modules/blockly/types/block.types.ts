/**
 * Block type definitions
 */

import { PLATFORMS_ALL } from "@app/modules/device/constants/device-boards.const";
import * as Blockly from "blockly";

/**
 * Supported platforms
 */
export type PlatformT = (typeof PLATFORMS_ALL)[number];

/**
 * Block difficulty levels
 */
export enum BlockLevelE {
  BEGINNER,
  INTERMEDIATE,
  ADVANCED,
}

/**
 * Input types
 */
export type InputType = "value" | "statement" | "dummy";

/**
 * Field types
 */
export type FieldType =
  | "text"
  | "number"
  | "dropdown"
  | "checkbox"
  | "angle"
  | "color"
  | "textarea"
  | "image"
  | "variable";

/**
 * Input configuration
 */
export interface InputConfig {
  type: InputType;
  name: string;
  label?: string;
  check?: string | string[] | null;
  align?: string;
  shadow?: {
    type: string;
    fields?: { [key: string]: any };
  };
}

/**
 * Field configuration
 */
export interface FieldConfig {
  type: FieldType;
  name: string;
  value?: any;
  options?: any[];
  min?: number;
  max?: number;
  precision?: number;
  width?: number;
  height?: number;
  alt?: string;
  inputName?: string; // Name of the input to attach this field to
}

/**
 * Generator function type
 */
export type GeneratorFunction = (
  block: Blockly.Block,
  generator: any
) => string | [string, number];

/**
 * Block configuration
 */
export interface IBlockConfig {
  type: string;
  category: string;
  color: number;
  platforms: PlatformT[];
  boards?: string[];
  level: BlockLevelE;
  tags?: string[];

  inputs: InputConfig[];
  fields: FieldConfig[];

  message?: string;
  args?: any[];
  previousStatement?: string | string[] | null | false;
  nextStatement?: string | string[] | null | false;
  output?: string | string[] | null | false;

  tooltip?: string;
  helpUrl?: string;
  deletable?: boolean;
  movable?: boolean;
  editable?: boolean;

  mutator?: string;
  extensions?: string[];

  onchange?: (event: Blockly.Events.Abstract) => void;

  generators: {
    [platform: string]: GeneratorFunction;
  };
}

/**
 * Block metadata for toolbox and filtering
 */
export interface BlockMetadata {
  /** Required board types (if specified, block only shows for these boards) */
  requiredBoardTypes?: (
    | "arduino"
    | "esp32"
    | "esp8266"
    | "microbit"
    | "python"
  )[];

  /** Required platform (web/electron) */
  requiredPlatform?: PlatformT;

  /** Minimum skill level */
  minLevel?: BlockLevelE;

  /** Tags for searching/filtering */
  tags?: string[];

  /** Default field values for toolbox */
  defaultValues?: Record<string, any>;

  /** Is this block deprecated? */
  deprecated?: boolean;

  /** Replacement block type (if deprecated) */
  replacedBy?: string;
}

/**
 * Block definition (registered block)
 */
export interface BlockDefinition {
  type: string;
  category: string;
  config: IBlockConfig;
  generator?: GeneratorFunction;
  platform?: PlatformT;
  level?: BlockLevelE;
  metadata?: BlockMetadata;
  init: () => void;
}

/**
 * Toolbox filter options
 */
export interface ToolboxFilters {
  platform?: PlatformT;
  board?: string;
  level?: BlockLevelE;
  categories?: string[];
  tags?: string[];
}
