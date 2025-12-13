/**
 * Compile result
 */
export interface CompileResult {
  success: boolean;
  output: string;
  error?: string;
  hexPath?: string;
  binPath?: string;
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

/**
 * Compile options
 */
export interface CompileOptions {
  board: string;
  code: string;
  libraries?: string[];
  warnings?: 'none' | 'default' | 'more' | 'all';
  verbose?: boolean;
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

