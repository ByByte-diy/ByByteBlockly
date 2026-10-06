import {
  STK500v2,
  type Board,
  type BootloadProgressCallback,
  type ISTKTransport,
  type STK500Options,
} from 'webserial-flasher';

/**
 * Arduino Mega "wiring" bootloaders (stk500boot.c) — STK500v2 subset, not AVRISP mkII.
 *
 * Diff vs stock {@link STK500v2.bootload} (webserial-flasher):
 * - skip setDeviceDescriptor — CMD 0x04 → STATUS_CMD_FAILED (0xC0)
 * - skip chipErase — CMD 0x12 always FAILED; pages erased in PROGRAM_FLASH_ISP
 * - skip verifySignature — wiring response layout breaks library parser (reads [3] not [2])
 *
 * @see https://github.com/arduino/ArduinoCore-avr/blob/master/bootloaders/stk500v2/stk500boot.c
 */
export class WiringSTK500v2 extends STK500v2 {
  override async bootload(
    hexData: string | Uint8Array,
    progressCallback?: BootloadProgressCallback,
  ): Promise<void> {
    const progress = (status: string, pct: number) => {
      progressCallback?.(status, pct);
    };

    progress('Resetting device', 0);
    await this.resetDevice();
    await delay(300);

    progress('Syncing', 5);
    await this.sync(5);

    progress('Entering programming mode', 15);
    await this.enterProgMode();

    progress('Uploading', 25);
    await this.upload(hexData, (pct) => {
      progress('Uploading', 25 + pct * 0.4);
    });

    progress('Verifying', 75);
    await this.verify(hexData, (pct) => {
      progress('Verifying', 75 + pct * 0.2);
    });

    progress('Exiting programming mode', 95);
    await this.leaveProgMode();

    progress('Complete', 100);
  }
}

/** Board keys in webserial-flasher `BOARDS` that use wiring STK500v2 bootloaders. */
export const WIRING_STK500V2_BOARD_KEYS = new Set([
  'arduino-mega2560',
  'arduino-mega-adk',
  'arduino-mega1280',
]);

export function isWiringStk500v2Board(flasherBoardKey: string): boolean {
  return WIRING_STK500V2_BOARD_KEYS.has(flasherBoardKey);
}

/** STK500v2 programmer — wiring subclass for Mega, stock class for AVRISP-class targets. */
export function createStk500v2Programmer(
  transport: ISTKTransport,
  board: Board,
  opts?: STK500Options,
  flasherBoardKey?: string,
): STK500v2 {
  if (flasherBoardKey && isWiringStk500v2Board(flasherBoardKey)) {
    return new WiringSTK500v2(transport, board, opts);
  }
  return new STK500v2(transport, board, opts);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
