import { describe, it, expect } from 'vitest';
import {
  classifyBuildLogLine,
  formatBuildLog,
  parseBuildLogLines,
} from '../utils/build-log.util';

describe('build-log.util', () => {
  it('classifies gcc error, warning and note lines', () => {
    expect(classifyBuildLogLine('sketch.ino:1:1: error: expected ;')).toBe('error');
    expect(classifyBuildLogLine('fatal error: limits.h: No such file')).toBe('error');
    expect(classifyBuildLogLine('note: candidate function not viable')).toBe('note');
    expect(classifyBuildLogLine('warning: unused variable')).toBe('warning');
    expect(classifyBuildLogLine('[sketch] sketch.cpp')).toBe('note');
    expect(classifyBuildLogLine('flash: 5292 bytes')).toBe('plain');
  });

  it('formats compile output with flash stats', () => {
    const text = formatBuildLog({
      success: true,
      output: '[cc1plus] ok',
      flashBytes: 5292,
      fitsTarget: true,
      hexContent: ':1234567890ABCDEF\n',
    });

    expect(text).toContain('[cc1plus] ok');
    expect(text).toContain('flash: 5292 bytes');
    expect(text).toContain('fits target: yes');
    expect(text).toContain('hex:');
  });

  it('omits ui.* error keys from build log text', () => {
    const text = formatBuildLog({
      success: false,
      output: '',
      error: 'ui.compile_code_empty',
    });
    expect(text).toBe('');
  });

  it('parses multiline log for UI rendering', () => {
    const lines = parseBuildLogLines('ok\nerror: boom\nwarning: unused');
    expect(lines).toEqual([
      { text: 'ok', kind: 'plain' },
      { text: 'error: boom', kind: 'error' },
      { text: 'warning: unused', kind: 'warning' },
    ]);
  });
});
