import { BlockRegistry } from "../../lib/registry/block-registry";
import { IToolboxCategoryConfig } from "../../types/toolbox.types";
import { BlockLevelE } from "../../types/block.types";
import { BUTTONS_BLOCKS } from "./buttons/buttons.blocks";
import { COLOR_BLOCKS } from "./color/color.blocks";
import { COMPASS_BLOCKS } from "./compass/compass.blocks";
import {
  BUTTONS_CATEGORY,
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_ORDER,
  COLOR_CATEGORY,
  COMPASS_CATEGORY,
  DISTANCE_CATEGORY,
  DISTANCE_LEVEL,
  GAS_CATEGORY,
  GESTURE_CATEGORY,
  GPS_CATEGORY,
  GYRO_CATEGORY,
  HUMIDITY_CATEGORY,
  JOYSTICK_CATEGORY,
  KNOB_CATEGORY,
  LIGHT_CATEGORY,
  MAGNET_CATEGORY,
  PRESSURE_CATEGORY,
  RFID_CATEGORY,
  RTC_CATEGORY,
  SENSING_SUBCATEGORY_LEVEL,
  SOUND_CATEGORY,
  TEMPERATURE_CATEGORY,
  TOOLBOX_LEVEL,
  VIBRATION_CATEGORY,
} from "./config";
import { DISTANCE_BLOCKS } from "./distance/distance.blocks";
import { GAS_BLOCKS } from "./gas/gas.blocks";
import { GESTURE_BLOCKS } from "./gesture/gesture.blocks";
import { GPS_BLOCKS } from "./gps/gps.blocks";
import { GYRO_BLOCKS } from "./gyro/gyro.blocks";
import { HUMIDITY_BLOCKS } from "./humidity/humidity.blocks";
import { JOYSTICK_BLOCKS } from "./joystick/joystick.blocks";
import { KNOB_BLOCKS } from "./knob/knob.blocks";
import { LIGHT_BLOCKS } from "./light/light.blocks";
import { MAGNET_BLOCKS } from "./magnet/magnet.blocks";
import { PRESSURE_BLOCKS } from "./pressure/pressure.blocks";
import { RFID_BLOCKS } from "./rfid/rfid.blocks";
import { RTC_BLOCKS } from "./rtc/rtc.blocks";
import { SOUND_BLOCKS } from "./sound/sound.blocks";
import { TEMPERATURE_BLOCKS } from "./temperature/temperature.blocks";
import { VIBRATION_BLOCKS } from "./vibration/vibration.blocks";

export const SENSING_BLOCKS = [
  ...DISTANCE_BLOCKS,
  ...SOUND_BLOCKS,
  ...TEMPERATURE_BLOCKS,
  ...LIGHT_BLOCKS,
  ...GESTURE_BLOCKS,
  ...COLOR_BLOCKS,
  ...MAGNET_BLOCKS,
  ...VIBRATION_BLOCKS,
  ...HUMIDITY_BLOCKS,
  ...GAS_BLOCKS,
  ...PRESSURE_BLOCKS,
  ...RTC_BLOCKS,
  ...RFID_BLOCKS,
  ...COMPASS_BLOCKS,
  ...GYRO_BLOCKS,
  ...GPS_BLOCKS,
  ...BUTTONS_BLOCKS,
  ...KNOB_BLOCKS,
  ...JOYSTICK_BLOCKS,
];

function registerSubcategory(
  name: string,
  subOrder: number,
  minLevel: BlockLevelE = SENSING_SUBCATEGORY_LEVEL
): IToolboxCategoryConfig {
  return {
    name,
    colour: CATEGORY_COLOR,
    order: CATEGORY_ORDER,
    subOrder,
    parentCategory: CATEGORY_NAME,
    minLevel,
  } as IToolboxCategoryConfig;
}

export function initialize(): void {
  BlockRegistry.registerMany(SENSING_BLOCKS);

  BlockRegistry.registerCategory(CATEGORY_NAME, {
    name: CATEGORY_NAME,
    colour: CATEGORY_COLOR,
    order: CATEGORY_ORDER,
    minLevel: TOOLBOX_LEVEL,
    isContainer: true,
  } as IToolboxCategoryConfig);

  BlockRegistry.registerCategory(
    DISTANCE_CATEGORY,
    registerSubcategory(DISTANCE_CATEGORY, 0, DISTANCE_LEVEL)
  );
  BlockRegistry.registerCategory(
    SOUND_CATEGORY,
    registerSubcategory(SOUND_CATEGORY, 1)
  );
  BlockRegistry.registerCategory(
    TEMPERATURE_CATEGORY,
    registerSubcategory(TEMPERATURE_CATEGORY, 2)
  );
  BlockRegistry.registerCategory(
    LIGHT_CATEGORY,
    registerSubcategory(LIGHT_CATEGORY, 3)
  );
  BlockRegistry.registerCategory(
    GESTURE_CATEGORY,
    registerSubcategory(GESTURE_CATEGORY, 4)
  );
  BlockRegistry.registerCategory(
    COLOR_CATEGORY,
    registerSubcategory(COLOR_CATEGORY, 5)
  );
  BlockRegistry.registerCategory(
    MAGNET_CATEGORY,
    registerSubcategory(MAGNET_CATEGORY, 6)
  );
  BlockRegistry.registerCategory(
    VIBRATION_CATEGORY,
    registerSubcategory(VIBRATION_CATEGORY, 7)
  );
  BlockRegistry.registerCategory(
    HUMIDITY_CATEGORY,
    registerSubcategory(HUMIDITY_CATEGORY, 8)
  );
  BlockRegistry.registerCategory(
    GAS_CATEGORY,
    registerSubcategory(GAS_CATEGORY, 9)
  );
  BlockRegistry.registerCategory(
    PRESSURE_CATEGORY,
    registerSubcategory(PRESSURE_CATEGORY, 10)
  );
  BlockRegistry.registerCategory(
    RTC_CATEGORY,
    registerSubcategory(RTC_CATEGORY, 11)
  );
  BlockRegistry.registerCategory(
    RFID_CATEGORY,
    registerSubcategory(RFID_CATEGORY, 12)
  );
  BlockRegistry.registerCategory(
    COMPASS_CATEGORY,
    registerSubcategory(COMPASS_CATEGORY, 13)
  );
  BlockRegistry.registerCategory(
    GYRO_CATEGORY,
    registerSubcategory(GYRO_CATEGORY, 14)
  );
  BlockRegistry.registerCategory(
    GPS_CATEGORY,
    registerSubcategory(GPS_CATEGORY, 15)
  );
  BlockRegistry.registerCategory(
    BUTTONS_CATEGORY,
    registerSubcategory(BUTTONS_CATEGORY, 16)
  );
  BlockRegistry.registerCategory(
    KNOB_CATEGORY,
    registerSubcategory(KNOB_CATEGORY, 17)
  );
  BlockRegistry.registerCategory(
    JOYSTICK_CATEGORY,
    registerSubcategory(JOYSTICK_CATEGORY, 18)
  );
}

export {
  DISTANCE_BLOCKS,
  SOUND_BLOCKS,
  TEMPERATURE_BLOCKS,
  LIGHT_BLOCKS,
  GESTURE_BLOCKS,
  COLOR_BLOCKS,
  MAGNET_BLOCKS,
  VIBRATION_BLOCKS,
  HUMIDITY_BLOCKS,
  GAS_BLOCKS,
  PRESSURE_BLOCKS,
  RTC_BLOCKS,
  RFID_BLOCKS,
  COMPASS_BLOCKS,
  GYRO_BLOCKS,
  GPS_BLOCKS,
  BUTTONS_BLOCKS,
  KNOB_BLOCKS,
  JOYSTICK_BLOCKS,
};
