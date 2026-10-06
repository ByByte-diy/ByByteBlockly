import { describe, it, expect } from 'vitest';
import {
  isUiI18nKey,
  resolveUiErrorKey,
  resolveUiErrorMessage,
} from '../i18n-error.util';

describe('i18n-error.util', () => {
  it('detects ui.* keys', () => {
    expect(isUiI18nKey('ui.compile_code_empty')).toBe(true);
    expect(isUiI18nKey('Code is empty')).toBe(false);
  });

  it('resolveUiErrorKey prefers i18nKey then message', () => {
    expect(resolveUiErrorKey({ i18nKey: 'ui.upload_error_short' }, 'fallback')).toBe(
      'ui.upload_error_short',
    );
    expect(resolveUiErrorKey(new Error('ui.compile_code_empty'), 'fallback')).toBe(
      'ui.compile_code_empty',
    );
    expect(resolveUiErrorKey(new Error('boom'), 'ui.compile_error_short')).toBe(
      'ui.compile_error_short',
    );
  });

  it('resolveUiErrorMessage returns key or first line', () => {
    expect(resolveUiErrorMessage('ui.compile_code_empty', 'fallback')).toBe('ui.compile_code_empty');
    expect(resolveUiErrorMessage('line1\nline2', 'fallback')).toBe('line1');
    expect(resolveUiErrorMessage(undefined, 'ui.compile_error_short')).toBe('ui.compile_error_short');
  });
});
