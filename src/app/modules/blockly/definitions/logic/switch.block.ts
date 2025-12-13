import * as Blockly from "blockly";
import { BlockBuilder } from "../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  TOOLBOX_LEVEL,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
} from "./config";
import { BlockDefinition } from "../../types/block.types";
import { MutatorRegistry } from "../../lib/registry/mutator-registry";

/**
 * Switch mutator mixin
 * Handles dynamic case/default blocks through mutator dialog
 */
const SWITCH_MUTATOR_MIXIN = {
  mutationToDom: function(this: Blockly.Block) {
    const casebreakCount = (this as any).casebreakCount_ || 0;
    const defaultCount = (this as any).defaultCount_ || 0;
    if (!casebreakCount && !defaultCount) return null;
    
    const container = document.createElement('mutation');
    if (casebreakCount) {
      container.setAttribute('casebreak', casebreakCount.toString());
    }
    if (defaultCount) {
      container.setAttribute('default', '1');
    }
    return container;
  },
  
  domToMutation: function(this: Blockly.Block, xmlElement: Element) {
    const win = window as any;
    const BlocklyGlobal = win.Blockly;
    
    const casebreakCount = parseInt(xmlElement.getAttribute('casebreak') || '0', 10);
    const defaultCount = parseInt(xmlElement.getAttribute('default') || '0', 10);
    
    (this as any).casebreakCount_ = casebreakCount;
    (this as any).defaultCount_ = defaultCount;
    
    for (let i = 1; i <= casebreakCount; i++) {
      (this as any).appendValueInput('CASE' + i)
        .setAlign(BlocklyGlobal.ALIGN_RIGHT)
        .appendField('case');
      (this as any).appendStatementInput('DO' + i)
        .setAlign(BlocklyGlobal.ALIGN_RIGHT)
        .appendField('do');
    }
    
    if (defaultCount) {
      (this as any).appendStatementInput('DEFAULT')
        .setAlign(BlocklyGlobal.ALIGN_RIGHT)
        .appendField('default');
    }
  },
  
  decompose: function(this: Blockly.Block, workspace: Blockly.Workspace) {
    const containerBlock = workspace.newBlock('controls_switch_var');
    (containerBlock as any).initSvg();
    let connection = containerBlock.getInput('STACK')!.connection;
    
    const casebreakCount = (this as any).casebreakCount_ || 0;
    for (let i = 1; i <= casebreakCount; i++) {
      const casebreakBlock = workspace.newBlock('controls_case_break');
      (casebreakBlock as any).initSvg();
      connection!.connect(casebreakBlock.previousConnection!);
      connection = casebreakBlock.nextConnection;
    }
    
    const defaultCount = (this as any).defaultCount_ || 0;
    if (defaultCount) {
      const defaultBlock = workspace.newBlock('controls_case_default');
      (defaultBlock as any).initSvg();
      connection!.connect(defaultBlock.previousConnection!);
    }
    
    return containerBlock;
  },
  
  compose: function(this: Blockly.Block, containerBlock: Blockly.Block) {
    const win = window as any;
    const BlocklyGlobal = win.Blockly;
    
    const oldDefaultCount = (this as any).defaultCount_ || 0;
    if (oldDefaultCount) {
      (this as any).removeInput('DEFAULT');
    }
    (this as any).defaultCount_ = 0;
    
    const oldCaseCount = (this as any).casebreakCount_ || 0;
    for (let i = oldCaseCount; i > 0; i--) {
      (this as any).removeInput('CASE' + i);
      (this as any).removeInput('DO' + i);
    }
    (this as any).casebreakCount_ = 0;
    
    let clauseBlock = containerBlock.getInputTargetBlock('STACK');
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'controls_case_break':
          (this as any).casebreakCount_++;
          const caseNum = (this as any).casebreakCount_;
          const ifInput = (this as any).appendValueInput('CASE' + caseNum)
            .setAlign(BlocklyGlobal.ALIGN_RIGHT)
            .setCheck('Number')
            .appendField('case');
          const doInput = (this as any).appendStatementInput('DO' + caseNum)
            .setAlign(BlocklyGlobal.ALIGN_RIGHT)
            .appendField('do');
          
          if ((clauseBlock as any).valueConnection_) {
            ifInput.connection!.connect((clauseBlock as any).valueConnection_);
          }
          if ((clauseBlock as any).statementConnection_) {
            doInput.connection!.connect((clauseBlock as any).statementConnection_);
          }
          break;
        
        case 'controls_case_default':
          (this as any).defaultCount_++;
          const defaultInput = (this as any).appendStatementInput('DEFAULT')
            .setAlign(BlocklyGlobal.ALIGN_RIGHT)
            .appendField('default');
          
          if ((clauseBlock as any).statementConnection_) {
            defaultInput.connection!.connect((clauseBlock as any).statementConnection_);
          }
          break;
      }
      clauseBlock = clauseBlock.nextConnection?.targetBlock() || null;
    }
  },
  
  saveConnections: function(this: Blockly.Block, containerBlock: Blockly.Block) {
    let clauseBlock = containerBlock.getInputTargetBlock('STACK');
    let i = 1;
    
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'controls_case_break':
          const inputIf = (this as any).getInput('CASE' + i);
          const inputDo = (this as any).getInput('DO' + i);
          (clauseBlock as any).valueConnection_ = inputIf?.connection?.targetConnection || null;
          (clauseBlock as any).statementConnection_ = inputDo?.connection?.targetConnection || null;
          i++;
          break;
        
        case 'controls_case_default':
          const inputDefault = (this as any).getInput('DEFAULT');
          (clauseBlock as any).statementConnection_ = inputDefault?.connection?.targetConnection || null;
          break;
      }
      clauseBlock = clauseBlock.nextConnection?.targetBlock() || null;
    }
  },
};

/**
 * Register switch mutator in the central registry
 * Will be initialized when MutatorRegistry.initializeAll() is called
 */
MutatorRegistry.define({
  name: 'controls_switch_mutator',
  mixin: SWITCH_MUTATOR_MIXIN,
  helperBlocks: ['controls_case_break', 'controls_case_default'],
  init: function(this: Blockly.Block) {
    (this as any).casebreakCount_ = 0;
    (this as any).defaultCount_ = 0;
  },
});

export const switchBlock = new BlockBuilder("controls_switch")
  .setCategory(CATEGORY_NAME)
  .setColor(CATEGORY_COLOR)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["logic", "switch", "case"])
  .addDummyInput("SWITCH_DUMMY", "switch")
  .addVariableField("SWVAR", "item", "SWITCH_DUMMY")
  .addValueInput("CASE0", "case", "Number")
  .addStatementInput("DO0", "do")
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setMutator("controls_switch_mutator")
  .setTooltip("Switch statement")
  .setHelpUrl("https://docs.arduino.cc/learn/programming/reference/#control-structure")
  
  .setArduinoGenerator((block, generator) => {
    const win = window as any;
    let n = 0;
    const switchvar = generator.variableDB_?.getName
      ? generator.variableDB_.getName(block.getFieldValue('SWVAR'), win.Blockly?.Variables?.NAME_TYPE)
      : block.getFieldValue('SWVAR') || 'item';
    
    let argument = generator.valueToCode(block, 'CASE' + n, generator.ORDER_NONE) || '0';
    let branch = generator.statementToCode(block, 'DO' + n);
    let code = 'switch (' + switchvar + ') {\n' + '  case ' + argument + ':\n' + branch + '    break;\n';
    
    const casebreakCount = (block as any).casebreakCount_ || 0;
    const defaultCount = (block as any).defaultCount_ || 0;
    
    for (n = 1; n <= casebreakCount; n++) {
      argument = generator.valueToCode(block, 'CASE' + n, generator.ORDER_NONE) || '0';
      branch = generator.statementToCode(block, 'DO' + n);
      code += '  case ' + argument + ':\n' + branch + '    break;\n';
    }
    
    if (defaultCount) {
      branch = generator.statementToCode(block, 'DEFAULT');
      code += '  default:\n' + branch;
    }
    
    code += '}\n';
    return code;
  })
  .build();

// Helper blocks for mutator
export const switchVarBlock: BlockDefinition = {
  type: "controls_switch_var",
  category: "Mutator", // Special category for mutator blocks
  level: TOOLBOX_LEVEL,
  platform: CATEGORY_PLATFORMS[0],
  metadata: {
    requiredPlatform: CATEGORY_PLATFORMS[0],
    minLevel: TOOLBOX_LEVEL,
    tags: ["mutator", "hidden"], // Mark as mutator helper
    deprecated: false,
  },
  config: {
    type: "controls_switch_var",
    category: CATEGORY_NAME,
    color: CATEGORY_COLOR,
    platforms: CATEGORY_PLATFORMS,
    level: TOOLBOX_LEVEL,
    inputs: [],
    fields: [],
    generators: {},
  },
  init: function(this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField("switch");
    this.appendStatementInput("STACK");
    this.setTooltip("Container for switch cases");
    (this as any).contextMenu = false;
  },
  generator: () => "",
};

export const caseBreakBlock: BlockDefinition = {
  type: "controls_case_break",
  category: "Mutator", // Special category for mutator blocks
  level: TOOLBOX_LEVEL,
  platform: CATEGORY_PLATFORMS[0],
  metadata: {
    requiredPlatform: CATEGORY_PLATFORMS[0],
    minLevel: TOOLBOX_LEVEL,
    tags: ["mutator", "hidden"], // Mark as mutator helper
    deprecated: false,
  },
  config: {
    type: "controls_case_break",
    category: CATEGORY_NAME,
    color: CATEGORY_COLOR,
    platforms: CATEGORY_PLATFORMS,
    level: TOOLBOX_LEVEL,
    inputs: [],
    fields: [],
    generators: {},
  },
  init: function(this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField("case");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip("Add case to switch");
    (this as any).contextMenu = false;
  },
  generator: () => "",
};

export const caseDefaultBlock: BlockDefinition = {
  type: "controls_case_default",
  category: "Mutator", // Special category for mutator blocks
  level: TOOLBOX_LEVEL,
  platform: CATEGORY_PLATFORMS[0],
  metadata: {
    requiredPlatform: CATEGORY_PLATFORMS[0],
    minLevel: TOOLBOX_LEVEL,
    tags: ["mutator", "hidden"], // Mark as mutator helper
    deprecated: false,
  },
  config: {
    type: "controls_case_default",
    category: CATEGORY_NAME,
    color: CATEGORY_COLOR,
    platforms: CATEGORY_PLATFORMS,
    level: TOOLBOX_LEVEL,
    inputs: [],
    fields: [],
    generators: {},
  },
  init: function(this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField("default");
    this.setPreviousStatement(true);
    this.setTooltip("Add default case to the switch");
    (this as any).contextMenu = false;
  },
  generator: () => "",
};
