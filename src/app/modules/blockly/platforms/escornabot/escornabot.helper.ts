import * as Blockly from "blockly";
import {
  registerDefinition,
  registerInclude,
} from "../../lib/generators/codegen-sections.helper";

export { createBlockIconField } from "../../lib/helpers/block-icon.helper";

export function escornabotLabel(key: string, fallback: string): string {
  return Blockly.Msg[key] || fallback;
}

/** Legacy escornabot_init → includes_['escornabot_lib'] */
export function ensureEscornabotLib(
  generator: any,
  modeSuffix: string
): void {
  registerInclude(
    generator,
    "escornabot.h",
    "Escornabot robot library (mirobot instance)."
  );
  registerDefinition(
    generator,
    "escornabot_lib",
    `escornabot mirobot${modeSuffix};`,
    "Escornabot mirobot global instance."
  );
}

/** Legacy escornabot_app → includes_['escornabot_lib'] with Bot.h */
export function ensureEscornabotAppLib(generator: any): void {
  registerDefinition(
    generator,
    "escornabot_lib",
    '#include "Bot.h"\nBot ESCORNABOT;',
    "Escornabot autonomous mode (Bot.h)."
  );
}

export function registerEscornabotUsSetup(
  generator: any,
  trigger: string,
  echo: string
): void {
  generator.setups_["escornabot_us_init"] = `mirobot.us(${trigger},${echo});`;
}

export function registerEscornabotIrSetup(
  generator: any,
  leftPin: string,
  rightPin: string
): void {
  generator.setups_["escornabot_ir_init"] =
    `mirobot.infrared(${leftPin},${rightPin});`;
}

export function registerEscornabotAppSetup(generator: any): void {
  generator.setups_["escornabot_init"] = "  ESCORNABOT.init();\n";
}
