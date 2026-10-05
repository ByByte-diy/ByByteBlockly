#include <Arduino.h>
#include <PlayRtttl.hpp>

const char melody[] PROGMEM = "TakeOnMe:d=4,o=5,b=125:8f6,8e6,d6,8c6,8c6,8c6,8c6,8d6,8e6";

void setup() {
  playRtttlBlockingPGM(8, melody);
}

void loop() {}
