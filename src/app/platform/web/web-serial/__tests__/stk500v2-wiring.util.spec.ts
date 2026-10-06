import { describe, it, expect } from 'vitest';
import { STK500v2 } from 'webserial-flasher';
import {
  WiringSTK500v2,
  createStk500v2Programmer,
  isWiringStk500v2Board,
} from '../upload/utils/stk500v2-wiring.util';

describe('stk500v2-wiring.util', () => {
  it('detects wiring board keys', () => {
    expect(isWiringStk500v2Board('arduino-mega2560')).toBe(true);
    expect(isWiringStk500v2Board('arduino-uno')).toBe(false);
  });

  it('createStk500v2Programmer returns WiringSTK500v2 for Mega', () => {
    const board = {
      name: 'Mega',
      baudRate: 115200,
      signature: new Uint8Array([0x1e, 0x98, 0x01]),
      pageSize: 256,
      timeout: 10000,
    };
    const transport = {} as ConstructorParameters<typeof STK500v2>[0];

    const mega = createStk500v2Programmer(transport, board, undefined, 'arduino-mega2560');
    expect(mega).toBeInstanceOf(WiringSTK500v2);

    const generic = createStk500v2Programmer(transport, board, undefined, 'unknown-board');
    expect(generic).toBeInstanceOf(STK500v2);
    expect(generic).not.toBeInstanceOf(WiringSTK500v2);
  });
});
