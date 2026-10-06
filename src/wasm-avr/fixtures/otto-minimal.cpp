#include <Arduino.h>
#include <Servo.h>
#include <EEPROM.h>
#include <Otto.h>

Otto Otto;

void setup() {
  Otto.init(2, 3, 4, 5, false, -1);
  Otto.home();
}

void loop() {
  Otto.walk(1000, 1, 0);
  delay(1000);
}
