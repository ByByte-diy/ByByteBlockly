#include <Arduino.h>
#include <SoftwareSerial.h>
#include <TinyGPSPlus.h>

SoftwareSerial gpsSerial(2, 3);
TinyGPSPlus gps;

void setup() {
  gpsSerial.begin(9600);
}

void loop() {
  while (gpsSerial.available()) {
    gps.encode(gpsSerial.read());
  }
}
