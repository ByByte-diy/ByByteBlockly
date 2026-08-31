import * as Blockly from "blockly";
import type { FlyoutItemInfo } from "blockly/core/utils/toolbox";
import type { IVariableModel, IVariableState } from "blockly/core/interfaces/i_variable_model";
import type { WorkspaceSvg } from "blockly/core/workspace_svg";
import {
  dropdownValueForArduinoType,
  pickPreferredVariable,
  cleanupUnusedAutoVariables,
  registerVariableFieldBinding,
  normalizeVariableTypes,
} from "../variables/variable-type.helper";

const CREATE_VARIABLE_KEY = "CREATE_VARIABLE";

/** Resolve whether current board targets Arduino/C++ (not MicroPython). */
export function isArduinoProgram(): boolean {
  const boardId =
    localStorage.getItem("selectedBoard") ||
    localStorage.getItem("card") ||
    "uno";
  const profileProg = (window as { profile?: Record<string, { prog?: string }> })
    .profile?.[boardId]?.prog;
  if (profileProg) {
    return profileProg !== "python";
  }
  return localStorage.getItem("prog") !== "python";
}

/** Keep legacy localStorage prog aligned with the selected board profile. */
export function syncProgramLanguageFromBoard(boardId: string): void {
  const profileProg = (window as { profile?: Record<string, { prog?: string }> })
    .profile?.[boardId]?.prog;
  if (profileProg) {
    localStorage.setItem("prog", profileProg);
  }
}

type VariableFlyoutBlockExtra = {
  fields?: Record<string, unknown>;
  inputs?: Record<string, unknown>;
  gap?: number;
};

function sortVariables(
  variables: IVariableModel<IVariableState>[]
): IVariableModel<IVariableState>[] {
  return [...variables].sort((a, b) =>
    a.getName().localeCompare(b.getName(), undefined, { sensitivity: "base" })
  );
}

function variableFields(
  variable: IVariableModel<IVariableState>
): Record<string, { id: string; name: string }> {
  return {
    VAR: {
      id: variable.getId(),
      name: variable.getName(),
    },
  };
}

function addBlockForVariable(
  flyout: FlyoutItemInfo[],
  type: string,
  variable: IVariableModel<IVariableState>,
  gap?: number,
  extra?: VariableFlyoutBlockExtra
): void {
  if (!Blockly.Blocks[type]) {
    return;
  }

  const { fields: extraFields, inputs, ...rest } = extra ?? {};

  flyout.push({
    kind: "block",
    type,
    gap,
    fields: {
      ...variableFields(variable),
      ...(extraFields as Record<string, unknown> | undefined),
    },
    ...(inputs ? { inputs } : {}),
    ...rest,
  });
}

/**
 * Build flyout contents for the Variables toolbox category.
 * Ported from legacy blocklino.js — create button first, blocks only after variables exist.
 */
export function buildVariablesFlyout(workspace: WorkspaceSvg): FlyoutItemInfo[] {
  cleanupUnusedAutoVariables(workspace);

  workspace.registerButtonCallback(CREATE_VARIABLE_KEY, (button) => {
    Blockly.Variables.createVariableButtonHandler(button.getTargetWorkspace());
  });

  const flyout: FlyoutItemInfo[] = [
    {
      kind: "button",
      text: "%{BKY_NEW_VARIABLE}",
      callbackkey: CREATE_VARIABLE_KEY,
    },
  ];

  const variables = sortVariables(workspace.getVariableMap().getAllVariables());
  if (variables.length === 0) {
    return flyout;
  }

  const isArduino = isArduinoProgram();
  const templateVar =
    pickPreferredVariable(workspace) ?? variables[variables.length - 1];

  if (isArduino) {
    addBlockForVariable(flyout, "variables_set_init", templateVar, 8, {
      fields: {
        TYPE: dropdownValueForArduinoType(templateVar.getType()),
      },
      inputs: {
        VAL: {
          shadow: {
            type: "math_number",
            fields: { NUM: 0 },
          },
        },
      },
    });

    addBlockForVariable(flyout, "variables_set", templateVar, 8, {
      inputs: {
        VAL: {
          shadow: {
            type: "math_number",
            fields: { NUM: 0 },
          },
        },
      },
    });
    addBlockForVariable(flyout, "math_change", templateVar, 8, {
      inputs: {
        DELTA: {
          shadow: {
            type: "math_number",
            fields: { NUM: 1 },
          },
        },
      },
    });
    addBlockForVariable(flyout, "variables_const", templateVar, 8, {
      fields: {
        TYPE: dropdownValueForArduinoType(templateVar.getType()),
      },
      inputs: {
        VAL_CONST: {
          shadow: {
            type: "math_number",
            fields: { NUM: 0 },
          },
        },
      },
    });
    addBlockForVariable(flyout, "base_define_const", templateVar, 16, {
      inputs: {
        TEXT2: {
          shadow: {
            type: "math_number",
            fields: { NUM: 0 },
          },
        },
      },
    });
  } else {
    addBlockForVariable(flyout, "variables_set", templateVar, 8, {
      inputs: {
        VAL: {
          shadow: {
            type: "math_number",
            fields: { NUM: 0 },
          },
        },
      },
    });
    addBlockForVariable(flyout, "math_change", templateVar, 8, {
      inputs: {
        DELTA: {
          shadow: {
            type: "math_number",
            fields: { NUM: 1 },
          },
        },
      },
    });
  }

  for (const variable of variables) {
    addBlockForVariable(
      flyout,
      "variables_get",
      variable,
      Blockly.Blocks["variables_set"] ? 8 : undefined
    );
  }

  return flyout;
}

/**
 * Register ByByte variables flyout before Blockly.inject().
 * Workspace inject registers the current Variables.flyoutCategory reference.
 */
export function registerVariablesFlyout(): void {
  Blockly.Variables.flyoutCategory = buildVariablesFlyout;
}

/**
 * Bind the custom variables flyout to a live workspace (Blockly 13).
 * Call after Blockly.inject() so the toolbox uses our flyout, not the default set/get only list.
 */
export function registerVariablesFlyoutOnWorkspace(
  workspace: WorkspaceSvg
): void {
  normalizeVariableTypes(workspace);
  Blockly.Variables.flyoutCategory = buildVariablesFlyout;
  workspace.registerToolboxCategoryCallback("VARIABLE", buildVariablesFlyout);
  registerVariableFieldBinding(workspace);
}
