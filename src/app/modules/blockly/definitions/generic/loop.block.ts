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

  .addStatementInput("DO", "Loop")

  .setTooltip("Loop section - runs repeatedly")
  .setHelpUrl(
    "https://docs.arduino.cc/learn/programming/sketches/#setup-and-loop"
  )
  .setDeletable(true)

  .setArduinoGenerator((block, generator) => {
    const loopCode = generator.statementToCode(block, "DO");
    return loopCode || "";
  })

  .build();
