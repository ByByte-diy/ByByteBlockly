/**
 * Math category blocks
 * Includes standard Blockly math blocks + custom Arduino math blocks
 */

import { BlockRegistry } from "../../lib/registry/block-registry";
import { BlockLevelE, IToolboxCategoryConfig } from "../../types";
import { CATEGORY_COLOR, CATEGORY_NAME, CATEGORY_ORDER } from "./config";
import { numberBlock } from "./number.block";
import { angleBlock } from "./math_angle.block";
import { analogPinBlock } from "./analog-input.block";
import { mathArithmeticBlock } from "./arithmetic.block";
import { logicCompareBlock } from "./compare.block";
import { rangeCompareBlock } from "./compare-range.block";
import { mapBlock } from "./map.block";
import { constrainBlock } from "./constrain.block";
import { randomIntBlock } from "./random.block";
import { mathRoundBlock } from "./round.block";
import { mathSingleBlock } from "./single.block";
import { mathConstantBlock } from "./constant.block";
import { mathTrigBlock } from "./trig.block";
import { castByteBlock } from "./cast-byte.block";
import { castUintBlock } from "./cast-uint.block";
import { castIntBlock } from "./cast-int.block";
import { castFloatBlock } from "./cast-float.block";
import { moduloBlock } from "./modulo.block";
import { numberPropertyBlock } from "./number-property.block";

export const MATH_BLOCKS = [
  numberBlock,
  angleBlock,
  analogPinBlock,
  mathArithmeticBlock,
  logicCompareBlock,
  rangeCompareBlock,
  mapBlock,
  constrainBlock,
  randomIntBlock,
  mathRoundBlock,
  mathSingleBlock,
  mathConstantBlock,
  mathTrigBlock,
  castByteBlock,
  castUintBlock,
  castIntBlock,
  castFloatBlock,
  moduloBlock,
  numberPropertyBlock,
];

export function initialize(): void {
  BlockRegistry.registerMany(MATH_BLOCKS);
  BlockRegistry.registerCategory(CATEGORY_NAME, {
    name: CATEGORY_NAME,
    colour: CATEGORY_COLOR.toString(),
    requiredPlatform: "both",
    order: CATEGORY_ORDER,
    minLevel: BlockLevelE.BEGINNER,
  } as IToolboxCategoryConfig);
}

// /**
//  * Standard Blockly math blocks metadata
//  */
// export const MATH_BLOCKS_METADATA = {
//   'math_number': {
//     category: 'Math',
//     color: BLOCK_COLORS.MATH,
//     tooltip: 'Number value'
//   },

//   'math_arithmetic': {
//     category: 'Math',
//     color: BLOCK_COLORS.MATH,
//     tooltip: 'Arithmetic operations (+, -, *, /, ^)'
//   },

//   'math_single': {
//     category: 'Math',
//     color: BLOCK_COLORS.MATH,
//     tooltip: 'Math functions (sqrt, abs, -, ln, log10, e^, 10^)'
//   },

//   'math_trig': {
//     category: 'Math',
//     color: BLOCK_COLORS.MATH,
//     tooltip: 'Trigonometric functions (sin, cos, tan)'
//   },



//   'math_modulo': {
//     category: 'Math',
//     color: BLOCK_COLORS.MATH,
//     tooltip: 'Remainder of division'
//   },

//   'logic_compare': {
//     category: 'Math',
//     color: BLOCK_COLORS.MATH,
//     tooltip: 'Comparison operators (=, ≠, <, >, ≤, ≥)'
//   }
// };

// /**
//  * Math category blocks
//  * Currently using standard Blockly math blocks
//  * Custom Arduino math blocks can be added here
//  */

// import { BlockRegistry } from '../../lib/registry/block-registry';

// /**
//  * All math category blocks
//  * Add custom math blocks here when created
//  */
// export const MATH_BLOCKS: BlockDefinition[] = [
//   // Custom math blocks will be added here
//   // Example: angleBlock, mapBlock, constrainBlock, etc.
// ];

// /**
//  * Initialize math blocks
//  * Registers custom math blocks with BlockRegistry
//  * Standard Blockly math blocks are already available
//  */
// export function initialize(): void {
//   // Register custom math blocks if any
//   if (MATH_BLOCKS.length > 0) {
//     BlockRegistry.registerMany(MATH_BLOCKS);
//   }

//   // Standard Blockly math blocks (math_number, math_arithmetic, etc.)
//   // are already available and don't need registration
// }
