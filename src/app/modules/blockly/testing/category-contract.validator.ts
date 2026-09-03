import { BlockRegistry } from "../lib/registry/block-registry";
import { CATEGORY_PALETTE } from "../constants/category-palette.const";
import { BYBYTE_CONTAINER_CATEGORY } from "../platforms/bybyte/config";
import { ContractViolation, violation } from "./contract-violation.types";

/** Platform containers registered before blocks land (migration placeholders). */
const KNOWN_EMPTY_CONTAINERS = new Set<string>([BYBYTE_CONTAINER_CATEGORY]);

const PALETTE_HUES = new Set<number>(Object.values(CATEGORY_PALETTE));

function isValidHue(colour: number | undefined): boolean {
  if (colour === undefined) {
    return false;
  }
  if (PALETTE_HUES.has(colour)) {
    return true;
  }
  return Number.isFinite(colour) && colour >= 0 && colour <= 360;
}

/**
 * Validate invariants for every registered toolbox category.
 */
export function validateAllCategories(): ContractViolation[] {
  const violations: ContractViolation[] = [];
  const names = BlockRegistry.getCategories();
  const nameSet = new Set(names);

  for (const name of names) {
    const config = BlockRegistry.getCategoryConfig(name);
    if (!config) {
      violations.push(
        violation("MISSING_CONFIG", `Category "${name}" has no config`, { name })
      );
      continue;
    }

    if (!isValidHue(config.colour)) {
      violations.push(
        violation("INVALID_COLOUR", `Category "${name}" has invalid colour ${config.colour}`, {
          name,
          colour: config.colour,
        })
      );
    }

    if (config.parentCategory && !nameSet.has(config.parentCategory)) {
      violations.push(
        violation("MISSING_PARENT", `Category "${name}" parent "${config.parentCategory}" not found`, {
          name,
          parentCategory: config.parentCategory,
        })
      );
    }
  }

  violations.push(...detectCategoryCycles(names));

  for (const name of names) {
    const config = BlockRegistry.getCategoryConfig(name);
    if (!config?.isContainer) {
      continue;
    }

    const children = names.filter(
      (child) => BlockRegistry.getCategoryConfig(child)?.parentCategory === name
    );
    const directBlocks = BlockRegistry.getByCategory(name).length;
    if (!children.length && !directBlocks && !KNOWN_EMPTY_CONTAINERS.has(name)) {
      violations.push(
        violation("EMPTY_CONTAINER", `Container category "${name}" has no child categories`, {
          name,
        })
      );
    }
  }

  return violations;
}

function detectCategoryCycles(names: string[]): ContractViolation[] {
  const violations: ContractViolation[] = [];

  for (const start of names) {
    const visited = new Set<string>();
    let current: string | undefined = start;

    while (current) {
      const config = BlockRegistry.getCategoryConfig(current);
      const parent = config?.parentCategory;
      if (!parent) {
        break;
      }
      if (visited.has(parent)) {
        violations.push(
          violation("CATEGORY_CYCLE", `Category cycle detected at "${parent}"`, {
            start,
            parent,
          })
        );
        break;
      }
      visited.add(parent);
      current = parent;
    }
  }

  return violations;
}
