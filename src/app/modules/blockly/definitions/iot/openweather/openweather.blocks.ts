import * as Blockly from "blockly";
import { BlockBuilder } from "../../../lib/builders/block-builder";
import {
  CATEGORY_COLOR,
  CATEGORY_PLATFORMS,
  OPENWEATHER_CATEGORY,
  TOOLBOX_LEVEL,
} from "../config";
import {
  createBlockIconField,
  ensureHttpClientInclude,
  getOpenWeatherApiLang,
  iotLabel,
  registerDefinition,
} from "../iot.helper";

const OPENWEATHER_GLOBALS =
  "String openWeatherMapApiKey = \"API_KEY_PLACEHOLDER\";\n" +
  "String city;\n" +
  "String country_code;\n" +
  "String location;\n" +
  "String country;\n" +
  "String icono;\n" +
  "String weather;\n" +
  "String description;\n" +
  "float temperature;\n" +
  "float humidity;\n" +
  "float pressure;\n" +
  "int sunrise;\n" +
  "int sunset;\n" +
  "float temp_min;\n" +
  "float temp_max;\n" +
  "float feels_like;\n" +
  "float Cloud;\n" +
  "float visibility;\n" +
  "float wind_speed;\n" +
  "float wind_angle;\n" +
  "int id;\n" +
  "\n" +
  "String jsonBuffer;\n";

const OPENWEATHER_FUNCTIONS =
  "String httpGETRequest(const char* serverName) {\n" +
  "HTTPClient http;\n" +
  "http.begin(serverName);\n" +
  "int httpResponseCode = http.GET();\n" +
  "String payload = \"{}\";\n" +
  "if (httpResponseCode>0) {\n" +
  "  payload = http.getString();\n" +
  "}\n" +
  "http.end();\n" +
  "\n" +
  "return payload;\n" +
  "}\n" +
  "\n" +
  "void GetValuesWeather (String jsonBuffer)\n" +
  "{\n" +
  "   jsonBuffer.replace('[', ' ');\n" +
  "   jsonBuffer.replace(']', ' ');\n" +
  "   char jsonArray [jsonBuffer.length()+1];\n" +
  "   jsonBuffer.toCharArray(jsonArray,sizeof(jsonArray));\n" +
  "   jsonArray[jsonBuffer.length() + 1] = '\\0';\n" +
  "\n" +
  "   DynamicJsonDocument root(1024);\n" +
  "   DeserializationError error = deserializeJson(root, jsonArray);\n" +
  "   if (error)\n" +
  "      return;\n" +
  "    location = (const char *)root[\"name\"];\n" +
  "    country = (const char *)root[\"sys\"][\"country\"];\n" +
  "    temperature = root[\"main\"][\"temp\"];\n" +
  "    humidity = root[\"main\"][\"humidity\"];\n" +
  "    weather = (const char *)root[\"weather\"][\"main\"];\n" +
  "    description = (const char *)root[\"weather\"][\"description\"];\n" +
  "    pressure = root[\"main\"][\"pressure\"];\n" +
  "    sunrise = root[\"sys\"][\"sunrise\"];\n" +
  "    sunset = root[\"sys\"][\"sunset\"];\n" +
  "    feels_like = root[\"main\"][\"feels_like\"];\n" +
  "    temp_min = root[\"main\"][\"temp_min\"];\n" +
  "    temp_max = root[\"main\"][\"temp_max\"];\n" +
  "    Cloud = root[\"clouds\"][\"all\"];\n" +
  "    visibility = root[\"visibility\"];\n" +
  "    wind_angle = root[\"wind\"][\"deg\"];\n" +
  "    wind_speed = root[\"wind\"][\"speed\"];\n" +
  "    icono = (const char *)root[\"weather\"][\"icon\"];\n" +
  "    id= root[\"weather\"][\"id\"];\n" +
  "}\n";

function openWeatherNumericValueOptions(): [string, string][] {
  return [
    [iotLabel("OW_Temperature", "Temperature ºC"), "0"],
    [iotLabel("Humidity", "Humidity"), "1"],
    [iotLabel("Preassure", "Preassure"), "2"],
    [iotLabel("Temp_max", "Temperature Max ºC"), "3"],
    [iotLabel("Temp_min", "Temperature Min ºC"), "4"],
    [iotLabel("Feels_like", "Feels like Temperature ºC"), "5"],
    [iotLabel("Cloud", "Cloud %"), "6"],
    [iotLabel("wind_speed", "Wind Speed"), "7"],
    [iotLabel("wind_angle", "Wind Angle"), "8"],
    [iotLabel("icon_id", "Icon Weather Id"), "9"],
    [iotLabel("Visibility", "Visibility %"), "10"],
    [iotLabel("sunrise", "Sunrise EPOC"), "11"],
    [iotLabel("sunset", "Sunset EPOC"), "12"],
  ];
}

function openWeatherTextValueOptions(): [string, string][] {
  return [
    [iotLabel("Description", "Description"), "0"],
    [iotLabel("Weather", "Weather"), "1"],
    [iotLabel("Icon", "Icon"), "2"],
    [iotLabel("Country", "Country"), "3"],
    [iotLabel("LocationOW", "Location"), "4"],
  ];
}

function buildInitOpenWeather() {
  const block = new BlockBuilder("Init_OpenWeather")
    .setCategory(OPENWEATHER_CATEGORY)
    .setColor(200)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "openweather", "init"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const apiKey = b.getFieldValue("API_KEY");
      ensureHttpClientInclude(generator);
      registerDefinition(
        generator,
        "definition_OpenWeather",
        OPENWEATHER_GLOBALS.replace("API_KEY_PLACEHOLDER", apiKey),
        "OpenWeather global variables."
      );
      generator.codeFunctions_["functions_OpenWeather"] = OPENWEATHER_FUNCTIONS;
      return "";
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("openweather.png"))
      .appendField(iotLabel("Openweather_init", "Configuration OpenWeather."));
    this.appendDummyInput()
      .appendField(iotLabel("Api_key", "Api Key"))
      .appendField(new Blockly.FieldTextInput("xxxxxxxxxxx"), "API_KEY");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Init OpenWeather configuration");
    this.setHelpUrl("");
  };
  return block;
}

function buildOrderReadOpenWeatherServer() {
  const block = new BlockBuilder("order_read_OpenWeather_server")
    .setCategory(OPENWEATHER_CATEGORY)
    .setColor(200)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "openweather"])
    .setPreviousStatement(true)
    .setNextStatement(true)
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const city = generator.valueToCode(b, "city", generator.ORDER_ATOMIC);
      const countrycode = generator.valueToCode(
        b,
        "countrycode",
        generator.ORDER_ATOMIC
      );
      const lang = getOpenWeatherApiLang();
      return (
        "if(WiFi.status()== WL_CONNECTED){\n" +
        `city=${city};\n` +
        `country_code=${countrycode};\n` +
        `String serverPath = "http://api.openweathermap.org/data/2.5/weather?q="+city+","+country_code+"&lang=${lang}&APPID="+openWeatherMapApiKey;\n` +
        "jsonBuffer = httpGETRequest(serverPath.c_str());\n" +
        "GetValuesWeather (jsonBuffer);\n" +
        "}\n"
      );
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("openweather.png"))
      .appendField(iotLabel("ReadWeather", "OpenWeather.Read Weather."));
    this.appendValueInput("city")
      .setCheck(null)
      .appendField(iotLabel("City", "City"));
    this.appendValueInput("countrycode")
      .setCheck(null)
      .appendField(iotLabel("CountryCode", "Country Code"));
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip("Order to read of OpenWeather server");
    this.setHelpUrl("");
  };
  return block;
}

function buildValuesOpenWeatherServer() {
  const block = new BlockBuilder("values_OpenWeather_server")
    .setCategory(OPENWEATHER_CATEGORY)
    .setColor(200)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "openweather"])
    .setOutput("Number")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const outputValue = b.getFieldValue("OUTPUT_VALUE");
      let code: string;
      if (outputValue === "0") {
        code = "(temperature-273.15)";
      } else if (outputValue === "1") {
        code = "humidity";
      } else if (outputValue === "2") {
        code = "pressure";
      } else if (outputValue === "3") {
        code = "(temp_max-273.15)";
      } else if (outputValue === "4") {
        code = "(temp_min-273.15)";
      } else if (outputValue === "5") {
        code = "(feels_like-273.15)";
      } else if (outputValue === "6") {
        code = "Cloud/100.00";
      } else if (outputValue === "7") {
        code = "wind_speed";
      } else if (outputValue === "8") {
        code = "wind_angle";
      } else if (outputValue === "9") {
        code = "id";
      } else if (outputValue === "10") {
        code = "visibility/100.00";
      } else if (outputValue === "11") {
        code = "sunrise";
      } else {
        code = "sunset";
      }
      return [code, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("openweather.png"))
      .appendField(iotLabel("OW_Value", "OpenWeather. Value:"))
      .appendField(
        new Blockly.FieldDropdown(openWeatherNumericValueOptions),
        "OUTPUT_VALUE"
      )
      .appendField(iotLabel("NTP_VALUES", "value"));
    this.setOutput(true, "Number");
    this.setInputsInline(true);
    this.setTooltip("Refund the date or time parameter");
    this.setHelpUrl("");
  };
  return block;
}

function buildValuesTextOpenWeatherServer() {
  const block = new BlockBuilder("values_text_OpenWeather_server")
    .setCategory(OPENWEATHER_CATEGORY)
    .setColor(200)
    .setPlatforms(CATEGORY_PLATFORMS)
    .setLevel(TOOLBOX_LEVEL)
    .setTags(["iot", "openweather"])
    .setOutput("String")
    .setInputsInline(true)
    .setArduinoGenerator((b, generator) => {
      const outputValue = b.getFieldValue("OUTPUT_VALUE");
      let code: string;
      if (outputValue === "0") {
        code = "description";
      } else if (outputValue === "1") {
        code = "weather";
      } else if (outputValue === "2") {
        code = "icono";
      } else if (outputValue === "3") {
        code = "country";
      } else {
        code = "location";
      }
      return [code, generator.ORDER_ATOMIC];
    })
    .build();

  block.init = function (this: Blockly.Block) {
    this.setColour(CATEGORY_COLOR);
    this.appendDummyInput()
      .appendField(createBlockIconField("openweather.png"))
      .appendField(iotLabel("OW_Value", "OpenWeather. Value:"))
      .appendField(
        new Blockly.FieldDropdown(openWeatherTextValueOptions),
        "OUTPUT_VALUE"
      );
    this.setOutput(true, "String");
    this.setInputsInline(true);
    this.setTooltip("Refund the text of day of week or month");
    this.setHelpUrl("");
  };
  return block;
}

export const OPENWEATHER_BLOCKS = [
  buildInitOpenWeather(),
  buildOrderReadOpenWeatherServer(),
  buildValuesOpenWeatherServer(),
  buildValuesTextOpenWeatherServer(),
];
