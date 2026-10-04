---
name: AVR compile adapters
overview: "Web-first компіляція AVR через WASM (@horang-corp/avr-gcc-wasm). Код через ICompiler-адаптери (майбутні Electron/remote не чіпаємо). Кнопка Compile → лог у console; UI debug console — наступна фаза. Upload — окремий план."
todos:
  - id: wasm-spike
    content: "Spike avr-gcc-wasm: Blink, Servo, Otto; go/no-go"
    status: completed
  - id: web-compile-button
    content: "WebCompilerWasmService + кнопка Compile; лог stderr/output у console"
    status: completed
  - id: wasm-assets-pipeline
    content: "prepare-bybyte-assets.mjs — prebuild .o + headers з userlibs для Angular assets/wasm-avr"
    status: completed
  - id: wasm-library-waves
    content: "W1 (Otto, EEPROM, Oscillator) готово. W2+ SerialCommand/TM1637 — наступні хвилі"
    status: pending
  - id: compile-ino-preprocess
    content: "Мінімальний .ino→.cpp preprocess (прототипи) перед WASM compile"
    status: pending
  - id: compile-debug-ui
    content: "Debug-панель у UI для логу збірки (замість console)"
    status: pending
  - id: electron-cli-harden
    content: "Electron arduino-cli (майбутнє, поза поточним scope)"
    status: cancelled
  - id: web-remote-fallback
    content: "Remote compile-server fallback для Mega/ESP (майбутнє, поза поточним scope)"
    status: cancelled
isProject: false
---

# План: компіляція AVR (web-first, WASM)

## Поточна ціль

**Зібрати робочу web-версію компіляції** для AVR (Uno / Nano, ATmega328P):

- in-browser WASM (`avr-gcc-wasm`)
- бібліотеки з [`compilation/arduino/userlibs`](compilation/arduino/userlibs) через asset pipeline
- кнопка **Compile** у header ([`upload-panel`](src/app/modules/upload/components/upload-panel/upload-panel.component.ts))
- **лог збірки в `console`** (на цьому етапі); UI debug console — наступна фаза

**Не в scope зараз:** upload, Electron hardening, remote server, ESP/Mega compile.

---

## Архітектура (адаптери — так, реалізація — лише web)

Код будуємо через існуючий контракт [`ICompiler`](src/app/core/interfaces/compiler.interface.ts), щоб пізніше додати інші платформи без переписування UI.

```mermaid
flowchart TD
  Btn[UploadPanel Compile button]
  UMS[UploadManagerService]
  CES[CodeEditorService.getEffectiveCode]
  IC[ICompiler abstract]
  WebWasm[WebAvrWasmCompilerService]
  Worker[avr-gcc WASM Worker]
  Assets[assets/wasm-avr tools + objects]

  Btn --> UMS
  UMS --> CES
  UMS --> IC
  IC -->|web only now| WebWasm
  WebWasm --> Worker
  Worker --> Assets
  WebWasm -->|Phase 1| Console[console.log stderr/output]
  WebWasm -->|Phase 5| DebugUI[Debug console panel]
```

| Шар | Файл | Зараз | Пізніше |
|-----|------|-------|---------|
| UI trigger | `upload-panel.component.ts` | Compile → `compileOnly()` | debug panel |
| Orchestrator | `upload-manager.service.ts` | без змін | — |
| Contract | `ICompiler` | без змін | — |
| Web impl | `web-compiler.service.ts` → **`WebAvrWasmCompilerService`** | WASM AVR | — |
| Desktop impl | `electron-compiler.service.ts` | **не чіпати** | arduino-cli |
| Fallback | remote HTTP | **не робити** | Mega / ESP |

[`WebPlatformModule`](src/app/platform/web/web-platform.module.ts) продовжує `{ provide: ICompiler, useClass: … }` — лише замінюємо stub на WASM-реалізацію.

---

## Фаза 0 — spike WASM ✅

Запуск: `npm run spike:wasm-avr`  
Звіт: [`src/wasm-avr/spike/SPIKE-RESULTS.md`](src/wasm-avr/spike/SPIKE-RESULTS.md)

**GO з обмеженнями:** Blink, Servo, Otto (unity-build) збираються; бібліотеки з `userlibs` потребують prebuilt `.o` + headers.

---

## Фаза 1 — WASM compile з кнопки + лог у console ✅

**Мета:** натиснув Compile → у devtools видно повний лог; при успіху — HEX у пам’яті (поки без download UI).

### 1.1 `WebAvrWasmCompilerService`

Новий сервіс (або заміна [`WebCompilerService`](src/app/platform/web/services/web-compiler.service.ts)):

- базується на spike [`extended-firmware-builder.mjs`](src/wasm-avr/spike/extended-firmware-builder.mjs) → перенести логіку в `src/app/platform/web/services/web-avr-wasm-compiler.service.ts`
- Worker через `@horang-corp/avr-gcc-wasm` або власний worker-обгортку
- `assetsBase` → `assets/wasm-avr/` (копія `tools/` + `assets/` з npm + bybyte objects)
- `compile(options)` → `CompileResult` з `hexContent`, `output` (= stderr gcc/ld), `flashBytes`, `fitsTarget`

### 1.2 Кнопка Compile

У [`upload-panel.component.ts`](src/app/modules/upload/components/upload-panel/upload-panel.component.ts):

- `onCompileOnly()` — перевіряти **лише плату** (port не потрібен)
- після `compileOnly()`:
  ```ts
  console.group('[Compile]');
  console.log(result.output);
  if (result.error) console.error(result.error);
  if (result.hexContent) console.log('HEX length:', result.hexContent.length, 'flash:', result.flashBytes);
  console.groupEnd();
  ```
- `alert()` на помилку — **прибрати** або лишити мінімальний toast; основний лог — console

### 1.3 `CompileResult` (розширення)

```ts
interface CompileResult {
  success: boolean;
  output: string;       // повний лог (stderr + timings)
  error?: string;
  hexContent?: string;  // web
  hexPath?: string;     // desktop (майбутнє)
  flashBytes?: number;
  fitsTarget?: boolean;
  fqbn?: string;
}
```

### 1.4 Обмеження FQBN (web)

| FQBN | Поведінка |
|------|-----------|
| `arduino:avr:uno`, `arduino:avr:nano` | compile |
| `arduino:avr:mega`, ESP, інші | зрозуміле повідомлення в console: «поки лише AVR 328p у web» |

### 1.5 Перевірка

- `npm run build:web`
- Blink-скетч з Blockly → Compile → console показує лог + HEX length
- Servo-скетч — те саме

---

## Фаза 2 — asset pipeline: бібліотеки у WASM ✅ (W1)

**Мета:** не unity-build, а **prebuilt `.o` + headers** для бібліотек ByByte (як Servo у npm-пакеті).

### 2.1 `src/wasm-avr/prepare-bybyte-assets.mjs`

Скрипт (CI / локально, Windows ок — WASM avr-gcc):

1. Бере `@horang-corp/avr-gcc-wasm` base assets
2. Додає headers з [`src/wasm-avr/libraries/`](src/wasm-avr/libraries/)
3. Компілює `.cpp` → `.o` WASM avr-gcc
4. Оновлює `manifest.json`: `objectGroups.bybyte`, `headerFiles`
5. Output → `src/assets/wasm-avr/` (tools + assets, ~55 MB+, gitignored)

`npm run prepare:wasm-avr` + документація в `src/wasm-avr/README.md`.

### 2.2 Хвилі бібліотек (пріоритет)

Не весь `userlibs` одразу (сотні lib, гігабайти). Хвилі за використанням у Blockly:

| Хвиля | Бібліотеки | Джерело блоків |
|-------|------------|----------------|
| **W0** (npm) | Servo, Wire, SPI, Firmata, Adafruit* (base) | вже в avr-gcc-wasm |
| **W1** | EEPROM.h, Otto, Oscillator | Otto / Ninja |
| **W2** | SerialCommand, SoftwareSerial | Otto BT app |
| **W3** | TM1637, LedControl, Stepper, … | definitions/* |
| **W4+** | решта AVR-only з userlibs | за telemetry / блоками |

Критерій хвилі: `npm run spike:wasm-avr` + integration test з реальним згенерованим скетчем Blockly.

### 2.3 Відсутні headers / link fixes

З spike відомо:

- `EEPROM.h` — додати з Arduino AVR core у assets
- `eeprom_read_byte` — перевірити link order / avr-libc (не stub у production)
- include paths — `-I /libraries/Otto`, `-I /arduino/libraries/EEPROM/src`, …

### 2.4 Розмір і кеш

- assets **не** в JS bundle — static `assets/wasm-avr/`
- long-cache headers у prod; опційно IndexedDB preload (фаза 2b)

---

## Фаза 3 — `.ino` preprocess

Blockly генерує Arduino-sketch-подібний код. WASM очікує valid C++.

- Мінімальний `sketch-preprocessor.ts`: `setup`/`loop` + forward declarations для user functions
- Або: генератор Blockly одразу emit C++ з прототипами (краще довгостроково)
- Unit-тест: типовий workspace → preprocess → WASM compile без помилок cc1plus

---

## Фаза 4 — debug console у UI

**Після** стабільного console-log flow.

- Панель / drawer «Build log» (аналог legacy `#message`) у upload popover або окрема debug-зона
- Підписка на `UploadManagerService.progress$` + повний `CompileResult.output`
- Syntax highlight помилок gcc (опційно)
- Кнопка «Copy log» / «Download .hex»

Console.log залишити в dev mode (`environment.production === false`).

---

## Backlog (після web MVP)

| Задача | Коли |
|--------|------|
| Electron `arduino-cli` + `--libraries userlibs` | desktop release |
| Remote compile-server (Mega, ESP, Android) | коли WASM не покриває FQBN |
| Upload Web Serial / esp-web-tools | окремий план |
| GPL-3 Corresponding Source для WASM toolchain | перед public release |
| Mega (2560) WASM | unlikely; remote |

---

## Порядок робіт

1. ✅ Фаза 0 — spike
2. **Фаза 1** — WebAvrWasmCompilerService + Compile button + console log
3. **Фаза 2** — prepare-bybyte-assets + хвилі W1–W3 бібліотек
4. **Фаза 3** — ino preprocess
5. **Фаза 4** — UI debug console
6. Backlog — Electron / remote / upload

---

## Вирішено

- **Платформа:** лише **web** на даному етапі; код через **ICompiler** для майбутніх адаптерів
- **Движок:** WASM AVR (328p), не remote (поки)
- **Бібліотеки:** prebuilt assets з `userlibs`, хвилями
- **UI:** кнопка Compile; лог → **console** → потім debug UI
- **Upload:** не в цьому плані
- **Spike:** GO з обмеженнями ([SPIKE-RESULTS.md](src/wasm-avr/spike/SPIKE-RESULTS.md))

## Відкриті питання (не блокують фазу 1)

1. Які бібліотеки входять у **W2** крім SerialCommand? (скан `#include` у generators)
2. IndexedDB cache для ~55 MB assets — робити в фазі 2 чи 4?
3. Nano old/new bootloader — один FQBN на compile чи два профілі?
4. GPL-3 disclosure сторінка — до public beta чи release?
