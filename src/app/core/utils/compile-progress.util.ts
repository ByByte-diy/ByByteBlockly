export interface ProgressSimulator {
  stop(): void;
}

/** Smooth percent ticks while a long-running compile step has no real progress signal. */
export function createProgressSimulator(
  onTick: (percent: number) => void,
  config: { from: number; to: number; intervalMs?: number } = { from: 35, to: 92, intervalMs: 220 },
): ProgressSimulator {
  let current = config.from;
  const timer = setInterval(() => {
    if (current >= config.to) {
      return;
    }
    const step = current < 60 ? 2 : current < 80 ? 1 : 0.5;
    current = Math.min(config.to, current + step);
    onTick(Math.round(current));
  }, config.intervalMs);

  return {
    stop(): void {
      clearInterval(timer);
    },
  };
}

export function clampProgressPercent(value: number | undefined): number | undefined {
  if (value == null || Number.isNaN(value)) {
    return undefined;
  }
  return Math.max(0, Math.min(100, Math.round(value)));
}
