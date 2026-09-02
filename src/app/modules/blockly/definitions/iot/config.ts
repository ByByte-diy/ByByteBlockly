import { BLOCK_COLORS } from "../../constants/blockly.constants";
import { BlockLevelE, PlatformT } from "../../types";

export const CATEGORY_NAME = "%{BKY_CAT_IOT}";
export const WIFI_CATEGORY = "%{BKY_CAT_IOT_WIFI}";
export const WIFISERVER_CATEGORY = "%{BKY_CAT_IOT_WIFISERVER}";
export const MQTT_CATEGORY = "%{BKY_CAT_IOT_MQTT}";
export const IFTTT_CATEGORY = "%{BKY_CAT_IOT_IFTTT}";
export const NTP_CATEGORY = "%{BKY_CAT_IOT_NTP}";
export const OPENWEATHER_CATEGORY = "%{BKY_CAT_IOT_OPENWEATHER}";
export const THINGSPEAK_CATEGORY = "%{BKY_CAT_IOT_THINGSPEAK}";
export const TELEGRAM_CATEGORY = "%{BKY_CAT_IOT_TELEGRAM}";
export const HTML_CATEGORY = "%{BKY_CAT_IOT_HTML}";
export const FIREBASE_CATEGORY = "%{BKY_CAT_IOT_FIREBASE}";
export const ESPNOW_CATEGORY = "%{BKY_CAT_IOT_ESPNOW}";
export const ALEXA_CATEGORY = "%{BKY_CAT_IOT_ALEXA}";

export const CATEGORY_COLOR = BLOCK_COLORS.IOT;
export const CATEGORY_PLATFORMS = ["esp32", "esp8266"] as PlatformT[];
export const TOOLBOX_LEVEL = BlockLevelE.ADVANCED;
export const CATEGORY_ORDER = 16;

/** Legacy Otto ESP8266 board id (maps to ESP8266WiFi headers). */
export const ESP_BOARD_TYPES = ["esp32", "esp8266"] as const;

/** Legacy #00AAAA for WiFi server async blocks (later phases). */
export const WIFI_SERVER_ASYNC_COLOR = 180;

export const GMT_OPTIONS: [string, string][] = [
  ["-12", "-12"],
  ["-11", "-11"],
  ["-10", "-10"],
  ["-9", "-9"],
  ["-8", "-8"],
  ["-7", "-7"],
  ["-6", "-6"],
  ["-5", "-5"],
  ["-4", "-4"],
  ["-3", "-3"],
  ["-2", "-2"],
  ["-1", "-1"],
  ["0", "0"],
  ["+12", "12"],
  ["+11", "11"],
  ["+10", "10"],
  ["+9", "9"],
  ["+8", "8"],
  ["+7", "7"],
  ["+6", "6"],
  ["+5", "5"],
  ["+4", "4"],
  ["+3", "3"],
  ["+2", "2"],
  ["+1", "1"],
];

/** Built at block init via iotLabel — legacy Blockly.Msg.NTP_* keys. */
export const NTP_VALUE_OPTION_KEYS: [string, string][] = [
  ["NTP_EPOCH", "0"],
  ["NTP_YEAR", "1"],
  ["NTP_MONTH", "2"],
  ["NTP_DAY", "3"],
  ["NTP_HOUR", "4"],
  ["NTP_MINUTE", "5"],
  ["NTP_SECOND", "6"],
];

export const NTP_TEXT_VALUE_OPTION_KEYS: [string, string][] = [
  ["NTP_TEXT_DOFWEEK", "0"],
  ["NTP_TEXT_MONTH", "1"],
  ["NTP_TEXT_TIME", "2"],
];

export const NTP_VALUE_FALLBACKS: Record<string, string> = {
  NTP_EPOCH: "Epoch",
  NTP_YEAR: "Year",
  NTP_MONTH: "Month",
  NTP_DAY: "Day",
  NTP_HOUR: "Hour",
  NTP_MINUTE: "Minute",
  NTP_SECOND: "Second",
  NTP_TEXT_DOFWEEK: "Day of week in string",
  NTP_TEXT_MONTH: "Month in string ",
  NTP_TEXT_TIME: "Time in string ",
};

export const THINGSPEAK_FIELD_OPTIONS: [string, string][] = [
  ["1", "1"],
  ["2", "2"],
  ["3", "3"],
  ["4", "4"],
  ["5", "5"],
  ["6", "6"],
  ["7", "7"],
  ["8", "8"],
];

export const FIREBASE_NUM_TYPE_OPTIONS: [string, string][] = [
  ["int", "1"],
  ["float", "2"],
  ["double", "3"],
];

/** Numeric OpenWeather value codes (labels resolved via iotLabel in blocks). */
export const OPENWEATHER_NUMERIC_VALUE_CODES = [
  "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12",
] as const;

/** Text OpenWeather value codes (labels resolved via iotLabel in blocks). */
export const OPENWEATHER_TEXT_VALUE_CODES = ["0", "1", "2", "3", "4"] as const;
