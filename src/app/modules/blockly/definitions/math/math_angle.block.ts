/**
 * Custom Arduino math blocks
 */

import { BlockBuilder } from "../../lib/builders/block-builder";
import { CATEGORY_COLOR, CATEGORY_NAME, CATEGORY_PLATFORMS, TOOLBOX_LEVEL } from "./config";

// Angle number (0-360)
export const angleBlock = new BlockBuilder("math_angle")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["math", "angle"])
  .addDummyInput("")
  .addAngleField("ANGLE", 90)
  .setOutput("Number")
  .setTooltip("%{BKY_MATH_ANGLE_TOOLTIP}")
  .setHelpUrl("https://docs.arduino.cc/learn/programming/sketches")
  .setArduinoGenerator((block) => {
    const angle = block.getFieldValue("ANGLE");
    return [angle, 0];
  })
  .build();
