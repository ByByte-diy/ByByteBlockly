/**
 * Base Loop Block
 */

import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_NAME,
  CATEGORY_COLOR,
  CATEGORY_LEVEL,
  CATEGORY_PLATFORMS,
} from "./config";

/**
 * Arduino loop section block (alternative to setup-loop)
 */
export const loopBlock = new BlockBuilder("base_loop")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(CATEGORY_LEVEL)
  .setTags(["structure"])

  .addStatementInput("DO", "%{BKY_GENERIC_LOOP}")

  .setTooltip("%{BKY_GENERIC_LOOP_TOOLTIP}")
  .setHelpUrl(
    "https://docs.arduino.cc/learn/programming/sketches/#setup-and-loop"
  )
  .setDeletable(true)

  .setArduinoGenerator((block, generator) => {
    const loopCode = generator.statementToCode(block, "DO");
    generator.sketchFlags_.emitLoop = true;
    return loopCode || "";
  })

  .build();
