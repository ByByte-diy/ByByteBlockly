import { getAnalogPins } from "@app/modules/device/helpers/device-board-globals.helper";
import { BlockBuilder } from "../../lib/builders/block-builder";
import { CATEGORY_COLOR, CATEGORY_NAME, CATEGORY_PLATFORMS, TOOLBOX_LEVEL } from "./config";

// Analog pin dropdown
export const analogPinBlock = new BlockBuilder("math_analog_pin")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["math", "analog", "input"])
  .addDummyInput("")
  .addDropdownField("PIN", getAnalogPins())
  .setOutput("AnalogPin")
  .setTooltip("%{BKY_MATH_ANALOG_INPUT_TOOLTIP}")
  .setHelpUrl("https://docs.arduino.cc/learn/programming/sketches")
  .setArduinoGenerator((block) => {
    const pin = block.getFieldValue("PIN");
    return [pin, 0];
  })
  .build();
