/**
 * Beginner-friendly comment blocks for generated Arduino/C++ code.
 * Keeps declarations grouped and easy to read in the sketch.
 */

import { ensureIncludeRegistry } from "./include-registry.helper";

/** Add // comment line(s) above a code fragment */
export function withComment(comment: string, code: string): string {
  const body = code.trimEnd();
  const commentLines = comment
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `// ${line}`);

  if (!commentLines.length) {
    return `${body}\n`;
  }
  return `${commentLines.join("\n")}\n${body}\n`;
}

/** Section-style header (title + short description) above code */
export function withSectionComment(
  title: string,
  description: string,
  code: string
): string {
  const header = description.trim() ? `${title}\n${description}` : title;
  return withComment(header, code);
}

export function registerDefinition(
  generator: { definitions_: Record<string, string> },
  key: string,
  code: string,
  comment: string
): void {
  generator.definitions_[key] = withComment(comment, code);
}

export function registerGlobalVariable(
  generator: { variables_: Record<string, string> },
  key: string,
  code: string,
  comment: string
): void {
  generator.variables_[key] = withComment(comment, code);
}

export function registerUserFunction(
  generator: { userFunctions_: Record<string, string> },
  key: string,
  code: string,
  comment: string
): void {
  generator.userFunctions_[key] = withComment(comment, code);
}

/** Register a unique #include (deduplicated by header path). */
export function registerInclude(
  generator: any,
  libraryRef: string,
  comment?: string
): boolean {
  return ensureIncludeRegistry(generator).add(libraryRef, comment);
}

/** Banner between major sketch sections (finish()) */
export function sketchSectionBanner(title: string): string {
  return `// ========== ${title} ==========`;
}

export function joinSketchSection(title: string, items: string[]): string {
  if (!items.length) {
    return "";
  }
  return (
    `${sketchSectionBanner(title)}\n` + items.join("\n").trimEnd() + "\n\n"
  );
}
