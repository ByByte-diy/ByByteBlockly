import * as Blockly from "blockly";
import { BlockBuilder } from "../../lib/builders/block-builder";
import { BlockDefinition } from "../../types/block.types";
import {
  BUTTON_OPTIONS,
  CATEGORY_NAME,
  CATEGORY_PLATFORMS,
  ESCORNABOT_APP_URL,
  ESCORNABOT_HELP_URL,
  LED_OPTIONS,
  MODE_OPTIONS,
  MOVEMENT_COLOR,
  SENSOR_COLOR,
  SPIN_VELOCITY_OPTIONS,
  TOOLBOX_LEVEL,
} from "./config";
import {
  createBlockIconField,
  ensureEscornabotAppLib,
  ensureEscornabotLib,
  escornabotLabel,
  registerEscornabotAppSetup,
  registerEscornabotIrSetup,
  registerEscornabotUsSetup,
} from "./escornabot.helper";

function buildEscornabotInit(): BlockDefinition {
  const block = new BlockBuilder("escornabot_init")
    .setCategory(CATEGORY_NAME)
    .setColor(0)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["escornabot", "robot", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(false)
    .setHelpUrl(ESCORNABOT_HELP_URL)
    .setTooltip("%{BKY_ESCORNABOT_INIT_TOOLTIP}")
    .setArduinoGenerator((b, generator) => {
      ensureEscornabotLib(generator, b.getFieldValue("escornabot_mode_choice"));
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(MOVEMENT_COLOR);
    this.appendDummyInput("")
      .appendField(createBlockIconField("escornabot.png", "large"))
      .appendField(escornabotLabel("ESCORNABOT_MODE_TEXT", "Escornabot"))
      .appendField(
        new Blockly.FieldDropdown(MODE_OPTIONS),
        "escornabot_mode_choice"
      );
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      escornabotLabel(
        "ESCORNABOT_INIT_TOOLTIP",
        "Mode choice: 1-> weaker but less electrical consumption, 2->Stronger, but needs more supply, 3->Intermediate mode"
      )
    );
    this.setHelpUrl(escornabotLabel("ESCORNABOT_URL", ESCORNABOT_HELP_URL));
  };
  return block;
}

function buildEscornabotSpin(): BlockDefinition {
  const block = new BlockBuilder("escornabot_spin")
    .setCategory(CATEGORY_NAME)
    .setColor(0)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["escornabot", "movement"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(false)
    .setHelpUrl(ESCORNABOT_HELP_URL)
    .setArduinoGenerator((b) => {
      const spinNumber = b.getFieldValue("spinNumber");
      const velocity = b.getFieldValue("escornabot_spin_velocity");
      return `mirobot.drive(${spinNumber},${velocity});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(MOVEMENT_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("escorniRecto.png", "large"))
      .appendField(escornabotLabel("ESCORNABOT_SPIN", "Spin: "))
      .appendField(escornabotLabel("ESCORNABOT_SPIN_NUMBER", "Nº: "))
      .appendField(new Blockly.FieldNumber("0"), "spinNumber")
      .appendField(
        escornabotLabel("ESCORNABOT_SPIN_VELOCITY_TEXT", "Velocity: ")
      )
      .appendField(
        new Blockly.FieldDropdown(SPIN_VELOCITY_OPTIONS),
        "escornabot_spin_velocity"
      );
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      escornabotLabel(
        "ESCORNABOT_SPIN_TOOLTIP",
        "Indicate spin number(admits negative value if reverse is wanted) and velocity"
      )
    );
    this.setHelpUrl(escornabotLabel("ESCORNABOT_URL", ESCORNABOT_HELP_URL));
  };
  return block;
}

function buildEscornabotDistance(): BlockDefinition {
  const block = new BlockBuilder("escornabot_distance")
    .setCategory(CATEGORY_NAME)
    .setColor(0)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["escornabot", "movement"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(false)
    .setHelpUrl(ESCORNABOT_HELP_URL)
    .setArduinoGenerator((b) => {
      const distance = b.getFieldValue("distance");
      const velocity = b.getFieldValue("escornabot_spin_velocity");
      return `mirobot.driveD(${distance},${velocity});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(MOVEMENT_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("escorniRecto.png", "large"))
      .appendField(
        escornabotLabel("ESCORNABOT_DISTANCE", "Run distance: ")
      )
      .appendField(escornabotLabel("ESCORNABOT_DISTANCE_TXT", ""))
      .appendField(escornabotLabel("ESCORNABOT_DISTANCE_TEXT", "cm: "))
      .appendField(new Blockly.FieldNumber("0"), "distance")
      .appendField(
        escornabotLabel("ESCORNABOT_SPIN_VELOCITY_TEXT", "Velocity: ")
      )
      .appendField(
        new Blockly.FieldDropdown(SPIN_VELOCITY_OPTIONS),
        "escornabot_spin_velocity"
      );
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      escornabotLabel(
        "ESCORNABOT_DISTANCE_TOOLTIP",
        "Indicate distance in cm (negative values will imply reverse mode) and velocity"
      )
    );
    this.setHelpUrl(escornabotLabel("ESCORNABOT_URL", ESCORNABOT_HELP_URL));
  };
  return block;
}

function buildEscornabotTurnSpin(): BlockDefinition {
  const block = new BlockBuilder("escornabot_turnspin")
    .setCategory(CATEGORY_NAME)
    .setColor(0)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["escornabot", "movement"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(false)
    .setHelpUrl(ESCORNABOT_HELP_URL)
    .setArduinoGenerator((b) => {
      const spinNumber = b.getFieldValue("spinNumber");
      const velocity = b.getFieldValue("escornabot_spin_velocity");
      return `mirobot.turn(${spinNumber},${velocity});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(MOVEMENT_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("escorniGira.png", "large"))
      .appendField(
        escornabotLabel("ESCORNABOT_TURNSPIN_TEXT", "Turn by X spins: ")
      )
      .appendField(escornabotLabel("ESCORNABOT_SPIN_NUMBER", "Nº: "))
      .appendField(new Blockly.FieldNumber("0"), "spinNumber")
      .appendField(
        escornabotLabel("ESCORNABOT_SPIN_VELOCITY_TEXT", "Velocity: ")
      )
      .appendField(
        new Blockly.FieldDropdown(SPIN_VELOCITY_OPTIONS),
        "escornabot_spin_velocity"
      );
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      escornabotLabel(
        "ESCORNABOT_TURNSPIN_TOOLTIP",
        "Turn clockwise/anticlockwise (depending on wether you introduce positive or negative values of spin number you desire)"
      )
    );
    this.setHelpUrl(escornabotLabel("ESCORNABOT_URL", ESCORNABOT_HELP_URL));
  };
  return block;
}

function buildEscornabotTurnAngle(): BlockDefinition {
  const block = new BlockBuilder("escornabot_turnangle")
    .setCategory(CATEGORY_NAME)
    .setColor(0)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["escornabot", "movement"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(false)
    .setHelpUrl(ESCORNABOT_HELP_URL)
    .setArduinoGenerator((b) => {
      const angle = b.getFieldValue("angle");
      const velocity = b.getFieldValue("escornabot_spin_velocity");
      return `mirobot.turnA(${angle},${velocity});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(MOVEMENT_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("escorniGira.png", "large"))
      .appendField(
        escornabotLabel("ESCORNABOT_TURNANGLE_TEXT", "Angle spin: ")
      )
      .appendField(escornabotLabel("ESCORNABOT_ANGLE_NUMBER", "Angle: "))
      .appendField(new Blockly.FieldNumber("0"), "angle")
      .appendField(
        escornabotLabel("ESCORNABOT_SPIN_VELOCITY_TEXT", "Velocity: ")
      )
      .appendField(
        new Blockly.FieldDropdown(SPIN_VELOCITY_OPTIONS),
        "escornabot_spin_velocity"
      );
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      escornabotLabel(
        "ESCORNABOT_TURNANGLE_TOOLTIP",
        "Spin by angle (sign value means clockwise/anticlockwise)"
      )
    );
    this.setHelpUrl(escornabotLabel("ESCORNABOT_URL", ESCORNABOT_HELP_URL));
  };
  return block;
}

function buildEscornabotStop(): BlockDefinition {
  const block = new BlockBuilder("escornabot_stop")
    .setCategory(CATEGORY_NAME)
    .setColor(0)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["escornabot", "movement"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(false)
    .setHelpUrl(ESCORNABOT_HELP_URL)
    .setArduinoGenerator(() => "mirobot.Stop();\n")
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(MOVEMENT_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("escorniStop.png", "large"))
      .appendField(escornabotLabel("ESCORNABOT_STOP_TEXT", "Stop"));
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      escornabotLabel("ESCORNABOT_STOP_TOOLTIP", "What did you think?")
    );
    this.setHelpUrl(escornabotLabel("ESCORNABOT_URL", ESCORNABOT_HELP_URL));
  };
  return block;
}

function buildEscornabotBeep(): BlockDefinition {
  const block = new BlockBuilder("escornabot_beep")
    .setCategory(CATEGORY_NAME)
    .setColor(0)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["escornabot", "movement"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(false)
    .setHelpUrl(ESCORNABOT_HELP_URL)
    .setArduinoGenerator((b) => {
      const time = b.getFieldValue("time");
      return `mirobot.buzzON();\ndelay(${time});\nmirobot.buzzOFF();\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(MOVEMENT_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("escorniZumba.png", "large"))
      .appendField(escornabotLabel("ESCORNABOT_BEEP_TEXT", "Beep"))
      .appendField(new Blockly.FieldNumber("0"), "time")
      .appendField(escornabotLabel("ESCORNABOT_TIME_TEXT", "ms"));
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      escornabotLabel(
        "ESCORNABOT_BEEP_TOOLTIP",
        "Beeps as long as the time you specify"
      )
    );
    this.setHelpUrl(escornabotLabel("ESCORNABOT_URL", ESCORNABOT_HELP_URL));
  };
  return block;
}

function buildEscornabotLedOn(): BlockDefinition {
  const block = new BlockBuilder("escornabot_ledon")
    .setCategory(CATEGORY_NAME)
    .setColor(0)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["escornabot", "movement"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(false)
    .setHelpUrl(ESCORNABOT_HELP_URL)
    .setArduinoGenerator((b) => {
      const led = b.getFieldValue("escornabot_led_choice");
      return `mirobot.ledON(${led});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(MOVEMENT_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("escorniLedon.png", "large"))
      .appendField(escornabotLabel("ESCORNABOT_LEDON_TEXT", "LED ON: "))
      .appendField(
        new Blockly.FieldDropdown(LED_OPTIONS),
        "escornabot_led_choice"
      );
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      escornabotLabel(
        "ESCORNABOT_LEDON_TOOLTIP",
        "Lights on the selected LED diode"
      )
    );
    this.setHelpUrl(escornabotLabel("ESCORNABOT_URL", ESCORNABOT_HELP_URL));
  };
  return block;
}

function buildEscornabotLedOff(): BlockDefinition {
  const block = new BlockBuilder("escornabot_ledoff")
    .setCategory(CATEGORY_NAME)
    .setColor(0)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["escornabot", "movement"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(false)
    .setHelpUrl(ESCORNABOT_HELP_URL)
    .setArduinoGenerator((b) => {
      const led = b.getFieldValue("escornabot_led_choice");
      return `mirobot.ledOFF(${led});\n`;
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(MOVEMENT_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("escorniLedoff.png", "large"))
      .appendField(escornabotLabel("ESCORNABOT_LEDOFF_TEXT", "LED OFF: "))
      .appendField(
        new Blockly.FieldDropdown(LED_OPTIONS),
        "escornabot_led_choice"
      );
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      escornabotLabel(
        "ESCORNABOT_LEDOFF_TOOLTIP",
        "Lights off the selected LED diode"
      )
    );
    this.setHelpUrl(escornabotLabel("ESCORNABOT_URL", ESCORNABOT_HELP_URL));
  };
  return block;
}

function buildEscornabotGetButton(): BlockDefinition {
  const block = new BlockBuilder("escornabot_getbutton")
    .setCategory(CATEGORY_NAME)
    .setColor(0)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["escornabot", "sensor"])
    .setOutput()
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const button = b.getFieldValue("button");
      return [`mirobot.pushButton()==${button}`, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(SENSOR_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("escorniPulsador.png", "large"))
      .appendField(
        escornabotLabel("ESCORNABOT_GETBUTTON_TEXT", "Button pushed: ")
      )
      .appendField(new Blockly.FieldDropdown(BUTTON_OPTIONS), "button");
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setTooltip(
      escornabotLabel(
        "ESCORNABOT_GETBUTTON_TOOLTIP",
        "Check if the selected button is being pushed."
      )
    );
  };
  return block;
}

function buildEscornabotUsInit(): BlockDefinition {
  const block = new BlockBuilder("escornabot_us_init")
    .setCategory(CATEGORY_NAME)
    .setColor(0)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["escornabot", "sensor", "ultrasonic", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(false)
    .setArduinoGenerator((b, generator) => {
      registerEscornabotUsSetup(
        generator,
        b.getFieldValue("Trigger"),
        b.getFieldValue("Echo")
      );
      return "//calibrated\n";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(SENSOR_COLOR);
    this.appendDummyInput("")
      .appendField(createBlockIconField("escornius.png", "large"))
      .appendField(
        escornabotLabel("ESCORNABOT_USINIT_TEXT", "Ultrasonic")
      )
      .appendField(escornabotLabel("ESCORNABOT_TRIGGER_TEXT", "Trigger"))
      .appendField(new Blockly.FieldNumber("0"), "Trigger")
      .appendField(escornabotLabel("ESCORNABOT_ECHO_TEXT", "Echo"))
      .appendField(new Blockly.FieldNumber("0"), "Echo");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
  };
  return block;
}

function buildEscornabotGetUs(): BlockDefinition {
  const block = new BlockBuilder("escornabot_getus")
    .setCategory(CATEGORY_NAME)
    .setColor(0)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["escornabot", "sensor", "ultrasonic"])
    .setOutput()
    .setInputsInline(true)
    .setHelpUrl(ESCORNABOT_APP_URL)
    .setArduinoGenerator((_b, generator) => [
      "mirobot.distance()",
      generator.ORDER_ATOMIC,
    ])
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(SENSOR_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("sensor_ultrasound.png", "large"))
      .appendField(escornabotLabel("ESCORNABOT_GETUS_TEXT", "Distance"));
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setTooltip(
      escornabotLabel("ESCORNABOT_GETUS_TOOLTIP", "Distance")
    );
    this.setHelpUrl(
      escornabotLabel("ESCORNABOT_APP_URL", ESCORNABOT_APP_URL)
    );
  };
  return block;
}

function buildEscornabotIrInit(): BlockDefinition {
  const block = new BlockBuilder("escornabot_ir_init")
    .setCategory(CATEGORY_NAME)
    .setColor(0)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["escornabot", "sensor", "ir", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(false)
    .setArduinoGenerator((b, generator) => {
      registerEscornabotIrSetup(
        generator,
        b.getFieldValue("Izquierda"),
        b.getFieldValue("Derecha")
      );
      return "//calibrated\n";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(SENSOR_COLOR);
    this.appendDummyInput("")
      .appendField(createBlockIconField("escorniir.png", "large"))
      .appendField(escornabotLabel("ESCORNABOT_IRINIT_TEXT", "Inits ir"))
      .appendField(escornabotLabel("ESCORNABOT_IRLEFT_TEXT", "left"))
      .appendField(new Blockly.FieldNumber("0"), "Izquierda")
      .appendField(escornabotLabel("ESCORNABOT_IRRIGHT_TEXT", "right"))
      .appendField(new Blockly.FieldNumber("0"), "Derecha");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip(
      escornabotLabel(
        "ESCORNABOT_IR_TOOLTIP",
        "Initialize infrared sensors"
      )
    );
  };
  return block;
}

function buildEscornabotBlackLeft(): BlockDefinition {
  const block = new BlockBuilder("escornabot_blackLeft")
    .setCategory(CATEGORY_NAME)
    .setColor(0)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["escornabot", "sensor", "ir"])
    .setOutput()
    .setInputsInline(true)
    .setArduinoGenerator((_b, generator) => [
      "mirobot.blackLeft()",
      generator.ORDER_ATOMIC,
    ])
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(SENSOR_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("escorniblackleft.png", "large"))
      .appendField(
        escornabotLabel(
          "ESCORNABOT_GETBLACKLEFT_TEXT",
          "Black left detected"
        )
      );
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setTooltip(
      escornabotLabel(
        "ESCORNABOT_GETBLACKLEFT_TOOLTIP",
        " TRUE if black detected at left side"
      )
    );
  };
  return block;
}

function buildEscornabotBlackRight(): BlockDefinition {
  const block = new BlockBuilder("escornabot_blackRight")
    .setCategory(CATEGORY_NAME)
    .setColor(0)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["escornabot", "sensor", "ir"])
    .setOutput()
    .setInputsInline(true)
    .setArduinoGenerator((_b, generator) => [
      "mirobot.blackRight()",
      generator.ORDER_ATOMIC,
    ])
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(SENSOR_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("escorniblackright.png", "large"))
      .appendField(
        escornabotLabel(
          "ESCORNABOT_GETBLACKRIGHT_TEXT",
          "Black right detected"
        )
      );
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setTooltip(
      escornabotLabel(
        "ESCORNABOT_GETBLACKRIGHT_TOOLTIP",
        "TRUE if black detected at right side"
      )
    );
  };
  return block;
}

function buildEscornabotWhiteLeft(): BlockDefinition {
  const block = new BlockBuilder("escornabot_whiteLeft")
    .setCategory(CATEGORY_NAME)
    .setColor(0)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["escornabot", "sensor", "ir"])
    .setOutput()
    .setInputsInline(true)
    .setArduinoGenerator((_b, generator) => [
      "mirobot.whiteLeft()",
      generator.ORDER_ATOMIC,
    ])
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(SENSOR_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("escorniwhiteleft.png", "large"))
      .appendField(
        escornabotLabel(
          "ESCORNABOT_GETWHITELEFT_TEXT",
          "White left detected"
        )
      );
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setTooltip(
      escornabotLabel(
        "ESCORNABOT_GETWHITELEFT_TOOLTIP",
        "TRUE if white detected at left side"
      )
    );
  };
  return block;
}

function buildEscornabotWhiteRight(): BlockDefinition {
  const block = new BlockBuilder("escornabot_whiteRight")
    .setCategory(CATEGORY_NAME)
    .setColor(0)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["escornabot", "sensor", "ir"])
    .setOutput()
    .setInputsInline(true)
    .setArduinoGenerator((_b, generator) => [
      "mirobot.whiteRight()",
      generator.ORDER_ATOMIC,
    ])
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(SENSOR_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("escorniwhiteright.png", "large"))
      .appendField(
        escornabotLabel(
          "ESCORNABOT_GETWHITERIGHT_TEXT",
          "White right detected"
        )
      );
    this.setInputsInline(true);
    this.setOutput(true, null);
    this.setTooltip(
      escornabotLabel(
        "ESCORNABOT_GETWHITERIGHT_TOOLTIP",
        "TRUE if white detected at right side"
      )
    );
  };
  return block;
}

function buildEscornabotApp(): BlockDefinition {
  const block = new BlockBuilder("escornabot_app")
    .setCategory(CATEGORY_NAME)
    .setColor(0)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["escornabot", "autonomous"])
    .setInputsInline(false)
    .setHelpUrl(ESCORNABOT_APP_URL)
    .setArduinoGenerator((_b, generator) => {
      ensureEscornabotAppLib(generator);
      registerEscornabotAppSetup(generator);
      return " ESCORNABOT.loop();\n";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(SENSOR_COLOR);
    this.appendDummyInput("")
      .appendField(createBlockIconField("escorniPulsador.png", "large"))
      .appendField("Escornabot autónomo");
    this.setInputsInline(false);
    this.setTooltip(
      escornabotLabel(
        "ESCORNABOT_APP_TOOLTIP",
        "Autonomous working"
      )
    );
    this.setHelpUrl(
      escornabotLabel("ESCORNABOT_APP_URL", ESCORNABOT_APP_URL)
    );
  };
  return block;
}

export const ESCORNABOT_BLOCKS: BlockDefinition[] = [
  buildEscornabotInit(),
  buildEscornabotSpin(),
  buildEscornabotDistance(),
  buildEscornabotTurnSpin(),
  buildEscornabotTurnAngle(),
  buildEscornabotStop(),
  buildEscornabotBeep(),
  buildEscornabotLedOn(),
  buildEscornabotLedOff(),
  buildEscornabotGetButton(),
  buildEscornabotUsInit(),
  buildEscornabotGetUs(),
  buildEscornabotIrInit(),
  buildEscornabotBlackLeft(),
  buildEscornabotBlackRight(),
  buildEscornabotWhiteLeft(),
  buildEscornabotWhiteRight(),
  buildEscornabotApp(),
];
