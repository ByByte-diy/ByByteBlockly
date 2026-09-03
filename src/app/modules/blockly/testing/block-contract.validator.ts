import { BlockRegistry } from "../lib/registry/block-registry";
import { BlockLevelE } from "../types/block.types";
import { ContractViolation, violation } from "./contract-violation.types";

const INTERNAL_CATEGORIES = new Set(["Mutator", "Shadow"]);
const VALID_LEVELS = new Set([
  BlockLevelE.BEGINNER,
  BlockLevelE.INTERMEDIATE,
  BlockLevelE.ADVANCED,
]);

/**
 * Validate invariants for every registered block definition.
 */
export function validateAllBlocks(): ContractViolation[] {
  const violations: ContractViolation[] = [];
  const seenTypes = new Set<string>();
  const win = window as Window & {
    Blockly?: { Arduino?: { forBlock: Record<string, unknown> } };
  };

  for (const block of BlockRegistry.getAll()) {
    const type = block.type || block.config.type;

    if (seenTypes.has(type)) {
      violations.push(
        violation("DUPLICATE_TYPE", `Duplicate block type "${type}"`, { type })
      );
    }
    seenTypes.add(type);

    const category = block.config.category || block.category;
    if (!INTERNAL_CATEGORIES.has(category)) {
      if (!BlockRegistry.getCategoryConfig(category)) {
        violations.push(
          violation("MISSING_CATEGORY", `Block "${type}" references unknown category "${category}"`, {
            type,
            category,
          })
        );
      }
    }

    if (!VALID_LEVELS.has(block.config.level)) {
      violations.push(
        violation("INVALID_LEVEL", `Block "${type}" has invalid level ${block.config.level}`, {
          type,
          level: block.config.level,
        })
      );
    }

    if (!block.config.platforms?.length) {
      violations.push(
        violation("EMPTY_PLATFORMS", `Block "${type}" has no platforms`, { type })
      );
    }

    if (block.config.platforms?.includes("arduino")) {
      const generator = win.Blockly?.Arduino?.forBlock?.[type];
      if (typeof generator !== "function") {
        violations.push(
          violation("MISSING_ARDUINO_GENERATOR", `Block "${type}" missing Arduino generator`, {
            type,
          })
        );
      }
    }

    if (typeof block.init !== "function") {
      violations.push(
        violation("INVALID_INIT", `Block "${type}" init is not callable`, { type })
      );
    }

    const boards = block.config.boards ?? [];
    const excluded = block.config.excludedBoards ?? [];
    const overlap = boards.filter((id) => excluded.includes(id));
    if (overlap.length) {
      violations.push(
        violation("BOARD_FILTER_CONFLICT", `Block "${type}" boards overlap excludedBoards`, {
          type,
          overlap,
        })
      );
    }

    if (block.config.tags?.includes("hidden")) {
      if (!INTERNAL_CATEGORIES.has(category)) {
        violations.push(
          violation("HIDDEN_BLOCK_CATEGORY", `Hidden block "${type}" must use Mutator or Shadow category`, {
            type,
            category,
          })
        );
      }
    }
  }

  return violations;
}
