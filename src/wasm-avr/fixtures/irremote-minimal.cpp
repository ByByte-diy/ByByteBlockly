#include <Arduino.h>
#include <IRremote.h>

IRrecv ir_rx(11);
decode_results ir_rx_results;

void setup() {
  ir_rx.enableIRIn();
}

void loop() {
  if (ir_rx.decode(&ir_rx_results)) {
    ir_rx.resume();
  }
}
