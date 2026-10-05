#include <Arduino.h>
#include <Wire.h>
#include <BME280.h>

BME280 bme;

void setup() {
  Wire.begin();
  bme.begin();
}

void loop() {}
