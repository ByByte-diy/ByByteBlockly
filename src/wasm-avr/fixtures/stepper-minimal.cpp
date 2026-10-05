#include <Arduino.h>
#include <Stepper.h>

Stepper stepper_1(2048, 8, 9, 10, 11);

void setup() {
  stepper_1.setSpeed(60);
}

void loop() {
  stepper_1.step(100);
}
