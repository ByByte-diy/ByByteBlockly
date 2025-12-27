/**
 * Base Setup/Loop Block
 */

import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_NAME,
  CATEGORY_COLOR,
  CATEGORY_LEVEL,
  CATEGORY_PLATFORMS,
} from "./config";

/**
 * Main Arduino program structure block
 * Contains setup() and loop() sections
 */
export const setupLoopBlock = new BlockBuilder("base_setup_loop")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(CATEGORY_LEVEL)
  .setTags(["essential", "structure"])

  .addStatementInput("DO", "%{BKY_GENERIC_SETUP}")
  .addStatementInput("LOOP", "%{BKY_GENERIC_LOOP}")

  .setTooltip("%{BKY_GENERIC_SETUP_LOOP_TOOLTIP}")
  .setHelpUrl(
    "https://docs.arduino.cc/learn/programming/sketches/#setup-and-loop"
  )
  .setDeletable(false)

  .setOnChange(function (event: any) {
    if (!this.workspace || this.workspace.isDragging() || this.isInFlyout) {
      return;
    }

    // Only process on create/move events
    if (!event || (event.type !== "create" && event.type !== "move")) {
      return;
    }

    const blocks = this.workspace.getTopBlocks(false);
    const setupLoopBlocks = blocks.filter(
      (block: any) =>
        block.type === "base_setup_loop" &&
        block.id !== this.id &&
        !block.isInFlyout
    );

    // Remove duplicate base_setup_loop blocks
    for (const block of setupLoopBlocks) {
      if (block.workspace && !block.isInFlyout) {
        block.dispose(true);
      }
    }

    // Remove conflicting base_loop blocks
    const baseLoopBlocks = blocks.filter(
      (block: any) => block.type === "base_loop" && !block.isInFlyout
    );
    for (const block of baseLoopBlocks) {
      if (block.workspace && !block.isInFlyout) {
        block.dispose(true);
      }
    }
  })

  .setArduinoGenerator((block, generator) => {
    const setupCode = generator.statementToCode(block, "DO");
    const loopCode = generator.statementToCode(block, "LOOP");

    if (setupCode) {
      generator.setups_["setup"] = setupCode;
    }

    return loopCode;
  })

  .build();
