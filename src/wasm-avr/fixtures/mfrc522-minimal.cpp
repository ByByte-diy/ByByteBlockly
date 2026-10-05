#include <Arduino.h>
#include <SPI.h>
#include <MFRC522.h>

MFRC522 mfrc522(10, 9);

void setup() {
  SPI.begin();
  mfrc522.PCD_Init();
}

void loop() {}
