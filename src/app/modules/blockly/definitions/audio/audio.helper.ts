import * as Blockly from "blockly";
import {
  applyDefaultDropdownFields,
  getAllPins,
  getCurrentBoardId,
  getDigitalPins,
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
import { MRTNODE_BOARD_IDS } from "../sensing/config";
import { ESP32_LEDC_BUZZER_CHANNEL } from "./config";

export { createBlockIconField } from "../../lib/helpers/block-icon.helper";
export { INIT_BLOCK_PREFIX, initBlockLabel };

export function audioLabel(key: string, fallback: string): string {
  return Blockly.Msg[key] || fallback;
}

export function createPinDropdownField(): Blockly.FieldDropdown {
  return new Blockly.FieldDropdown(getAllPins);
}

export function createDigitalPinDropdownField(): Blockly.FieldDropdown {
  return new Blockly.FieldDropdown(getDigitalPins);
}

export function applyDefaultPinFields(
  block: Blockly.Block,
  defaults: Record<string, string>
): void {
  applyDefaultDropdownFields(block, defaults, getAllPins);
}

export function applyDefaultDigitalPinFields(
  block: Blockly.Block,
  defaults: Record<string, string>
): void {
  applyDefaultDropdownFields(block, defaults, getDigitalPins);
}

/** Register global `buzzer` pin constant (legacy buzzer_init). */
export function ensureBuzzerPin(
  generator: any,
  pin: string
): void {
  registerGlobalVariable(
    generator,
    "setup_buzzer",
    `const int buzzer = ${pin};`,
    "Buzzer output pin."
  );
  generator.setups_["setup_buzzer"] = formatPinMode(pin, "OUTPUT").trim();
}

export function ensurePlayRtttlInclude(generator: any): void {
  registerInclude(
    generator,
    "PlayRtttl.hpp",
    "PlayRtttl library for RTTTL ringtone playback."
  );
}

/** Legacy playRtttlBlocking vs playRtttlBlockingPGM by board. */
export function rtttlPlayCall(pin: string, melodyExpr: string): string {
  const board = getCurrentBoardId();
  if (MRTNODE_BOARD_IDS.includes(board as (typeof MRTNODE_BOARD_IDS)[number])) {
    return `playRtttlBlocking(${pin},(char*)${melodyExpr});\n`;
  }
  return `playRtttlBlockingPGM(${pin},(char*)${melodyExpr});\n`;
}

export function melodyVarNameFromCode(melodyCode: string): string {
  return melodyCode.slice(1, 4);
}

export function ensureEsp32BuzzerToneSetup(
  generator: any,
  pin: string
): void {
  generator.setups_["setup_tone_esp32"] =
    `ledcSetup(${ESP32_LEDC_BUZZER_CHANNEL},5000,8);\nledcAttachPin(${pin},${ESP32_LEDC_BUZZER_CHANNEL});\n`;
}

export function esp32BuzzerToneCode(frequency: string, duration: string): string {
  return (
    `ledcWriteTone(${ESP32_LEDC_BUZZER_CHANNEL},${frequency});\n` +
    ` delay(${duration});\n`
  );
}

export function esp32BuzzerStopCode(): string {
  return `ledcWriteTone(${ESP32_LEDC_BUZZER_CHANNEL},0);\n`;
}

export function volumeToDfPlayerHex(volumeCode: string): string {
  const volume = parseInt(volumeCode, 10);
  if (Number.isNaN(volume) || volume > 48) {
    return "0x30";
  }
  return `0x${volume.toString(16)}`;
}

export function ensureDfPlayerInit(
  generator: any,
  pinRx: string,
  pinTx: string,
  volumeHex: string,
  autoplay: boolean
): void {
  registerInclude(
    generator,
    "SoftwareSerial.h",
    "SoftwareSerial for DFPlayer Mini communication."
  );
  registerDefinition(
    generator,
    "setup_osmp3",
    `SoftwareSerial DFMiniSerial(${pinRx},${pinTx});`,
    "SoftwareSerial link to DFPlayer Mini (RX, TX)."
  );
  registerUserFunction(
    generator,
    "fonction_mp3",
    "void exe_cmd(byte CMD, byte Par1, byte Par2) {\n" +
      "  word check=-(0xFF + 0x06 + CMD + 0x00 + Par1 + Par2);\n" +
      "  byte Command[10]={0x7E,0xFF,0x06,CMD,0x00,Par1,Par2,highByte(check),lowByte(check),0xEF};\n" +
      "  for (int i=0; i<10; i++) {\n" +
      "    DFMiniSerial.write( Command[i]);\n" +
      "  };\n" +
      "}",
    "Send a command frame to the DFPlayer Mini module."
  );
  let setup =
    "DFMiniSerial.begin(9600);\n" +
    "  delay(1000);\n" +
    "  exe_cmd(0x3F,0,0);\n" +
    `  exe_cmd(0x06,0,${volumeHex});\n`;
  if (autoplay) {
    setup += "  exe_cmd(0x11,0,1);\n";
  }
  generator.setups_["setup_mp3"] = setup;
}

export function ensureOpenSmartMp3Init(
  generator: any,
  pinRx: string,
  pinTx: string
): void {
  registerInclude(
    generator,
    "SoftwareSerial.h",
    "SoftwareSerial for OpenSmart MP3 module."
  );
  registerInclude(
    generator,
    "RedMP3.h",
    "RedMP3 / OpenSmart MP3 player library."
  );
  registerDefinition(
    generator,
    "setup_osmp3",
    ` MP3 mp3(${pinRx},${pinTx});`,
    "OpenSmart MP3 player instance."
  );
  generator.setups_["init_osmp3"] =
    " delay(500);//Requires 500ms to wait for the MP3 module to initialize \n";
}

export function openSmartOperationCode(operation: string): string {
  const ops: Record<string, string> = {
    "0": "mp3.volumeUp();",
    "1": "mp3.volumeDown();",
    "2": "mp3.nextSong();",
    "3": "mp3.previousSong();",
    "4": "mp3.play();",
    "5": "mp3.pause();",
    "6": "mp3.stopPlay();",
    "7": "mp3.forward();",
    "8": "mp3.rewind();",
    "9": "mp3.stopInject();",
    "10": "mp3.singleCycle();",
    "11": "mp3.allCycle();",
  };
  return `${ops[operation] ?? "mp3.play();"}\ndelay(50);\n`;
}

export function ensureTea5767Init(generator: any): void {
  registerInclude(
    generator,
    "TEA5767N.h",
    "TEA5767 FM radio module library."
  );
  registerDefinition(
    generator,
    "define_TEA5767N",
    "TEA5767N radio=TEA5767N();",
    "TEA5767 radio receiver instance."
  );
}
