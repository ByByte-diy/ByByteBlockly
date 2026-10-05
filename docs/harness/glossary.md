# Glossary

| Термін | Значення |
|--------|----------|
| **FQBN** | Fully Qualified Board Name, напр. `arduino:avr:uno` |
| **STK500v1** | Bootloader protocol для Uno/Nano (AVR) |
| **WASM AVR** | In-browser компілятор `@horang-corp/avr-gcc-wasm` |
| **Platform adapter** | `ICompiler` / `IUploader` implementation (web або electron) |
| **Upload profile** | `AvrUploadProfile` — baud, flasher key, protocol |
| **Port path** | Внутрішній ID порту (`web-serial-0`), не OS COM name |
| **User gesture** | Клік користувача, required для `requestPort()` |
| **hexContent** | Intel HEX string для web upload |
| **hexPath** | Шлях до `.hex` файлу (electron) |
| **Build log** | Текстовий лог compile (+ upload) у UI panel |
| **Platform pack** | Набір blocks/toolbox для robot/platform (Blockly) |
| **Secure context** | HTTPS або localhost для Web Serial |
