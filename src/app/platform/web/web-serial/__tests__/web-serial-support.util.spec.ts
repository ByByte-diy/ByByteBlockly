import { describe, it, expect } from 'vitest';
import {
  getWebSerialSupport,
  isSecureContextForWebSerial,
  isWebSerialSupported,
} from '../utils/web-serial-support.util';

function mockScope(options: {
  hasSerial?: boolean;
  secure?: boolean;
}): Parameters<typeof getWebSerialSupport>[0] {
  const navigator = options.hasSerial ? ({ serial: {} } as Navigator) : ({} as Navigator);
  return {
    isSecureContext: options.secure ?? true,
    location: { protocol: 'https:' } as Location,
    navigator,
  };
}

describe('web-serial-support.util', () => {
  it('reports supported when API exists and context is secure', () => {
    const status = getWebSerialSupport(mockScope({ hasSerial: true, secure: true }));
    expect(status.supported).toBe(true);
    expect(status.secureContext).toBe(true);
    expect(status.reason).toBeUndefined();
    expect(isWebSerialSupported(mockScope({ hasSerial: true, secure: true }))).toBe(true);
  });

  it('reports no_api when navigator.serial is missing', () => {
    const status = getWebSerialSupport(mockScope({ hasSerial: false, secure: true }));
    expect(status.supported).toBe(false);
    expect(status.reason).toBe('no_api');
  });

  it('reports insecure_context on plain HTTP', () => {
    const status = getWebSerialSupport(mockScope({ hasSerial: true, secure: false }));
    expect(status.supported).toBe(false);
    expect(status.reason).toBe('insecure_context');
    expect(isSecureContextForWebSerial(mockScope({ secure: false }))).toBe(false);
  });
});
