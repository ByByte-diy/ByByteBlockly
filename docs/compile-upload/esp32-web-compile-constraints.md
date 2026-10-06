# ESP32 / ESP8266 — обмеження web-компіляції (F4.4)

Документ для користувачів і розробників: що підтримує **браузерна WASM-компіляція**, а що лишається для **desktop (Electron + arduino-cli)**.

## Підтримувані плати (web)

| Board ID (приклад) | FQBN | Web compile | Web upload |
|--------------------|------|-------------|------------|
| Otto ESP / MRT ESP | `esp32:esp32:esp32` | ✅ | ✅ (esptool-js) |
| Uno / Nano / Mega | `arduino:avr:*` | ✅ | ✅ (STK500) |

Перевірка FQBN: `WasmCompilerRegistry` → `Esp32WasmCompilerStrategy` / AVR strategies.

## ESP8266 — лише desktop

**wasm-toolchains не містить ESP8266 WASM.** У браузері компіляція недоступна.

- Повідомлення в UI: `ui.compile_wasm_esp8266_desktop_only`
- Рішення: **Electron**-версія з `arduino-cli`, або обрати AVR / ESP32 плату в селекторі пристрою

Блоки IoT для ESP8266 (RemoteXY, ESP-NOW ESP8266, HTML-сторінки тощо) залишаються в toolbox для desktop-проєктів.

## ESP32 — як працює bundle

- Toolchain: [wasm-toolchains esp-v1.0.0](https://github.com/begeistert/wasm-toolchains/releases/tag/esp-v1.0.0) — bundle **~192 MB** (`cache-manifest.json` → `wasm-esp32.totalBytes`: 191638977); lazy tier prefetch у браузері
- **Фіксований link closure** з harvest-скетчу: WiFi, BLE, Network, IDF — навіть «порожній» Blink ~900 KB app `.bin`
- Валідація `#include` до cc1plus: `validateEsp32SketchIncludes()` + `libraries.esp.json` → `supportPolicy` у `wasm-catalog.json`
- Деталі spike: [wasm-esp32-spike.md](./wasm-esp32-spike.md)

## Що **не** web-compile на ESP32

### Категорії Blockly / генератори

| Область | Web ESP32 | Коментар |
|---------|-----------|----------|
| **Firebase** (IoT) | ❌ | `Firebase_ESP_Client.h` — лише desktop |
| **Async Web Server** | ❌ | `ESPAsyncWebServer.h`, `AsyncTCP.h` |
| **Otto biped / Quad** | ❌ | `Otto.h`, `Quad.h` — web лише AVR Uno/Mega |
| **ByByte Stepper** | ❌ | AVR web only |
| **Escornabot** | ❌ | OttoESP (ESP8266) профіль |
| **MRT motor (ESP32)** | ❌ | `MRT_esp32_Motor.h` не в harvest |
| **BLE Keyboard / Mouse** | ❌ | Third-party HID |
| **MFRC522, GPS, ESP32Time** | ❌ | Не в harvest bundle |

Toolbox може **приховувати** частину категорій за `requiredBoardIds` / `requiredBoardTypes`, але якщо код з `#include` потрапив у редактор — валідатор зупинить compile з поясненням у build log.

### Заголовки з політики (`src/wasm-esp/libraries.esp.json`)

**`desktopOnly`** — явно desktop / arduino-cli:

- `escornabot.h`, `Bot.h`
- `MRT_esp32_Motor.h`
- `BleKeyboard.h`, `BleMouse.h`
- `ESP32Time.h`
- `MFRC522.h`, `TinyGPSPlus.h`
- `AsyncTCP.h`, `ESPAsyncWebServer.h`
- `Firebase_ESP_Client.h`, `Firebase.h`

**`avrWebOnly`** — web compile лише на Uno/Mega:

- `Quad.h`, `Octosnake.h`
- `Otto.h`, `Otto_humanoid.h`
- `Stepper.h`

**`harvested`** (приклади, що **є** у bundle):

- NeoPixel, DHT, Keypad, Adafruit BusIO / Unified Sensor
- Core: `WiFi.h`, `HTTPClient.h`, `esp_now.h`

## Повідомлення користувачу

| Ситуація | i18n / log |
|----------|------------|
| Невідома плата | `ui.compile_wasm_unsupported_board` |
| ESP8266 | `ui.compile_wasm_esp8266_desktop_only` |
| Невідомий `#include` на ESP32 | `ui.compile_wasm_esp32_unsupported_library` + деталі в build log |

## Розробникам

| Файл | Роль |
|------|------|
| `src/wasm-esp/libraries.esp.json` | Політика harvested / desktopOnly / avrWebOnly |
| `src/wasm-esp/generate-esp32-catalog.mjs` | Вбудовує `supportPolicy` у catalog |
| `wasm-esp32-sketch-validator.ts` | Pre-compile перевірка includes |
| `Esp32WasmCompilerStrategy` | FQBN `esp32:esp32*` |

Після зміни `libraries.esp.json`:

```bash
npm run prepare:wasm-esp
```

## Backlog (поза F4.4)

- Selective ESP32 relink (менший `.bin` для простих скетчів)
- Розширення harvest (MRT motor, MFRC522, …)
- ESP8266 WASM (немає upstream toolchain)
