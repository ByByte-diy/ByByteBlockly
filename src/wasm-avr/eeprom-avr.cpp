#include <avr/io.h>
#include <stdint.h>

// avr-gcc-wasm libc.a does not export EEPROM helpers. Provide the two
// symbols used by Arduino EEPROM.h for ATmega328P.
extern "C" uint8_t eeprom_read_byte(const uint8_t* addr) {
  while (EECR & (1 << EEPE)) {
  }
  EEAR = (uint16_t)addr;
  EECR |= (1 << EERE);
  return EEDR;
}

extern "C" void eeprom_write_byte(uint8_t* addr, uint8_t value) {
  while (EECR & (1 << EEPE)) {
  }
  EEAR = (uint16_t)addr;
  EEDR = value;
  EECR |= (1 << EEMPE);
  EECR |= (1 << EEPE);
}
