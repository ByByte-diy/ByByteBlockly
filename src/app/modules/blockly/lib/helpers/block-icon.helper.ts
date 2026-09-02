import * as Blockly from "blockly";

/** Legacy Blocklino icon sizes (media/*.png on blocks). */
export type BlockIconSize =
  | "init"
  | "value"
  | "medium"
  | "large"
  | "wide"
  | "pressure"
  | "serial"
  | "remoteWide"
  | "remoteMedium"
  | "remoteKey"
  | "displayWide"
  | "tm1637";

const BLOCK_ICON_SIZES: Record<
  BlockIconSize,
  { width: number; height: number }
> = {
  init: { width: 33, height: 33 },
  value: { width: 15, height: 15 },
  medium: { width: 22, height: 22 },
  large: { width: 48, height: 48 },
  wide: { width: 25, height: 15 },
  pressure: { width: 23, height: 23 },
  serial: { width: 20, height: 25 },
  remoteWide: { width: 57, height: 38 },
  remoteMedium: { width: 26, height: 38 },
  remoteKey: { width: 65, height: 38 },
  displayWide: { width: 53, height: 38 },
  tm1637: { width: 48, height: 38 },
};

/** Public URL path served from `src/assets/icons/blocks/`. */
export function blockIconUrl(filename: string): string {
  return `assets/icons/blocks/${filename}`;
}

/** Blockly field using a legacy PNG from `www/media` (copied to assets). */
export function createBlockIconField(
  filename: string,
  size: BlockIconSize = "init",
  alt = "*"
): Blockly.FieldImage {
  const { width, height } = BLOCK_ICON_SIZES[size];
  return new Blockly.FieldImage(blockIconUrl(filename), width, height, alt);
}
