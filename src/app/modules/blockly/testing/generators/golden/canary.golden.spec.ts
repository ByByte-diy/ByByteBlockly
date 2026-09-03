import * as Blockly from "blockly";
import {
  attachNumberShadow,
  createGoldenBlock,
  generateBlockCode,
} from "../golden-workspace.factory";
import { describe, it, expect } from "vitest";

describe("Arduino generator golden (canary blocks)", () => {
  it("controls_if with true condition", () => {
    const ctx = createGoldenBlock("controls_if", (block, workspace) => {
      const condition = workspace.newBlock("logic_boolean");
      condition.setFieldValue("TRUE", "BOOL");
      block.getInput("IF0")?.connection?.connect(condition.outputConnection);
    });

    expect(generateBlockCode(ctx)).toMatchSnapshot();
  });

  it("text_join with two numeric parts", () => {
    const ctx = createGoldenBlock("text_join", (block, workspace) => {
      const joinBlock = block as Blockly.Block & {
        itemCount_?: number;
        updateShape_?: () => void;
      };
      joinBlock.itemCount_ = 2;
      joinBlock.updateShape_?.();
      attachNumberShadow(workspace, block, "ADD0", 1);
      attachNumberShadow(workspace, block, "ADD1", 2);
    });

    const code = generateBlockCode(ctx);
    expect(Array.isArray(code) ? code[0] : code).toMatchSnapshot();
  });

  it("otto_move forward at default speed", () => {
    const ctx = createGoldenBlock("otto_move", (block) => {
      block.setFieldValue("FORWARD", "otto_move_sens");
    });

    expect(generateBlockCode(ctx)).toMatchSnapshot();
  });

  it("paragraph HTML block with empty content", () => {
    const ctx = createGoldenBlock("paragraph");

    expect(generateBlockCode(ctx)).toMatchSnapshot();
  });

  it("controls_switch with one case", () => {
    const ctx = createGoldenBlock("controls_switch", (block, workspace) => {
      attachNumberShadow(workspace, block, "CASE0", 1);
    });

    expect(generateBlockCode(ctx)).toMatch(
      /^switch \(.+\) \{\n  case 1:\n    break;\n\}\n$/
    );
  });

  it("procedures_defnoreturn empty body", () => {
    const ctx = createGoldenBlock("procedures_defnoreturn", (block) => {
      block.setFieldValue("doSomething", "NAME");
    });

    expect(generateBlockCode(ctx)).toMatchSnapshot();
  });
});
