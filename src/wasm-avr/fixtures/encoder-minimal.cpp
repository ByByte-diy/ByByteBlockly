#include <Arduino.h>
#include <Encoder.h>

Encoder enc(2, 3);

void setup() {}

void loop() {
  (void)enc.read();
}
