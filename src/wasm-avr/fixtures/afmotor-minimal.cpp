#include <Arduino.h>
#include <AFMotor.h>

AF_DCMotor motor_dc_1(1, MOTOR12_2KHZ);

void setup() {
  motor_dc_1.setSpeed(200);
  motor_dc_1.run(FORWARD);
}

void loop() {}
