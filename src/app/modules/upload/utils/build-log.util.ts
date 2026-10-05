import { CompileResult } from '@core/models';

export type BuildLogLineKind = 'error' | 'warning' | 'note' | 'plain';

export interface BuildLogLine {
  text: string;
  kind: BuildLogLineKind;
}

export function classifyBuildLogLine(line: string): BuildLogLineKind {
  const lower = line.toLowerCase();
  if (lower.includes('fatal error:') || lower.includes('error:')) {
    return 'error';
  }
  if (lower.includes('warning:')) {
    return 'warning';
  }
  if (lower.includes('note:')) {
    return 'note';
  }
  return 'plain';
}

export function parseBuildLogLines(text: string): BuildLogLine[] {
  if (!text) {
    return [];
  }
  return text.split('\n').map((line) => ({
    text: line,
    kind: classifyBuildLogLine(line),
  }));
}

/** Full build log text for UI and clipboard. */
export function formatBuildLog(result: CompileResult): string {
  const parts: string[] = [];

  if (result.output) {
    parts.push(result.output.trimEnd());
  }
  if (result.error && !result.output?.includes(result.error)) {
    parts.push(result.error.trim());
  }
  if (result.success) {
    if (result.flashBytes != null) {
      parts.push('', `flashBytes: ${result.flashBytes}`);
    }
    if (result.fitsTarget != null) {
      parts.push(`fitsTarget: ${result.fitsTarget}`);
    }
    if (result.hexContent) {
      parts.push(`hex length: ${result.hexContent.length}`);
    }
  }

  return parts.join('\n').trim();
}
