import {
  IToolboxCategory,
  IToolboxDefinition,
  CategoryKindE,
  BlockKindE,
} from "../types/toolbox.types";
import { BlockRegistry } from "../lib/registry/block-registry";

/** Collect all category names from a toolbox tree (depth-first). */
export function collectCategoryNames(toolbox: IToolboxDefinition): string[] {
  const names: string[] = [];

  function walkCategory(category: IToolboxCategory): void {
    names.push(category.name);
    for (const item of category.contents ?? []) {
      if (item.kind === CategoryKindE.Category && "name" in item) {
        walkCategory(item as IToolboxCategory);
      }
    }
  }

  for (const item of toolbox.contents ?? []) {
    if (item.kind === CategoryKindE.Category && "name" in item) {
      walkCategory(item as IToolboxCategory);
    }
  }

  return names;
}

/** Collect all block types referenced in a toolbox tree. */
export function collectBlockTypes(toolbox: IToolboxDefinition): string[] {
  const types: string[] = [];

  function walkCategory(category: IToolboxCategory): void {
    for (const item of category.contents ?? []) {
      if (item.kind === BlockKindE.Block && "type" in item) {
        types.push(item.type);
      } else if (item.kind === CategoryKindE.Category && "name" in item) {
        walkCategory(item as IToolboxCategory);
      }
    }
  }

  for (const item of toolbox.contents ?? []) {
    if (item.kind === CategoryKindE.Category && "name" in item) {
      walkCategory(item as IToolboxCategory);
    }
  }

  return types;
}

/** Find non-custom categories that have no blocks and no nested categories. */
export function findEmptyCategories(toolbox: IToolboxDefinition): string[] {
  const empty: string[] = [];

  function walkCategory(category: IToolboxCategory): void {
    if (category.custom) {
      return;
    }

    const hasBlock = (category.contents ?? []).some(
      (item) => item.kind === BlockKindE.Block
    );
    const nested = (category.contents ?? []).filter(
      (item) => item.kind === CategoryKindE.Category && "name" in item
    ) as IToolboxCategory[];

    for (const child of nested) {
      walkCategory(child);
    }

    if (!hasBlock && nested.length === 0) {
      empty.push(category.name);
    }
  }

  for (const item of toolbox.contents ?? []) {
    if (item.kind === CategoryKindE.Category && "name" in item) {
      walkCategory(item as IToolboxCategory);
    }
  }

  return empty;
}

/** Return block types in toolbox that are not registered in BlockRegistry. */
export function findOrphanToolboxBlocks(toolbox: IToolboxDefinition): string[] {
  return collectBlockTypes(toolbox).filter((type) => !BlockRegistry.has(type));
}

/** Find custom categories and their custom type (VARIABLE / PROCEDURE). */
export function collectCustomCategories(
  toolbox: IToolboxDefinition
): { name: string; custom: string }[] {
  const result: { name: string; custom: string }[] = [];

  function walkCategory(category: IToolboxCategory): void {
    if (category.custom) {
      result.push({ name: category.name, custom: category.custom });
    }
    for (const item of category.contents ?? []) {
      if (item.kind === CategoryKindE.Category && "name" in item) {
        walkCategory(item as IToolboxCategory);
      }
    }
  }

  for (const item of toolbox.contents ?? []) {
    if (item.kind === CategoryKindE.Category && "name" in item) {
      walkCategory(item as IToolboxCategory);
    }
  }

  return result;
}
