import { describe, it, expect } from 'vitest';
import { BOARDS } from 'webserial-flasher';
import {
  AvrUploadUnsupportedError,
  getFlasherBoardConfig,
  isWebAvrUploadBoard,
  resolveAvrUploadProfile,
} from '@platform/web/utils/avr-upload-profile.util';

describe('avr-upload-profile.util', () => {
  it('resolves Uno profile by board id', () => {
    const profile = resolveAvrUploadProfile({
      boardId: 'uno',
      fqbn: 'arduino:avr:uno',
    });

    expect(profile.flasherBoardKey).toBe('arduino-uno');
    expect(profile.baudRate).toBe(115200);
    expect(profile.protocol).toBe('stk500v1');
  });

  it('maps old Nano to arduino-nano-old at 57600', () => {
    const profile = resolveAvrUploadProfile({
      boardId: 'nano',
      fqbn: 'arduino:avr:nano:cpu=atmega328old',
    });

    expect(profile.flasherBoardKey).toBe('arduino-nano-old');
    expect(profile.baudRate).toBe(57600);
  });

  it('maps new Nano to arduino-nano at 115200', () => {
    const profile = resolveAvrUploadProfile({
      boardId: 'nano_new',
      fqbn: 'arduino:avr:nano:cpu=atmega328',
    });

    expect(profile.flasherBoardKey).toBe('arduino-nano');
    expect(profile.baudRate).toBe(115200);
  });

  it('resolves nanooptiboot and bybyte_nano as new Nano bootloader', () => {
    for (const boardId of ['nanooptiboot', 'bybyte_nano'] as const) {
      const profile = resolveAvrUploadProfile({
        boardId,
        fqbn: 'arduino:avr:nano',
      });
      expect(profile.flasherBoardKey).toBe('arduino-nano');
      expect(profile.baudRate).toBe(115200);
    }
  });

  it('resolves Mega profile (STK500v2 @ 115200)', () => {
    const profile = resolveAvrUploadProfile({
      boardId: 'mega',
      fqbn: 'arduino:avr:mega',
    });

    expect(profile.flasherBoardKey).toBe('arduino-mega2560');
    expect(profile.baudRate).toBe(115200);
    expect(profile.protocol).toBe('stk500v2');
  });

  it('resolves ByByte Mega and FQBN with cpu option', () => {
    const bybyte = resolveAvrUploadProfile({
      boardId: 'bybyte_mega',
      fqbn: 'arduino:avr:mega',
    });
    expect(bybyte.protocol).toBe('stk500v2');

    const fqbnCpu = resolveAvrUploadProfile({
      fqbn: 'arduino:avr:mega:cpu=atmega2560',
    });
    expect(fqbnCpu.flasherBoardKey).toBe('arduino-mega2560');
    expect(fqbnCpu.protocol).toBe('stk500v2');
  });

  it('rejects unknown FQBN', () => {
    expect(() =>
      resolveAvrUploadProfile({
        fqbn: 'unknown:board:foo',
      }),
    ).toThrow(AvrUploadUnsupportedError);
  });

  it('returns flasher board config with profile baud rate', () => {
    const profile = resolveAvrUploadProfile({
      boardId: 'nano',
      fqbn: 'arduino:avr:nano:cpu=atmega328old',
    });
    const board = getFlasherBoardConfig(profile);

    expect(board.baudRate).toBe(57600);
    expect(board.signature).toEqual(BOARDS['arduino-nano-old'].signature);
  });

  it('isWebAvrUploadBoard reflects web upload allow-list', () => {
    expect(isWebAvrUploadBoard('uno')).toBe(true);
    expect(isWebAvrUploadBoard('mega')).toBe(true);
    expect(isWebAvrUploadBoard('leonardo')).toBe(false);
  });

  it('uses longer command timeout cap for Mega STK500v2', () => {
    const profile = resolveAvrUploadProfile({
      boardId: 'mega',
      fqbn: 'arduino:avr:mega',
    });
    const board = getFlasherBoardConfig(profile);

    expect(board.timeout).toBe(10000);
    expect(board.resetDelayMs).toBe(500);
    expect(board.signature).toEqual(BOARDS['arduino-mega2560'].signature);
  });
});
