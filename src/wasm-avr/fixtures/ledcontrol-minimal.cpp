#include <Arduino.h>
#include <LedControl.h>

LedControl lclm(12, 11, 10, 1);

void setup() {
  lclm.shutdown(0, false);
}

void loop() {}
