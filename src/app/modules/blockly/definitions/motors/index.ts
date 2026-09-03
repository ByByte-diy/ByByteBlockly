import { BlockRegistry } from "../../lib/registry/block-registry";
import { IToolboxCategoryConfig } from "../../types/toolbox.types";
import {
  ADVANCED_MOTOR_LEVEL,
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_ORDER,
  DC_CATEGORY,
  SERVO_CATEGORY,
  SERVO_LEVEL,
  STEPPER_CATEGORY,
  TOOLBOX_LEVEL,
} from "./config";
import { SERVO_BLOCKS } from "./servo/servo.blocks";
import { STEPPER_BLOCKS } from "./stepper/stepper.blocks";
import { DC_MOTOR_BLOCKS } from "./dc/dc-motor.blocks";
import { MRT_MOTOR_BLOCKS } from "./mrt/mrt-motor.blocks";

export const MOTORS_BLOCKS = [
  ...SERVO_BLOCKS,
  ...STEPPER_BLOCKS,
  ...DC_MOTOR_BLOCKS,
  ...MRT_MOTOR_BLOCKS,
];

export function initialize(): void {
  BlockRegistry.registerMany(MOTORS_BLOCKS);

  BlockRegistry.registerCategory(CATEGORY_NAME, {
    name: CATEGORY_NAME,
    colour: CATEGORY_COLOR,
    order: CATEGORY_ORDER,
    minLevel: TOOLBOX_LEVEL,
    isContainer: true,
  } as IToolboxCategoryConfig);

  BlockRegistry.registerCategory(SERVO_CATEGORY, {
    name: SERVO_CATEGORY,
    colour: CATEGORY_COLOR,
    order: CATEGORY_ORDER,
    subOrder: 0,
    parentCategory: CATEGORY_NAME,
    minLevel: SERVO_LEVEL,
  } as IToolboxCategoryConfig);

  BlockRegistry.registerCategory(STEPPER_CATEGORY, {
    name: STEPPER_CATEGORY,
    colour: CATEGORY_COLOR,
    order: CATEGORY_ORDER,
    subOrder: 1,
    parentCategory: CATEGORY_NAME,
    minLevel: ADVANCED_MOTOR_LEVEL,
  } as IToolboxCategoryConfig);

  BlockRegistry.registerCategory(DC_CATEGORY, {
    name: DC_CATEGORY,
    colour: CATEGORY_COLOR,
    order: CATEGORY_ORDER,
    subOrder: 2,
    parentCategory: CATEGORY_NAME,
    minLevel: ADVANCED_MOTOR_LEVEL,
  } as IToolboxCategoryConfig);
}

export { SERVO_BLOCKS, STEPPER_BLOCKS, DC_MOTOR_BLOCKS, MRT_MOTOR_BLOCKS };
