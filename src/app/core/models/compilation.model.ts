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
  port: string;
  hexPath?: string;
  programmer?: string;
  verbose?: boolean;
}

