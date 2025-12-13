/**
 * Arduino Code Generator для Blockly 12.x
 *
 * This file defines our own code generator for Arduino/C++
 */

import * as Blockly from "blockly";

/**
 * Initializes the Arduino code generator
 */
export function initializeArduinoGenerator() {
  const win = window as any;

  if (!win.Blockly) {
    console.error("Blockly not available");
    return;
  }

  const arduinoGenerator =
    win.Blockly.Arduino || new Blockly.CodeGenerator("Arduino");
  arduinoGenerator.addReservedWords(
    "Blockly,setup,loop,if,else,for,switch,case,while,do,break,continue,return,goto,define,include,HIGH,LOW,INPUT,OUTPUT,INPUT_PULLUP,true,false,integer,constants,floating,point,void,boolean,char,unsigned,byte,int,word,long,float,double,string,String,array,static,volatile,const,sizeof,pinMode,digitalWrite,digitalRead,analogReference,analogRead,analogWrite,tone,noTone,shiftOut,shitIn,pulseIn,millis,micros,delay,delayMicroseconds,min,max,abs,constrain,map,pow,sqrt,sin,cos,tan,randomSeed,random,detachInterrupt,interrupts,noInterrupts"
  );

  // Create or expand the Arduino generator
  if (!win.Blockly.Arduino) {
    win.Blockly.Arduino = arduinoGenerator;
  }

  /**
   * Order of operation ENUMs.
   *
   */
  arduinoGenerator.ORDER_ATOMIC = 0; // 0 ""  ...
  arduinoGenerator.ORDER_UNARY_POSTFIX = 1; // expr++ expr-- () [] .
  arduinoGenerator.ORDER_UNARY_PREFIX = 2; // -expr !expr ~expr ++expr --expr
  arduinoGenerator.ORDER_MULTIPLICATIVE = 3; // * / %
  arduinoGenerator.ORDER_ADDITIVE = 4; // + -
  arduinoGenerator.ORDER_SHIFT = 5; // << >>
  arduinoGenerator.ORDER_RELATIONAL = 6; // < <= > >=
  arduinoGenerator.ORDER_EQUALITY = 7; // == !=
  arduinoGenerator.ORDER_BITWISE_AND = 8; // &
  arduinoGenerator.ORDER_BITWISE_XOR = 9; // ^
  arduinoGenerator.ORDER_BITWISE_OR = 10; // |
  arduinoGenerator.ORDER_LOGICAL_AND = 11; // &&
  arduinoGenerator.ORDER_LOGICAL_OR = 12; // ||
  arduinoGenerator.ORDER_CONDITIONAL = 13; // ?:
  arduinoGenerator.ORDER_ASSIGNMENT = 14; // = += -= *= /= %= <<= >>= ...
  arduinoGenerator.ORDER_COMMA = 15; // ,
  arduinoGenerator.ORDER_UNARY_NEGATION = 16;
  arduinoGenerator.ORDER_MEMBER = 17;
  arduinoGenerator.ORDER_NONE = 99; // (...)

  /**
   * List of outer-inner pairings that do NOT require parentheses.
   * @type {!Array.<!Array.<number>>}
   */
  arduinoGenerator.ORDER_OVERRIDES = [
    // (foo()).bar -> foo().bar
    // (foo())[0] -> foo()[0]
    [arduinoGenerator.ORDER_FUNCTION_CALL, arduinoGenerator.ORDER_MEMBER],
    // (foo())() -> foo()()
    [
      arduinoGenerator.ORDER_FUNCTION_CALL,
      arduinoGenerator.ORDER_FUNCTION_CALL,
    ],
    // (foo.bar).baz -> foo.bar.baz
    // (foo.bar)[0] -> foo.bar[0]
    // (foo[0]).bar -> foo[0].bar
    // (foo[0])[1] -> foo[0][1]
    [arduinoGenerator.ORDER_MEMBER, arduinoGenerator.ORDER_MEMBER],
    // (foo.bar)() -> foo.bar()
    // (foo[0])() -> foo[0]()
    [arduinoGenerator.ORDER_MEMBER, arduinoGenerator.ORDER_FUNCTION_CALL],
    // !(!foo) -> !!foo
    [arduinoGenerator.ORDER_LOGICAL_NOT, arduinoGenerator.ORDER_LOGICAL_NOT],
    // a * (b * c) -> a * b * c
    [
      arduinoGenerator.ORDER_MULTIPLICATION,
      arduinoGenerator.ORDER_MULTIPLICATION,
    ],
    // a + (b + c) -> a + b + c
    [arduinoGenerator.ORDER_ADDITION, arduinoGenerator.ORDER_ADDITION],
    // a && (b && c) -> a && b && c
    [arduinoGenerator.ORDER_LOGICAL_AND, arduinoGenerator.ORDER_LOGICAL_AND],
    // a || (b || c) -> a || b || c
    [arduinoGenerator.ORDER_LOGICAL_OR, arduinoGenerator.ORDER_LOGICAL_OR],
  ] as [number, number][];

  /**
   * Initialize the database of variable names.
   * @param {!Blockly.Workspace} workspace Workspace to generate code from.
   */
  arduinoGenerator.init = function (workspace: Blockly.Workspace) {
    // Create a dictionary of definitions to be printed at the top of the sketch
    arduinoGenerator.includes_ = {} as Record<string, string>;
    // Create a dictionary of global definitions to be printed after variables
    arduinoGenerator.definitions_ = {} as Record<string, string>;
    // Create a dictionary of variables
    arduinoGenerator.variables_ = {} as Record<string, string>;
    // Create a dictionary of functions from the code generator
    arduinoGenerator.codeFunctions_ = {} as Record<string, string>;
    // Create a dictionary of functions created by the user
    arduinoGenerator.userFunctions_ = {} as Record<string, string>;
    // Create a dictionary mapping desired function names in definitions_
    // to actual function names (to avoid collisions with user functions)
    arduinoGenerator.functionNames_ = {} as Record<string, string>;
    // Create a dictionary of setups to be printed in the setup() function
    arduinoGenerator.setups_ = {} as Record<string, string>;

    if (!arduinoGenerator.variableDB_) {
      arduinoGenerator.variableDB_ = new Blockly.Names(
        arduinoGenerator.RESERVED_WORDS_
      );
    } else {
      arduinoGenerator.variableDB_.reset();
    }

    arduinoGenerator.variableDB_.setVariableMap(workspace.getVariableMap());
    arduinoGenerator.definitions_["variables"] = "";

    // get all types from all variable in workspace
    const variableMap = workspace.getVariableMap();
    const allTypes = variableMap.getTypes();
    for (let i = 0; i < allTypes.length; i++) {
      const defVars: string[] = [];
      // get all variable for one of this type
      const allVarOfType = variableMap.getVariablesOfType(allTypes[i]);
      for (let j = 0; j < allVarOfType.length; j++) {
        defVars.push(allVarOfType[j].getName());
      }
      if (defVars.length > 0) {
        arduinoGenerator.definitions_["variables"] +=
          allTypes[i] + " " + defVars.join(", ") + ";\n";
      }
    }
  };

  /**
   * Prepend the generated code with the variable definitions.
   * @param {string} code Generated code.
   * @return {string} Completed code.
   */
  arduinoGenerator.finish = function (code: string): string {
    const includes: string[] = [],
      definitions: string[] = [],
      variables: string[] = [],
      functions: string[] = [],
      BLOCK_GLOBALS_ARRAY_SIZE: string[] = [];
    for (const name in arduinoGenerator.includes_) {
      includes.push(arduinoGenerator.includes_[name]);
    }
    if (includes.length) includes.push("\n");
    for (const name in arduinoGenerator.definitions_) {
      definitions.push(arduinoGenerator.definitions_[name]);
    }
    if (definitions.length) definitions.push("\n");
    for (const name in arduinoGenerator.variables_) {
      variables.push(arduinoGenerator.variables_[name]);
    }
    if (variables.length) variables.push("\n");
    for (const name in arduinoGenerator.codeFunctions_) {
      functions.push(arduinoGenerator.codeFunctions_[name]);
    }
    for (const name in arduinoGenerator.userFunctions_) {
      functions.push(arduinoGenerator.userFunctions_[name]);
    }
    if (functions.length) functions.push("\n");
    const setups: string[] = [""];
    let userSetupCode = "";
    if (arduinoGenerator.setups_["userSetupCode"] !== undefined) {
      userSetupCode = "\n" + arduinoGenerator.setups_["userSetupCode"];
      delete arduinoGenerator.setups_["userSetupCode"];
    }
    for (var name in arduinoGenerator.setups_) {
      setups.push(arduinoGenerator.setups_[name]);
    }
    if (userSetupCode) setups.push(userSetupCode);

    delete arduinoGenerator.includes_;
    delete arduinoGenerator.definitions_;
    delete arduinoGenerator.codeFunctions_;
    delete arduinoGenerator.userFunctions_;
    delete arduinoGenerator.functionNames_;
    delete arduinoGenerator.setups_;
    delete arduinoGenerator.pins_;
    arduinoGenerator.variableDB_.reset();
    const allDefs =
      includes.join("\n") +
      definitions.join("\n") +
      variables.join("\n") +
      functions.join("\n");
    const setup = "void setup() {" + setups.join("\n  ") + "\n}\n\n";
    const loop = "void loop() {\n  " + code.replace(/\n/g, "\n  ") + "\n}";
    return allDefs + setup + loop;
  };

  /**
   * Naked values are top-level blocks with outputs that aren't plugged into
   * anything.  A trailing semicolon is needed to make this legal.
   * @param {string} line Line of generated code.
   * @return {string} Legal line of code.
   */
  arduinoGenerator.scrubNakedValue = function (line: string): string {
    return line + ";\n";
  };

  /**
   * Encode a string as a properly escaped Arduino string, complete with quotes.
   * @param {string} string Text to encode.
   * @return {string} Arduino string.
   * @private
   */
  arduinoGenerator.quote_ = function (string: string): string {
    return `"${string
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\\n")
      .replace(/\$/g, "\\$")
      .replace(/'/g, "\\'")}"`;
  };

  /**
   * Common tasks for generating Arduino from blocks.
   * Handles comments for the specified block and any connected value blocks.
   * Calls any statements following this block.
   * @param {!Blockly.Block} block The current block.
   * @param {string} code The Arduino code created for this block.
   * @param {boolean=} opt_thisOnly True to generate code for only this statement.
   * @return {string} Arduino code with comments and subsequent blocks added.
   * @private
   */
  arduinoGenerator.scrub_ = function (
    block: Blockly.Block,
    code: string,
    opt_thisOnly?: boolean
  ): string {
    if (code === null) {
      // Block has handled code generation itself.
      return "";
    }
    let commentCode = "";
    // Only collect comments for blocks that aren't inline.
    if (!block.outputConnection || !block.outputConnection.targetConnection) {
      // Collect comment for this block.
      const comment = block.getCommentText();
      if (comment) {
        commentCode += arduinoGenerator.prefixLines(comment, "// ") + "\n";
      }
      // Collect comments for all value arguments.
      // Don't collect comments for nested statements.
      for (let x = 0; x < block.inputList.length; x++) {
        const input = block.inputList[x];
        if (input.type === Blockly.INPUT_VALUE as number) {
          const childBlock = input.connection?.targetBlock();
          if (childBlock) {
            const comment = arduinoGenerator.allNestedComments(childBlock);
            if (comment) {
              commentCode += arduinoGenerator.prefixLines(comment, "// ");
            }
          }
        }
      }
    }
    var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    var nextCode = arduinoGenerator.blockToCode(nextBlock);
    return commentCode + code + nextCode;
  };

  //  if (!arduinoGenerator.forBlock) {
  //    arduinoGenerator.forBlock = {} as Record<
  //      string,
  //      (block: Blockly.Block, generator: any) => string | [string, number]
  //    >;
  //  }
  // arduinoGenerator.forBlock["logic_boolean"] = function (
  //   block: Blockly.Block
  // ): [string, number] {
  //   const value = block.getFieldValue("BOOL") === "TRUE" ? "true" : "false";
  //   return [value, arduinoGenerator.ORDER_ATOMIC];
  // };
  

  // Save the generated code
  // if (!win.Blockly.Arduino.definitions_) {
  //   win.Blockly.Arduino.definitions_ = {} as Record<string, string>;
  // }
  // if (!win.Blockly.Arduino.includes_) {
  //   win.Blockly.Arduino.includes_ = {} as Record<string, string>;
  // }
  // if (!win.Blockly.Arduino.setups_) {
  //   win.Blockly.Arduino.setups_ = {} as Record<string, string>;
  // }
  // if (!win.Blockly.Arduino.variables_) {
  //   win.Blockly.Arduino.variables_ = {} as Record<string, string>;
  // }
  // if (!win.Blockly.Arduino.functions_) {
  //   win.Blockly.Arduino.functions_ = {} as Record<string, string>;
  // }

  // // forBlock - object to register generators for individual blocks
  // if (!win.Blockly.Arduino.forBlock) {
  //   win.Blockly.Arduino.forBlock = {} as Record<
  //     string,
  //     (block: Blockly.Block, generator: any) => string | [string, number]
  //   >;
  // }

  // // Generator name
  // win.Blockly.Arduino.name_ = "Arduino";

  // /**
  //  * Generates code for a single block
  //  */
  // win.Blockly.Arduino.blockToCode = function (
  //   block: Blockly.Block
  // ): string | null {
  //   if (!block || !block.isEnabled()) {
  //     return null;
  //   }

  //   const func = this.forBlock[block.type];
  //   if (!func) {
  //     return null;
  //   }

  //   const code = func.call(this, block, this);

  //   if (Array.isArray(code)) {
  //     // [code, order] - return only the code
  //     return code[0];
  //   }

  //   return code as string;
  // };

  // /**
  //  * Generates code for statement input
  //  */
  // win.Blockly.Arduino.statementToCode = function (
  //   block: Blockly.Block,
  //   name: string
  // ): string {
  //   const targetBlock = block.getInputTargetBlock(name);
  //   let code = "";

  //   let currentBlock = targetBlock;
  //   while (currentBlock) {
  //     const blockCode = this.blockToCode(currentBlock);
  //     if (blockCode) {
  //       code += blockCode;
  //       if (!blockCode.endsWith("\n")) {
  //         code += "\n";
  //       }
  //     }
  //     currentBlock = currentBlock.getNextBlock();
  //   }

  //   return code;
  // };

  // /**
  //  * Generates code for value input
  //  */
  // win.Blockly.Arduino.valueToCode = function (
  //   block: Blockly.Block,
  //   name: string,
  //   outerOrder: number
  // ): string {
  //   if (outerOrder === undefined) {
  //     outerOrder = this.ORDER_NONE;
  //   }

  //   const targetBlock = block.getInputTargetBlock(name);
  //   if (!targetBlock) {
  //     return "";
  //   }

  //   const blockCode = this.blockToCode(targetBlock);
  //   if (!blockCode) {
  //     return "";
  //   }

  //   // If an array [code, order] is returned
  //   if (Array.isArray(blockCode)) {
  //     const [code, order] = blockCode;
  //     if (order !== undefined && order < outerOrder) {
  //       return `(${code})`;
  //     }
  //     return code;
  //   }

  //   return blockCode;
  // };

  // /**
  //  * Generates the final Arduino code
  //  */
  // win.Blockly.Arduino.workspaceToCode = function (
  //   workspace: Blockly.Workspace
  // ): string {
  //   // Clear previous data
  //   this.definitions_ = {};
  //   this.includes_ = {};
  //   this.setups_ = {};
  //   this.variables_ = {};
  //   this.functions_ = {};

  //   // Generates code for all top-level blocks
  //   const blocks = workspace.getTopBlocks(true);
  //   let loopCode = "";

  //   for (const block of blocks) {
  //     const code = this.blockToCode(block);
  //     if (code) {
  //       loopCode += code;
  //       if (!code.endsWith("\n")) {
  //         loopCode += "\n";
  //       }
  //     }
  //   }

  //   // Collect the final code
  //   let finalCode = "";

  //   // 1. Includes
  //   const includesList = Object.values(this.includes_);
  //   if (includesList.length > 0) {
  //     finalCode += includesList.join("\n") + "\n\n";
  //   }

  //   // 2. Definitions (variables, constants)
  //   const definitionsList = Object.values(this.definitions_);
  //   if (definitionsList.length > 0) {
  //     finalCode += definitionsList.join("\n") + "\n\n";
  //   }

  //   // 3. Functions
  //   const functionsList = Object.values(this.functions_);
  //   if (functionsList.length > 0) {
  //     finalCode += functionsList.join("\n\n") + "\n\n";
  //   }

  //   // 4. setup() function
  //   const setupsList = Object.values(this.setups_);
  //   if (setupsList.length > 0) {
  //     finalCode += "void setup() {\n";
  //     for (const setup of setupsList) {
  //       const setupCode = setup as string;
  //       const lines = setupCode.split("\n").filter((line) => line.trim());
  //       for (const line of lines) {
  //         finalCode += "  " + line + "\n";
  //       }
  //     }
  //     finalCode += "}\n\n";
  //   } else {
  //     finalCode += "void setup() {\n}\n\n";
  //   }

  //   // 5. loop() function
  //   finalCode += "void loop() {\n";
  //   if (loopCode && loopCode.trim()) {
  //     const lines = loopCode.split("\n").filter((line: string) => line.trim());
  //     for (const line of lines) {
  //       finalCode += "  " + line + "\n";
  //     }
  //   }
  //   finalCode += "}\n";

  //   return finalCode;
  // };

  return win.Blockly.Arduino;
}
