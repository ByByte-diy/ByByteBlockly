import * as Blockly from "blockly";
import { FieldColour } from "@blockly/field-colour";
import {
  applyDefaultDropdownFields,
  getAllPins,
  getBuiltinLED,
  getPWMPins,
} from "@app/modules/device/helpers/device-board-globals.helper";
import {
  registerDefinition,
  registerGlobalVariable,
  registerInclude,
  registerUserFunction,
} from "../../lib/generators/codegen-sections.helper";
import { formatPinMode } from "../../lib/generators/pin-definitions.helper";
import {
  INIT_BLOCK_PREFIX,
  initBlockLabel,
} from "../../lib/helpers/block-label.helper";
import { BLINK_SPEED_OPTIONS, ON_OFF_OPTIONS } from "./config";

export { createBlockIconField } from "../../lib/helpers/block-icon.helper";
export { INIT_BLOCK_PREFIX, initBlockLabel, getBuiltinLED };

/** Localized LED block label with English fallback. */
export function ledLabel(key: string, fallback: string): string {
  return Blockly.Msg[key] || fallback;
}

export function createPinDropdownField(): Blockly.FieldDropdown {
  return new Blockly.FieldDropdown(getAllPins);
}

export function createPwmPinDropdownField(): Blockly.FieldDropdown {
  return new Blockly.FieldDropdown(getPWMPins);
}

export function applyDefaultAllPinFields(
  block: Blockly.Block,
  defaults: Record<string, string>
): void {
  applyDefaultDropdownFields(block, defaults, getAllPins);
}

export function applyDefaultPwmPinFields(
  block: Blockly.Block,
  defaults: Record<string, string>
): void {
  applyDefaultDropdownFields(block, defaults, getPWMPins);
}

export function onOffDropdownField(): Blockly.FieldDropdown {
  return new Blockly.FieldDropdown(ON_OFF_OPTIONS);
}

export function blinkSpeedDropdownField(): Blockly.FieldDropdown {
  return new Blockly.FieldDropdown(BLINK_SPEED_OPTIONS);
}

/** Colour picker field (@blockly/field-colour). */
export function createColourField(
  defaultColour = "#ff0000"
): FieldColour {
  return new FieldColour(defaultColour);
}

/** Parse #RRGGBB from colour field value. */
export function parseHexColor(fieldValue: string): {
  r: number;
  g: number;
  b: number;
} {
  const hex = fieldValue.replace("#", "");
  const colorR = hex.substring(0, 2);
  const colorG = hex.substring(2, 4);
  const colorB = hex.substring(4, 6);
  return {
    r: parseInt(colorR, 16),
    g: parseInt(colorG, 16),
    b: parseInt(colorB, 16),
  };
}

/** Register RGB PWM pins and setColor(); ESP32 uses ledcWrite. */
export function ensureRgbPwmInit(
  generator: any,
  rPin: string,
  gPin: string,
  bPin: string,
  esp32 = false
): void {
  const key = `rvb_${rPin}`;
  registerGlobalVariable(
    generator,
    key,
    `#define redPin ${rPin}\n#define greenPin ${gPin}\n#define bluePin ${bPin}`,
    "RGB LED pin macros (red, green, blue)."
  );

  if (esp32) {
    registerUserFunction(
      generator,
      key,
      "void setColor(int redValue, int greenValue, int blueValue) {\n ledcWrite(5,greenValue);\n ledcWrite(6,redValue);\n  ledcWrite(7,blueValue);\n}",
      "Set RGB color via ESP32 LEDC PWM channels."
    );
    generator.setups_[`rvb_esp32${rPin}`] =
      "ledcSetup(5,5000,8);\nledcAttachPin(greenPin,5);\nledcSetup(6,5000,8);\nledcAttachPin(redPin,6);\nledcSetup(7,5000,8);\nledcAttachPin(bluePin,7);\n";
  } else {
    registerUserFunction(
      generator,
      key,
      "void setColor(int redValue, int greenValue, int blueValue) {\n  analogWrite(redPin, redValue);\n  analogWrite(greenPin, greenValue);\n  analogWrite(bluePin, blueValue);\n}",
      "Set RGB color via analogWrite on PWM pins."
    );
    generator.setups_[key] =
      "pinMode(greenPin, OUTPUT);\n  pinMode(redPin, OUTPUT);\n  pinMode(bluePin, OUTPUT);";
  }
}

/** Register Adafruit_NeoPixel instance and begin/clear setup. */
export function ensureNeoPixelInit(
  generator: any,
  pin: string,
  count: string
): void {
  registerInclude(
    generator,
    "Adafruit_NeoPixel.h",
    "Adafruit NeoPixel library for addressable RGB LEDs."
  );
  registerDefinition(
    generator,
    "pixel",
    `Adafruit_NeoPixel pixel = Adafruit_NeoPixel(${count}, ${pin}, NEO_GRB + NEO_KHZ800);`,
    "Global NeoPixel strip instance."
  );
  generator.setups_["pixel"] = "pixel.begin();\npixel.clear();\n";
}

/** Register LedControl (MAX7219) instance. */
export function ensureMax7219Init(
  generator: any,
  dat: string,
  clk: string,
  cs: string,
  count: string
): void {
  registerInclude(
    generator,
    "LedControl.h",
    "LedControl library for MAX7219 8×8 LED matrices."
  );
  registerDefinition(
    generator,
    "init_Ledcontrol_LM",
    `LedControl lclm=LedControl(${dat},${clk},${cs},${count});`,
    "MAX7219 LedControl driver instance."
  );
}

export function registerLedOutputSetup(
  generator: any,
  key: string,
  pin: string
): void {
  generator.setups_[key] = formatPinMode(pin, "OUTPUT").trim();
}
