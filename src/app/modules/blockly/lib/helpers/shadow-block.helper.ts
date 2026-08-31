import * as Blockly from "blockly";

/**
 * Attach a shadow block to a value input if it is empty.
 * Shadow blocks must be rendered before connecting, otherwise drag will crash.
 */
export function attachShadowBlock(
  block: Blockly.Block,
  inputName: string,
  shadowType: string,
  fields?: Record<string, string | number>
): void {
  if (!block.workspace || block.isInFlyout || block.getInputTargetBlock(inputName)) {
    return;
  }

  const input = block.getInput(inputName);
  if (!input?.connection) {
    return;
  }

  const shadow = block.workspace.newBlock(shadowType) as Blockly.BlockSvg;
  shadow.setShadow(true);

  if (fields) {
    for (const [name, value] of Object.entries(fields)) {
      shadow.setFieldValue(String(value), name);
    }
  }

  shadow.initSvg();
  shadow.render();

  if (shadow.outputConnection) {
    input.connection.connect(shadow.outputConnection);
  }
}
