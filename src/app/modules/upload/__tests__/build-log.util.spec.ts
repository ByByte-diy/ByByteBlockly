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
    expect(classifyBuildLogLine('flashBytes: 5292')).toBe('plain');
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
    expect(text).toContain('flashBytes: 5292');
    expect(text).toContain('fitsTarget: true');
    expect(text).toContain('hex length:');
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
