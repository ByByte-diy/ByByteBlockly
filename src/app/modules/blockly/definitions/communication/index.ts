import { BlockRegistry } from "../../lib/registry/block-registry";
import { IToolboxCategoryConfig } from "../../types/toolbox.types";
import { BLUETOOTH_BLOCKS } from "./bluetooth/bluetooth.blocks";
import {
  BLUETOOTH_CATEGORY,
  CATEGORY_COLOUR,
  CATEGORY_NAME,
  CATEGORY_ORDER,
  KEYBOARD_CATEGORY,
  KEYBOARD_COLOUR,
  KEYBOARD_LEVEL,
  MUVISION_CATEGORY,
  MUVISION_LEVEL,
  REMOTE_CATEGORY,
  SERIAL_CATEGORY,
  SOFT_SERIAL_CATEGORY,
  TOOLBOX_LEVEL,
} from "./config";
import { KEYBOARD_BLOCKS } from "./keyboard/keyboard.blocks";
import { MUVISION_BLOCKS } from "./muvision/muvision.blocks";
import { REMOTE_BLOCKS } from "./remote/remote.blocks";
import { SERIAL_BLOCKS } from "./serial/serial.blocks";
import { SOFT_SERIAL_BLOCKS } from "./soft-serial/soft-serial.blocks";

export const COMMUNICATION_BLOCKS = [
  ...SERIAL_BLOCKS,
  ...SOFT_SERIAL_BLOCKS,
  ...BLUETOOTH_BLOCKS,
  ...REMOTE_BLOCKS,
  ...KEYBOARD_BLOCKS,
  ...MUVISION_BLOCKS,
];

export function initialize(): void {
  BlockRegistry.registerMany(COMMUNICATION_BLOCKS);

  BlockRegistry.registerCategory(CATEGORY_NAME, {
    name: CATEGORY_NAME,
    colour: CATEGORY_COLOUR,
    requiredPlatform: "both",
    order: CATEGORY_ORDER,
    minLevel: TOOLBOX_LEVEL,
    isContainer: true,
  } as IToolboxCategoryConfig);

  BlockRegistry.registerCategory(SERIAL_CATEGORY, {
    name: SERIAL_CATEGORY,
    colour: CATEGORY_COLOUR,
    order: CATEGORY_ORDER,
    subOrder: 0,
    parentCategory: CATEGORY_NAME,
    minLevel: TOOLBOX_LEVEL,
  } as IToolboxCategoryConfig);

  BlockRegistry.registerCategory(SOFT_SERIAL_CATEGORY, {
    name: SOFT_SERIAL_CATEGORY,
    colour: CATEGORY_COLOUR,
    order: CATEGORY_ORDER,
    subOrder: 1,
    parentCategory: CATEGORY_NAME,
    minLevel: TOOLBOX_LEVEL,
  } as IToolboxCategoryConfig);

  BlockRegistry.registerCategory(BLUETOOTH_CATEGORY, {
    name: BLUETOOTH_CATEGORY,
    colour: CATEGORY_COLOUR,
    order: CATEGORY_ORDER,
    subOrder: 2,
    parentCategory: CATEGORY_NAME,
    minLevel: TOOLBOX_LEVEL,
  } as IToolboxCategoryConfig);

  BlockRegistry.registerCategory(REMOTE_CATEGORY, {
    name: REMOTE_CATEGORY,
    colour: CATEGORY_COLOUR,
    order: CATEGORY_ORDER,
    subOrder: 3,
    parentCategory: CATEGORY_NAME,
    minLevel: TOOLBOX_LEVEL,
  } as IToolboxCategoryConfig);

  BlockRegistry.registerCategory(KEYBOARD_CATEGORY, {
    name: KEYBOARD_CATEGORY,
    colour: KEYBOARD_COLOUR,
    order: CATEGORY_ORDER,
    subOrder: 4,
    parentCategory: CATEGORY_NAME,
    minLevel: KEYBOARD_LEVEL,
  } as IToolboxCategoryConfig);

  BlockRegistry.registerCategory(MUVISION_CATEGORY, {
    name: MUVISION_CATEGORY,
    colour: CATEGORY_COLOUR,
    order: CATEGORY_ORDER,
    subOrder: 5,
    parentCategory: CATEGORY_NAME,
    minLevel: MUVISION_LEVEL,
  } as IToolboxCategoryConfig);
}
