import { CATEGORY_PALETTE } from "../../constants/category-palette.const";
import { BlockLevelE, PlatformT } from "../../types";
import { PLATFORMS_ALL } from "@app/modules/device/constants/device-boards.const";
import { IToolboxCategoryConfig } from "../../types/toolbox.types";
import { BYBYTE_EXCLUSIVE_BOARD_IDS } from "../shared/robot-boards.const";

/** Top-level Robot Otto container (replaces legacy CAT_ROBOT). */
export const OTTO_CONTAINER_CATEGORY = "%{BKY_CAT_ROBOT_OTTO}";

export const BIPED_CATEGORY = "%{BKY_CAT_ROBOT_OTTO_BIPED}";
export const ARMS_CATEGORY = "%{BKY_CAT_ROBOT_OTTO_ARMS}";
export const QUAD_CATEGORY = "%{BKY_CAT_ROBOT_OTTO_QUAD}";
export const WHEELS_CATEGORY = "%{BKY_CAT_ROBOT_OTTO_WHEELS}";
export const CAT_ROBOT_OTTO_NINJA = "%{BKY_CAT_ROBOT_OTTO_NINJA}";

export const OTTO_MOVEMENT_COLOUR = CATEGORY_PALETTE.ROBOT;
export const OTTO_SOUND_COLOUR = CATEGORY_PALETTE.ROBOT_SOUND;
export const OTTO_EEPROM_COLOUR = CATEGORY_PALETTE.ROBOT_EEPROM;
export const OTTO_SENSOR_COLOUR = CATEGORY_PALETTE.ROBOT_SENSOR;

export const NINJA_COLOUR = CATEGORY_PALETTE.ROBOT;

/** Legacy: CAT_OTTO is present in toolbox_arduino_all* for AVR, ESP8266, ESP32, MRT — not Otto-kit-only. */
export const CATEGORY_PLATFORMS = Array.from(PLATFORMS_ALL) as PlatformT[];
export const TOOLBOX_LEVEL = BlockLevelE.BEGINNER;
export const CATEGORY_ORDER = 14;

/** Optional block-level hints (legacy toolbox XML); categories are not board-gated. */
export const OTTO_WHEELS_BOARD_IDS = ["mrtx", "MRTnode", "uno_mrtx", "OttoESP", "Ottoky", "esp8266", "esp32", "wemosD1miniPro"] as const;
export const NINJA_WIFI_BOARD_IDS = ["OttoESP", "MRTnode", "esp8266"] as const;

/** Legacy Blockly.Msg.OTTO9_DIY_URL — do not translate */
export const OTTO_DIY_URL = "https://www.ottodiy.com/";

/** From legacy Arduino_en.js Blockly.Msg.OTTO9_MOVE_CHOICE */
export const OTTO_MOVE_OPTIONS: [string, string][] = [
  ["↑ forward", "FORWARD"],
  ["↓ backward", "BACKWARD"],
  ["↺ turn left", "LEFT"],
  ["↻ turn right", "RIGHT"],
  ["bend to the left", "BENDLEFT"],
  ["bend to the right", "BENDRIGHT"],
  ["shake left leg", "SHAKELEFT"],
  ["shake right leg", "SHAKERIGHT"],
  ["up", "jump"],
];

/** From legacy Arduino_en.js Blockly.Msg.OTTO9_MOVEW_CHOICE */
export const OTTO_WHEELS_MOVE_OPTIONS: [string, string][] = [
  ["↑ forward", "FORWARD"],
  ["↓ backward", "BACKWARD"],
  ["↺ turn left", "LEFT"],
  ["↻ turn right", "RIGHT"],
];

/** From legacy Arduino_en.js Blockly.Msg.OTTO9_MOVE_SPEED_CHOICE */
export const OTTO_MOVE_SPEED_OPTIONS: [string, string][] = [
  ["normal", "1000"],
  ["slow", "2000"],
  ["very slow", "3000"],
  ["fast", "750"],
  ["very fast", "500"],
  ["way to fast", "250"],
];

/** From legacy Arduino_en.js Blockly.Msg.OTTO9_MOVEW_SPEED_CHOICE */
export const OTTO_WHEELS_SPEED_OPTIONS: [string, string][] = [
  ["normal", "45"],
  ["slow", "20"],
  ["very slow", "10"],
  ["fast", "60"],
  ["very fast", "90"],
];

/** From legacy Arduino_en.js Blockly.Msg.OTTO9_DANCE_CHOICE */
export const OTTO_DANCE_OPTIONS: [string, string][] = [
  ["moonwalk ⟵", "moonwalkerLEFT"],
  ["moonwalk ⟶", "moonwalkerRIGHT"],
  ["crossing ⟵", "crusaitoLEFT"],
  ["crossing ⟶", "crusaitoRIGHT"],
  ["flapping ↑", "flappingFRONT"],
  ["flapping ↓", "flappingBACK"],
];

/** From legacy Arduino_en.js Blockly.Msg.OTTO9_DANCE_SIZE_CHOICE */
export const OTTO_DANCE_SIZE_OPTIONS: [string, string][] = [
  ["normal", "25"],
  ["little", "10"],
  ["big", "40"],
];

/** From legacy Arduino_en.js Blockly.Msg.OTTO9_DO_CHOICE */
export const OTTO_DO_OPTIONS: [string, string][] = [
  ["swing", "swing"],
  ["updown", "updown"],
  ["tiptoeSwing", "tiptoeSwing"],
  ["jitter", "jitter"],
  ["ascendingTurn", "ascendingTurn"],
];

/** From legacy Arduino_en.js Blockly.Msg.OTTO9_GESTURE_CHOICE */
export const OTTO_GESTURE_OPTIONS: [string, string][] = [
  ["😃 happy1", "OttoSuperHappy"],
  ["🙂 happy2", "OttoHappy"],
  ["🙁 sad", "OttoSad"],
  ["😴 sleep", "OttoSleeping"],
  ["😕 confused", "OttoConfused"],
  ["😰 fretful", "OttoFretful"],
  ["😍 love", "OttoLove"],
  ["😡 angry", "OttoAngry"],
  ["🤩 magic", "OttoMagic"],
  ["😐 wave", "OttoWave"],
  [" 😎 victory", "OttoVictory"],
  ["😞 fail", "OttoFail"],
  ["💩 fart", "OttoFart"],
];

/** From legacy Arduino_en.js Blockly.Msg.OTTO9_SOUND_CHOICE */
export const OTTO_SOUND_OPTIONS: [string, string][] = [
  ["😃 happy1", "S_superHappy"],
  ["🙂 happy2", "S_happy"],
  ["😊 happy3", "S_happy_short"],
  ["🙁 sad", "S_sad"],
  ["😕 confused", "S_confused"],
  ["🤗 cuddly", "S_cuddly"],
  ["🦘 jump", "S_JUMP"],
  ["☠️ pirate", "PIRATES"],
  ["😮 Oh", "S_OhOoh"],
  ["😯 OhOoh", "S_OhOoh2"],
  ["😲 surprise", "S_surprise"],
  ["🤖 connect", "S_connection"],
  [" 🤖 disconnect", "S_disconnection"],
  ["👇 push", "S_buttonPushed"],
  ["❗ 1", "S_mode1"],
  ["❗❗ 2", "S_mode2"],
  ["❗❗❗ 3", "S_mode3"],
  ["💤 sleep", "S_sleeping"],
  ["💩 fart1", "S_fart1"],
  ["💩 fart2", "S_fart2"],
  ["💩 fart3", "S_fart3"],
];

/** From legacy Arduino_en.js Blockly.Msg.OTTO9_ARMS_CHOICE */
export const OTTO_ARMS_OPTIONS: [string, string][] = [
  ["hands up", "HANDSUP"],
  ["hands down", "HANDSDOWN"],
  ["handwave left", "HANDWAVE1"],
  ["handwave right", "HANDWAVE2"],
];

/** Legacy otto_tone note dropdown (ottoesp.js) */
export const OTTO_TONE_NOTE_OPTIONS: [string, string][] = [
  ["C₄ | Do₄", "262"],
  ["D₄ | Re₄", "294"],
  ["E₄ | Mi₄", "330"],
  ["F₄ | Fa₄", "349"],
  ["G₄ | Sol₄", "392"],
  ["A₄ | La₄", "440"],
  ["B₄ | Si₄", "494"],
  ["C₅ | Do₅", "523"],
  ["D₅ | Re₅", "587"],
  ["E₅ | Mi₅", "659"],
  ["F₅ | Fa₅", "698"],
  ["G₅ | Sol₅", "784"],
  ["A₅ | La₅", "880"],
  ["B₅ | Si₅", "988"],
  ["C₆ | Do₆", "1047"],
  ["D₆ | Re₆", "1175"],
  ["E₆ | Mi₆", "1319"],
  ["F₆ | Fa₆", "1397"],
  ["G₆ | Sol₆", "1568"],
  ["A₆ | La₆", "1760"],
  ["B₆ | Si₆", "1976"],
];

/** Legacy otto_tone duration dropdown (ottoesp.js) */
export const OTTO_TONE_DURATION_OPTIONS: [string, string][] = [
  ["♫", "125"],
  ["♪", "250"],
  ["♩", "500"],
  ["𝅗𝅥", "1000"],
  ["𝅝", "2000"],
];

function createSubcategoryConfig(
  name: string,
  subOrder: number
): IToolboxCategoryConfig {
  return {
    name,
    colour: OTTO_MOVEMENT_COLOUR,
    order: CATEGORY_ORDER,
    subOrder,
    parentCategory: OTTO_CONTAINER_CATEGORY,
    minLevel: TOOLBOX_LEVEL,
  };
}

export const OTTO_CONTAINER_CATEGORY_CONFIG: IToolboxCategoryConfig = {
  name: OTTO_CONTAINER_CATEGORY,
  colour: OTTO_MOVEMENT_COLOUR,
  order: CATEGORY_ORDER,
  subOrder: 1,
  minLevel: TOOLBOX_LEVEL,
  isContainer: true,
  hiddenBoardIds: [...BYBYTE_EXCLUSIVE_BOARD_IDS],
};

export const OTTO_BIPED_CATEGORY_CONFIG = createSubcategoryConfig(
  BIPED_CATEGORY,
  0
);

export const OTTO_ARMS_CATEGORY_CONFIG = createSubcategoryConfig(
  ARMS_CATEGORY,
  1
);

export const OTTO_QUAD_CATEGORY_CONFIG = createSubcategoryConfig(
  QUAD_CATEGORY,
  2
);

export const OTTO_WHEELS_CATEGORY_CONFIG = createSubcategoryConfig(
  WHEELS_CATEGORY,
  3
);

export const OTTO_NINJA_CATEGORY_CONFIG = createSubcategoryConfig(
  CAT_ROBOT_OTTO_NINJA,
  4
);
