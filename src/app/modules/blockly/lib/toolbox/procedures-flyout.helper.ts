import * as Blockly from "blockly";
import type { WorkspaceSvg } from "blockly/core/workspace_svg";

/** Bind Blockly's built-in procedure flyout to the workspace toolbox. */
export function registerProceduresFlyoutOnWorkspace(
  workspace: WorkspaceSvg
): void {
  workspace.registerToolboxCategoryCallback(
    "PROCEDURE",
    Blockly.Procedures.flyoutCategory
  );
}
