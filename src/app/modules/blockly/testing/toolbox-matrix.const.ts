import { BlockLevelE } from "../types/block.types";
import { CATEGORY_NAME as LOGIC_CATEGORY } from "../definitions/logic/config";
import { CATEGORY_NAME as PORTS_CATEGORY } from "../definitions/ports/config";
import { CATEGORY_NAME as MOTORS_CATEGORY } from "../definitions/motors/config";
import { CATEGORY_NAME as IOT_CATEGORY } from "../definitions/iot/config";
import { OTTO_CONTAINER_CATEGORY } from "../platforms/otto/config";
import { BYBYTE_CONTAINER_CATEGORY } from "../platforms/bybyte/config";

export interface ToolboxMatrixCase {
  boardId: string;
  userLevel: BlockLevelE;
  mustIncludeCategories: string[];
  mustExcludeCategories: string[];
  minBlockCount?: number;
  mustIncludeBlocks?: string[];
  mustExcludeBlocks?: string[];
  /** Expect Variables / Procedures custom flyouts (INTERMEDIATE+ only). */
  expectCustomCategories?: boolean;
}

const REFERENCE_BOARDS = [
  "uno",
  "esp32",
  "esp8266",
  "OttoESP",
  "Ottoky",
  "bybyte_nano",
  "mrtx",
] as const;

const LEVELS = [
  BlockLevelE.BEGINNER,
  BlockLevelE.INTERMEDIATE,
  BlockLevelE.ADVANCED,
] as const;

interface BoardRules {
  mustIncludeCategories?: string[];
  mustExcludeCategories?: string[];
  levelRules?: Partial<
    Record<BlockLevelE, { mustInclude?: string[]; mustExclude?: string[] }>
  >;
}

const BOARD_RULES: Record<string, BoardRules> = {
  uno: {
    mustIncludeCategories: [OTTO_CONTAINER_CATEGORY],
    levelRules: {
      [BlockLevelE.BEGINNER]: {
        mustInclude: [LOGIC_CATEGORY],
        mustExclude: [PORTS_CATEGORY, MOTORS_CATEGORY],
      },
      [BlockLevelE.ADVANCED]: {
        mustInclude: [PORTS_CATEGORY],
      },
    },
  },
  esp32: {
    mustIncludeCategories: [OTTO_CONTAINER_CATEGORY],
    levelRules: {
      [BlockLevelE.ADVANCED]: {
        mustInclude: [IOT_CATEGORY],
      },
    },
  },
  esp8266: {
    mustIncludeCategories: [OTTO_CONTAINER_CATEGORY],
    levelRules: {
      [BlockLevelE.ADVANCED]: {
        mustInclude: [IOT_CATEGORY],
      },
    },
  },
  OttoESP: {
    mustIncludeCategories: [OTTO_CONTAINER_CATEGORY],
    mustExcludeCategories: [BYBYTE_CONTAINER_CATEGORY],
  },
  Ottoky: {
    mustIncludeCategories: [OTTO_CONTAINER_CATEGORY],
    mustExcludeCategories: [BYBYTE_CONTAINER_CATEGORY],
  },
  bybyte_nano: {
    mustExcludeCategories: [OTTO_CONTAINER_CATEGORY],
  },
  mrtx: {
    mustIncludeCategories: [OTTO_CONTAINER_CATEGORY],
  },
};

function buildMatrix(): ToolboxMatrixCase[] {
  const cases: ToolboxMatrixCase[] = [];

  for (const boardId of REFERENCE_BOARDS) {
    for (const userLevel of LEVELS) {
      const rules = BOARD_RULES[boardId] ?? {};
      const levelRule = rules.levelRules?.[userLevel] ?? {};

      cases.push({
        boardId,
        userLevel,
        mustIncludeCategories: [
          ...(rules.mustIncludeCategories ?? []),
          ...(levelRule.mustInclude ?? []),
        ],
        mustExcludeCategories: [
          ...(rules.mustExcludeCategories ?? []),
          ...(levelRule.mustExclude ?? []),
        ],
        minBlockCount: 5,
        expectCustomCategories: userLevel >= BlockLevelE.INTERMEDIATE,
      });
    }
  }

  return cases;
}

export const TOOLBOX_MATRIX: ToolboxMatrixCase[] = buildMatrix();

export const REFERENCE_BOARD_IDS = REFERENCE_BOARDS;

export const MATRIX_LEVELS = LEVELS;
