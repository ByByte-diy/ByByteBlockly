import { describe, expect, it } from 'vitest';
import { BlockLevelE } from '../types/block.types';
import { BlockDefinition } from '../types/block.types';
import {
  isBlockVisible,
  isCategoryVisible,
  matchesVisibility,
  resolveBlockVisibilityRules,
} from '../lib/visibility/toolbox-visibility.util';
import { IToolboxCategoryConfig } from '../types/toolbox.types';

const ctx = (boardId: string, boardType: 'arduino' | 'esp32' | 'esp8266' = 'arduino') => ({
  boardId,
  boardType,
  userLevel: BlockLevelE.ADVANCED,
  appPlatform: 'web' as const,
});

const stubBlock = (
  category: string,
  overrides: Partial<BlockDefinition['config']> = {},
): BlockDefinition =>
  ({
    type: 'test_block',
    category,
    config: {
      category,
      type: 'test_block',
      level: BlockLevelE.BEGINNER,
      platforms: ['uno'],
      inputs: [],
      fields: [],
      generators: {},
      ...overrides,
    },
    init: () => undefined,
  }) as BlockDefinition;

describe('toolbox-visibility.util', () => {
  it('matchesVisibility enforces requiredBoardIds', () => {
    expect(
      matchesVisibility({ requiredBoardIds: ['OttoESP'] }, ctx('esp32', 'esp32')),
    ).toBe(false);
    expect(
      matchesVisibility({ requiredBoardIds: ['OttoESP'] }, ctx('OttoESP', 'esp8266')),
    ).toBe(true);
  });

  it('resolveBlockVisibilityRules inherits category requiredBoardIds', () => {
    const category: IToolboxCategoryConfig = {
      name: '%{CAT}',
      colour: 20,
      order: 1,
      requiredBoardIds: ['OttoESP'],
    };
    const rules = resolveBlockVisibilityRules(stubBlock('%{CAT}'), category);
    expect(rules.requiredBoardIds).toEqual(['OttoESP']);
  });

  it('isCategoryVisible gates Escornabot to OttoESP', () => {
    const category: IToolboxCategoryConfig = {
      name: '%{BKY_CAT_ROBOT_ESCORNABOT}',
      colour: 20,
      order: 1,
      requiredBoardIds: ['OttoESP'],
    };
    expect(isCategoryVisible(category, ctx('esp32', 'esp32'))).toBe(false);
    expect(isCategoryVisible(category, ctx('OttoESP', 'esp8266'))).toBe(true);
  });

  it('inherited category rules hide blocks on unsupported boards', () => {
    const category: IToolboxCategoryConfig = {
      name: '%{BKY_CAT_ROBOT_ESCORNABOT}',
      colour: 20,
      order: 1,
      requiredBoardIds: ['OttoESP'],
    };
    const rules = resolveBlockVisibilityRules(stubBlock(category.name), category);
    expect(matchesVisibility(rules, ctx('esp32', 'esp32'))).toBe(false);
    expect(matchesVisibility(rules, ctx('OttoESP', 'esp8266'))).toBe(true);
  });
});
