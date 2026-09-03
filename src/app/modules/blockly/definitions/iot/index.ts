import { BlockRegistry } from "../../lib/registry/block-registry";
import { IToolboxCategoryConfig } from "../../types/toolbox.types";
import { ALEXA_BLOCKS } from "./alexa/alexa.blocks";
import {
  ALEXA_CATEGORY,
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_ORDER,
  ESP_BOARD_TYPES,
  ESPNOW_CATEGORY,
  FIREBASE_CATEGORY,
  HTML_CATEGORY,
  IFTTT_CATEGORY,
  MQTT_CATEGORY,
  NTP_CATEGORY,
  OPENWEATHER_CATEGORY,
  TELEGRAM_CATEGORY,
  THINGSPEAK_CATEGORY,
  TOOLBOX_LEVEL,
  WIFI_CATEGORY,
  WIFISERVER_CATEGORY,
} from "./config";
import { ESPNOW_BLOCKS } from "./espnow/espnow.blocks";
import { FIREBASE_BLOCKS } from "./firebase/firebase.blocks";
import { HTML_BLOCKS } from "./html/html.blocks";
import { IFTTT_BLOCKS } from "./ifttt/ifttt.blocks";
import { MQTT_BLOCKS } from "./mqtt/mqtt.blocks";
import { NTP_BLOCKS } from "./ntp/ntp.blocks";
import { OPENWEATHER_BLOCKS } from "./openweather/openweather.blocks";
import { TELEGRAM_BLOCKS } from "./telegram/telegram.blocks";
import { THINGSPEAK_BLOCKS } from "./thingspeak/thingspeak.blocks";
import { WIFI_BLOCKS } from "./wifi/wifi.blocks";
import { WIFISERVER_BLOCKS } from "./wifi-server/wifi-server.blocks";

export const IOT_BLOCKS = [
  ...WIFI_BLOCKS,
  ...WIFISERVER_BLOCKS,
  ...MQTT_BLOCKS,
  ...IFTTT_BLOCKS,
  ...NTP_BLOCKS,
  ...OPENWEATHER_BLOCKS,
  ...THINGSPEAK_BLOCKS,
  ...FIREBASE_BLOCKS,
  ...TELEGRAM_BLOCKS,
  ...ALEXA_BLOCKS,
  ...HTML_BLOCKS,
  ...ESPNOW_BLOCKS,
];

function registerSubcategory(
  name: string,
  subOrder: number
): IToolboxCategoryConfig {
  return {
    name,
    colour: CATEGORY_COLOR,
    order: CATEGORY_ORDER,
    subOrder,
    parentCategory: CATEGORY_NAME,
    minLevel: TOOLBOX_LEVEL,
    requiredBoardTypes: [...ESP_BOARD_TYPES],
  } as IToolboxCategoryConfig;
}

export function initialize(): void {
  BlockRegistry.registerMany(IOT_BLOCKS);

  BlockRegistry.registerCategory(CATEGORY_NAME, {
    name: CATEGORY_NAME,
    colour: CATEGORY_COLOR,
    order: CATEGORY_ORDER,
    minLevel: TOOLBOX_LEVEL,
    isContainer: true,
    requiredBoardTypes: [...ESP_BOARD_TYPES],
  } as IToolboxCategoryConfig);

  BlockRegistry.registerCategory(
    WIFI_CATEGORY,
    registerSubcategory(WIFI_CATEGORY, 0)
  );
  BlockRegistry.registerCategory(
    WIFISERVER_CATEGORY,
    registerSubcategory(WIFISERVER_CATEGORY, 1)
  );
  BlockRegistry.registerCategory(
    MQTT_CATEGORY,
    registerSubcategory(MQTT_CATEGORY, 2)
  );
  BlockRegistry.registerCategory(
    IFTTT_CATEGORY,
    registerSubcategory(IFTTT_CATEGORY, 3)
  );
  BlockRegistry.registerCategory(
    NTP_CATEGORY,
    registerSubcategory(NTP_CATEGORY, 4)
  );
  BlockRegistry.registerCategory(
    OPENWEATHER_CATEGORY,
    registerSubcategory(OPENWEATHER_CATEGORY, 5)
  );
  BlockRegistry.registerCategory(
    THINGSPEAK_CATEGORY,
    registerSubcategory(THINGSPEAK_CATEGORY, 6)
  );
  BlockRegistry.registerCategory(
    FIREBASE_CATEGORY,
    registerSubcategory(FIREBASE_CATEGORY, 7)
  );
  BlockRegistry.registerCategory(
    TELEGRAM_CATEGORY,
    registerSubcategory(TELEGRAM_CATEGORY, 8)
  );
  BlockRegistry.registerCategory(
    ALEXA_CATEGORY,
    registerSubcategory(ALEXA_CATEGORY, 9)
  );
  BlockRegistry.registerCategory(
    HTML_CATEGORY,
    registerSubcategory(HTML_CATEGORY, 10)
  );
  BlockRegistry.registerCategory(
    ESPNOW_CATEGORY,
    registerSubcategory(ESPNOW_CATEGORY, 11)
  );
}

export {
  WIFI_BLOCKS,
  WIFISERVER_BLOCKS,
  MQTT_BLOCKS,
  IFTTT_BLOCKS,
  NTP_BLOCKS,
  OPENWEATHER_BLOCKS,
  THINGSPEAK_BLOCKS,
  FIREBASE_BLOCKS,
  TELEGRAM_BLOCKS,
  ALEXA_BLOCKS,
  HTML_BLOCKS,
  ESPNOW_BLOCKS,
};
