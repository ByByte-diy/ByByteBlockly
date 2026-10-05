#include <Arduino.h>
#include <Servo.h>
#include <EEPROM.h>
#include <Quad.h>

Quad Quad;

extern "C" void pause(int period) {
  long timeout = millis() + period;
  do {
    Quad.refresh();
  } while (millis() <= timeout);
}

void setup() {
  Quad.init(2, 8, 3, 9, 4, 6, 5, 7);
  Quad.home();
}

void loop() {
  Quad.walk(1, 4, 550);
}
