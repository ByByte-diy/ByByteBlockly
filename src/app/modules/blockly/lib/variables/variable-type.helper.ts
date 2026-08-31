import * as Blockly from "blockly";
import type { IVariableModel, IVariableState } from "blockly/core/interfaces/i_variable_model";

/** Blockly variable field that accepts any workspace variable type. */
export function createVariableField(defaultVarName = ""): Blockly.FieldVariable {
  return new Blockly.FieldVariable(defaultVarName, undefined, null, "");
}

export const VARIABLE_TYPE_OPTIONS: [string, string][] = [
  ["CHARACTER", "CHARACTER"],
  ["TEXT", "TEXT"],
  ["BOOL", "BOOL"],
  ["BYTE", "BYTE"],
  ["INTEGER", "INTEGER"],
  ["UNUMBER", "UNUMBER"],
  ["LARGE_NUMBER", "LARGE_NUMBER"],
  ["DECIMAL", "DECIMAL"],
];

const AUTO_VARIABLE_NAMES = new Set(["i", "j", "k"]);

const DROPDOWN_TO_ARDUINO: Record<string, string> = {
  CHARACTER: "char",
  TEXT: "String",
  BOOL: "boolean",
  BYTE: "byte",
  INTEGER: "int",
  UNUMBER: "unsigned int",
  LARGE_NUMBER: "long",
  DECIMAL: "float",
};

const ARDUINO_TYPE_TO_DROPDOWN: Record<string, string> = {
  char: "CHARACTER",
  String: "TEXT",
  boolean: "BOOL",
  byte: "BYTE",
  int: "INTEGER",
  "unsigned int": "UNUMBER",
  long: "LARGE_NUMBER",
  float: "DECIMAL",
};

export function pickPreferredVariable(
  workspace: Blockly.Workspace
): IVariableModel<IVariableState> | null {
  const variables = workspace.getVariableMap()?.getAllVariables() ?? [];
  if (variables.length === 0) {
    return null;
  }

  for (let i = variables.length - 1; i >= 0; i--) {
    if (!AUTO_VARIABLE_NAMES.has(variables[i].getName())) {
      return variables[i];
    }
  }

  return variables[variables.length - 1];
}

export function cleanupUnusedAutoVariables(workspace: Blockly.Workspace): void {
  const variableMap = workspace.getVariableMap();
  if (!variableMap) {
    return;
  }

  for (const variable of [...variableMap.getAllVariables()]) {
    if (!AUTO_VARIABLE_NAMES.has(variable.getName())) {
      continue;
    }
    const uses = Blockly.Variables.getVariableUsesById(
      workspace,
      variable.getId()
    );
    if (uses.length === 0) {
      variableMap.deleteVariable(variable);
    }
  }
}

export function bindPreferredVariableField(block: Blockly.Block): void {
  if (!block.workspace || block.isInFlyout || !block.getField("VAR")) {
    return;
  }

  const variableMap = block.workspace.getVariableMap();
  if (!variableMap) {
    return;
  }

  const currentId = block.getFieldValue("VAR");
  if (!currentId) {
    return;
  }

  const current = variableMap.getVariableById(currentId);
  if (current && !AUTO_VARIABLE_NAMES.has(current.getName())) {
    return;
  }

  const preferred = pickPreferredVariable(block.workspace);
  if (!preferred || preferred.getId() === currentId) {
    return;
  }

  block.setFieldValue(preferred.getId(), "VAR");
}

/** Reset legacy Arduino types on Blockly variables — type lives on block TYPE field. */
export function normalizeVariableTypes(workspace: Blockly.Workspace): void {
  const variableMap = workspace.getVariableMap();
  if (!variableMap) return;

  for (const variable of variableMap.getAllVariables()) {
    const type = variable.getType();
    if (type && type !== "") {
      variable.setType("").save();
    }
  }
}

/** Workspace listener: replace auto-created i/j/k after flyout drag. */
export function registerVariableFieldBinding(
  workspace: Blockly.WorkspaceSvg
): void {
  workspace.addChangeListener((event) => {
    if (event.type !== Blockly.Events.BLOCK_CREATE) {
      return;
    }

    const blockId = (event as Blockly.Events.BlockCreate).blockId;
    const block = workspace.getBlockById(blockId);
    if (!block?.getField("VAR")) {
      return;
    }

    setTimeout(() => {
      bindPreferredVariableField(block);
      cleanupUnusedAutoVariables(workspace);
    }, 0);
  });
}

export function arduinoTypeForDropdownValue(typeValue: string): string {
  return DROPDOWN_TO_ARDUINO[typeValue] ?? "int";
}

export function defaultValueForVariableType(typeValue: string): string {
  switch (typeValue) {
    case "BOOL":
      return "false";
    case "TEXT":
      return '""';
    case "CHARACTER":
      return "'\\0'";
    case "DECIMAL":
      return "0.0";
    default:
      return "0";
  }
}

export function dropdownValueForArduinoType(arduinoType: string): string {
  if (!arduinoType) {
    return "INTEGER";
  }
  return ARDUINO_TYPE_TO_DROPDOWN[arduinoType] ?? "INTEGER";
}

export function syncVariableTypeOnChange(
  this: Blockly.Block,
  event: Blockly.Events.Abstract
): void {
  if (
    event.type !== Blockly.Events.BLOCK_CHANGE &&
    event.type !== Blockly.Events.BLOCK_CREATE
  ) {
    return;
  }

  if (event.type === Blockly.Events.BLOCK_CHANGE) {
    const changeEvent = event as Blockly.Events.BlockChange;
    if (changeEvent.blockId !== this.id) {
      return;
    }
    if (changeEvent.name !== "TYPE" && changeEvent.name !== "VAR") {
      return;
    }
  }

  const sync = () => {
    bindPreferredVariableField(this);
  };

  if (event.type === Blockly.Events.BLOCK_CREATE) {
    // Fields may not be ready until after create finishes.
    setTimeout(sync, 0);
    return;
  }

  sync();
}
