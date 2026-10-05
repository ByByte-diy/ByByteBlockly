#include <Arduino.h>
#include <TM1637Display.h>

TM1637Display tm1637_1(2, 3);

void setup() {
  tm1637_1.setBrightness(0x0f);
  tm1637_1.showNumberDec(42, false);
}

void loop() {}
