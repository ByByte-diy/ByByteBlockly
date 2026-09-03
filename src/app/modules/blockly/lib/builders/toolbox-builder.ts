import { BlockDefinition, BlockLevelE } from "../../types/block.types";
import {
  IToolboxDefinition,
  IToolboxCategory,
  IToolboxBlock,
  BoardType,
  ToolboxOptions,
  ToolboxKindE,
  BlockKindE,
  CategoryKindE,
  IToolboxCategoryConfig,
} from "../../types/toolbox.types";
import { BlockRegistry } from "../registry/block-registry";
import { getCategoryIconCssClass, getCategoryIconFile } from "../../constants/category-icons.const";
import { categoryHueToToolboxColour } from "../../constants/category-colour.const";
import { CATEGORY_PALETTE } from "../../constants/category-palette.const";
import { isElectron } from "@app/platform/platform";

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
      userLevel: BlockLevelE.ADVANCED,
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
    return ToolboxBuilder.fromRegistry({ ...options, boardType, boardId });
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
    if (boardId.includes("mrtx") || boardId.includes("uno_mrtx")) {
      return "arduino";
    }
    return "arduino";
  }

  /**
   * Build the toolbox
   */
  build(): IToolboxDefinition {
    this.blocks = this.collectFilteredBlocks();
    const categories = this._pruneEmptyCategories(this.buildCategories());

    return {
      kind: ToolboxKindE.CategoryToolbox,
      contents: categories,
    };
  }

  /**
   * Collect blocks visible for the current board / level / exclusions
   */
  private collectFilteredBlocks(): BlockDefinition[] {
    let blocks = BlockRegistry.getAll();

    if (this.options.boardId) {
      blocks = BlockRegistry.getFiltered({ board: this.options.boardId });
    }

    blocks = this.filterBlocksByBoardType(blocks);

    if (this.options.excludeCategories?.length) {
      const excluded = new Set(this.options.excludeCategories);
      blocks = blocks.filter(
        (block) => !excluded.has(block.config.category)
      );
    }

    const userLevel = this.resolveUserLevel();
    blocks = blocks.filter((block) => block.level <= userLevel);

    return blocks.filter(
      (block) =>
        block.category !== "Mutator" &&
        block.category !== "Shadow" &&
        !block.config.tags?.includes("hidden")
    );
  }

  /**
   * Resolve the maximum visible difficulty level from options.
   */
  private resolveUserLevel(): BlockLevelE {
    return this.options.userLevel ?? BlockLevelE.ADVANCED;
  }

  /**
   * Filter blocks by board type
   */
  private filterBlocksByBoardType(
    blocks: BlockDefinition[]
  ): BlockDefinition[] {
    return blocks.filter((block) => {
      if (block.metadata?.requiredBoardTypes) {
        return block.metadata.requiredBoardTypes.includes(
          this.options.boardType
        );
      }

      if (block.category.toLowerCase().includes("esp")) {
        return this.options.boardType.includes("esp");
      }

      return true;
    });
  }

  /**
   * Whether a toolbox category should appear for the current board / app platform
   */
  private _isCategoryVisible(config: IToolboxCategoryConfig): boolean {
    if (this.options.excludeCategories?.includes(config.name)) {
      return false;
    }

    if (
      config.requiredBoardTypes?.length &&
      !config.requiredBoardTypes.includes(this.options.boardType)
    ) {
      return false;
    }

    if (config.requiredBoardIds?.length) {
      if (
        !this.options.boardId ||
        !config.requiredBoardIds.includes(this.options.boardId)
      ) {
        return false;
      }
    }

    if (config.hiddenBoardIds?.length && this.options.boardId) {
      if (config.hiddenBoardIds.includes(this.options.boardId)) {
        return false;
      }
    }

    if (config.requiredPlatform && config.requiredPlatform !== "both") {
      const appPlatform = isElectron() ? "electron" : "web";
      if (config.requiredPlatform !== appPlatform) {
        return false;
      }
    }

    const userLevel = this.resolveUserLevel();
    if (config.minLevel !== undefined && config.minLevel > userLevel) {
      return false;
    }

    return true;
  }

  /**
   * Remove container categories that have no blocks or visible subcategories
   */
  private _pruneEmptyCategories(
    categories: IToolboxCategory[]
  ): IToolboxCategory[] {
    return categories
      .map((category) => this.pruneCategory(category))
      .filter((category) => this._categoryHasVisibleContent(category));
  }

  private pruneCategory(category: IToolboxCategory): IToolboxCategory {
    if (category.custom) {
      return category;
    }

    const prunedContents = category.contents
      .map((item) =>
        item.kind === CategoryKindE.Category && "name" in item
          ? this.pruneCategory(item as IToolboxCategory)
          : item
      )
      .filter((item) => {
        if (item.kind === CategoryKindE.Category && "name" in item) {
          return this._categoryHasVisibleContent(item as IToolboxCategory);
        }
        return true;
      });

    return { ...category, contents: prunedContents };
  }

  private _categoryHasVisibleContent(category: IToolboxCategory): boolean {
    if (category.custom) {
      return true;
    }

    return category.contents.some((item) => {
      if (item.kind === BlockKindE.Block) {
        return true;
      }
      if (item.kind === CategoryKindE.Category && "name" in item) {
        return this._categoryHasVisibleContent(item as IToolboxCategory);
      }
      return false;
    });
  }

  /**
   * Build categories from blocks
   */
  private buildCategories(): IToolboxCategory[] {
    const groupedBlocks = this.groupBlocksByCategory();
    const categoryNodes = new Map<string, IToolboxCategory>();

    for (const catName of BlockRegistry.getCategories()) {
      // Skip special categories like "Mutator" that shouldn't appear in toolbox
      if (catName === "Mutator") continue;

      const config = BlockRegistry.getCategoryConfig(
        catName
      ) as IToolboxCategoryConfig | undefined;
      if (!config || !this._isCategoryVisible(config)) continue;
      const iconClass = getCategoryIconCssClass(catName);
      const iconFile = getCategoryIconFile(catName);
      const iconProps =
        iconClass && iconFile
          ? {
            id: `cat-icon-${iconFile}`,
            cssconfig: {
              icon: iconClass,
              rowcontentcontainer:
                "blocklyTreeRowContentContainer toolbox-cat-row",
            },
          }
          : {};

      if (config.custom) {
        categoryNodes.set(catName, {
          kind: CategoryKindE.Category,
          name: catName,
          colour: categoryHueToToolboxColour(config.colour ?? 0),
          custom: config.custom,
          contents: [],
          ...iconProps,
        } as IToolboxCategory);
        continue;
      }

      const blocks = groupedBlocks[catName];
      categoryNodes.set(catName, {
        kind: CategoryKindE.Category,
        name: catName,
        colour: categoryHueToToolboxColour(config.colour ?? 0),
        contents: config.isContainer
          ? []
          : blocks?.map((block) => ToolboxBuilder.blockToToolboxBlock(block)) ??
          [],
        ...iconProps,
      } as IToolboxCategory);
    }

    const rootCategories: IToolboxCategory[] = [];

    // Build root categories
    for (const catName of BlockRegistry.getCategories()) {
      const config = BlockRegistry.getCategoryConfig(catName);
      const category = categoryNodes.get(catName);
      if (!config || !category) {
        continue;
      }

      if (config.parentCategory) {
        const parent = categoryNodes.get(config.parentCategory);
        if (parent) {
          parent.contents.push(category);
        }
        continue;
      }

      rootCategories.push(category);
    }

    // Nest categories
    for (const category of categoryNodes.values()) {
      const nested = category.contents.filter(
        (item): item is IToolboxCategory =>
          item.kind === CategoryKindE.Category && "name" in item
      );
      if (nested.length > 1) {
        nested.sort((a, b) => {
          const orderA =
            BlockRegistry.getCategoryConfig(a.name)?.subOrder ?? 50;
          const orderB =
            BlockRegistry.getCategoryConfig(b.name)?.subOrder ?? 50;
          return orderA - orderB;
        });
        let nestedIndex = 0;
        category.contents = category.contents.map((item) =>
          item.kind === CategoryKindE.Category && "name" in item
            ? nested[nestedIndex++]
            : item
        );
      }
    }

    return this.sortCategories(rootCategories);
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
      colour: categoryHueToToolboxColour(CATEGORY_PALETTE.LOGIC),
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
      colour: categoryHueToToolboxColour(CATEGORY_PALETTE.LOOPS),
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
      colour: categoryHueToToolboxColour(CATEGORY_PALETTE.MATH),
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
      colour: categoryHueToToolboxColour(CATEGORY_PALETTE.TEXT),
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
      colour: categoryHueToToolboxColour(CATEGORY_PALETTE.VARIABLES),
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
      const category = block.config.category || block.category || "Other";
      const config = BlockRegistry.getCategoryConfig(
        category
      ) as IToolboxCategoryConfig | undefined;

      // Dynamic categories (e.g. Variables) populate flyout via custom callback
      if (config?.custom) continue;

      if (!map[category]) {
        map[category] = [];
      }
      map[category].push(block);
    }

    // Init blocks (tag: "init") first, then usage blocks — preserve registration order within each group
    for (const blocks of Object.values(map)) {
      blocks.sort((a, b) => {
        const aInit = a.config.tags?.includes("init") ? 0 : 1;
        const bInit = b.config.tags?.includes("init") ? 0 : 1;
        return aInit - bInit;
      });
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
  private static _extractDefaultFields(
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
  private static _extractShadowBlocks(
    toolbox: IToolboxBlock,
    block: BlockDefinition
  ): void {
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
      const metaA = BlockRegistry.getCategoryConfig(a.name);
      const metaB = BlockRegistry.getCategoryConfig(b.name);
      const orderDiff = (metaA?.order ?? 50) - (metaB?.order ?? 50);
      if (orderDiff !== 0) {
        return orderDiff;
      }
      return (metaA?.subOrder ?? 50) - (metaB?.subOrder ?? 50);
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
   * Set maximum visible toolbox difficulty level
   */
  setUserLevel(level: BlockLevelE): this {
    this.options.userLevel = level;
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
