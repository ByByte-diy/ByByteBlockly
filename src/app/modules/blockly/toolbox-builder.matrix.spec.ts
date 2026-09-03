import { describe, beforeAll, it, expect } from "vitest";
import { ToolboxBuilder } from "./lib/builders/toolbox-builder";
import { setupBlocklyTestEnv } from "./testing/blockly-test-harness";
import { TOOLBOX_MATRIX } from "./testing/toolbox-matrix.const";
import {
  collectBlockTypes,
  collectCategoryNames,
  collectCustomCategories,
  findEmptyCategories,
  findOrphanToolboxBlocks,
} from "./testing/toolbox-test.helper";

describe("ToolboxBuilder matrix", () => {
  beforeAll(() => {
    setupBlocklyTestEnv();
  });

  describe.each(TOOLBOX_MATRIX)(
    "$boardId @ level $userLevel",
    (matrixCase) => {
      const toolbox = () =>
        ToolboxBuilder.forBoard(matrixCase.boardId, {
          userLevel: matrixCase.userLevel,
        });

      it("includes expected categories", () => {
        const categories = collectCategoryNames(toolbox());
        for (const name of matrixCase.mustIncludeCategories) {
          expect(categories).toContain(name);
        }
      });

      it("excludes gated categories", () => {
        const categories = collectCategoryNames(toolbox());
        for (const name of matrixCase.mustExcludeCategories) {
          expect(categories).not.toContain(name);
        }
      });

      it("has a non-empty toolbox", () => {
        const tb = toolbox();
        expect(tb.contents.length).toBeGreaterThan(0);
        if (matrixCase.minBlockCount) {
          expect(collectBlockTypes(tb).length).toBeGreaterThanOrEqual(
            matrixCase.minBlockCount
          );
        }
      });

      it("has no empty non-custom categories", () => {
        expect(findEmptyCategories(toolbox())).toEqual([]);
      });

      it("has no orphan toolbox blocks", () => {
        expect(findOrphanToolboxBlocks(toolbox())).toEqual([]);
      });

      it("does not expose internal categories", () => {
        const categories = collectCategoryNames(toolbox());
        expect(categories).not.toContain("Mutator");
        expect(categories).not.toContain("Shadow");
      });

      it("includes dynamic Variables and Procedures categories", () => {
        if (!matrixCase.expectCustomCategories) {
          return;
        }
        const custom = collectCustomCategories(toolbox());
        const customTypes = custom.map((entry) => entry.custom);
        expect(customTypes).toContain("VARIABLE");
        expect(customTypes).toContain("PROCEDURE");
      });
    }
  );
});
