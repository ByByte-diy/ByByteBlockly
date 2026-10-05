import { describe, it, expect } from 'vitest';
import {
  WebSerialRequestError,
  mapWebSerialRequestError,
} from '@platform/web/utils/web-serial-request-error.util';

describe('web-serial-request-error.util', () => {
  it('maps NotFoundError to cancelled i18n key', () => {
    const err = mapWebSerialRequestError(new DOMException('closed', 'NotFoundError'));
    expect(err).toBeInstanceOf(WebSerialRequestError);
    expect(err.reason).toBe('cancelled');
    expect(err.i18nKey).toBe('ui.web_serial_cancelled');
  });

  it('maps SecurityError to insecure context key', () => {
    const err = mapWebSerialRequestError(new DOMException('blocked', 'SecurityError'));
    expect(err.i18nKey).toBe('ui.web_serial_insecure_context');
  });
});
