import * as Blockly from "blockly";

/**
 * Re-init SVG and re-render every block in the workspace.
 * Required after JSON reload while Blockly.Events are disabled — nested
 * statement/value blocks otherwise keep broken paths (fields like dropdowns
 * may render while the block body stays invisible).
 */
export function rerenderWorkspaceBlocks(workspace: Blockly.WorkspaceSvg): void {
  const blocks = workspace.getAllBlocks(false);

  for (const block of blocks) {
    const svg = block as Blockly.BlockSvg;
    if (!svg.rendered) {
      svg.initSvg();
    }
  }

  for (const block of blocks) {
    (block as Blockly.BlockSvg).render();
  }

  Blockly.svgResize(workspace);
}

/** Schedule rerender on the next animation frame (after serialization finishes). */
export function scheduleWorkspaceRerender(
  workspace: Blockly.WorkspaceSvg
): void {
  requestAnimationFrame(() => {
    rerenderWorkspaceBlocks(workspace);
  });
}
