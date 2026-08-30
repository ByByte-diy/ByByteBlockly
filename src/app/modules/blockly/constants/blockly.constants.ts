/**
 * Blockly configuration constants
 */

import * as Blockly from 'blockly';
import type { BlocklyOptions } from 'blockly/core/blockly_options';
import { BYBYTE_BLOCKLY_LIGHT_THEME } from './blockly-themes';

/**
 * Default workspace options for Blockly 13.x
 */
export const DEFAULT_WORKSPACE_OPTIONS: BlocklyOptions = {
  grid: {
    spacing: 20,
    length: 3,
    colour: '#ccc',
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
 * Block colors (HSV format for Blockly 13.x)
 */
export const BLOCK_COLORS = {
  GENERIC: 160,      // Base/Generic blocks
  IO: 230,           // Input/Output blocks
  SENSORS: 290,      // Sensor blocks
  ACTUATORS: 65,     // Actuator blocks (servo, motor, etc.)
  COMMUNICATION: 20, // Serial, I2C, SPI, etc.
  DISPLAY: 120,      // LCD, LED, OLED, etc.
  TIME: 180,         // Delay, millis, etc.
  MATH: 230,         // Math operations
  LOGIC: 210,        // Logic operations
  LOOPS: 120,        // Loop blocks
  TEXT: 160,         // Text/String operations
  VARIABLES: 330     // Variables
};

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

