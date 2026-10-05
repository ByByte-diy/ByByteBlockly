#include <Arduino.h>
#include <SPI.h>
#include <Adafruit_GFX.h>
#include <Adafruit_ST7735.h>

Adafruit_ST7735 tft1(10, 9, 8);

void setup() {
  tft1.initR(INITR_BLACKTAB);
}

void loop() {}
