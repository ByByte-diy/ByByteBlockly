import { describe, it, expect } from 'vitest';
import {
  FlashAvrUploadError,
  getNanoAlternateProfile,
  getUploadProfilesWithFallbacks,
  mapBootloadStatusToI18n,
  mapUploadPhasePercent,
} from '@platform/web/utils/web-avr-stk500.util';

describe('web-avr-stk500.util', () => {
  it('maps STK500 progress into upload phase range', () => {
    expect(mapUploadPhasePercent(0)).toBe(10);
    expect(mapUploadPhasePercent(100)).toBe(95);
    expect(mapUploadPhasePercent(50)).toBe(53);
  });

  it('adds nano alternate baud profile for fallback upload', () => {
    const oldNano = {
      boardId: 'nano',
      fqbn: 'arduino:avr:nano:cpu=atmega328old',
      protocol: 'stk500v1' as const,
      flasherBoardKey: 'arduino-nano-old',
      baudRate: 57600,
      webSupported: true,
    };

    expect(getNanoAlternateProfile(oldNano)?.baudRate).toBe(115200);
    expect(getUploadProfilesWithFallbacks(oldNano).map((p) => p.baudRate)).toEqual([115200, 57600]);
  });

  it('FlashAvrUploadError carries i18n key for UI', () => {
    const err = new FlashAvrUploadError('ui.upload_nano_baud_exhausted', 'sync failed');
    expect(err.i18nKey).toBe('ui.upload_nano_baud_exhausted');
    expect(err.message).toBe('sync failed');
  });

  it('maps bootload status labels to i18n keys', () => {
    expect(mapBootloadStatusToI18n('Syncing with bootloader')).toBe('ui.upload_progress_syncing');
    expect(mapBootloadStatusToI18n('Uploading flash')).toBe('ui.upload_progress_flashing');
    expect(mapBootloadStatusToI18n('Verify flash')).toBe('ui.upload_progress_verifying');
    expect(mapBootloadStatusToI18n('Done')).toBe('ui.upload_progress_uploading');
  });
});
