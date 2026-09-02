import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import { registerDefinition } from "../../../lib/generators/codegen-sections.helper";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  SOUND_CATEGORY,
  SENSING_SUBCATEGORY_LEVEL,
} from "../config";
import {
  analogReadExpression,
  applyDefaultAnalogPinFields,
  createAnalogPinDropdownField,
  createBlockIconField,
  createDigitalPinDropdownField,
  ensureMrtnodeAnalogResolution,
  registerDigitalInputSetup,
  sensingLabel,
  valuePercentOptions,
} from "../sensing.helper";

const DEFAULT_SOUND_ANALOG_PIN = "A0";

function buildSoundAnalog() {
  const block = new BlockBuilder("Sound_sensor2")
    .setCategory(SOUND_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "sound"])
    .setOutput("Number")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue("PIN_SOUND");
      const mode = b.getFieldValue("OUTPUT_VALUE");
      ensureMrtnodeAnalogResolution(generator);
      return [analogReadExpression(pin, mode), generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("sensor_noise.png"))
      .appendField(sensingLabel("SOUND_NAME", "microphone"))
      .appendField(sensingLabel("PIN", "PIN"))
      .appendField(createAnalogPinDropdownField(), "PIN_SOUND");
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown(valuePercentOptions),
      "OUTPUT_VALUE"
    );
    applyDefaultAnalogPinFields(this, { PIN_SOUND: DEFAULT_SOUND_ANALOG_PIN });
    this.setOutput(true, "Number");
    this.setInputsInline(true);
  };
  return block;
}

function buildSoundDigital() {
  const block = new BlockBuilder("Sound_status_sensor2")
    .setCategory(SOUND_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "sound"])
    .setOutput("Boolean")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue("PIN_SOUND");
      registerDigitalInputSetup(generator, "setup_sound", pin);
      return [`digitalRead(${pin})`, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("sensor_noise.png"))
      .appendField(sensingLabel("SOUND_NAME", "microphone"))
      .appendField(sensingLabel("PIN", "PIN"))
      .appendField(createDigitalPinDropdownField(), "PIN_SOUND")
      .appendField(sensingLabel("SOUND_DETECTED", "detected"));
    this.setOutput(true, "Boolean");
    this.setInputsInline(true);
  };
  return block;
}

function buildSoundAmp() {
  const block = new BlockBuilder("SoundAmp_sensor2")
    .setCategory(SOUND_CATEGORY)
    .setColor(CATEGORY_COLOR)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(SENSING_SUBCATEGORY_LEVEL)
    .setTags(["sensing", "sound"])
    .setOutput("Number")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const pin = b.getFieldValue("PIN_SOUND");
      const mode = b.getFieldValue("OUTPUT_VALUE");
      const sampleWindow =
        generator.valueToCode(b, "SAMPLE_WINDOW", generator.ORDER_ATOMIC) ||
        "50";
      ensureMrtnodeAnalogResolution(generator);

      const measureVolumeFn =
        "int measureVolume() {\n" +
        "unsigned long startMillis= millis();\n" +
        "unsigned int peakToPeak = 0;\n" +
        "int sample;\n" +
        "unsigned int signalMax = 0;\n" +
        "unsigned int signalMin = 1024;\n" +
        `while (millis() - startMillis < ${sampleWindow})\n` +
        "{\n" +
        `  sample = analogRead(${pin});\n` +
        " if (sample < 1024)\n" +
        " {\n" +
        "    if (sample > signalMax)\n" +
        "    {\n" +
        "      signalMax = sample;\n" +
        "    }\n" +
        "   else if (sample < signalMin)\n" +
        "    {\n" +
        "      signalMin = sample;\n" +
        "    }\n" +
        " }\n" +
        " }\n" +
        " peakToPeak = signalMax - signalMin;\n" +
        " return peakToPeak;\n" +
        "}";

      registerDefinition(
        generator,
        "measure_peakToPeak",
        measureVolumeFn,
        "Function measureVolume(): sound level (peak-to-peak) over sample window, ms."
      );

      const code =
        mode === "0"
          ? "map(measureVolume(),0,1023,0,100)"
          : "measureVolume()";
      return [code, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("sensor_noise.png"))
      .appendField(sensingLabel("SOUND_AMP_NAME", "mic amplifier"))
      .appendField(sensingLabel("PIN", "PIN"))
      .appendField(createAnalogPinDropdownField(), "PIN_SOUND");
    this.appendDummyInput().appendField(
      new Blockly.FieldDropdown(valuePercentOptions),
      "OUTPUT_VALUE"
    );
    this.appendValueInput("SAMPLE_WINDOW")
      .setCheck("Number")
      .setAlign(Blockly.inputs.Align.RIGHT)
      .appendField(sensingLabel("SOUND_WINDOWS", "sample window"));
    applyDefaultAnalogPinFields(this, { PIN_SOUND: DEFAULT_SOUND_ANALOG_PIN });
    this.setOutput(true, "Number");
    this.setInputsInline(true);
  };
  return block;
}

export const SOUND_BLOCKS = [
  buildSoundAnalog(),
  buildSoundDigital(),
  buildSoundAmp(),
];
