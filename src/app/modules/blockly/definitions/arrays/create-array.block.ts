import * as Blockly from "blockly";
import { BlockBuilder } from "../../lib/builders/block-builder";
import { registerGlobalVariable } from "../../lib/generators/codegen-sections.helper";
import {
  createVariableField,
  VARIABLE_TYPE_OPTIONS,
} from "../../lib/variables/variable-type.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  TOOLBOX_LEVEL,
} from "./config";
import {
  DIMENSION_OPTIONS,
  updateArrayDimensionInputs,
  attachArrayDimensionSerialization,
} from "./array-dimension.helper";

export const createArrayBlock = new BlockBuilder("array_create")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["arrays", "create"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setHelpUrl("https://www.arduino.cc/reference/en/language/variables/variable-types-and-constants/")
  .setArduinoGenerator((block, generator) => {
    const varName = generator.getVariableName(block.getFieldValue("VAR"));
    const typeBlock = (generator as any).getArduinoType_(
      block.getFieldValue("type")
    );
    const mode = block.getFieldValue("choix");
    const dimension = parseInt(block.getFieldValue("dim"), 10);
    let indices = "";

    if (mode === "c1") {
      for (let i = 0; i < dimension; i++) {
        const size =
          generator.valueToCode(block, "D" + i, generator.ORDER_ASSIGNMENT) ||
          "1";
        indices += `[${size}]`;
      }
      registerGlobalVariable(
        generator,
        varName,
        `${typeBlock} ${varName}${indices};`,
        `Array ${varName} — size set by block.`
      );
      return "";
    }

    let init = "{";
    let sizeSuffix = "";
    for (let i = 0; i < dimension; i++) {
      const content =
        generator.valueToCode(block, "D" + i, generator.ORDER_ASSIGNMENT) ||
        "0";
      const parts = content.split(",");
      init += content + ",";
      sizeSuffix += `[${parts.length}]`;
    }
    init = init.slice(0, -1) + "}";
    registerGlobalVariable(
      generator,
      varName,
      `${typeBlock} ${varName}${sizeSuffix}=${init};`,
      `Array ${varName} with initial values.`
    );
    return "";
  })
  .build();

createArrayBlock.init = function (this: Blockly.Block) {
  this.setColour(CATEGORY_COLOR);
  this.appendDummyInput()
    .appendField(Blockly.Msg["ARRAY_create"] || "set array")
    .appendField(createVariableField(), "VAR")
    .appendField(Blockly.Msg["VARIABLES_AS"] || "as")
    .appendField(new Blockly.FieldDropdown(VARIABLE_TYPE_OPTIONS), "type")
    .appendField(Blockly.Msg["ARRAY_dim"] || "size of")
    .appendField(
      new Blockly.FieldDropdown(DIMENSION_OPTIONS, (option) => {
        (this as any).updateShape_(option);
        return undefined;
      }),
      "dim"
    );
  this.appendValueInput("D0").appendField(
    new Blockly.FieldDropdown([
      [Blockly.Msg["ARRAY_taille"] || "size", "c1"],
      [Blockly.Msg["ARRAY_contenu"] || "which contains", "c2"],
    ]),
    "choix"
  );
  this.setInputsInline(true);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  this.setTooltip(
    Blockly.Msg["ARRAY_GETINDEX_TOOLTIP2"] ||
      "Create an array of the selected type."
  );

  (this as any).updateShape_ = function (option: string) {
    updateArrayDimensionInputs(this, option);
  };
  attachArrayDimensionSerialization(this);
};
