export type WebSerialUnsupportedReason = 'no_api' | 'insecure_context';

export interface WebSerialSupportStatus {
  supported: boolean;
  secureContext: boolean;
  reason?: WebSerialUnsupportedReason;
}

/**
 * Checks whether Web Serial API can be used in the current browser context.
 * Requires a secure context (HTTPS or localhost) and `navigator.serial`.
 */
export function getWebSerialSupport(
  globalScope: Pick<Window, 'isSecureContext' | 'location'> & { navigator: Navigator } = window,
): WebSerialSupportStatus {
  const secureContext = globalScope.isSecureContext === true;
  const hasApi = 'serial' in globalScope.navigator;

  if (!hasApi) {
    return { supported: false, secureContext, reason: 'no_api' };
  }

  if (!secureContext) {
    return { supported: false, secureContext: false, reason: 'insecure_context' };
  }

  return { supported: true, secureContext: true };
}

export function isWebSerialSupported(globalScope?: Parameters<typeof getWebSerialSupport>[0]): boolean {
  return getWebSerialSupport(globalScope).supported;
}

export function isSecureContextForWebSerial(
  globalScope: Pick<Window, 'isSecureContext'> = window,
): boolean {
  return globalScope.isSecureContext === true;
}
