/** AVR WASM bundle families (328p, Mega). */
export type AvrWasmFamily = 'avr-328p' | 'avr-mega';

/** All WASM bundle families supported by {@link WasmCompilerRegistry}. */
export type WasmFamily = AvrWasmFamily | 'esp32';
