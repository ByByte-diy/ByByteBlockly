#include <Arduino.h>
#include <SoftwareSerial.h>

SoftwareSerial softSerial(2, 3);

void setup() {
  Serial.begin(9600);
  softSerial.begin(9600);
}

void loop() {
  if (softSerial.available()) {
    Serial.write(softSerial.read());
  }
}
