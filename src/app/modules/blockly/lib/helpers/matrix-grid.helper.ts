import * as Blockly from "blockly";
import {
  createMatrixColumnLabel,
  createMatrixCornerLabel,
  createMatrixLedField,
  createMatrixRowLabel,
} from "../fields/field-matrix-led";

export const MATRIX_GRID_SIZE = 8;
export const MATRIX_PIXEL_COUNT = MATRIX_GRID_SIZE * MATRIX_GRID_SIZE;

/** Append the 0–7 column header row aligned with matrix cells. */
export function appendMatrixGridHeader(
  block: Blockly.Block,
  cols = MATRIX_GRID_SIZE
): void {
  const input = block.appendDummyInput();
  input.appendField(createMatrixCornerLabel());
  for (let col = 0; col < cols; col++) {
    input.appendField(createMatrixColumnLabel(col));
  }
}

/** Append one matrix row: row label + LED dot fields. */
export function appendMatrixLedGridRow(
  block: Blockly.Block,
  rowIndex: number,
  cols = MATRIX_GRID_SIZE,
  fieldPrefix = "Pixel"
): void {
  const input = block.appendDummyInput().appendField(createMatrixRowLabel(rowIndex));
  for (let col = 0; col < cols; col++) {
    const index = rowIndex * cols + col;
    input.appendField(createMatrixLedField(), `${fieldPrefix}${index}`);
  }
}

/** Append full 8×8 matrix grid (header + rows). */
export function appendMatrixLedGrid(
  block: Blockly.Block,
  rows = MATRIX_GRID_SIZE,
  cols = MATRIX_GRID_SIZE,
  fieldPrefix = "Pixel"
): void {
  appendMatrixGridHeader(block, cols);
  for (let row = 0; row < rows; row++) {
    appendMatrixLedGridRow(block, row, cols, fieldPrefix);
  }
}

export function isMatrixPixelOn(
  block: Blockly.Block,
  index: number,
  fieldPrefix = "Pixel"
): boolean {
  return block.getFieldValue(`${fieldPrefix}${index}`) !== "FALSE";
}
