#include <Arduino.h>
#include <Adafruit_NeoPixel.h>

Adafruit_NeoPixel pixel(4, 6, NEO_GRB + NEO_KHZ800);

void setup() {
  pixel.begin();
  pixel.clear();
}

void loop() {}
