import { PLATFORMS_ALL } from "@app/modules/device/constants/device-boards.const";
import { BLOCK_COLORS } from "../../constants/blockly.constants";
import { BlockLevelE, PlatformT } from "../../types";

export const CATEGORY_NAME = "%{BKY_CAT_MOTORS}";
export const SERVO_CATEGORY = "%{BKY_CAT_MOTORS_SERVO}";
export const STEPPER_CATEGORY = "%{BKY_CAT_MOTORS_STEPPER}";
export const DC_CATEGORY = "%{BKY_CAT_MOTORS_DC}";

export const CATEGORY_COLOR = BLOCK_COLORS.ACTUATORS;
export const CATEGORY_PLATFORMS = Array.from(PLATFORMS_ALL) as PlatformT[];
export const TOOLBOX_LEVEL = BlockLevelE.INTERMEDIATE;
export const SERVO_LEVEL = BlockLevelE.INTERMEDIATE;
export const ADVANCED_MOTOR_LEVEL = BlockLevelE.ADVANCED;
export const CATEGORY_ORDER = 12;

export const MRTDUINO_BOARD_IDS = ["mrtduino", "MRTnode", "mrtx"] as const;
export const MRTX_BOARD_IDS = ["uno_mrtx", "mrtx"] as const;
export const MRTNODE_BOARD_IDS = ["MRTnode"] as const;

/** Default DRV8833 wiring (Arduino D5, D6, D9, D10) */
export const DRV8833_DEFAULT_PINS = {
  AIN1: "D5",
  AIN2: "D6",
  BIN1: "D9",
  BIN2: "D10",
} as const;

/** Typical L298N wiring on Uno/Nano (D5–D10, ENA/ENB = PWM) */
export const L298N_DEFAULT_PINS = {
  ENA: "D5",
  ENB: "D6",
  IN1: "D7",
  IN2: "D8",
  IN3: "D9",
  IN4: "D10",
} as const;

export const STEPPER_ID_OPTIONS: [string, string][] = [
  ["1", "1"],
  ["2", "2"],
  ["3", "3"],
  ["4", "4"],
];

export const PCA9685_CHANNEL_OPTIONS: [string, string][] = [
  ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"],
  ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"],
  ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"],
  ["12", "12"], ["13", "13"], ["14", "14"], ["15", "15"],
];

export const DC_MOTOR_SIDE_OPTIONS: [string, string][] = [
  ["right", "6"],
  ["left", "5"],
  ["right & left", "11"],
];

export const DC_DIRECTION_OPTIONS: [string, string][] = [
  ["forward", "1"],
  ["backward", "0"],
];

export const AFMOTOR_DIRECTION_OPTIONS: [string, string][] = [
  ["forward", "a"],
  ["turn right", "d"],
  ["turn left", "g"],
];

export const ADAFRUIT_MOTOR_OPTIONS: [string, string][] = [
  ["M1", "1"],
  ["M2", "2"],
  ["M3", "3"],
  ["M4", "4"],
];

export const ADAFRUIT_RUN_OPTIONS: [string, string][] = [
  ["forward", "FORWARD"],
  ["backward", "BACKWARD"],
  ["stop", "RELEASE"],
];

export const MRT_CONNECTOR_OPTIONS: [string, string][] = [
  ["ML1", "ML1"],
  ["MR1", "MR1"],
  ["ML2", "ML2"],
  ["MR2", "MR2"],
];

export const MRT_NODE_CONNECTOR_OPTIONS: [string, string][] = [
  ["ML1", "MOTOR_L1"],
  ["MR1", "MOTOR_R1"],
  ["ML2", "MOTOR_L2"],
  ["MR2", "MOTOR_R2"],
];

export const MRT_DIRECTION_OPTIONS: [string, string][] = [
  ["Forward", "HIGH"],
  ["Backward", "LOW"],
];

export const MRT_NODE_DIRECTION_OPTIONS: [string, string][] = [
  ["Forward", "0"],
  ["Backward", "1"],
];
