import * as Blockly from "blockly";

type ProcedureBlock = Blockly.Block & {
  arguments_: string[];
  getProcedureDef(): [string, string[], boolean];
};

const PROCEDURE_NAME = Blockly.Names.NameType.PROCEDURE;
const VARIABLE_NAME = Blockly.Names.NameType.VARIABLE;

/** Arduino generators for Blockly standard procedure blocks. */
export function registerProcedureGenerators(arduinoGenerator: any): void {
  arduinoGenerator.forBlock["procedures_defnoreturn"] = function (
    block: ProcedureBlock
  ) {
    const funcName = arduinoGenerator.nameDB_.getName(
      block.getFieldValue("NAME"),
      PROCEDURE_NAME
    );
    let branch = arduinoGenerator.statementToCode(block, "STACK");
    if (arduinoGenerator.INFINITE_LOOP_TRAP) {
      branch = arduinoGenerator.INFINITE_LOOP_TRAP.replace(
        /%1/g,
        `'${block.id}'`
      ) + branch;
    }

    const args = (block.arguments_ ?? []).map(
      (arg) => `int ${arduinoGenerator.nameDB_.getName(arg, VARIABLE_NAME)}`
    );
    const code = `void ${funcName}(${args.join(", ")}) {\n${branch}}\n`;
    arduinoGenerator.codeFunctions_[funcName] = arduinoGenerator.scrub_(
      block,
      code
    );
    return "";
  };

  arduinoGenerator.forBlock["procedures_defreturn"] = function (
    block: ProcedureBlock
  ) {
    const funcName = arduinoGenerator.nameDB_.getName(
      block.getFieldValue("NAME"),
      PROCEDURE_NAME
    );
    let branch = arduinoGenerator.statementToCode(block, "STACK");
    if (arduinoGenerator.INFINITE_LOOP_TRAP) {
      branch = arduinoGenerator.INFINITE_LOOP_TRAP.replace(
        /%1/g,
        `'${block.id}'`
      ) + branch;
    }

    let returnValue =
      arduinoGenerator.valueToCode(block, "RETURN", arduinoGenerator.ORDER_NONE) ||
      "";
    if (returnValue) {
      returnValue = `  return ${returnValue};\n`;
    }

    const args = (block.arguments_ ?? []).map(
      (arg) => `int ${arduinoGenerator.nameDB_.getName(arg, VARIABLE_NAME)}`
    );
    const code = `int ${funcName}(${args.join(", ")}) {\n${branch}${returnValue}}\n`;
    arduinoGenerator.codeFunctions_[funcName] = arduinoGenerator.scrub_(
      block,
      code
    );
    return "";
  };

  arduinoGenerator.forBlock["procedures_callreturn"] = function (
    block: ProcedureBlock
  ) {
    const funcName = arduinoGenerator.nameDB_.getName(
      block.getFieldValue("NAME"),
      PROCEDURE_NAME
    );
    const args: string[] = [];
    for (let i = 0; i < (block.arguments_?.length ?? 0); i++) {
      args[i] =
        arduinoGenerator.valueToCode(
          block,
          "ARG" + i,
          arduinoGenerator.ORDER_NONE
        ) || "0";
    }
    return [`${funcName}(${args.join(", ")})`, arduinoGenerator.ORDER_UNARY_POSTFIX];
  };

  arduinoGenerator.forBlock["procedures_callnoreturn"] = function (
    block: ProcedureBlock
  ) {
    const funcName = arduinoGenerator.nameDB_.getName(
      block.getFieldValue("NAME"),
      PROCEDURE_NAME
    );
    const args: string[] = [];
    for (let i = 0; i < (block.arguments_?.length ?? 0); i++) {
      args[i] =
        arduinoGenerator.valueToCode(
          block,
          "ARG" + i,
          arduinoGenerator.ORDER_NONE
        ) || "0";
    }
    return `${funcName}(${args.join(", ")});\n`;
  };

  arduinoGenerator.forBlock["procedures_ifreturn"] = function (block: Blockly.Block) {
    const hasReturn = (block as any).hasReturnValue_;
    if (hasReturn) {
      const value =
        arduinoGenerator.valueToCode(block, "VALUE", arduinoGenerator.ORDER_NONE) ||
        "0";
      return `  return ${value};\n`;
    }
    return "  return;\n";
  };
}
