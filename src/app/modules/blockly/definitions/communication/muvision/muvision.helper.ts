import * as Blockly from "blockly";
import { FieldColour } from "@blockly/field-colour";
import {
  registerDefinition,
  registerGlobalVariable,
  registerInclude,
} from "../../../lib/generators/codegen-sections.helper";

export { createBlockIconField } from "../../../lib/helpers/block-icon.helper";
export { registerDefinition, registerGlobalVariable, registerInclude };

import { CATEGORY_PALETTE } from "../../../constants/category-palette.const";

/** Legacy Mu Vision block colour (#0060aa) */
export const MU_BLOCK_COLOUR = CATEGORY_PALETTE.COMMUNICATION;
export const K_MU_NAME = "MU";

export const MU_OBJ_OPTIONS: [string, string][] = [
  ["MU00", "0"],
  ["MU01", "1"],
  ["MU10", "2"],
  ["MU11", "3"],
];

export const VISION_CARD_TYPE_OPTIONS: [string, string][] = [
  ["Shape Card Detect", "VISION_SHAPE_CARD_DETECT"],
  ["Traffic Card Detect", "VISION_TRAFFIC_CARD_DETECT"],
  ["Num Card Detect", "VISION_NUM_CARD_DETECT"],
];

export const VS_VISION_TYPE_OPTIONS: [string, string][] = [
  ["Color Detect", "VISION_COLOR_DETECT"],
  ["Color Recognition", "VISION_COLOR_RECOGNITION"],
  ["Ball Detect", "VISION_BALL_DETECT"],
  ["Body Detect", "VISION_BODY_DETECT"],
  ...VISION_CARD_TYPE_OPTIONS,
];

export const LED_COLOUR_PALETTE = [
  "#fff",
  "#000",
  "#f00",
  "#0f0",
  "#ff0",
  "#00f",
  "#f0f",
  "#0ff",
];

export const DETECT_COLOUR_PALETTE = [
  "#000",
  "#f00",
  "#0f0",
  "#ff0",
  "#00f",
  "#f0f",
  "#0ff",
  "#fff",
];

export const LED_COLOR_MAP: Record<string, string> = {
  "#000000": "kLedClose",
  "#ff0000": "kLedRed",
  "#00ff00": "kLedGreen",
  "#ffff00": "kLedYellow",
  "#0000ff": "kLedBlue",
  "#ff00ff": "kLedPurple",
  "#00ffff": "kLedCyan",
  "#ffffff": "kLedWhite",
};

export const MU_COLOR_MAP: Record<string, string> = {
  "#000000": "MU_COLOR_BLACK",
  "#ff0000": "MU_COLOR_RED",
  "#00ff00": "MU_COLOR_GREEN",
  "#ffff00": "MU_COLOR_YELLOW",
  "#0000ff": "MU_COLOR_BLUE",
  "#ff00ff": "MU_COLOR_PURPLE",
  "#00ffff": "MU_COLOR_CYAN",
  "#ffffff": "MU_COLOR_WHITE",
};

export const FUN_MU_VS2_GET_COLOR_RCG_LABEL = `\
int MuVs2GetColorRCGLabel(MuVisionSensor& Mu, int x, int y) {
  static int x_last = -1;
  static int y_last = -1;
  x = x>100 ? 100:(x<0 ? 0:x);
  y = y>100 ? 100:(y<0 ? 0:y);
  if (x != x_last) {
    x_last = x;
    Mu.write(VISION_COLOR_RECOGNITION, kXValue, x);
  }
  if (y != y_last) {
    y_last = y;
    Mu.write(VISION_COLOR_RECOGNITION, kYValue, y);
  }
  return Mu.GetValue(VISION_COLOR_RECOGNITION, kStatus);
}
`;

export const FUN_MU_VS2_GET_COLOR_DETECT_LABEL = `\
int MuVs2GetColorDetectLabel(MuVisionSensor& Mu, const int label) {
  static int label_last = -1;
  if (label_last != label) {
    label_last = label;
    Mu.write(VISION_COLOR_DETECT, kLabel, label);
  }
  return Mu.GetValue(VISION_COLOR_DETECT, kStatus);
}
`;

export const FUN_MU3_READ_GESTURE = `\
MuVsLsGesture Mu3ReadGesture(MuVisionSensor& Mu, int offset) {
  mu3_gesture[offset] = Mu.LsReadGesture();
  return mu3_gesture[offset];
}
`;

export const FUN_MU3_AT_READ8 = `\
int Mu3AtRead8() {
  unsigned long time = millis();
  while(!SERIAL_PORT.available() && millis()-time<1000);
  if (millis()-time>=1000) {
    return -1;
  }
  return SERIAL_PORT.read();
}
`;

export const FUN_MU3_AT_WRITE8 = `\
void Mu3AtWrite8(uint8_t c) {
  SERIAL_PORT.write(c);
}
`;

/** Legacy module-level serial port name set by Mu3AtWiFiInit. */
export let Mu3AtPort = "";

export function setMu3AtPort(port: string): void {
  Mu3AtPort = port;
}

export function muLabel(key: string, fallback: string): string {
  return Blockly.Msg[key] || fallback;
}

export function registerSetup(
  generator: { setups_: Record<string, string> },
  key: string,
  code: string
): void {
  generator.setups_[key] = code;
}

export function createLedColourField(defaultColour: string): FieldColour {
  const field = new FieldColour(defaultColour);
  field.setColours(LED_COLOUR_PALETTE).setColumns(3);
  return field;
}

export function createDetectColourField(defaultColour: string): FieldColour {
  const field = new FieldColour(defaultColour);
  field.setColours(DETECT_COLOUR_PALETTE).setColumns(3);
  return field;
}

/** Warn when block is not nested inside Vs2Setup (legacy setup-only blocks). */
export function attachSetupOnlyWarning(block: Blockly.Block): void {
  block.setOnChange(function (this: Blockly.Block) {
    const surroundParent = this.getSurroundParent();
    if (surroundParent && surroundParent.type === "Vs2Setup") {
      this.setWarningText(null);
    } else {
      this.setWarningText(
        muLabel(
          "LKL_VS2_WARNING_SETUP_ONLY",
          "This block can only be placed in the setup block!"
        )
      );
    }
  });
}

/** Warn when Serial (not I2C/Wire) is selected for MU init blocks. */
export function attachSerialPortWarning(block: Blockly.Block): void {
  block.setOnChange(function (this: Blockly.Block) {
    if (this.getFieldValue("SERIAL") === "Serial") {
      this.setWarningText(
        muLabel(
          "LKL_VS2_WARNING_MU_INIT",
          "Please DON'T forget initialize the uart1, Serial1. Configure the bauds too"
        )
      );
    } else {
      this.setWarningText(null);
    }
  });
}
