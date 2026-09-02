import * as Blockly from "blockly";

/** Prefix for configuration / init blocks in the toolbox */
export const INIT_BLOCK_PREFIX = "⚙️ ";

export function blockLabel(key: string, fallback: string): string {
  return Blockly.Msg[key] || fallback;
}

/** Label for init blocks — always starts with the gear emoji */
export function initBlockLabel(key: string, fallback: string): string {
  const text = blockLabel(key, fallback);
  return text.startsWith(INIT_BLOCK_PREFIX) ? text : `${INIT_BLOCK_PREFIX}${text}`;
}
