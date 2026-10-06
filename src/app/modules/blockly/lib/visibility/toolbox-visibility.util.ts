import { BlockDefinition, BlockLevelE } from '../../types/block.types';
import { BoardType, IToolboxCategoryConfig } from '../../types/toolbox.types';
import { BlockRegistry } from '../registry/block-registry';

/** Runtime context for toolbox block/category visibility. */
export interface ToolboxVisibilityContext {
  boardId?: string;
  boardType: BoardType;
  userLevel: BlockLevelE;
  appPlatform: 'web' | 'electron';
}

/** Normalized board/type gates (category + block). */
export interface VisibilityRules {
  requiredBoardTypes?: BoardType[];
  requiredBoardIds?: string[];
  hiddenBoardIds?: string[];
  requiredPlatform?: 'web' | 'electron' | 'both';
  minLevel?: BlockLevelE;
}

function hasBoardIdRules(rules: VisibilityRules): boolean {
  return Boolean(rules.requiredBoardIds?.length || rules.hiddenBoardIds?.length);
}

function hasBoardTypeRules(rules: VisibilityRules): boolean {
  return Boolean(rules.requiredBoardTypes?.length);
}

export function matchesVisibility(
  rules: VisibilityRules | undefined,
  ctx: ToolboxVisibilityContext,
): boolean {
  if (!rules) {
    return true;
  }

  if (rules.requiredBoardTypes?.length && !rules.requiredBoardTypes.includes(ctx.boardType)) {
    return false;
  }

  if (rules.requiredBoardIds?.length) {
    if (!ctx.boardId || !rules.requiredBoardIds.includes(ctx.boardId)) {
      return false;
    }
  }

  if (rules.hiddenBoardIds?.length && ctx.boardId && rules.hiddenBoardIds.includes(ctx.boardId)) {
    return false;
  }

  if (rules.requiredPlatform && rules.requiredPlatform !== 'both') {
    if (rules.requiredPlatform !== ctx.appPlatform) {
      return false;
    }
  }

  if (rules.minLevel !== undefined && rules.minLevel > ctx.userLevel) {
    return false;
  }

  return true;
}

/** Merge block config/metadata with its toolbox category gates. */
export function resolveBlockVisibilityRules(
  block: BlockDefinition,
  categoryConfig?: IToolboxCategoryConfig,
): VisibilityRules {
  const rules: VisibilityRules = {};

  if (block.config.boards?.length) {
    rules.requiredBoardIds = [...block.config.boards];
  }
  if (block.config.excludedBoards?.length) {
    rules.hiddenBoardIds = [...block.config.excludedBoards];
  }
  if (block.metadata?.requiredBoardTypes?.length) {
    rules.requiredBoardTypes = [...block.metadata.requiredBoardTypes];
  }
  if (block.metadata?.requiredBoardIds?.length) {
    rules.requiredBoardIds = [...block.metadata.requiredBoardIds];
  }
  if (block.metadata?.hiddenBoardIds?.length) {
    rules.hiddenBoardIds = [...block.metadata.hiddenBoardIds];
  }

  if (!rules.requiredBoardIds && categoryConfig?.requiredBoardIds?.length) {
    rules.requiredBoardIds = [...categoryConfig.requiredBoardIds];
  }
  if (!rules.hiddenBoardIds && categoryConfig?.hiddenBoardIds?.length) {
    rules.hiddenBoardIds = [...categoryConfig.hiddenBoardIds];
  }
  if (!rules.requiredBoardTypes && categoryConfig?.requiredBoardTypes?.length) {
    rules.requiredBoardTypes = [...categoryConfig.requiredBoardTypes];
  }

  rules.minLevel =
    block.metadata?.minLevel ??
    block.level ??
    block.config.level ??
    categoryConfig?.minLevel;

  if (categoryConfig?.requiredPlatform) {
    rules.requiredPlatform = categoryConfig.requiredPlatform;
  }

  return rules;
}

export function categoryConfigToVisibilityRules(
  config: IToolboxCategoryConfig,
): VisibilityRules {
  return {
    requiredBoardTypes: config.requiredBoardTypes,
    requiredBoardIds: config.requiredBoardIds,
    hiddenBoardIds: config.hiddenBoardIds,
    requiredPlatform: config.requiredPlatform,
    minLevel: config.minLevel,
  };
}

export function isBlockVisible(
  block: BlockDefinition,
  ctx: ToolboxVisibilityContext,
): boolean {
  const categoryConfig = BlockRegistry.getCategoryConfig(block.config.category || block.category);
  const rules = resolveBlockVisibilityRules(block, categoryConfig);

  if (hasBoardIdRules(rules) || hasBoardTypeRules(rules)) {
    return matchesVisibility(rules, ctx);
  }

  // Legacy heuristic until all ESP-only blocks declare requiredBoardTypes.
  if (block.category.toLowerCase().includes('esp')) {
    return ctx.boardType.includes('esp');
  }

  return matchesVisibility(rules, ctx);
}

export function isCategoryVisible(
  config: IToolboxCategoryConfig,
  ctx: ToolboxVisibilityContext,
): boolean {
  return matchesVisibility(categoryConfigToVisibilityRules(config), ctx);
}
