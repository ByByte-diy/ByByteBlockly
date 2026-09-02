import { PLATFORMS_ALL } from "@app/modules/device/constants/device-boards.const";
import { BLOCK_COLORS } from "../../constants/blockly.constants";
import { BlockLevelE, PlatformT } from "../../types";

export const CATEGORY_NAME = "%{BKY_CAT_SENSING}";
export const DISTANCE_CATEGORY = "%{BKY_CAT_SENSING_DISTANCE}";
export const SOUND_CATEGORY = "%{BKY_CAT_SENSING_SOUND}";
export const TEMPERATURE_CATEGORY = "%{BKY_CAT_SENSING_TEMPERATURE}";
export const LIGHT_CATEGORY = "%{BKY_CAT_SENSING_LIGHT}";
export const GESTURE_CATEGORY = "%{BKY_CAT_SENSING_GESTURE}";
export const COLOR_CATEGORY = "%{BKY_CAT_SENSING_COLOR}";
export const MAGNET_CATEGORY = "%{BKY_CAT_SENSING_MAGNET}";
export const VIBRATION_CATEGORY = "%{BKY_CAT_SENSING_VIBRATION}";
export const HUMIDITY_CATEGORY = "%{BKY_CAT_SENSING_HUMIDITY}";
export const GAS_CATEGORY = "%{BKY_CAT_SENSING_GAS}";
export const PRESSURE_CATEGORY = "%{BKY_CAT_SENSING_PRESSURE}";
export const RTC_CATEGORY = "%{BKY_CAT_SENSING_REALTIMECLOCK}";
export const RFID_CATEGORY = "%{BKY_CAT_SENSING_RFID}";
export const COMPASS_CATEGORY = "%{BKY_CAT_SENSING_COMPASS}";
export const GYRO_CATEGORY = "%{BKY_CAT_SENSING_GYRO}";
export const GPS_CATEGORY = "%{BKY_CAT_SENSING_GPS}";
export const BUTTONS_CATEGORY = "%{BKY_CAT_SENSING_BUTTONS}";
export const KNOB_CATEGORY = "%{BKY_CAT_SENSING_KNOB}";
export const JOYSTICK_CATEGORY = "%{BKY_CAT_SENSING_JOYSTICK}";

export const CATEGORY_COLOR = BLOCK_COLORS.SENSORS;
export const CATEGORY_PLATFORMS = Array.from(PLATFORMS_ALL) as PlatformT[];
export const TOOLBOX_LEVEL = BlockLevelE.BEGINNER;
export const DISTANCE_LEVEL = BlockLevelE.BEGINNER;
export const SENSING_SUBCATEGORY_LEVEL = BlockLevelE.INTERMEDIATE;
export const CATEGORY_ORDER = 3;

export const MRTNODE_BOARD_IDS = ["MRTnode"] as const;
export const MRTX_BOARD_IDS = ["uno_mrtx", "mrtx"] as const;

/** NEO-6M GPS default SoftwareSerial wiring on Uno */
export const GPS_DEFAULT_PINS = {
  PIN_TX: "D12",
  PIN_RX: "D11",
} as const;

export const DEFAULT_BUTTON_PIN = "A0";
export const DEFAULT_POTENTIOMETER_PIN = "A0";
export const DEFAULT_JOYSTICK_AXIS_PIN = "A0";
export const DEFAULT_JOYSTICK_BUTTON_PIN = "D2";
export const DEFAULT_ROTARY_ENCODER_PINS = {
  PINDT: "D2",
  PINCLK: "D3",
} as const;
export const DEFAULT_ROTARY_ENCODER_BUTTON_PIN = "D13";

export const SENSOR_INSTANCE_OPTIONS: [string, string][] = [
  ["1", "1"],
  ["2", "2"],
  ["3", "3"],
  ["4", "4"],
];

/** Typical HC-SR04 wiring on Uno (D8 = TRIG, D9 = ECHO) */
export const ULTRASONIC_DEFAULT_PINS = {
  PIN_TRIG: "D8",
  PIN_ECHO: "D9",
} as const;

export const DEFAULT_DHT_PIN = "D10";

/** Typical analog humidity / soil sensor wiring on Uno */
export const DEFAULT_HUMIDITY_ANALOG_PIN = "A0";

/** Typical analog gas / alcohol sensor wiring on Uno */
export const DEFAULT_GAS_ANALOG_PIN = "A0";

/** MFRC522 default wiring (SS / RST) */
export const RFID_DEFAULT_PINS = {
  PIN_SDA: "D10",
  PIN_RST: "D9",
} as const;
