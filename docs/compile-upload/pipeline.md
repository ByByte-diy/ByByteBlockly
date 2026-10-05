# Upload pipeline (orchestration)

## UploadManagerService

Центральний оркестратор у `src/app/modules/upload/services/upload-manager.service.ts`.

### Статуси (`UploadStatus`)

| Статус | Опис |
|--------|------|
| `idle` | Очікування |
| `compiling` | Компіляція |
| `uploading` | Завантаження на плату |
| `success` | Успіх |
| `error` | Помилка |

### Observables

- `status$` — поточний статус
- `progress$` — `{ status, message, progress? }` (message — i18n key)
- `buildLog$` — текст логу компіляції (+ upload при успіху)
- `compileResult$` — останній `CompileResult`

### Потік compile + upload

1. `deviceManager.getSelectedBoard()` → FQBN
2. `codeEditorService.getEffectiveCode()` → Arduino sketch
3. `compiler.compile({ board, code, onProgress })` → `CompileResult`
4. Збереження в `lastCompileResult`, публікація build log
5. Перевірка `deviceManager.getSelectedPort()` — без порту → `ui.upload_select_board_port`
6. `uploader.upload({ board, boardId, port, hexContent, hexPath, onProgress })`
7. Upload log додається до build log при успіху

### Upload-only

`uploadOnly()` вимагає `lastCompileResult.success === true`, інакше `ui.upload_compile_first`.

### Progress mapping

- Compile: 3% → generating, далі `onProgress` від compiler
- Upload: 10% старт, 10–95% від STK500 (`mapUploadPhasePercent`), 100% success

## UI — Upload panel

`src/app/modules/upload/components/upload-panel/`

- Три full-width кнопки з іконками (compile / upload / compile+upload)
- Підписка на `progress$` та `buildLog$`
- Guards для Web Serial (browser support, secure context)

## DeviceManager

Постачає:

- `getSelectedBoard()` — `{ id, fqbn, … }` з каталогу плат
- `getSelectedPort()` — `{ path, … }` або null

Web: path типу `web-serial-0`, `web-serial-selected`. Деталі — [web-serial/developer-reference.md](../web-serial/developer-reference.md).

## Моделі

```typescript
// core/models/compilation.model.ts (фрагмент)
interface CompileResult {
  success: boolean;
  output: string;
  error?: string;
  hexPath?: string;      // electron
  hexContent?: string;   // web
}

interface UploadOptions {
  board: string;         // FQBN
  boardId?: string;
  port: string;
  hexPath?: string;
  hexContent?: string;
  verbose?: boolean;
  onProgress?: (update: UploadProgressUpdate) => void;
}
```
