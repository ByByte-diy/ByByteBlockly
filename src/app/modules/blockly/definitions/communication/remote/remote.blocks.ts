import * as Blockly from "blockly";
import { applyDefaultDropdownFields, getAllPins } from "@app/modules/device/helpers/device-board-globals.helper";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import {
  registerDefinition,
  registerGlobalVariable,
  registerInclude,
} from "../../../lib/generators/codegen-sections.helper";
import { BlockDefinition } from "../../../types/block.types";
import {
  CATEGORY_COLOUR,
  CATEGORY_PLATFORMS,
  commBlockLabel,
  createBlockIconField,
  DEFAULT_IR_PIN,
  IR_MRT_KEY_OPTIONS,
  IR_REMOTE_KEY_OPTIONS,
  MRT_CHANNEL_OPTIONS,
  REMOTE_CATEGORY,
  TOOLBOX_LEVEL,
} from "../config";

function msg(key: string, fallback: string): string {
  return Blockly.Msg[key] || fallback;
}

function applyCommColour(block: BlockDefinition): void {
  const originalInit = block.init;
  block.init = function (this: Blockly.Block) {
    originalInit.call(this);
    this.setColour(CATEGORY_COLOUR);
  };
}

function ensureIrRemoteInfrastructure(generator: any, pin: string): void {
  registerInclude(
    generator,
    "IRremote.h",
    "IRremote library — IR remote receiver."
  );
  registerGlobalVariable(
    generator,
    "reception_function",
    `IRrecv ir_rx(${pin});\n` +
      "decode_results ir_rx_results;\n\n" +
      "unsigned long fnc_ir_rx_decode()\n" +
      " {\n" +
      "  bool decoded=false;\n" +
      "  if( ir_rx.decode(&ir_rx_results))\n" +
      "	{\n" +
      "		decoded=true;\n" +
      "		ir_rx.resume();\n" +
      "	}\n" +
      "	if(decoded) \n" +
      "		return ir_rx_results.value; \n" +
      "	else \n" +
      "		return 0;\n" +
      " }",
    "IR receiver on pin and fnc_ir_rx_decode() — pressed button code."
  );
}

const MRT_IRRC_DEFINITIONS = `#define Timeout 500
#define Shift 8
unsigned long time, dtime,timeout_mark;
unsigned long res = 0;
unsigned long Button_ID = 0;
unsigned int buf = 0;
byte impuls = 1;
byte Channl_ID = 1;
byte Button_en = 0;
byte state = 0;
byte Channl_buf = 0;

bool RC(long BT_ID)
{
  if (Timeout < millis() - timeout_mark)
   Button_ID = 0x733;
  if (BT_ID == Button_ID)
    return 1;
  return 0;
}

void IRRC_setup(int pin, uint8_t Channl)
{
  pinMode(pin, INPUT);
  digitalWrite(pin, HIGH);
  time = micros();
  enableInterrupt(pin, change, CHANGE);
 switch ( Channl )
  {
    case 1:
   Channl_ID = 0xFC;
    return;
    case 2:
    Channl_ID = 0x3C;
    return;
    case 3:
    Channl_ID = 0xCC;
    return;
    case 4:
    Channl_ID = 0x0C;
    return;
    case 5:
    Channl_ID = 0xF0;
    return;
    case 6:
    Channl_ID = 0x30;
    return;
    case 7:
    Channl_ID = 0xC0;
    return;
    case 8:
    Channl_ID = 0x00;
    return;
  }
}

void change()
{
  dtime = micros();
  buf = dtime - time ;
  time = dtime;
  if (buf % 200 > 101)
  {
    buf = (buf / 200) + 1;
  }
  else
  {
    buf = buf / 200;
  }
  if (buf == 0) buf = 1;
  if (state == 0)
  {
      if (!impuls)
      {
        state++;
        res = 0;
        res = res << buf;
      }
  } else {
    if (impuls)
    {
      res = res << buf;
      for (int i = 0; i < buf ; i++)
     {
        res |= 1 << i ;
      }
    }else{
      res = res << buf;
      if ((byte)(res & 0x7F) == 0x38)
      {
        buf = 1;
        for (int i = 1; i < Shift; i ++)
          buf = (buf << 1) + 1;
        Channl_buf = (res >> 6) & buf ;
        if (Channl_buf == Channl_ID)
        {
          Button_ID = res >> (6+Shift);
          while(!(Button_ID & 1)) Button_ID = Button_ID >> 1;
          timeout_mark = millis();
        }
        state = 0;
        res = 0;
      }
    }
  }
  impuls = !impuls;
}
`;

/** Setup IR receiver — place once in Setup (before loop). */
export const irRemoteSetupBlock = new BlockBuilder("ir_remote_setup")
  .setCategory(REMOTE_CATEGORY)
  .setColor(20)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["communication", "remote", "ir", "init"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setTooltip("%{BKY_GENERAL_IR_SETUP_TOOLTIP}")
  .setArduinoGenerator((block, generator) => {
    ensureIrRemoteInfrastructure(generator, block.getFieldValue("PIN_IR"));
    return "ir_rx.enableIRIn();\n";
  })
  .build();

irRemoteSetupBlock.init = function (this: Blockly.Block) {
  this.appendDummyInput()
    .appendField(createBlockIconField("genericRC.png", "remoteWide"))
    .appendField(
      commBlockLabel("COMM_IR_RECEIVER_INIT", "Initialize IR receiver")
    )
    .appendField(msg("PIN", "PIN"))
    .appendField(new Blockly.FieldDropdown(getAllPins()), "PIN_IR");
  applyDefaultDropdownFields(this, { PIN_IR: DEFAULT_IR_PIN }, getAllPins);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  this.setInputsInline(true);
};

/** Read IR key code — use in conditions with ir_remote_key block. */
export const irRemoteReadBlock = new BlockBuilder("ir_remote_read")
  .setCategory(REMOTE_CATEGORY)
  .setColor(20)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["communication", "remote", "ir"])
  .setOutput("Number")
  .setTooltip("%{BKY_GENERAL_IR_READ_TOOLTIP}")
  .setArduinoGenerator((_block, generator) => [
    "(unsigned long)fnc_ir_rx_decode()",
    generator.ORDER_ATOMIC,
  ])
  .build();

irRemoteReadBlock.init = function (this: Blockly.Block) {
  this.appendDummyInput()
    .appendField(createBlockIconField("genericRC.png", "remoteWide"))
    .appendField(msg("GENERAL_IR_READ", "IR key pressed"));
  this.setOutput(true, "Number");
};

export const irRemoteKeyBlock = new BlockBuilder("ir_remote_key")
  .setCategory(REMOTE_CATEGORY)
  .setColor(20)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["communication", "remote", "ir"])
  .setOutput("Number")
  .setArduinoGenerator((block, generator) => {
    const key = block.getFieldValue("KEY");
    return [`(${key})`, generator.ORDER_ATOMIC];
  })
  .build();

irRemoteKeyBlock.init = function (this: Blockly.Block) {
  this.appendDummyInput()
    .appendField(createBlockIconField("mando.png", "remoteKey"))
    .appendField(msg("KEY", "key"))
    .appendField(new Blockly.FieldDropdown(IR_REMOTE_KEY_OPTIONS), "KEY");
  this.setOutput(true, "Number");
  this.setInputsInline(true);
};

/** Setup MRT IR remote — place once in Setup. */
export const irMrtInitBlock = new BlockBuilder("ir_mrt_init")
  .setCategory(REMOTE_CATEGORY)
  .setColor(20)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["communication", "remote", "ir", "mrt", "init"])
  .setPreviousStatement(true)
  .setNextStatement(true)
  .setTooltip("%{BKY_MRT_IR_SETUP_TOOLTIP}")
  .setArduinoGenerator((block, generator) => {
    const pin = block.getFieldValue("PIN_IR");
    const channel = block.getFieldValue("CHANNEL");
    registerInclude(
      generator,
      "EnableInterrupt.h",
      "EnableInterrupt library — pin change interrupts for MRT remote."
    );
    registerDefinition(
      generator,
      "defines_remoteMRT",
      MRT_IRRC_DEFINITIONS.trimEnd(),
      "MRT IR remote support: variables, RC() and IRRC_setup()."
    );
    return `IRRC_setup(${pin}, ${channel});\n`;
  })
  .build();

irMrtInitBlock.init = function (this: Blockly.Block) {
  this.appendDummyInput()
    .appendField(createBlockIconField("genericRC.png", "remoteMedium"))
    .appendField(
      commBlockLabel("COMM_MRT_REMOTE_INIT", "Initialize MRT IR remote")
    )
    .appendField(msg("PIN2", "interrupt PIN"))
    .appendField(new Blockly.FieldDropdown(getAllPins()), "PIN_IR")
    .appendField(msg("MRT_CHANNEL", "channel"))
    .appendField(new Blockly.FieldDropdown(MRT_CHANNEL_OPTIONS), "CHANNEL");
  applyDefaultDropdownFields(this, { PIN_IR: DEFAULT_IR_PIN }, getAllPins);
  this.setPreviousStatement(true, null);
  this.setNextStatement(true, null);
  this.setInputsInline(true);
};

export const irMrtKeyBlock = new BlockBuilder("ir_mrt_key")
  .setCategory(REMOTE_CATEGORY)
  .setColor(20)
  .setPlatforms(CATEGORY_PLATFORMS)
  .setLevel(TOOLBOX_LEVEL)
  .setTags(["communication", "remote", "ir", "mrt"])
  .setOutput("Boolean")
  .setArduinoGenerator((block, generator) => {
    const key = block.getFieldValue("KEY");
    return [`RC(${key})`, generator.ORDER_ATOMIC];
  })
  .build();

irMrtKeyBlock.init = function (this: Blockly.Block) {
  this.appendDummyInput()
    .appendField(createBlockIconField("remotecontrol.png", "remoteKey"))
    .appendField(msg("MRT_KEY", "key MRT"))
    .appendField(new Blockly.FieldDropdown(IR_MRT_KEY_OPTIONS), "KEY")
    .appendField(msg("MRT_PRESSED", "pressed?"));
  this.setOutput(true, "Boolean");
  this.setInputsInline(true);
};

export const REMOTE_BLOCKS = [
  irRemoteSetupBlock,
  irMrtInitBlock,
  irRemoteReadBlock,
  irRemoteKeyBlock,
  irMrtKeyBlock,
].map((block) => {
  applyCommColour(block);
  return block;
});
