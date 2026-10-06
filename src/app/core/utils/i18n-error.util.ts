/** UI message keys returned in CompileResult.error / UploadResult.error or Error.message. */
export function isUiI18nKey(value: string | undefined): boolean {
  return typeof value === 'string' && value.startsWith('ui.');
}

/** Resolves i18n key from thrown errors (message or i18nKey field). */
export function resolveUiErrorKey(err: unknown, fallback: string): string {
  if (err && typeof err === 'object') {
    const record = err as { message?: string; i18nKey?: string };
    if (isUiI18nKey(record.i18nKey)) {
      return record.i18nKey!;
    }
    if (isUiI18nKey(record.message)) {
      return record.message!;
    }
  }
  return fallback;
}

/** Resolves i18n key from result.error (first line if technical text). */
export function resolveUiErrorMessage(error: string | undefined, fallback: string): string {
  if (isUiI18nKey(error)) {
    return error!;
  }
  if (error) {
    return error.split('\n')[0];
  }
  return fallback;
}
