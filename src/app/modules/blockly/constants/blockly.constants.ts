/**
 * Blockly configuration constants
 */

import type { BlocklyOptions } from 'blockly/core/blockly_options';
import { BYBYTE_BLOCKLY_LIGHT_THEME } from './blockly-themes';
import { CATEGORY_PALETTE } from './category-palette.const';

/**
 * Default workspace options for Blockly 13.x
 */
export const DEFAULT_WORKSPACE_OPTIONS: BlocklyOptions = {
  grid: {
    spacing: 20,
    length: 3,
    colour: '#888894',
    snap: true,
  },
  zoom: {
    controls: true,
    wheel: true,
    startScale: 1.0,
    maxScale: 3,
    minScale: 0.3,
    scaleSpeed: 1.2
  },
  scrollbars: true,
  trashcan: true,
  sounds: false,
  oneBasedIndex: false,
  horizontalLayout: false,
  toolboxPosition: 'start',
  move: {
    scrollbars: true,
    drag: true,
    wheel: true
  },
  media: 'assets/blockly/media/',
  renderer: 'zelos',
  theme: BYBYTE_BLOCKLY_LIGHT_THEME,
};

/**
 * Block colours by domain — aliases into {@link CATEGORY_PALETTE}.
 * HSV hue 0–360; saturation/value are fixed (see category-colour.const.ts).
 */
export const BLOCK_COLORS = {
  GENERIC: CATEGORY_PALETTE.GENERIC,
  IO: CATEGORY_PALETTE.PORTS,
  SENSORS: CATEGORY_PALETTE.SENSING,
  ACTUATORS: CATEGORY_PALETTE.MOTORS,
  COMMUNICATION: CATEGORY_PALETTE.COMMUNICATION,
  DISPLAY: CATEGORY_PALETTE.LED,
  DISPLAYS: CATEGORY_PALETTE.DISPLAYS,
  AUDIO: CATEGORY_PALETTE.AUDIO,
  IOT: CATEGORY_PALETTE.IOT,
  TIME: CATEGORY_PALETTE.TIME,
  MATH: CATEGORY_PALETTE.MATH,
  LOGIC: CATEGORY_PALETTE.LOGIC,
  LOOPS: CATEGORY_PALETTE.LOOPS,
  TEXT: CATEGORY_PALETTE.TEXT,
  VARIABLES: CATEGORY_PALETTE.VARIABLES,
} as const;

/**
 * File extensions
 */
export const FILE_EXTENSIONS = {
  BLOCKLY: '.bly',
  ARDUINO: '.ino',
  PYTHON: '.py',
  JSON: '.json',
  XML: '.xml'
};
