/**
 * Blockly category and block colours use HSV with fixed saturation and value.
 * Only hue (0–360) varies so the palette stays consistent across the project.
 */
import * as Blockly from "blockly";

/** Blockly default block palette saturation (0–1). */
export const CATEGORY_COLOUR_SATURATION =
  Blockly.utils.colour.getHsvSaturation();

/** Blockly default block palette value/brightness (0–1). */
export const CATEGORY_COLOUR_VALUE = Blockly.utils.colour.getHsvValue();

/** Hue angle for category/block colours (Blockly HSV palette). */
export type CategoryHue = number;

/** Normalize hue to 0–360. */
export function categoryHue(hue: number): CategoryHue {
  const rounded = Math.round(hue);
  return ((rounded % 360) + 360) % 360;
}

/** Toolbox JSON expects hue as a string. */
export function categoryHueToToolboxColour(hue: CategoryHue): string {
  return String(categoryHue(hue));
}

/**
 * Derive hue from legacy #RRGGBB hex (RGB hue, not exact Blockly palette match).
 * Use when migrating old hex category colours.
 */
export function hexToCategoryHue(hex: string): CategoryHue {
  const rgb = Blockly.utils.colour.hexToRgb(hex);
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  if (delta === 0) {
    return 0;
  }

  let h = 0;
  switch (max) {
    case r:
      h = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
      break;
    case g:
      h = ((b - r) / delta + 2) / 6;
      break;
    default:
      h = ((r - g) / delta + 4) / 6;
      break;
  }

  return categoryHue(h * 360);
}
