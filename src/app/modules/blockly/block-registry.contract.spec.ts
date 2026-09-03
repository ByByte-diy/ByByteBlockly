import { setupBlocklyTestEnv } from "./testing/blockly-test-harness";
import { validateAllBlocks } from "./testing/block-contract.validator";
import { validateAllCategories } from "./testing/category-contract.validator";
import { beforeAll, describe, expect, it } from "vitest";

describe("BlockRegistry contract", () => {
  beforeAll(() => {
    setupBlocklyTestEnv();
  });

  it("blocks satisfy invariants", () => {
    const violations = validateAllBlocks();
    expect(violations).toEqual([]);
  });

  it("categories satisfy invariants", () => {
    const violations = validateAllCategories();
    expect(violations).toEqual([]);
  });
});
