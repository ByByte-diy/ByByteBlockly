import * as Blockly from "blockly";

const IDENTIFIER_PATTERN = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

function normalizeVariableName(raw: string): string {
  return raw.replace(/[\s\xa0]+/g, " ").replace(/^ | $/g, "");
}

function isReservedWord(name: string): boolean {
  const win = window as any;
  const reserved: string =
    win.Blockly?.Arduino?.RESERVED_WORDS_ ??
    "setup,loop,if,else,for,switch,case,while,do,break,continue,return,goto,define,include";
  const set = new Set(reserved.split(",").map((w) => w.trim().toLowerCase()));
  return set.has(name.toLowerCase());
}

/**
 * Validate a user-entered variable name for Blockly + Arduino.
 * Returns an error message key/text, or null when valid.
 */
export function validateVariableName(
  raw: string,
  workspace?: Blockly.Workspace | null,
  options?: { allowExistingName?: string }
): string | null {
  const name = normalizeVariableName(raw);

  if (!name) return Blockly.Msg["VARIABLE_NAME_EMPTY"] || "Variable name cannot be empty."; // prettier-ignore

  if (name === Blockly.Msg["RENAME_VARIABLE"] || name === Blockly.Msg["NEW_VARIABLE"]) {
    return Blockly.Msg["VARIABLE_NAME_INVALID"] || "Invalid variable name.";
  }

  if (!IDENTIFIER_PATTERN.test(name)) {
    return (
      Blockly.Msg["VARIABLE_NAME_INVALID"] ||
      "Use letters, numbers, and underscores. Must start with a letter or underscore."
    );
  }

  if (isReservedWord(name)) {
    return (
      Blockly.Msg["VARIABLE_NAME_RESERVED"] ||
      "This name is a reserved Arduino keyword."
    );
  }

  if (workspace && Blockly.Variables.nameUsedWithAnyType(name, workspace)) {
    if (
      options?.allowExistingName &&
      name.localeCompare(options.allowExistingName, undefined, {
        sensitivity: "base",
      }) === 0
    ) {
      return null;
    }

    const template =
      Blockly.Msg["VARIABLE_ALREADY_EXISTS"] ||
      'A variable named "%1" already exists.';
    return template.replace("%1", name);
  }

  return null;
}

export { normalizeVariableName };
