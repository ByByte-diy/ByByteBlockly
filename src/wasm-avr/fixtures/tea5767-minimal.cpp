#include <Arduino.h>
#include <Wire.h>
#include <TEA5767N.h>

TEA5767N radio;

void setup() {
  radio.selectFrequency(88.2f);
}

void loop() {
  (void)radio.getSignalLevel();
}
