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

  it('rejects Mega (STK500v2) on web', () => {
    expect(() =>
      resolveAvrUploadProfile({
        boardId: 'mega',
        fqbn: 'arduino:avr:mega',
      }),
    ).toThrow(AvrUploadUnsupportedError);

    try {
      resolveAvrUploadProfile({ boardId: 'mega', fqbn: 'arduino:avr:mega' });
    } catch (err) {
      expect(err).toBeInstanceOf(AvrUploadUnsupportedError);
      expect((err as AvrUploadUnsupportedError).reason).toBe('unsupported_protocol');
    }
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

  it('isWebAvrUploadBoard reflects phase-1 allow-list', () => {
    expect(isWebAvrUploadBoard('uno')).toBe(true);
    expect(isWebAvrUploadBoard('mega')).toBe(false);
  });
});
