import { PLATFORMS_ALL } from "@app/modules/device/constants/device-boards.const";
import { BLOCK_COLORS } from "../../constants/blockly.constants";
import { BlockLevelE, PlatformT } from "../../types";

export const CATEGORY_NAME = "%{BKY_CAT_AUDIO}";
export const BUZZER_CATEGORY = "%{BKY_CAT_AUDIO_BUZZER}";
export const DFPLAYER_CATEGORY = "%{BKY_CAT_AUDIO_DFPLAYER}";
export const OPENSMART_CATEGORY = "%{BKY_CAT_AUDIO_OPENSMART}";
export const RADIO_CATEGORY = "%{BKY_CAT_AUDIO_RADIO}";

export const CATEGORY_COLOR = BLOCK_COLORS.AUDIO;
export const CATEGORY_PLATFORMS = Array.from(PLATFORMS_ALL) as PlatformT[];
export const TOOLBOX_LEVEL = BlockLevelE.BEGINNER;
export const BUZZER_LEVEL = BlockLevelE.BEGINNER;
export const DFPLAYER_LEVEL = BlockLevelE.INTERMEDIATE;
export const OPENSMART_LEVEL = BlockLevelE.INTERMEDIATE;
export const RADIO_LEVEL = BlockLevelE.INTERMEDIATE;
export const CATEGORY_ORDER = 15;

export const MRTX_BOARD_IDS = ["uno_mrtx", "mrtx"] as const;

export const DEFAULT_DFPLAYER_PINS = { TX: "12", RX: "11" } as const;
export const DEFAULT_OPENSMART_PINS = { TX: "12", RX: "11" } as const;
export const MRTX_INTERNAL_BUZZER_PIN = "11";
export const ESP32_LEDC_BUZZER_CHANNEL = "4";

/** Musical notes for play block (from legacy Arduino_en.js). */
export const NOTE_OPTIONS: [string, string][] = [
  ["C₄ | Do₄", "261"],
  ["D₄ | Re₄", "293"],
  ["E₄ | Mi₄", "329"],
  ["F₄ | Fa₄", "349"],
  ["G₄ | Sol₄", "392"],
  ["A₄ | La₄", "440"],
  ["B₄ | Si₄", "493"],
  ["C₅ | Do₅", "523"],
  ["D₅ | Re₅", "587"],
  ["E₅ | Mi₅", "659"],
  ["F₅ | Fa₅", "698"],
  ["G₅ | Sol₅", "784"],
  ["A₅ | La₅", "880"],
];

export const TEMPO_OPTIONS: [string, string][] = [
  ["♫ beamed notes", "125"],
  ["♪ eight note", "250"],
  ["♩ quarter note", "500"],
  ["𝅗� half note", "1000"],
  ["𝅝 whole note", "2000"],
];

export const RTTTL_MELODY_OPTIONS: [string, string][] = [
  ["StarWars", "StarWars"],
  ["MahnaMahna", "MahnaMahna"],
  ["LeisureSuit", "LeisureSuit"],
  ["MissionImp", "MissionImp"],
  ["Entertainer", "Entertainer"],
  ["Muppets", "Muppets"],
  ["Flinstones", "Flinstones"],
  ["YMCA", "YMCA"],
  ["Simpsons", "Simpsons"],
  ["Indiana", "Indiana"],
  ["TakeOnMe", "TakeOnMe"],
  ["Looney", "Looney"],
  ["20thCenFox", "_20thCenFox"],
  ["Bond", "Bond"],
  ["GoodBad", "GoodBad"],
  ["PinkPanther", "PinkPanther"],
  ["A_Team", "A_Team"],
  ["Jeopardy", "Jeopardy"],
  ["Gadget", "Gadget"],
  ["Smurfs", "Smurfs"],
  ["Toccata", "Toccata"],
  ["Short", "Short"],
  ["JingleBell", "JingleBell"],
  ["Rudolph", "Rudolph"],
  ["WeWishYou", "WeWishYou"],
  ["WinterWonderland", "WinterWonderland"],
  ["OhDennenboom", "OhDennenboom"],
  ["LetItSnow", "LetItSnow"],
  ["Frosty", "Frosty"],
  ["SilentNight", "SilentNight"],
  ["LastChristmas", "LastChristmas"],
  ["AllIWant", "AllIWant"],
  ["AmazingGrace", "AmazingGrace"],
];

export const OPENSMART_OPERATION_OPTIONS: [string, string][] = [
  ["Increase Volumen", "0"],
  ["Decrease Volumen", "1"],
  ["Reproduce next Song", "2"],
  ["Reproduce previous Song", "3"],
  ["Start Song", "4"],
  ["Pause Song", "5"],
  ["Stop Song", "6"],
  ["Foward", "7"],
  ["Rewind", "8"],
  ["Stop inject", "9"],
  ["Single cycle", "10"],
  ["All cycle", "11"],
];

export const TEA5767_POWER_OPTIONS: [string, string][] = [
  ["ON", "1"],
  ["OFF", "2"],
];

export const TEA5767_MUTE_OPTIONS: [string, string][] = [
  ["OFF", "2"],
  ["ON", "1"],
];

export const MADRID_FREQUENCY_OPTIONS: [string, string][] = [
  ["RNE Radio Nacional", "88.20"],
  ["M80 Radio", "89.00"],
  ["SER Madrid Norte", "89.60"],
  ["RNE Radio 5 Todo Noticias", "90.30"],
  ["Europa FM", "91.00"],
  ["Cadena Dial", "91.70"],
  ["RNE Radio 3", "93.20"],
  ["Los 40 Principales", "93.90"],
  ["Melodía FM", "98.40"],
  ["Cadena 100", "99.50"],
  ["COPE+ Madrid", "101.00"],
  ["RNE Radio Clásica", "96.50"],
  ["Onda Cero", "98.00"],
  ["Vaughan Radio", "100.40"],
  ["Kiss FM", "102.70"],
  ["Onda Madrid", "101.30"],
  ["Radio Marca", "103.50"],
];
