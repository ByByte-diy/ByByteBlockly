/**
 * Arduino Code Generator for Blockly 13.x
 *
 * This file defines our own code generator for Arduino/C++
 */

import * as Blockly from "blockly";
import { joinSketchSection } from "./codegen-sections.helper";
import { IncludeRegistry } from "./include-registry.helper";

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

  // Legacy BlocklyDuino aliases used by migrated blocks
  arduinoGenerator.ORDER_FUNCTION_CALL = arduinoGenerator.ORDER_UNARY_POSTFIX;
  arduinoGenerator.ORDER_MODULUS = arduinoGenerator.ORDER_MULTIPLICATIVE;
  arduinoGenerator.ORDER_MULTIPLICATION = arduinoGenerator.ORDER_MULTIPLICATIVE;
  arduinoGenerator.ORDER_ADDITION = arduinoGenerator.ORDER_ADDITIVE;
  arduinoGenerator.ORDER_LOGICAL_NOT = arduinoGenerator.ORDER_UNARY_PREFIX;

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
    arduinoGenerator.includeRegistry_ = new IncludeRegistry();
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
    // Which sketch sections to emit (even when empty)
    arduinoGenerator.sketchFlags_ = {
      emitSetup: false,
      emitLoop: false,
    };

    if (!arduinoGenerator.nameDB_) {
      arduinoGenerator.nameDB_ = new Blockly.Names(
        arduinoGenerator.RESERVED_WORDS_
      );
    } else {
      arduinoGenerator.nameDB_.reset();
    }

    // get all types from all variable in workspace
    const variableMap = workspace.getVariableMap();
    arduinoGenerator.nameDB_.setVariableMap(variableMap);
  };

  /**
   * Prepend the generated code with the variable definitions.
   * @param {string} code Generated code.
   * @return {string} Completed code.
   */
  arduinoGenerator.finish = function (code: string): string {
    const definitions: string[] = [],
      variables: string[] = [],
      functions: string[] = [],
      BLOCK_GLOBALS_ARRAY_SIZE: string[] = [];
    const includeLines =
      arduinoGenerator.includeRegistry_?.renderLines() ?? [];
    const includes = includeLines.length ? [includeLines.join("\n")] : [];
    for (const name in arduinoGenerator.definitions_) {
      definitions.push(arduinoGenerator.definitions_[name]);
    }
    for (const name in arduinoGenerator.variables_) {
      variables.push(arduinoGenerator.variables_[name]);
    }
    for (const name in arduinoGenerator.codeFunctions_) {
      functions.push(arduinoGenerator.codeFunctions_[name]);
    }
    for (const name in arduinoGenerator.userFunctions_) {
      functions.push(arduinoGenerator.userFunctions_[name]);
    }
    const setups: string[] = [];
    let userSetupCode = "";
    if (arduinoGenerator.setups_["userSetupCode"] !== undefined) {
      userSetupCode = arduinoGenerator.setups_["userSetupCode"];
      delete arduinoGenerator.setups_["userSetupCode"];
    }
    for (const name in arduinoGenerator.setups_) {
      setups.push(arduinoGenerator.setups_[name]);
    }

    const sketchFlags = arduinoGenerator.sketchFlags_ || {
      emitSetup: false,
      emitLoop: false,
    };

    delete arduinoGenerator.includeRegistry_;
    delete arduinoGenerator.definitions_;
    delete arduinoGenerator.codeFunctions_;
    delete arduinoGenerator.userFunctions_;
    delete arduinoGenerator.functionNames_;
    delete arduinoGenerator.setups_;
    delete arduinoGenerator.pins_;
    delete arduinoGenerator.sketchFlags_;
    arduinoGenerator.nameDB_.reset();

    const allDefs =
      joinSketchSection("Libraries (#include)", includes) +
      joinSketchSection("Constants and helper functions", definitions) +
      joinSketchSection("Global variables", variables) +
      joinSketchSection("Functions", functions);

    const setupBody = [...setups, userSetupCode]
      .join("\n")
      .replace(/^\s+|\s+$/g, "");
    const loopBody = code.replace(/^\s+|\s+$/g, "");

    let sketch = allDefs;
    if (setupBody || sketchFlags.emitSetup) {
      sketch += `void setup() {\n${setupBody}\n}\n\n`;
    }
    if (loopBody || sketchFlags.emitLoop) {
      sketch += `void loop() {\n${loopBody}\n}\n`;
    }

    return sketch.replace(/^\s+\n/, "").replace(/\n\s+$/, "\n");
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
        if (input.type === (Blockly.INPUT_VALUE as number)) {
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

  arduinoGenerator.DEF_FUNC_NAME = "FUNCTION_NAME_PLACEHOLDER_";
  arduinoGenerator.FUNCTION_NAME_PLACEHOLDER_ = "%1";

  /**
   * Add a helper function to codeFunctions_ (legacy BlocklyDuino API).
   */
  arduinoGenerator.addFunction = function (
    preferredName: string,
    code: string
  ): string {
    if (!arduinoGenerator.codeFunctions_[preferredName]) {
      const uniqueName = arduinoGenerator.nameDB_.getDistinctName(
        preferredName,
        Blockly.Names.NameType.DEVELOPER_VARIABLE
      );
      arduinoGenerator.codeFunctions_[preferredName] = code.replace(
        arduinoGenerator.DEF_FUNC_NAME,
        uniqueName
      );
      arduinoGenerator.functionNames_[preferredName] = uniqueName;
    }
    return arduinoGenerator.functionNames_[preferredName];
  };

  /**
   * Provide a helper function in definitions_ (legacy Blockly API).
   */
  arduinoGenerator.provideFunction_ = function (
    desiredName: string,
    codeLines: string[]
  ): string {
    if (!arduinoGenerator.definitions_[desiredName]) {
      const fnName = arduinoGenerator.nameDB_.getDistinctName(
        desiredName,
        "PROCEDURE"
      );
      arduinoGenerator.functionNames_[desiredName] = fnName;
      let code = codeLines
        .join("\n")
        .replace(/%1/g, fnName);
      let normalized = "";
      do {
        normalized = code;
        code = code.replace(/^((  )*)  /gm, "$1\u0000");
      } while (code !== normalized);
      code = code.replace(/\0/g, "  ");
      arduinoGenerator.definitions_[desiredName] = code;
    }
    return arduinoGenerator.functionNames_[desiredName];
  };

  arduinoGenerator.getArduinoType_ = function (type: string): string {
    return (
      {
        BYTE: "byte",
        INTEGER: "int",
        UNUMBER: "unsigned int",
        LARGE_NUMBER: "long",
        DECIMAL: "float",
        TEXT: "String",
        CHARACTER: "char",
        BOOL: "boolean",
        NULL: "void",
        // ARRAY: arduinoGenerator.getArduinoType_(type),
        UNDEF: "undefined",
        CHILD_BLOCK_MISSING: "int",
      }[type] || "Invalid Blockly Type"
    );
  };

  return win.Blockly.Arduino;
}
