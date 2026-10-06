/**
 * Compile result
 */
export interface CompileResult {
  success: boolean;
  output: string;
  error?: string;
  hexPath?: string;
  hexContent?: string;
  binPath?: string;
  /** Base64-encoded flash app image (ESP32 WASM compile). */
  binContent?: string;
  /** Flash offset for binContent (ESP32 app partition). */
  flashAppAddress?: number;
  flashBytes?: number;
  fitsTarget?: boolean;
  fqbn?: string;
  size?: {
    text: number;
    data: number;
    bss: number;
    total: number;
  };
}

/**
 * Upload result
 */
export interface UploadResult {
  success: boolean;
  output: string;
  error?: string;
}

/** Progress update during compile (0–100). */
export interface CompileProgressUpdate {
  percent: number;
  /** Plain text or i18n key (ui.compile_progress_*). */
  message?: string;
}

/** Progress update during firmware upload (0–100). */
export interface UploadProgressUpdate {
  percent: number;
  /** Plain text or i18n key (ui.upload_progress_*). */
  message?: string;
}

/**
 * Compile options
 */
export interface CompileOptions {
  board: string;
  code: string;
  libraries?: string[];
  warnings?: 'none' | 'default' | 'more' | 'all';
  verbose?: boolean;
  onProgress?: (update: CompileProgressUpdate) => void;
}

/**
 * Upload options
 */
export interface UploadOptions {
  board: string;
  /** Catalog board id (e.g. uno, nano) for upload profile resolution. */
  boardId?: string;
  port: string;
  hexPath?: string;
  /** In-memory Intel HEX from WASM compile (web). */
  hexContent?: string;
  /** Base64 app .bin from ESP32 WASM compile (web). */
  binContent?: string;
  /** Flash offset for binContent (default 0x10000 for ESP32). */
  flashAppAddress?: number;
  programmer?: string;
  verbose?: boolean;
  onProgress?: (update: UploadProgressUpdate) => void;
}

