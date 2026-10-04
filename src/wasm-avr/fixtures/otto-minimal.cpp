#include <Arduino.h>
#include <Servo.h>
#include <EEPROM.h>

#include "/libraries/Otto/Oscillator.h"
#include "/libraries/Otto/Otto.h"

Otto Otto;

void setup() {
  Otto.init(2, 3, 4, 5, false, -1);
  Otto.home();
}

void loop() {
  Otto.walk(1000, 1, 0);
  delay(1000);
}
