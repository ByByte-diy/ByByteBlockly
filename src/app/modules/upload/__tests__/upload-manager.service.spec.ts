import { of, throwError } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { NgZone } from '@angular/core';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ICompiler } from '@core/interfaces';
import { IUploader } from '@core/interfaces';
import { CompileResult } from '@core/models';
import { DeviceManagerService } from '@modules/device/services/device-manager.service';
import { CodeEditorService } from '@modules/code-editor/services/code-editor.service';
import { UploadManagerService, UploadProgress, UploadStatus } from '../services/upload-manager.service';

describe('UploadManagerService', () => {
  let service: UploadManagerService;
  let compiler: { compile: ReturnType<typeof vi.fn> };
  let uploader: { upload: ReturnType<typeof vi.fn> };
  let deviceManager: { getSelectedBoard: ReturnType<typeof vi.fn>; getSelectedPort: ReturnType<typeof vi.fn> };
  let codeEditorService: { getEffectiveCode: ReturnType<typeof vi.fn> };

  const compileResult: CompileResult = {
    success: true,
    output: 'ok',
    hexPath: '/tmp/sketch.hex',
  };

  beforeEach(() => {
    vi.useFakeTimers();

    compiler = {
      compile: vi.fn().mockReturnValue(of(compileResult)),
    };
    uploader = {
      upload: vi.fn(),
    };
    deviceManager = {
      getSelectedBoard: vi.fn().mockReturnValue({ fqbn: 'arduino:avr:uno' }),
      getSelectedPort: vi.fn().mockReturnValue({ path: 'COM3' }),
    };
    codeEditorService = {
      getEffectiveCode: vi.fn().mockReturnValue('void setup() { /* edited */ }'),
    };

    const ngZone = { run: (fn: () => void) => fn() } as NgZone;
    service = new UploadManagerService(
      compiler as unknown as ICompiler,
      uploader as unknown as IUploader,
      deviceManager as unknown as DeviceManagerService,
      codeEditorService as unknown as CodeEditorService,
      ngZone,
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('compiles effective code from the editor, not generated Blockly code', async () => {
    compiler.compile.mockImplementation((opts) => {
      opts.onProgress?.({ percent: 55, message: 'ui.compile_progress_compiling' });
      return of(compileResult);
    });

    const progressEvents: number[] = [];
    service.progress$.subscribe((event) => {
      if (event.progress != null) {
        progressEvents.push(event.progress);
      }
    });

    const result = await firstValueFrom(service.compileOnly());

    expect(result.success).toBe(true);
    expect(compiler.compile).toHaveBeenCalledWith(
      expect.objectContaining({
        board: 'arduino:avr:uno',
        code: 'void setup() { /* edited */ }',
        verbose: true,
        onProgress: expect.any(Function),
      }),
    );
    expect(progressEvents).toContain(55);
    expect(progressEvents).toContain(100);
    expect(await firstValueFrom(service.buildLog$)).toContain('ok');
  });

  it('fails when effective code is empty', async () => {
    codeEditorService.getEffectiveCode.mockReturnValue('');

    const compilePromise = firstValueFrom(service.compileOnly());
    const expectation = expect(compilePromise).rejects.toThrow('ui.compile_code_empty');
    await expectation;
    expect(compiler.compile).not.toHaveBeenCalled();
  });

  it('shows i18n key when compiler returns empty-code failure', async () => {
    compiler.compile.mockReturnValue(
      of({
        success: false,
        output: '',
        error: 'ui.compile_code_empty',
      }),
    );

    let lastProgress: UploadProgress | undefined;
    service.progress$.subscribe((event) => {
      lastProgress = event;
    });

    const result = await firstValueFrom(service.compileOnly());

    expect(result.success).toBe(false);
    expect(result.error).toBe('ui.compile_code_empty');
    expect(lastProgress?.message).toBe('ui.compile_code_empty');
    expect(await firstValueFrom(service.buildLog$)).toBe('');
  });

  it('reports compiler errors', async () => {
    compiler.compile.mockReturnValue(throwError(() => new Error('arduino-cli failed')));

    const compilePromise = firstValueFrom(service.compileOnly());
    const expectation = expect(compilePromise).rejects.toThrow('arduino-cli failed');
    await expectation;
    expect(service.getStatus()).toBe(UploadStatus.ERROR);
    expect(await firstValueFrom(service.buildLog$)).toBe('arduino-cli failed');
  });

  it('requires a successful compile before upload-only', async () => {
    let lastProgress: UploadProgress | undefined;
    service.progress$.subscribe((event) => {
      lastProgress = event;
    });

    await expect(firstValueFrom(service.uploadOnly())).rejects.toThrow('ui.upload_compile_first');
    expect(lastProgress?.status).toBe(UploadStatus.ERROR);
    expect(lastProgress?.message).toBe('ui.upload_compile_first');
    expect(uploader.upload).not.toHaveBeenCalled();
  });

  it('publishes build log when compile returns failure', async () => {
    compiler.compile.mockReturnValue(
      of({
        success: false,
        output: '[cc1plus] note: bad',
        error: 'compilation failed',
      }),
    );

    const result = await firstValueFrom(service.compileOnly());

    expect(result.success).toBe(false);
    expect(await firstValueFrom(service.buildLog$)).toContain('[cc1plus] note: bad');
  });
});
