import { BOARDS, boardFromFqbn, type Board } from 'webserial-flasher';
import {
  AVR_UPLOAD_PROFILES_BY_BOARD_ID,
  AVR_UPLOAD_PROFILES_BY_FQBN,
  AvrUploadProfile,
  WEB_AVR_UPLOAD_BOARD_IDS,
} from '../constants/avr-upload-profiles.const';

export type AvrUploadUnsupportedReason =
  | 'unsupported_board'
  | 'unsupported_protocol'
  | 'unsupported_web_phase';

export class AvrUploadUnsupportedError extends Error {
  readonly reason: AvrUploadUnsupportedReason;
  readonly i18nKey: string;

  constructor(reason: AvrUploadUnsupportedReason, i18nKey: string, message: string) {
    super(message);
    this.name = 'AvrUploadUnsupportedError';
    this.reason = reason;
    this.i18nKey = i18nKey;
  }
}

export interface ResolveAvrUploadProfileOptions {
  fqbn: string;
  boardId?: string;
}

/** Returns true when the board is in the current web upload allow-list. */
export function isWebAvrUploadBoard(boardId: string): boolean {
  return WEB_AVR_UPLOAD_BOARD_IDS.has(boardId);
}

/**
 * Resolves upload profile for Uno/Nano (STK500v1) boards.
 * Throws {@link AvrUploadUnsupportedError} for Mega, ESP, Leonardo, etc.
 */
export function resolveAvrUploadProfile(options: ResolveAvrUploadProfileOptions): AvrUploadProfile {
  const { fqbn, boardId } = options;
  const normalizedFqbn = fqbn.trim();

  if (boardId && AVR_UPLOAD_PROFILES_BY_BOARD_ID[boardId]) {
    const profile = AVR_UPLOAD_PROFILES_BY_BOARD_ID[boardId];
    if (!profile.webSupported) {
      throw unsupportedWeb(profile.boardId, normalizedFqbn);
    }
    return profile;
  }

  const fqbnOverride = AVR_UPLOAD_PROFILES_BY_FQBN[normalizedFqbn];
  const flasherBoard = boardFromFqbn(normalizedFqbn);

  if (!flasherBoard && !fqbnOverride) {
    throw new AvrUploadUnsupportedError(
      'unsupported_board',
      'ui.upload_unsupported_board',
      `Upload is not supported for board FQBN: ${normalizedFqbn}`,
    );
  }

  const protocol = fqbnOverride?.protocol ?? flasherBoard?.protocol ?? 'stk500v1';
  if (protocol !== 'stk500v1') {
    throw new AvrUploadUnsupportedError(
      'unsupported_protocol',
      'ui.upload_unsupported_protocol',
      `Web upload does not support protocol "${protocol}" yet (FQBN: ${normalizedFqbn})`,
    );
  }

  const flasherBoardKey =
    fqbnOverride?.flasherBoardKey ??
    findFlasherBoardKey(flasherBoard!) ??
    'arduino-uno';

  const baudRate =
    fqbnOverride?.baudRate ??
    flasherBoard?.baudRate ??
    BOARDS[flasherBoardKey]?.baudRate ??
    115200;

  const resolvedBoardId = boardId ?? inferBoardIdFromFqbn(normalizedFqbn);

  const profile: AvrUploadProfile = {
    boardId: resolvedBoardId,
    fqbn: normalizedFqbn,
    protocol: 'stk500v1',
    flasherBoardKey,
    baudRate,
    webSupported: fqbnOverride?.webSupported ?? isWebAvrUploadBoard(resolvedBoardId),
  };

  if (!profile.webSupported) {
    throw unsupportedWeb(resolvedBoardId, normalizedFqbn);
  }

  return profile;
}

/** Per-command timeout for web upload (ms). Lower than desktop avrdude — fail fast on wrong baud. */
export const WEB_AVR_COMMAND_TIMEOUT_MS = 2500;

/** Returns webserial-flasher Board config with catalog baud rate applied. */
export function getFlasherBoardConfig(profile: AvrUploadProfile): Board {
  const base = BOARDS[profile.flasherBoardKey];
  if (!base) {
    throw new Error(`Unknown flasher board key: ${profile.flasherBoardKey}`);
  }

  const baudRate = profile.baudRate;
  const timeout = Math.min(base.timeout ?? WEB_AVR_COMMAND_TIMEOUT_MS, WEB_AVR_COMMAND_TIMEOUT_MS);

  if (base.baudRate === baudRate && base.timeout === timeout) {
    return base;
  }

  return { ...base, baudRate, timeout };
}

function findFlasherBoardKey(board: Board): string | undefined {
  for (const [key, entry] of Object.entries(BOARDS)) {
    if (entry === board) {
      return key;
    }
  }
  return undefined;
}

function inferBoardIdFromFqbn(fqbn: string): string {
  if (fqbn.startsWith('arduino:avr:nano')) {
    if (fqbn.includes('atmega328old')) {
      return 'nano';
    }
    if (fqbn.includes('cpu=atmega328')) {
      return 'nano_new';
    }
    return 'nanooptiboot';
  }
  if (fqbn.startsWith('arduino:avr:uno')) {
    return 'uno';
  }
  return fqbn.replace(/[:]/g, '_');
}

function unsupportedWeb(boardId: string, fqbn: string): AvrUploadUnsupportedError {
  return new AvrUploadUnsupportedError(
    'unsupported_web_phase',
    'ui.upload_unsupported_board',
    `Web upload for board "${boardId}" (${fqbn}) is not enabled yet`,
  );
}
