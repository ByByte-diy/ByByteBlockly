/**
 * Math category blocks
 * Includes standard Blockly math blocks + custom Arduino math blocks
 */

import { BlockRegistry } from "../../lib/registry/block-registry";
import { BlockLevelE, IToolboxCategoryMetadata } from "../../types";
import { CATEGORY_COLOR, CATEGORY_NAME } from "./config";
import { numberBlock } from "./number.block";

export const CATEGORY_ORDER = 5;

export const MATH_BLOCKS = [numberBlock];

export function initialize(): void {
  BlockRegistry.registerMany(MATH_BLOCKS);
  BlockRegistry.registerCategory(CATEGORY_NAME, {
    name: CATEGORY_NAME,
    colour: CATEGORY_COLOR.toString(),
    requiredPlatform: "both",
    order: CATEGORY_ORDER,
    minLevel: BlockLevelE.BEGINNER,
  } as IToolboxCategoryMetadata);
}

// /**
//  * Custom Arduino math blocks
//  */

// // Angle number (0-360)
// export const angleBlock = new BlockBuilder('math_angle')
//   .setCategory('Math')
//   .setColor(BLOCK_COLORS.MATH)
//   .setMessage('%1 °')
//   .addNumberField('ANGLE', 90, 0, 360)
//   .setOutput('Number')
//   .setTooltip('Angle value (0-360 degrees)')
//   .setArduinoGenerator((block) => {
//     const angle = block.getFieldValue('ANGLE');
//     return [angle, 0];
//   })
//   .build();

// // Analog pin dropdown
// export const analogPinBlock = new BlockBuilder('math_analog_pin')
//   .setCategory('Math')
//   .setColor(BLOCK_COLORS.MATH)
//   .setMessage('%1')
//   .addDropdownField('PIN', getAnalogPins())
//   .setOutput('Number')
//   .setTooltip('Analog pin selection')
//   .setArduinoGenerator((block) => {
//     const pin = block.getFieldValue('PIN');
//     return [pin, 0];
//   })
//   .build();

// // Map function
// export const mapBlock = new BlockBuilder('math_map')
//   .setCategory('Math')
//   .setColor(BLOCK_COLORS.MATH)
//   .setMessage('map %1 from %2 - %3 to %4 - %5')
//   .addValueInput('NUM', 'Number')
//   .addValueInput('DMIN', 'Number')
//   .addValueInput('DMAX', 'Number')
//   .addValueInput('CMIN', 'Number')
//   .addValueInput('CMAX', 'Number')
//   .setOutput('Number')
//   .setTooltip('Map value from one range to another')
//   .setArduinoGenerator((block) => {
//     const num = (window as any).Blockly.Arduino.valueToCode(block, 'NUM', 0) || '0';
//     const dmin = (window as any).Blockly.Arduino.valueToCode(block, 'DMIN', 0) || '0';
//     const dmax = (window as any).Blockly.Arduino.valueToCode(block, 'DMAX', 0) || '1023';
//     const cmin = (window as any).Blockly.Arduino.valueToCode(block, 'CMIN', 0) || '0';
//     const cmax = (window as any).Blockly.Arduino.valueToCode(block, 'CMAX', 0) || '255';
    
//     return [`map(${num}, ${dmin}, ${dmax}, ${cmin}, ${cmax})`, 0];
//   })
//   .build();

// // Constrain function
// export const constrainBlock = new BlockBuilder('math_constrain')
//   .setCategory('Math')
//   .setColor(BLOCK_COLORS.MATH)
//   .setMessage('constrain # %1 between %2 & %3')
//   .addValueInput('VALUE', 'Number')
//   .addValueInput('LOW', 'Number')
//   .addValueInput('HIGH', 'Number')
//   .setOutput('Number')
//   .setTooltip('Constrain value between min and max')
//   .setArduinoGenerator((block) => {
//     const value = (window as any).Blockly.Arduino.valueToCode(block, 'VALUE', 0) || '0';
//     const low = (window as any).Blockly.Arduino.valueToCode(block, 'LOW', 0) || '0';
//     const high = (window as any).Blockly.Arduino.valueToCode(block, 'HIGH', 0) || '100';
    
//     return [`constrain(${value}, ${low}, ${high})`, 0];
//   })
//   .build();

// // Random integer
// export const randomIntBlock = new BlockBuilder('math_random_int')
//   .setCategory('Math')
//   .setColor(BLOCK_COLORS.MATH)
//   .setMessage('random integer %1 & %2')
//   .addValueInput('FROM', 'Number')
//   .addValueInput('TO', 'Number')
//   .setOutput('Number')
//   .setTooltip('Random integer between min and max')
//   .setArduinoGenerator((block) => {
//     const from = (window as any).Blockly.Arduino.valueToCode(block, 'FROM', 0) || '0';
//     const to = (window as any).Blockly.Arduino.valueToCode(block, 'TO', 0) || '100';
    
//     return [`random(${from}, ${to})`, 0];
//   })
//   .build();

// // Comparison with range (a < b < c)
// export const rangeCompareBlock = new BlockBuilder('math_range_compare')
//   .setCategory('Math')
//   .setColor(BLOCK_COLORS.MATH)
//   .setMessage('%1 %2 %3 %4 %5')
//   .addValueInput('A', 'Number')
//   .addDropdownField('OP1', [['<', '<'], ['<=', '<='], ['>', '>'], ['>=', '>=']])
//   .addValueInput('B', 'Number')
//   .addDropdownField('OP2', [['<', '<'], ['<=', '<='], ['>', '>'], ['>=', '>=']])
//   .addValueInput('C', 'Number')
//   .setOutput('Boolean')
//   .setTooltip('Range comparison (e.g., 0 < x < 10)')
//   .setArduinoGenerator((block) => {
//     const a = (window as any).Blockly.Arduino.valueToCode(block, 'A', 0) || '0';
//     const b = (window as any).Blockly.Arduino.valueToCode(block, 'B', 0) || '0';
//     const c = (window as any).Blockly.Arduino.valueToCode(block, 'C', 0) || '0';
//     const op1 = block.getFieldValue('OP1');
//     const op2 = block.getFieldValue('OP2');
    
//     return [`(${a} ${op1} ${b} && ${b} ${op2} ${c})`, 0];
//   })
//   .build();

// // Casting blocks
// export const castByteBlock = new BlockBuilder('math_cast_byte')
//   .setCategory('Math')
//   .setColor(BLOCK_COLORS.MATH)
//   .setMessage('casting to byte %1')
//   .addValueInput('VALUE', undefined)
//   .setOutput('Number')
//   .setTooltip('Cast value to byte (0-255)')
//   .setArduinoGenerator((block) => {
//     const value = (window as any).Blockly.Arduino.valueToCode(block, 'VALUE', 0) || '0';
//     return [`(byte)(${value})`, 0];
//   })
//   .build();

// export const castUintBlock = new BlockBuilder('math_cast_uint')
//   .setCategory('Math')
//   .setColor(BLOCK_COLORS.MATH)
//   .setMessage('casting to unsigned int %1')
//   .addValueInput('VALUE', undefined)
//   .setOutput('Number')
//   .setTooltip('Cast value to unsigned integer')
//   .setArduinoGenerator((block) => {
//     const value = (window as any).Blockly.Arduino.valueToCode(block, 'VALUE', 0) || '0';
//     return [`(unsigned int)(${value})`, 0];
//   })
//   .build();

// export const castIntBlock = new BlockBuilder('math_cast_int')
//   .setCategory('Math')
//   .setColor(BLOCK_COLORS.MATH)
//   .setMessage('casting to int %1')
//   .addValueInput('VALUE', undefined)
//   .setOutput('Number')
//   .setTooltip('Cast value to signed integer')
//   .setArduinoGenerator((block) => {
//     const value = (window as any).Blockly.Arduino.valueToCode(block, 'VALUE', 0) || '0';
//     return [`(int)(${value})`, 0];
//   })
//   .build();

// export const castFloatBlock = new BlockBuilder('math_cast_float')
//   .setCategory('Math')
//   .setColor(BLOCK_COLORS.MATH)
//   .setMessage('casting to float %1')
//   .addValueInput('VALUE', undefined)
//   .setOutput('Number')
//   .setTooltip('Cast value to floating point')
//   .setArduinoGenerator((block) => {
//     const value = (window as any).Blockly.Arduino.valueToCode(block, 'VALUE', 0) || '0';
//     return [`(float)(${value})`, 0];
//   })
//   .build();

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
  
//   'math_round': {
//     category: 'Math',
//     color: BLOCK_COLORS.MATH,
//     tooltip: 'Round number (round, ceil, floor)'
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

