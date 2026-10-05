import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  clampProgressPercent,
  createProgressSimulator,
} from '@core/utils/compile-progress.util';

describe('compile-progress.util', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('clamps progress to 0–100', () => {
    expect(clampProgressPercent(undefined)).toBeUndefined();
    expect(clampProgressPercent(-5)).toBe(0);
    expect(clampProgressPercent(42.6)).toBe(43);
    expect(clampProgressPercent(150)).toBe(100);
  });

  it('ticks simulated progress until stopped', () => {
    const ticks: number[] = [];
    const simulator = createProgressSimulator((percent) => ticks.push(percent), {
      from: 35,
      to: 40,
      intervalMs: 100,
    });

    vi.advanceTimersByTime(250);
    simulator.stop();

    expect(ticks.length).toBeGreaterThan(0);
    expect(ticks.at(-1)).toBeLessThanOrEqual(40);
    expect(ticks[0]).toBeGreaterThanOrEqual(35);
  });
});
