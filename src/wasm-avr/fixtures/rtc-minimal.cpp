#include <Arduino.h>
#include <Wire.h>
#include <RTClib.h>

RTC_DS3231 rtc;

void setup() {
  Wire.begin();
  rtc.begin();
}

void loop() {}
