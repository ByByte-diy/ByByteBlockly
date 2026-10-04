# Phase 0: AVR WASM spike — результати

Дата: 2026-10-04  
Пакет: `@horang-corp/avr-gcc-wasm@0.2.0`  
Запуск: `npm run spike:wasm-avr`

## Висновок: **GO з обмеженнями**

WASM **можна** використовувати для web-компіляції **Uno/Nano (ATmega328P)** з базовими скетчами, Servo і **Otto** — але потрібен власний asset-пайплайн (як `prepare-assets`), а не «просто покласти .h/.cpp з userlibs».

**Mega / ESP / повний userlibs → remote `arduino-cli`.**

---

## Тести

| # | Скетч | Результат | Flash | Час |
|---|--------|-----------|-------|-----|
| 1 | Blink | PASS | 5292 B | ~770 ms |
| 2 | Servo | PASS | 6306 B | ~615 ms |
| 3a | Otto (лише headers, без .o) | **Очікуваний FAIL** | — | link: undefined Otto::* |
| 3b | Otto unity-build (.cpp в одному TU) | PASS | 10710 B | ~880 ms |

---

## Що працює «з коробки» пакета

- Arduino core (prebuilt `.o`: main, wiring, Serial, …)
- **Servo** (`lib_Servo.o` + headers)
- Blink / простий C++ з `setup()` / `loop()`
- ~600–800 ms на compile+link на dev-машині (Node + HTTP assets)

---

## Що **не** працює без додаткової роботи

### 1. Довільні бібліотеки з `userlibs/`

Пакет **не** читає `#include <Otto.h>` і не компілює `.cpp` на льоту. Бібліотеки мають бути:

- **prebuilt `.o`** у `assets/objects/` (як Servo), **або**
- **unity-build** (усі `.cpp` в одному файлі — spike 3b)

Для продукту потрібен скрипт на кшталт `prepare-assets.mjs`, який з **ваших** `compilation/arduino/userlibs` збирає `.o` нативним avr-gcc.

### 2. Відсутні headers у assets

| Header | Статус |
|--------|--------|
| `EEPROM.h` | Немає в npm assets — треба додавати з Arduino AVR core |
| `SerialCommand.h` | Немає — Otto BT-скетчі не зберуться без asset pipeline |
| `SoftwareSerial` | Частково (core) — треба перевірити per-sketch |

### 3. EEPROM / avr-libc на link

Unity Otto потребував stub `eeprom_read_byte` / `eeprom_write_byte` — символи не підтягнулись з `libc.a` у поточному link order. У production треба перевірити лінкування avr-libc або prebuild EEPROM helpers.

### 4. `.ino` preprocess

Пакет компілює `.cpp` з явними `setup`/`loop`. Blockly генерує `.ino`-подібний код — потрібен **генератор прототипів** або завжди emit valid C++.

### 5. Платформи

| FQBN | WASM |
|------|------|
| `arduino:avr:uno` / `nano` (328p) | Так (з asset pipeline) |
| `arduino:avr:mega` (2560) | Ні — інший MCU / ldscript |
| ESP32 / ESP8266 | Ні — тільки remote |

### 6. Android / iOS

Той самий WASM Worker технічно можливий, але ~55 MB assets + RAM peaks ~56 MB sequential — важко на слабких телефонах. **Remote compile** надійніший fallback.

---

## Рекомендована архітектура після spike

```text
ICompiler
├── ElectronCompilerService     → arduino-cli (offline, усі FQBN + userlibs)
└── WebCompilerService
    ├── AvrWasmCompiler         → Uno/Nano, curated libs (Otto, Servo, …)
    └── RemoteCompiler          → fallback: Mega, ESP, невідомі libs, server-side userlibs
```

---

## Наступні кроки (фаза 1)

1. Compile-only UX (порт не обов’язковий для Compile)
2. Electron: `--libraries userlibs` + hardened temp sketch
3. Скрипт `src/wasm-avr/prepare-bybyte-assets.mjs` — prebuild Otto/Servo/… → `.o`
4. Fork/extend `firmware-builder` з dynamic library groups замість unity-build
5. Remote compile-server (Docker) як fallback з першого дня для ESP

---

## Файли spike

- `src/wasm-avr/spike/run-spike.mjs` — runner
- `src/wasm-avr/spike/extended-firmware-builder.mjs` — builder з extra includes/FS
- `src/wasm-avr/spike/fixtures/` — blink, servo, otto, EEPROM.h
