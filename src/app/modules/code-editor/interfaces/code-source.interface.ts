/**
 * Single source of truth for code consumed by the compiler.
 * Phase 2: inject this abstraction into UploadManagerService.
 */
export abstract class ICodeSource {
  abstract getEffectiveCode(): string;
  abstract isManuallyEdited(): boolean;
  abstract resetToGenerated(): void;
}
