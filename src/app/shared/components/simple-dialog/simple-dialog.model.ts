export type SimpleDialogMode = 'alert' | 'confirm';

export interface SimpleDialogConfig {
  titleKey: string;
  messageKey: string;
  messageParams?: Record<string, string | number>;
  mode: SimpleDialogMode;
  primaryKey?: string;
  secondaryKey?: string;
}
