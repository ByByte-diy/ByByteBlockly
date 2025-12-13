import {
  BlockDefinition,
  PlatformT,
  BlockLevelE,
} from "../../types/block.types";
import {
  IToolboxDefinition,
  IToolboxCategory,
  IToolboxBlock,
  BoardType,
  ToolboxOptions,
  IToolboxCategoryMetadata,
  ToolboxKindE,
  BlockKindE,
  CategoryKindE,
} from "../../types/toolbox.types";
import { BlockRegistry } from "../registry/block-registry";
import { BLOCK_COLORS } from "../../constants/blockly.constants";

/**
 * Builder for creating Blockly toolbox configurations
 * Uses Strategy Pattern for different board types
 */
export class ToolboxBuilder {
  private options: ToolboxOptions;
  private blocks: BlockDefinition[] = [];

  constructor(options: Partial<ToolboxOptions> = {}) {
    this.options = {
      boardType: "arduino",
      includeStandardBlocks: true,
      includeAdvancedBlocks: false,
      customCategories: [],
      excludeCategories: [],
      ...options,
    };
  }

  /**
   * Build toolbox from BlockRegistry
   */
  static fromRegistry(
    options: Partial<ToolboxOptions> = {}
  ): IToolboxDefinition {
    const builder = new ToolboxBuilder(options);
    return builder.build();
  }

  /**
   * Build toolbox for specific board
   */
  static forBoard(
    boardId: string,
    options: Partial<ToolboxOptions> = {}
  ): IToolboxDefinition {
    const boardType = ToolboxBuilder.detectBoardType(boardId);
    return ToolboxBuilder.fromRegistry({ ...options, boardType });
  }

  /**
   * Detect board type from board ID
   */
  private static detectBoardType(boardId: string): BoardType {
    if (
      boardId.includes("esp32") ||
      boardId.includes("Ottoky") ||
      boardId.includes("MRTnode")
    ) {
      return "esp32";
    }
    if (
      boardId.includes("esp8266") ||
      boardId.includes("wemos") ||
      boardId.includes("OttoESP")
    ) {
      return "esp8266";
    }
    if (boardId.includes("microbit")) {
      return "microbit";
    }
    if (boardId.includes("pyboard")) {
      return "python";
    }
    return "arduino";
  }

  /**
   * Build the toolbox
   */
  build(): IToolboxDefinition {
    // Get all registered blocks
    this.blocks = BlockRegistry.getAll();

    // Filter blocks by board type
    this.blocks = this.filterBlocksByBoardType(this.blocks);

    // Filter by level if needed
    if (!this.options.includeAdvancedBlocks) {
      this.blocks = this.blocks.filter(
        (b: BlockDefinition) =>
          b.level === BlockLevelE.BEGINNER ||
          b.level === BlockLevelE.INTERMEDIATE
      );
    }

    // Build categories
    const categories = this.buildCategories();

    return {
      kind: ToolboxKindE.CategoryToolbox,
      contents: categories,
    };
  }

  /**
   * Filter blocks by board type
   */
  private filterBlocksByBoardType(
    blocks: BlockDefinition[]
  ): BlockDefinition[] {
    return blocks.filter((block) => {
      // Check if block is compatible with board type
      if (block.metadata?.requiredBoardTypes) {
        return block.metadata.requiredBoardTypes.includes(
          this.options.boardType
        );
      }

      // Default: Arduino blocks work on all boards, ESP blocks only on ESP
      if (block.category.toLowerCase().includes("esp")) {
        return this.options.boardType.includes("esp");
      }

      return true; // Generic blocks work everywhere
    });
  }

  /**
   * Build categories from blocks
   */
  private buildCategories(): IToolboxCategory[] {
    const categories: IToolboxCategory[] = [];
    const catRegistered = BlockRegistry.getCategories();

    // Add standard Blockly categories
    if (this.options.includeStandardBlocks) {
      categories.push(...this.buildStandardCategories());
    }

    // Group blocks by category
    const groupedBlocks = this.groupBlocksByCategory();
    for (const catName of catRegistered) {
      // Skip special categories like "Mutator" that shouldn't appear in toolbox
      if (catName === "Mutator") continue;
      
      const blocks = groupedBlocks[catName];
      const meta = BlockRegistry.getCategoryMetadata(catName);
      categories.push({
        kind: CategoryKindE.Category,
        name: catName,
        colour: meta?.colour ?? "0",
        contents: blocks.map((block) =>
          ToolboxBuilder.blockToToolboxBlock(block)
        ),
      } as IToolboxCategory);
    }

    // Sort categories by order
    return this.sortCategories(categories);
  }

  /**
   * Build standard Blockly categories (Logic, Loops, Math, etc.)
   */
  private buildStandardCategories(): IToolboxCategory[] {
    const categories: IToolboxCategory[] = [];

    // Logic category
    categories.push({
      kind: CategoryKindE.Category,
      name: "Logic",
      colour: "210",
      contents: [
        // { kind: BlockKindE.Block, type: "controls_if" },
        {
          kind: BlockKindE.Block,
          type: "logic_compare",
          inputs: {
            B: {
              shadow: {
                type: "math_number",
                fields: { NUM: 10 },
              },
            },
          },
        },
        { kind: BlockKindE.Block, type: "logic_operation" },
        { kind: BlockKindE.Block, type: "logic_negate" },
        { kind: BlockKindE.Block, type: "logic_boolean" },
        { kind: BlockKindE.Block, type: "logic_null" },
        { kind: BlockKindE.Block, type: "logic_ternary" },
      ],
    });

    // Loops category
    categories.push({
      kind: CategoryKindE.Category,
      name: "Loops",
      colour: "120",
      contents: [
        {
          kind: BlockKindE.Block,
          type: "controls_repeat_ext",
          inputs: {
            TIMES: {
              shadow: {
                type: "math_number",
                fields: { NUM: 2 },
              },
            },
          },
        },
        { kind: BlockKindE.Block, type: "controls_whileUntil" },
        {
          kind: BlockKindE.Block,
          type: "controls_for",
          inputs: {
            FROM: {
              shadow: {
                type: "math_number",
                fields: { NUM: 0 },
              },
            },
            TO: {
              shadow: {
                type: "math_number",
                fields: { NUM: 5 },
              },
            },
            BY: {
              shadow: {
                type: "math_number",
                fields: { NUM: 1 },
              },
            },
          },
        },
        { kind: BlockKindE.Block, type: "controls_forEach" },
        { kind: BlockKindE.Block, type: "controls_flow_statements" },
      ],
    });

    // Math category
    categories.push({
      kind: CategoryKindE.Category,
      name: "Math",
      colour: "230",
      contents: [
        { kind: BlockKindE.Block, type: "math_number" },
        { kind: BlockKindE.Block, type: "math_arithmetic" },
        { kind: BlockKindE.Block, type: "math_single" },
        { kind: BlockKindE.Block, type: "math_trig" },
        { kind: BlockKindE.Block, type: "math_constant" },
        { kind: BlockKindE.Block, type: "math_number_property" },
        { kind: BlockKindE.Block, type: "math_round" },
        { kind: BlockKindE.Block, type: "math_modulo" },
        { kind: BlockKindE.Block, type: "math_constrain" },
        { kind: BlockKindE.Block, type: "math_random_int" },
        { kind: BlockKindE.Block, type: "math_random_float" },
      ],
    });

    // Text category
    categories.push({
      kind: CategoryKindE.Category,
      name: "Text",
      colour: "160",
      contents: [
        { kind: BlockKindE.Block, type: "text" },
        { kind: BlockKindE.Block, type: "text_join" },
        { kind: BlockKindE.Block, type: "text_append" },
        { kind: BlockKindE.Block, type: "text_length" },
        { kind: BlockKindE.Block, type: "text_isEmpty" },
        { kind: BlockKindE.Block, type: "text_indexOf" },
        { kind: BlockKindE.Block, type: "text_charAt" },
        { kind: BlockKindE.Block, type: "text_getSubstring" },
        { kind: BlockKindE.Block, type: "text_changeCase" },
        { kind: BlockKindE.Block, type: "text_trim" },
      ],
    });

    // Variables category
    categories.push({
      kind: CategoryKindE.Category,
      name: "Variables",
      colour: "330",
      contents: [
        { kind: BlockKindE.Block, type: "variables_get" },
        { kind: BlockKindE.Block, type: "variables_set" },
        { kind: BlockKindE.Block, type: "math_change" },
      ],
    });

    return categories;
  }

  /**
   * Group blocks by category
   */
  private groupBlocksByCategory(): Record<string, BlockDefinition[]> {
    const map: Record<string, BlockDefinition[]> = {};

    for (const block of this.blocks) {
      const category = block.category || "Other";
      if (!map[category]) {
        map[category] = [];
      }
      map[category].push(block);
    }

    return map;
  }

  /**
   * Convert BlockDefinition to ToolboxBlock
   */
  static blockToToolboxBlock(block: BlockDefinition): IToolboxBlock {
    const toolboxBlock: IToolboxBlock = {
      kind: BlockKindE.Block,
      type: block.type,
    };

    this._extractDefaultFields(toolboxBlock, block);
    this._extractShadowBlocks(toolboxBlock, block);
    return toolboxBlock;
  }

  /**
   * Extract default field values from block
   */
  private static  _extractDefaultFields(
    toolbox: IToolboxBlock,
    block: BlockDefinition
  ): void {
    if (block.config.fields && block.config.fields.length > 0) {
      const fields: Record<string, any> = {};
      for (const field of block.config.fields) {
        if (field.value !== undefined) {
          fields[field.name] = field.value;
        }
      }
      if (Object.keys(fields).length > 0) {
        toolbox.fields = fields;
      }
    }
  }

  /**
   * Extract shadow blocks from inputs
   */
  private static _extractShadowBlocks(toolbox: IToolboxBlock, block: BlockDefinition): void {
    if (block.config.inputs && block.config.inputs.length > 0) {
      const inputs: Record<string, any> = {};
      for (const input of block.config.inputs) {
        if (input.type === "value" && input.shadow) {
          // Create shadow block structure (Blockly JSON format doesn't use 'kind' for shadow blocks)
          const shadowBlock: any = {
            type: input.shadow.type,
          };

          // Add fields to shadow block if present
          if (
            input.shadow.fields &&
            Object.keys(input.shadow.fields).length > 0
          ) {
            shadowBlock.fields = input.shadow.fields;
          }

          // Add shadow block to input
          inputs[input.name] = {
            shadow: shadowBlock,
          };
        }
      }
      if (Object.keys(inputs).length > 0) {
        toolbox.inputs = inputs;
      }
    }
  }

  /**
   * Sort categories by order
   */
  private sortCategories(categories: IToolboxCategory[]): IToolboxCategory[] {
    return categories.sort((a, b) => {
      const metaA = BlockRegistry.getCategoryMetadata(a.name);
      const metaB = BlockRegistry.getCategoryMetadata(b.name);
      return (metaA?.order ?? 50) - (metaB?.order ?? 50);
    });
  }

  /**
   * Add custom category
   */
  addCategory(category: IToolboxCategory): this {
    // This method can be used for custom extensions
    return this;
  }

  /**
   * Set board type
   */
  setBoardType(boardType: BoardType): this {
    this.options.boardType = boardType;
    return this;
  }

  /**
   * Include advanced blocks
   */
  includeAdvanced(include: boolean = true): this {
    this.options.includeAdvancedBlocks = include;
    return this;
  }

  /**
   * Exclude specific categories
   */
  excludeCategories(categories: string[]): this {
    this.options.excludeCategories = categories;
    return this;
  }
}
