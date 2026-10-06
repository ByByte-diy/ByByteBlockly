/** AVR bootloader protocols supported in web upload. */
export type AvrUploadProtocol = 'stk500v1' | 'stk500v2';

/**
 * AVR upload profile for webserial-flasher.
 * Maps ByByte board catalog entries to flasher board keys and baud rates.
 */
export interface AvrUploadProfile {
  boardId: string;
  fqbn: string;
  protocol: AvrUploadProtocol;
  /** Key in webserial-flasher `BOARDS` database. */
  flasherBoardKey: string;
  baudRate: number;
  /** Whether web upload is enabled for this board in the current phase. */
  webSupported: boolean;
}

/** Board IDs with web AVR upload support. */
export const WEB_AVR_UPLOAD_BOARD_IDS = new Set<string>([
  'uno',
  'nano',
  'nano_new',
  'nanooptiboot',
  'bybyte_nano',
  'mega',
  'bybyte_mega',
]);

/**
 * Explicit board-id → upload profile mapping.
 * Overrides FQBN defaults where our catalog differs from arduino-cli (e.g. old Nano bootloader).
 */
export const AVR_UPLOAD_PROFILES_BY_BOARD_ID: Readonly<Record<string, AvrUploadProfile>> = {
  uno: {
    boardId: 'uno',
    fqbn: 'arduino:avr:uno',
    protocol: 'stk500v1',
    flasherBoardKey: 'arduino-uno',
    baudRate: 115200,
    webSupported: true,
  },
  nano: {
    boardId: 'nano',
    fqbn: 'arduino:avr:nano:cpu=atmega328old',
    protocol: 'stk500v1',
    flasherBoardKey: 'arduino-nano-old',
    baudRate: 57600,
    webSupported: true,
  },
  nano_new: {
    boardId: 'nano_new',
    fqbn: 'arduino:avr:nano:cpu=atmega328',
    protocol: 'stk500v1',
    flasherBoardKey: 'arduino-nano',
    baudRate: 115200,
    webSupported: true,
  },
  nanooptiboot: {
    boardId: 'nanooptiboot',
    fqbn: 'arduino:avr:nano',
    protocol: 'stk500v1',
    flasherBoardKey: 'arduino-nano',
    baudRate: 115200,
    webSupported: true,
  },
  bybyte_nano: {
    boardId: 'bybyte_nano',
    fqbn: 'arduino:avr:nano',
    protocol: 'stk500v1',
    flasherBoardKey: 'arduino-nano',
    baudRate: 115200,
    webSupported: true,
  },
  mega: {
    boardId: 'mega',
    fqbn: 'arduino:avr:mega',
    protocol: 'stk500v2',
    flasherBoardKey: 'arduino-mega2560',
    baudRate: 115200,
    webSupported: true,
  },
  bybyte_mega: {
    boardId: 'bybyte_mega',
    fqbn: 'arduino:avr:mega',
    protocol: 'stk500v2',
    flasherBoardKey: 'arduino-mega2560',
    baudRate: 115200,
    webSupported: true,
  },
};

/** FQBN suffix overrides when board id is unknown. */
export const AVR_UPLOAD_PROFILES_BY_FQBN: Readonly<Record<string, Partial<AvrUploadProfile>>> = {
  'arduino:avr:nano:cpu=atmega328old': {
    flasherBoardKey: 'arduino-nano-old',
    baudRate: 57600,
    protocol: 'stk500v1',
    webSupported: true,
  },
  'arduino:avr:nano:cpu=atmega328': {
    flasherBoardKey: 'arduino-nano',
    baudRate: 115200,
    protocol: 'stk500v1',
    webSupported: true,
  },
  'arduino:avr:mega:cpu=atmega2560': {
    flasherBoardKey: 'arduino-mega2560',
    baudRate: 115200,
    protocol: 'stk500v2',
    webSupported: true,
  },
};
