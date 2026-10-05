import { STK500, STK500SyncError } from 'webserial-flasher';
import { AvrUploadProfile } from '../constants/avr-upload-profiles.const';
import { WebSerialPortHandle } from '../services/web-serial-port-registry.service';
import { getFlasherBoardConfig } from './avr-upload-profile.util';
import { createFlasherWebSerialTransport } from './web-serial-port-adapter.util';

export interface FlashAvrHexOptions {
  port: WebSerialPortHandle;
  hexContent: string;
  profile: AvrUploadProfile;
  verbose?: boolean;
  onProgress?: (percent: number, status: string) => void;
}

export interface FlashAvrHexResult {
  output: string;
}

const NANO_BOARD_IDS = new Set(['nano', 'nano_new', 'nanooptiboot', 'bybyte_nano']);

/** Maps webserial-flasher bootload status labels to i18n keys. */
export function mapBootloadStatusToI18n(status: string): string {
  const normalized = status.toLowerCase();

  if (normalized.includes('verify')) {
    return 'ui.upload_progress_verifying';
  }
  if (normalized.includes('upload') || normalized.includes('flash') || normalized.includes('program')) {
    return 'ui.upload_progress_flashing';
  }
  if (normalized.includes('sync') || normalized.includes('connect') || normalized.includes('reset')) {
    return 'ui.upload_progress_syncing';
  }

  return 'ui.upload_progress_uploading';
}

/** Maps STK500 0–100 progress into the upload phase range (10–95). */
export function mapUploadPhasePercent(stkPercent: number): number {
  const clamped = Math.max(0, Math.min(100, stkPercent));
  return 10 + Math.round(clamped * 0.85);
}

export function isStk500SyncFailure(err: unknown): boolean {
  return err instanceof STK500SyncError;
}

/** Alternate Nano bootloader baud when sync fails (old 57600 ↔ new 115200). */
export function getNanoAlternateProfile(profile: AvrUploadProfile): AvrUploadProfile | null {
  const isNano =
    NANO_BOARD_IDS.has(profile.boardId) || profile.fqbn.includes('arduino:avr:nano');

  if (!isNano) {
    return null;
  }

  if (profile.baudRate === 57600) {
    return {
      ...profile,
      flasherBoardKey: 'arduino-nano',
      baudRate: 115200,
    };
  }

  if (profile.baudRate === 115200) {
    return {
      ...profile,
      flasherBoardKey: 'arduino-nano-old',
      baudRate: 57600,
    };
  }

  return null;
}

export function getUploadProfilesWithFallbacks(profile: AvrUploadProfile): AvrUploadProfile[] {
  const alternate = getNanoAlternateProfile(profile);
  if (!alternate) {
    return [profile];
  }

  // Most clone Nano boards use 115200 — try it first when catalog default is old (57600).
  if (profile.baudRate === 57600) {
    return [alternate, profile];
  }

  return [profile, alternate];
}

/**
 * Flashes Intel HEX to an AVR board over an existing Web Serial port handle.
 * Retries alternate Nano baud rate on STK500 sync failure.
 */
export async function flashAvrHex(options: FlashAvrHexOptions): Promise<FlashAvrHexResult> {
  const profiles = getUploadProfilesWithFallbacks(options.profile);
  let lastError: unknown;
  let lastOutput = '';

  for (let index = 0; index < profiles.length; index += 1) {
    const profile = profiles[index];
    try {
      return await attemptFlash({ ...options, profile });
    } catch (err) {
      lastError = err;
      lastOutput = formatFlashErrorOutput(err);
      const hasAlternate = index < profiles.length - 1;
      if (!isStk500SyncFailure(err) || !hasAlternate) {
        throw enrichFlashError(err, index, profiles.length);
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError ?? lastOutput));
}

async function attemptFlash(options: FlashAvrHexOptions): Promise<FlashAvrHexResult> {
  const logs: string[] = [];
  const board = getFlasherBoardConfig(options.profile);
  logs.push(
    `Upload profile: ${options.profile.boardId} @ ${board.baudRate} baud (${options.profile.flasherBoardKey})`,
  );

  await triggerBootloaderReset(options.port);

  const transport = createFlasherWebSerialTransport(options.port);

  try {
    await transport.open(board.baudRate);

    const stk = new STK500(transport, board, {
      retry: { syncAttempts: 4, retryDelayMs: 250 },
      logger: (level, message) => {
        logs.push(`[${level}] ${message}`);
        if (message.includes('sync attempt') || message.includes('resetDevice')) {
          options.onProgress?.(5, message);
        }
      },
    });

    await stk.bootload(options.hexContent, (status, percentage) => {
      options.onProgress?.(percentage, status);
    });

    logs.push('Upload completed successfully.');
    return { output: logs.join('\n') };
  } finally {
    await transport.close().catch(() => undefined);
  }
}

/** Classic 1200-baud reset — helps CH340 / clone Nano boards enter bootloader. */
async function triggerBootloaderReset(port: WebSerialPortHandle): Promise<void> {
  if (port.readable || port.writable) {
    await port.close().catch(() => undefined);
  }

  await port.open({
    baudRate: 1200,
    dataBits: 8,
    stopBits: 1,
    parity: 'none',
  });

  await delay(250);
  await port.close().catch(() => undefined);
  await delay(400);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function formatFlashErrorOutput(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }
  return String(err);
}

function enrichFlashError(err: unknown, attemptIndex: number, totalAttempts: number): Error {
  const base = err instanceof Error ? err : new Error(String(err));

  if (totalAttempts > 1 && attemptIndex === totalAttempts - 1 && isStk500SyncFailure(err)) {
    return new Error(
      `${base.message}\nTried both Nano bootloader speeds (57600 and 115200). Pick the matching board profile or check the USB cable.`,
    );
  }

  return base;
}
