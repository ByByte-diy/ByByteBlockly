/**
 * Central registry for Arduino #include directives.
 * Deduplicates libraries via a Set of normalized header paths.
 */

/** Headers included with quotes in legacy sketches (not angle brackets). */
const QUOTED_HEADERS = new Set(["DHT.h", "MRT_esp32_Motor.h"]);

export interface IncludeRegistryEntry {
  key: string;
  line: string;
  comment?: string;
}

export class IncludeRegistry {
  private readonly seen = new Set<string>();
  private readonly entries: IncludeRegistryEntry[] = [];

  /** Normalize: Wire.h | <Wire.h> | #include <Wire.h> → Wire.h */
  normalizeLibraryRef(ref: string): string {
    let path = ref.trim();
    path = path.replace(/^#include\s+/, "");
    path = path.replace(/^["<]|[">]$/g, "");
    return path;
  }

  formatIncludeLine(libraryPath: string): string {
    const key = this.normalizeLibraryRef(libraryPath);
    if (QUOTED_HEADERS.has(key)) {
      return `#include "${key}"`;
    }
    return `#include <${key}>`;
  }

  /** Returns true when the library was added; false if already registered. */
  add(libraryRef: string, comment?: string): boolean {
    const key = this.normalizeLibraryRef(libraryRef);
    if (!key || this.seen.has(key)) {
      return false;
    }
    this.seen.add(key);
    this.entries.push({
      key,
      line: this.formatIncludeLine(key),
      comment: comment?.trim() || undefined,
    });
    return true;
  }

  has(libraryRef: string): boolean {
    return this.seen.has(this.normalizeLibraryRef(libraryRef));
  }

  renderLines(): string[] {
    return [...this.entries]
      .sort((a, b) => a.key.localeCompare(b.key))
      .map((entry) => {
        if (!entry.comment) {
          return entry.line;
        }
        const commentLines = entry.comment
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => `// ${line}`);
        return `${commentLines.join("\n")}\n${entry.line}`;
      });
  }

  render(): string {
    return this.renderLines().join("\n");
  }
}

export function ensureIncludeRegistry(generator: any): IncludeRegistry {
  if (!generator.includeRegistry_) {
    generator.includeRegistry_ = new IncludeRegistry();
  }
  return generator.includeRegistry_ as IncludeRegistry;
}
