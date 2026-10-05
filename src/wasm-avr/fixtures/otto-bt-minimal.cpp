#include <Arduino.h>
#include <Servo.h>
#include <EEPROM.h>
#include <SerialCommand.h>

SoftwareSerial BTserial = SoftwareSerial(11, 12);
SerialCommand SCmd(BTserial);

#include "/libraries/Otto/Otto.h"

Otto Otto;

void receiveStop() {}

void setup() {
  Serial.begin(9600);
  BTserial.begin(9600);
  Otto.init(2, 3, 4, 5, false, -1);
  SCmd.addCommand("S", receiveStop);
}

void loop() {
  SCmd.readSerial();
}
