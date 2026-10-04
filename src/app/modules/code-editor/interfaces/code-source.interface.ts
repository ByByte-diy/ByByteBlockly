/**
 * Single source of truth for code consumed by the compiler.
 * Implemented by CodeEditorService; injected into UploadManagerService.
 */
export abstract class ICodeSource {
  abstract getEffectiveCode(): string;
  abstract isManuallyEdited(): boolean;
  abstract resetToGenerated(): void;
}
