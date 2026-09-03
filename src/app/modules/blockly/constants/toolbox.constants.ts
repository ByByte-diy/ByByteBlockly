/**
 * Blockly Toolbox configurations
 */

import { ToolboxDefinition } from "blockly/core/utils/toolbox";
import { BlockRegistry } from "../lib/registry/block-registry";
import { CATEGORY_PALETTE } from "../constants/category-palette.const";
import { categoryHueToToolboxColour } from "../constants/category-colour.const";

/**
 * Fallback toolbox when registry is empty
 * Used before BlockRegistry is initialized
 */
const FALLBACK_TOOLBOX = {
  kind: 'categoryToolbox' as const,
  contents: [
    {
      kind: 'category' as const,
      name: "Arduino",
      colour: categoryHueToToolboxColour(CATEGORY_PALETTE.GENERIC),
      contents: []
    },
    {
      kind: 'category' as const,
      name: "Logic",
      colour: categoryHueToToolboxColour(CATEGORY_PALETTE.LOGIC),
      contents: [
        { kind: 'block' as const, type: "controls_if" },
        { kind: 'block' as const, type: "logic_compare" },
      ],
    },
    {
      kind: 'category' as const,
      name: "Loops",
      colour: categoryHueToToolboxColour(CATEGORY_PALETTE.LOOPS),
      contents: [
        { kind: 'block' as const, type: "controls_repeat_ext" },
        { kind: 'block' as const, type: "controls_whileUntil" },
      ],
    },
    {
      kind: 'category' as const,
      name: "Math",
      colour: categoryHueToToolboxColour(CATEGORY_PALETTE.MATH),
      contents: [
        { kind: 'block' as const, type: "math_number" },
        { kind: 'block' as const, type: "math_arithmetic" },
      ],
    },
  ],
} as ToolboxDefinition;

/**
 * Helper function to get a category name with proper display text
 */
function getCategoryDisplayName(category: string): string {
  const nameMap: Record<string, string> = {
    'Generic': 'Generic',
    'Base': 'Program',
    'I/O': 'Input/Output',
  };
  return nameMap[category] || category;
}

/**
 * Generate toolbox dynamically from BlockRegistry
 */
export function getDefaultToolbox(): ToolboxDefinition {
  if (!BlockRegistry.isInitialized()) {
    return FALLBACK_TOOLBOX;
  }

  const allBlocks = BlockRegistry.getAll();
  const categoryMap = new Map<string, typeof allBlocks>();

  allBlocks.forEach((block) => {
    const category = block.category || 'Other';
    if (!categoryMap.has(category)) {
      categoryMap.set(category, []);
    }
    categoryMap.get(category)!.push(block);
  });

  const contents: any[] = Array.from(categoryMap.entries()).map(([categoryName, categoryBlocks]) => {
    return {
      kind: 'category' as const,
      name: categoryName,
      colour: categoryHueToToolboxColour(
        BlockRegistry.get(categoryName)?.config.color ?? CATEGORY_PALETTE.GENERIC
      ),
      contents: categoryBlocks.map((block) => ({
        kind: 'block' as const,
        type: block.config.type,
      })),
    };
  });

  // Add standard Blockly categories (Logic, Loops, Math)
  contents.push(
    {
      kind: 'category' as const,
      name: "Logic",
      colour: categoryHueToToolboxColour(CATEGORY_PALETTE.LOGIC),
      contents: [
        { kind: 'block' as const, type: "controls_if" },
        { kind: 'block' as const, type: "logic_compare" },
        { kind: 'block' as const, type: "logic_operation" },
        { kind: 'block' as const, type: "logic_negate" },
      ],
    },
    {
      kind: 'category' as const,
      name: "Loops",
      colour: categoryHueToToolboxColour(CATEGORY_PALETTE.LOOPS),
      contents: [
        { kind: 'block' as const, type: "controls_repeat_ext" },
        { kind: 'block' as const, type: "controls_whileUntil" },
        { kind: 'block' as const, type: "controls_for" },
      ],
    },
    {
      kind: 'category' as const,
      name: "Math",
      colour: categoryHueToToolboxColour(CATEGORY_PALETTE.MATH),
      contents: [
        { kind: 'block' as const, type: "math_number" },
        { kind: 'block' as const, type: "math_arithmetic" },
        { kind: 'block' as const, type: "math_single" },
      ],
    },
    {
      kind: 'category' as const,
      name: "Variables",
      colour: categoryHueToToolboxColour(CATEGORY_PALETTE.VARIABLES),
      contents: [],
      custom: "VARIABLE"
    } as any
  );

  return {
    kind: 'categoryToolbox' as const,
    contents
  } as ToolboxDefinition;
}

/**
 * Default toolbox (for export)
 * This is evaluated at module load time, but getDefaultToolbox() handles empty registry
 */
export const DEFAULT_TOOLBOX = FALLBACK_TOOLBOX;

/**
 * Minimal toolbox (only essential Arduino blocks)
 */
export const MINIMAL_TOOLBOX = {
  kind: 'categoryToolbox' as const,
  contents: [
    {
      kind: 'category' as const,
      name: 'Arduino',
      colour: categoryHueToToolboxColour(CATEGORY_PALETTE.GENERIC),
      contents: [
        { kind: 'block' as const, type: 'base_setup_loop' },
        { kind: 'block' as const, type: 'base_code' }
      ]
    }
  ]
} as ToolboxDefinition;

/**
 * Empty flyout toolbox (no categories)
 */
export const EMPTY_FLYOUT_TOOLBOX = {
  kind: 'flyoutToolbox' as const,
  contents: []
} as ToolboxDefinition;
