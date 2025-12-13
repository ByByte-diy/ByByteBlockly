/**
 * Fluent API Builder for creating Blockly blocks
 */

import * as Blockly from "blockly";
import {
  IBlockConfig,
  BlockDefinition,
  InputConfig,
  FieldConfig,
  GeneratorFunction,
  PlatformT,
  BlockLevelE,
  InputType,
  FieldType,
} from "../../types/block.types";
import { DropdownBoardOptionT } from "@app/modules/device/types/device-board-profile.type";

/**
 * BlockBuilder - Fluent API for creating blocks
 */
export class BlockBuilder {
  private config: Partial<IBlockConfig>;

  constructor(type: string) {
    this.config = {
      type,
      inputs: [],
      fields: [],
      generators: {},
      platforms: ["arduino"],
      level: BlockLevelE.BEGINNER,
      color: 20,
      category: "base",
      deletable: true,
      movable: true,
      editable: true,
    };
  }

  /**
   * Set block category
   */
  setCategory(category: string): this {
    this.config.category = category;
    return this;
  }

  /**
   * Set block color
   */
  setColor(color: number): this {
    this.config.color = color;
    return this;
  }

  /**
   * Set supported platforms
   */
  setPlatforms(platforms: PlatformT[]): this {
    this.config.platforms = platforms;
    return this;
  }

  /**
   * Set supported boards
   */
  setBoards(boards: string[]): this {
    this.config.boards = boards;
    return this;
  }

  /**
   * Set difficulty level
   */
  setLevel(level: BlockLevelE): this {
    this.config.level = level;
    return this;
  }

  /**
   * Set tags for filtering
   */
  setTags(tags: string[]): this {
    this.config.tags = tags;
    return this;
  }

  /**
   * Add statement input
   */
  // prettier-ignore
  addStatementInput(name: string, label?: string, check?: string | string[] | null): this {
    this.config.inputs!.push({
      type: "statement",
      name,
      label,
      check,
    });
    return this;
  }

  /**
   * Add value input
   */
  // prettier-ignore
  addValueInput(name: string, label?: string, check?: string | string[] | null ): this {
    this.config.inputs!.push({
      type: "value",
      name,
      label,
      check,
    });
    return this;
  }

  /**
   * Set shadow block for the last value input
   * @param type Block type (e.g., "math_number")
   * @param fields Field values for the shadow block (e.g., { NUM: 10 })
   */
  setShadowBlock(type: string, fields?: { [key: string]: any }): this {
    const inputs = this.config.inputs || [];
    // Find last value input
    for (let i = inputs.length - 1; i >= 0; i--) {
      if (inputs[i].type === "value") {
        inputs[i].shadow = { type, fields };
        break;
      }
    }
    return this;
  }

  /**
   * Add dummy input
   * @param name Name of the input (optional, auto-generated if not provided)
   * @param label Label text to display
   */
  addDummyInput(name?: string, label?: string): this {
    const inputName = name || `DUMMY_${this.config.inputs!.length}`;
    this.config.inputs!.push({
      type: "dummy",
      name: inputName,
      label,
    });
    return this;
  }

  /**
   * Add text field
   */
  addTextField(name: string, value: string = ""): this {
    this.config.fields!.push({
      type: "text",
      name,
      value,
    });
    return this;
  }

  /**
   * Add number field
   */
  // prettier-ignore
  addNumberField(name: string, value: number = 0, min?: number, max?: number, precision?: number): this {
    this.config.fields!.push({
      type: "number",
      name,
      value,
      min,
      max,
      precision,
    });
    return this;
  }

  /**
   * Add dropdown field
   */
  // prettier-ignore
  addDropdownField(name: string, options: DropdownBoardOptionT[], defaultValue?: string): this {
    this.config.fields!.push({
      type: "dropdown",
      name,
      options,
      value: defaultValue,
    });
    return this;
  }

  /**
   * Add checkbox field
   */
  addCheckboxField(name: string, checked: boolean = false): this {
    this.config.fields!.push({
      type: "checkbox",
      name,
      value: checked ? "TRUE" : "FALSE",
    });
    return this;
  }

  /**
   * Add angle field
   */
  addAngleField(name: string, angle: number = 90): this {
    this.config.fields!.push({
      type: "angle",
      name,
      value: angle,
    });
    return this;
  }

  /**
   * Add image field (icon)
   */
  addImageField(
    src: string,
    width: number = 24,
    height: number = 24,
    alt?: string
  ): this {
    this.config.fields!.push({
      type: "image",
      name: `IMAGE_${this.config.fields!.length}`,
      value: src,
      width,
      height,
      alt: alt || "",
    });
    return this;
  }

  /**
   * Add variable field (dropdown for variable selection)
   * @param name Field name
   * @param variableType Variable type (e.g., Blockly.Variables.NAME_TYPE)
   * @param inputName Optional: name of the input to attach this field to
   */
  addVariableField(name: string, variableType?: string, inputName?: string): this {
    this.config.fields!.push({
      type: "variable",
      name,
      value: variableType, // Variable type (e.g., Blockly.Variables.NAME_TYPE)
      inputName, // Optional: specify which input to attach to
    });
    return this;
  }

  /**
   * Set message with interpolation
   */
  setMessage(message: string, args?: any[]): this {
    this.config.message = message;
    this.config.args = args;
    return this;
  }

  /**
   * Set previous statement connection
   */
  setPreviousStatement(check?: string | string[] | boolean | null): this {
    if (check === undefined || check === true) {
      this.config.previousStatement = null;
    } else if (check === false) {
      this.config.previousStatement = false;
    } else {
      this.config.previousStatement = check;
    }
    return this;
  }

  /**
   * Set next statement connection
   */
  setNextStatement(check?: string | string[] | boolean | null): this {
    if (check === undefined || check === true) {
      this.config.nextStatement = null;
    } else if (check === false) {
      this.config.nextStatement = false;
    } else {
      this.config.nextStatement = check;
    }
    return this;
  }

  /**
   * Set output connection
   */
  setOutput(check?: string | string[] | null): this {
    if (check === undefined || check === null) {
      this.config.output = null;
    } else {
      this.config.output = check;
    }
    return this;
  }

  /**
   * Set tooltip
   */
  setTooltip(tooltip: string): this {
    this.config.tooltip = tooltip;
    return this;
  }

  /**
   * Set help URL
   */
  setHelpUrl(url: string): this {
    this.config.helpUrl = url;
    return this;
  }

  /**
   * Set if block is deletable
   */
  setDeletable(deletable: boolean): this {
    this.config.deletable = deletable;
    return this;
  }

  /**
   * Set if block is movable
   */
  setMovable(movable: boolean): this {
    this.config.movable = movable;
    return this;
  }

  /**
   * Set if block is editable
   */
  setEditable(editable: boolean): this {
    this.config.editable = editable;
    return this;
  }

  /**
   * Add mutator
   */
  setMutator(mutator: string): this {
    this.config.mutator = mutator;
    return this;
  }

  /**
   * Add extensions
   */
  setExtensions(extensions: string[]): this {
    this.config.extensions = extensions;
    return this;
  }

  /**
   * Set onchange handler
   */
  setOnChange(handler: (event: Blockly.Events.Abstract) => void): this {
    this.config.onchange = handler;
    return this;
  }

  /**
   * Set generator for specific platform
   */
  setGenerator(platform: string, generator: GeneratorFunction): this {
    this.config.generators![platform] = generator;
    return this;
  }

  /**
   * Set Arduino generator
   */
  setArduinoGenerator(generator: GeneratorFunction): this {
    return this.setGenerator("arduino", generator);
  }

  /**
   * Set Python generator
   */
  setPythonGenerator(generator: GeneratorFunction): this {
    return this.setGenerator("python", generator);
  }

  /**
   * Build the block definition
   */
  build(): BlockDefinition {
    const config = this.config as IBlockConfig;

    return {
      type: config.type,
      category: config.category || "Other",
      platform: config.platforms?.[0] as any,
      level: config.level,
      metadata: {
        requiredPlatform: config.platforms?.[0] as any,
        minLevel: config.level,
        tags: [],
        deprecated: false,
      },
      generator: config.generators["arduino"],
      config,
      init: function (this: Blockly.Block) {
        // Set color
        this.setColour(config.color);

        // Manual input building
        for (const input of config.inputs || []) {
          let blockInput: Blockly.Input;

          switch (input.type) {
            case "statement":
              blockInput = this.appendStatementInput(input.name);
              if (input.check !== undefined) {
                blockInput.setCheck(input.check);
              }
              break;
            case "value":
              blockInput = this.appendValueInput(input.name);
              if (input.check !== undefined) {
                blockInput.setCheck(input.check);
              }
              // Add shadow block if configured
              if (input.shadow && this.workspace) {
                const shadowBlock = this.workspace.newBlock(input.shadow.type);
                shadowBlock.setShadow(true);
                if (input.shadow.fields) {
                  for (const [fieldName, fieldValue] of Object.entries(input.shadow.fields)) {
                    shadowBlock.setFieldValue(fieldValue, fieldName);
                  }
                }
                if (blockInput!.connection && shadowBlock.outputConnection) {
                  blockInput.connection.connect(shadowBlock.outputConnection);
                }
              }
              break;
            case "dummy":
              blockInput = this.appendDummyInput(input.name);
              break;
          }

          if (input.label) {
            blockInput!.appendField(input.label);
          }

          // Add fields that are specifically attached to this input
          for (const field of config.fields || []) {
            if (field.inputName === input.name) {
              const fieldInstance = createField(field);
              blockInput!.appendField(fieldInstance, field.name);
            }
          }
        }

        // Add standalone fields (not attached to specific inputs)
        for (const field of config.fields || []) {
          // Skip fields that are already attached to specific inputs
          if (field.inputName) continue;
          
          const lastInput = this.inputList[this.inputList.length - 1];
          if (lastInput) {
            lastInput.appendField(createField(field), field.name);
          }
        }

        // Set connections
        if (
          config.previousStatement !== undefined &&
          config.previousStatement !== false
        ) {
          this.setPreviousStatement(
            true,
            config.previousStatement === null
              ? null
              : (config.previousStatement as string | string[])
          );
        }
        if (
          config.nextStatement !== undefined &&
          config.nextStatement !== false
        ) {
          this.setNextStatement(
            true,
            config.nextStatement === null
              ? null
              : (config.nextStatement as string | string[])
          );
        }
        if (config.output !== undefined && config.output !== false) {
          this.setOutput(
            true,
            config.output === null ? null : (config.output as string | string[])
          );
        }

        // Set properties
        if (config.tooltip) {
          this.setTooltip(config.tooltip);
        }
        if (config.helpUrl) {
          this.setHelpUrl(config.helpUrl);
        }
        if (config.deletable !== undefined) {
          this.setDeletable(config.deletable);
        }
        if (config.movable !== undefined) {
          this.setMovable(config.movable);
        }
        if (config.editable !== undefined) {
          this.setEditable(config.editable);
        }

        // Set mutator extension
        if (config.mutator) {
          Blockly.Extensions.apply(config.mutator, this, true);
        }

        // Set onchange handler
        if (config.onchange) {
          this.setOnChange(config.onchange);
        }
      },
    };
  }
}

/**
 * Helper function to create Blockly fields
 */
function createField(fieldConfig: FieldConfig): Blockly.Field {
  switch (fieldConfig.type) {
    case "text":
      return new Blockly.FieldTextInput(fieldConfig.value || "");
    case "number":
      return new Blockly.FieldNumber(
        fieldConfig.value || 0,
        fieldConfig.min,
        fieldConfig.max,
        fieldConfig.precision
      );
    case "dropdown":
      return new Blockly.FieldDropdown(fieldConfig.options || []);
    case "checkbox":
      return new Blockly.FieldCheckbox(fieldConfig.value || "FALSE");
    case "angle":
      // FieldAngle not available in this version, use number instead
      return new Blockly.FieldNumber(fieldConfig.value || 90, 0, 360);
    case "color":
      // FieldColour might not be available, use text field
      return new Blockly.FieldTextInput(fieldConfig.value || "#ff0000");
    case "image":
      return new Blockly.FieldImage(
        fieldConfig.value,
        fieldConfig.width,
        fieldConfig.height,
        fieldConfig.alt
      );
    case "variable":
      // FieldVariable for variable selection dropdown
      // Use default variable name if no value specified
      const defaultVarName = fieldConfig.value || "item";
      const fieldVar = new Blockly.FieldVariable(defaultVarName);
      return fieldVar;
    default:
      return new Blockly.FieldTextInput("");
  }
}
