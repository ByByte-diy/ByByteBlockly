/**
 * Contract violation reported by block/category validators.
 */
export interface ContractViolation {
  code: string;
  message: string;
  context?: Record<string, unknown>;
}

export function violation(
  code: string,
  message: string,
  context?: Record<string, unknown>
): ContractViolation {
  return { code, message, context };
}
