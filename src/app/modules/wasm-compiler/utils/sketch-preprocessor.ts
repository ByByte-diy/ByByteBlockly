/**
 * Minimal Arduino-sketch → valid C++ transform for WASM cc1plus.
 * Mirrors arduino-cli .ino preprocessing: forward declarations for functions.
 */

export const FORWARD_DECL_BANNER = '// Forward declarations (WASM sketch preprocess)';

const INCLUDE_LINE = /^\s*#\s*include\b/;
const SECTION_BANNER = /^\/\/ =+/;
const CONTROL_FLOW = /^\s*(if|while|for|switch|catch)\s*\(/i;
const FUNCTION_START =
  /^\s*(?:static\s+)?(?:inline\s+)?(?:(?:unsigned|signed)\s+)?(?:void|[A-Za-z_][\w:<>,\s*&]*\s+)\*?\s*[A-Za-z_]\w*\s*\(?/;
const ARDUINO_ENTRYPOINTS = new Set(['setup', 'loop']);
const EXTERN_C_PREFIX = /^\s*extern\s+"C"\s+/i;

function stripExternC(signature: string): { linkage: string; rest: string } {
  const match = signature.match(EXTERN_C_PREFIX);
  if (!match) {
    return { linkage: '', rest: signature };
  }
  return { linkage: 'extern "C" ', rest: signature.slice(match[0].length) };
}

function stripLineComment(line: string): string {
  let inString = false;
  let escaped = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === '\\' && inString) {
      escaped = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (!inString && ch === '/' && line[i + 1] === '/') {
      return line.slice(0, i).trimEnd();
    }
  }
  return line;
}

function isSkippableLine(line: string): boolean {
  const trimmed = line.trim();
  return !trimmed || trimmed.startsWith('//') || SECTION_BANNER.test(trimmed);
}

function isFunctionSignature(signature: string): boolean {
  const { rest } = stripExternC(signature);
  const normalized = rest.replace(/\s+/g, ' ').trim();
  if (!normalized || normalized.includes(';') || normalized.includes('{')) {
    return false;
  }
  if (CONTROL_FLOW.test(normalized)) {
    return false;
  }
  if (/\b(class|struct|enum|namespace|union|template)\b/.test(normalized)) {
    return false;
  }
  return /^(?:static\s+)?(?:inline\s+)?(?:(?:unsigned|signed)\s+)?(?:[A-Za-z_][\w:<>,\s*&]*\s+)+?\*?\s*[A-Za-z_]\w*\s*\([^)]*\)$/.test(
    normalized,
  );
}

function countBraceDelta(text: string): number {
  let delta = 0;
  let inString = false;
  let escaped = false;
  for (const ch of text) {
    if (escaped) {
      escaped = false;
      continue;
    }
    if (ch === '\\' && inString) {
      escaped = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) {
      continue;
    }
    if (ch === '{') {
      delta++;
    } else if (ch === '}') {
      delta--;
    }
  }
  return delta;
}

function extractFunctionName(signature: string): string | null {
  const match = signature.match(/([A-Za-z_]\w*)\s*\([^)]*\)$/);
  return match?.[1] ?? null;
}

function looksLikeFunctionStart(line: string): boolean {
  const stripped = stripLineComment(line).trim();
  if (!stripped || stripped.endsWith(';')) {
    return false;
  }
  if (EXTERN_C_PREFIX.test(stripped)) {
    return true;
  }
  return FUNCTION_START.test(stripped) && stripped.includes('(');
}

function parseSingleLineFunction(line: string): string | null {
  const trimmed = stripLineComment(line).trim();
  const { linkage, rest } = stripExternC(trimmed);
  const braceIdx = rest.indexOf('{');
  if (braceIdx === -1) {
    return null;
  }
  const signature = `${linkage}${rest.slice(0, braceIdx).trim()}`.trim();
  return isFunctionSignature(signature) ? signature : null;
}

function rememberPrototype(prototypes: string[], seen: Set<string>, signature: string): void {
  const normalized = signature.replace(/\s+/g, ' ').trim();
  if (!isFunctionSignature(normalized)) {
    return;
  }
  const name = extractFunctionName(normalized);
  if (name && ARDUINO_ENTRYPOINTS.has(name)) {
    return;
  }
  if (seen.has(normalized)) {
    return;
  }
  seen.add(normalized);
  prototypes.push(normalized);
}

/** Collect function signatures from definitions in generated sketch code. */
export function extractFunctionPrototypes(source: string): string[] {
  const prototypes: string[] = [];
  const seen = new Set<string>();
  const lines = source.replace(/\r\n/g, '\n').split('\n');

  let depth = 0;
  for (let i = 0; i < lines.length; i++) {
    const stripped = stripLineComment(lines[i]);
    if (!isSkippableLine(stripped) && depth === 0) {
      const singleLine = parseSingleLineFunction(lines[i]);
      if (singleLine) {
        rememberPrototype(prototypes, seen, singleLine);
      } else if (looksLikeFunctionStart(lines[i])) {
        const buffer: string[] = [];
        for (let j = i; j < lines.length && j < i + 10; j++) {
          const part = stripLineComment(lines[j]).trim();
          if (!part && buffer.length === 0) {
            continue;
          }
          buffer.push(part);
          const combined = buffer.join(' ').replace(/\s+/g, ' ');
          const braceAt = combined.indexOf('{');
          if (braceAt === -1) {
            continue;
          }
          rememberPrototype(prototypes, seen, combined.slice(0, braceAt).trim());
          i = j;
          break;
        }
      }
    }

    if (!isSkippableLine(stripped)) {
      depth += countBraceDelta(stripped);
      if (depth < 0) {
        depth = 0;
      }
    }
  }

  return prototypes;
}

function findPrototypeInsertionIndex(lines: string[]): number {
  let lastIncludeIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (INCLUDE_LINE.test(lines[i])) {
      lastIncludeIdx = i;
    }
  }

  if (lastIncludeIdx === -1) {
    let i = 0;
    while (i < lines.length && lines[i].trim() === '') {
      i++;
    }
    return i;
  }

  let insertAt = lastIncludeIdx + 1;
  while (insertAt < lines.length && lines[insertAt].trim() === '') {
    insertAt++;
  }
  return insertAt;
}

/** Insert forward declarations after #include block (idempotent). */
export function injectForwardDeclarations(source: string): string {
  if (source.includes(FORWARD_DECL_BANNER)) {
    return source;
  }

  const prototypes = extractFunctionPrototypes(source);
  if (!prototypes.length) {
    return source;
  }

  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const insertAt = findPrototypeInsertionIndex(lines);
  const block = [FORWARD_DECL_BANNER, ...prototypes.map((sig) => `${sig};`), ''];
  lines.splice(insertAt, 0, ...block);
  return lines.join('\n');
}
