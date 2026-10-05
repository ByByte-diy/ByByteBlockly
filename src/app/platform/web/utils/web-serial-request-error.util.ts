export type WebSerialRequestFailureReason =
  | 'cancelled'
  | 'denied'
  | 'insecure_context'
  | 'not_supported'
  | 'unknown';

export class WebSerialRequestError extends Error {
  readonly reason: WebSerialRequestFailureReason;
  readonly i18nKey: string;

  constructor(reason: WebSerialRequestFailureReason, i18nKey: string, message: string) {
    super(message);
    this.name = 'WebSerialRequestError';
    this.reason = reason;
    this.i18nKey = i18nKey;
  }
}

export function mapWebSerialRequestError(err: unknown): WebSerialRequestError {
  if (err instanceof WebSerialRequestError) {
    return err;
  }

  if (err instanceof DOMException) {
    switch (err.name) {
      case 'NotFoundError':
        return new WebSerialRequestError(
          'cancelled',
          'ui.web_serial_cancelled',
          err.message || 'Port selection was cancelled',
        );
      case 'NotAllowedError':
      case 'SecurityError':
        return new WebSerialRequestError(
          err.name === 'SecurityError' ? 'insecure_context' : 'denied',
          err.name === 'SecurityError'
            ? 'ui.web_serial_insecure_context'
            : 'ui.web_serial_denied',
          err.message || 'Web Serial access was denied',
        );
      default:
        break;
    }
  }

  const message = err instanceof Error ? err.message : String(err);
  return new WebSerialRequestError('unknown', 'ui.web_serial_request_failed', message);
}

/** Embedded IDE browsers often block the native serial port picker. */
export function getWebSerialEnvironmentHintKey(): string | null {
  if (typeof navigator === 'undefined') {
    return null;
  }

  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('cursor') || ua.includes('electron')) {
    return 'ui.web_serial_use_external_browser';
  }

  return null;
}
