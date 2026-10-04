#include <Arduino.h>
#include <Servo.h>

Servo myServo;

void setup() {
  myServo.attach(9);
  myServo.write(90);
}

void loop() {
  myServo.write(45);
  delay(500);
  myServo.write(135);
  delay(500);
}
