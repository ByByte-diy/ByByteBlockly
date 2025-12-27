import { BlockBuilder } from "../../lib/builders";
import { CATEGORY_COLOR, CATEGORY_NAME, CATEGORY_PLATFORMS, TOOLBOX_LEVEL } from "./config";

// Map function
export const mapBlock = new BlockBuilder("math_map")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["math", "map"])
  .addDummyInput("MAP_DUMMY", "%{BKY_MATH_MAP_MSG_MAP}")
  .addValueInput("NUM", null, "Number")
  .addValueInput("DMIN", "%{BKY_MATH_MAP_MSG_FROM}", "Number")
  .setShadowBlock("math_number", { NUM: 0 })
  .addValueInput("DMAX", "-", "Number")
  .setShadowBlock("math_number", { NUM: 1023 })
  .addValueInput("CMIN", "%{BKY_MATH_MAP_MSG_TO}", "Number")
  .setShadowBlock("math_number", { NUM: 0 })
  .addValueInput("CMAX", "-", "Number")
  .setShadowBlock("math_number", { NUM: 255 })
  .addDummyInput("")
  .setOutput("Number")
  .setTooltip("Map value from one range to another")
  .setArduinoGenerator((block) => {
    const num =
      (window as any).Blockly.Arduino.valueToCode(block, "NUM", 0) || "0";
    const dmin =
      (window as any).Blockly.Arduino.valueToCode(block, "DMIN", 0) || "0";
    const dmax =
      (window as any).Blockly.Arduino.valueToCode(block, "DMAX", 0) || "1023";
    const cmin =
      (window as any).Blockly.Arduino.valueToCode(block, "CMIN", 0) || "0";
    const cmax =
      (window as any).Blockly.Arduino.valueToCode(block, "CMAX", 0) || "255";
    return [`map(${num}, ${dmin}, ${dmax}, ${cmin}, ${cmax})`, 0];
  })
  .build();