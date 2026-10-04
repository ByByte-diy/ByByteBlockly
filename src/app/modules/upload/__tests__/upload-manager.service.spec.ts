import { of, throwError } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ICompiler } from '@core/interfaces';
import { IUploader } from '@core/interfaces';
import { CompileResult } from '@core/models';
import { DeviceManagerService } from '@modules/device/services/device-manager.service';
import { CodeEditorService } from '@modules/code-editor/services/code-editor.service';
import { UploadManagerService, UploadStatus } from '../services/upload-manager.service';

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

    service = new UploadManagerService(
      compiler as unknown as ICompiler,
      uploader as unknown as IUploader,
      deviceManager as unknown as DeviceManagerService,
      codeEditorService as unknown as CodeEditorService,
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('compiles effective code from the editor, not generated Blockly code', async () => {
    const compilePromise = firstValueFrom(service.compileOnly());
    await vi.advanceTimersByTimeAsync(100);
    const result = await compilePromise;

    expect(result.success).toBe(true);
    expect(compiler.compile).toHaveBeenCalledWith({
      board: 'arduino:avr:uno',
      code: 'void setup() { /* edited */ }',
      verbose: true,
    });
  });

  it('fails when effective code is empty', async () => {
    codeEditorService.getEffectiveCode.mockReturnValue('');

    const compilePromise = firstValueFrom(service.compileOnly());
    const expectation = expect(compilePromise).rejects.toThrow('Code is empty or not generated');
    await vi.advanceTimersByTimeAsync(100);
    await expectation;
    expect(compiler.compile).not.toHaveBeenCalled();
  });

  it('reports compiler errors', async () => {
    compiler.compile.mockReturnValue(throwError(() => new Error('arduino-cli failed')));

    const compilePromise = firstValueFrom(service.compileOnly());
    const expectation = expect(compilePromise).rejects.toThrow('arduino-cli failed');
    await vi.advanceTimersByTimeAsync(100);
    await expectation;
    expect(service.getStatus()).toBe(UploadStatus.ERROR);
  });
});
