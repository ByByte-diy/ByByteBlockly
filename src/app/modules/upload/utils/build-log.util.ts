import { CompileResult } from '@core/models';
import { isUiI18nKey } from '@core/utils/i18n-error.util';

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
  if (
    lower.includes('note:') ||
    line.startsWith('---') ||
    /^\[(core|stock|bybyte|sketch|ar|ld|objcopy|done)\]/i.test(line) ||
    /^(board|stock libs|bybyte \.o):/.test(line) ||
    /^  /.test(line)
  ) {
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
  if (
    result.error &&
    !isUiI18nKey(result.error) &&
    !result.output?.includes(result.error)
  ) {
    parts.push(result.error.trim());
  }
  if (result.success) {
    const summary: string[] = ['', '--- result ---'];
    if (result.flashBytes != null) {
      summary.push(`flash: ${result.flashBytes} bytes`);
    }
    if (result.fitsTarget != null) {
      summary.push(`fits target: ${result.fitsTarget ? 'yes' : 'no'}`);
    }
    if (result.hexContent) {
      summary.push(`hex: ${result.hexContent.length} chars`);
    }
    parts.push(summary.join('\n'));
  }

  return parts.join('\n').trim();
}
