/**
 * Base Setup Block
 */

import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_NAME,
  CATEGORY_COLOR,
  CATEGORY_LEVEL,
  CATEGORY_PLATFORMS,
} from "./config";

/**
 * Arduino setup section block (alternative to setup-loop)
 */
export const setupBlock = new BlockBuilder("base_setup")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(CATEGORY_LEVEL)
  .setTags(["structure"])

  .addStatementInput("DO", "%{BKY_GENERIC_SETUP}")

  .setTooltip("%{BKY_GENERIC_SETUP_TOOLTIP}")
  .setHelpUrl(
    "https://docs.arduino.cc/learn/programming/sketches/#setup-and-loop"
  )
  .setDeletable(true)

  .setArduinoGenerator((block, generator) => {
    const setupCode = generator.statementToCode(block, "DO");

    generator.sketchFlags_.emitSetup = true;

    if (setupCode) {
      generator.setups_["setup"] = setupCode;
    }

    return "";
  })

  .build();
