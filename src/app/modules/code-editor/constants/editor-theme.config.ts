import { Extension } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import { oneDark } from '@codemirror/theme-one-dark';
import { ResolvedAppTheme } from '@core/services/theme.service';

/** Light theme aligned with app CSS variables. */
const lightTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: 'var(--code-editor-bg)',
      color: 'var(--code-editor-text)',
    },
    '.cm-content': {
      caretColor: 'var(--code-editor-cursor)',
    },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: 'var(--code-editor-cursor)',
    },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': {
      backgroundColor: 'var(--code-editor-selection)',
    },
    '.cm-gutters': {
      backgroundColor: 'var(--code-editor-gutter-bg)',
      color: 'var(--code-editor-gutter-text)',
      borderRight: '1px solid var(--code-editor-border)',
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'var(--code-editor-active-line-gutter)',
    },
    '.cm-activeLine': {
      backgroundColor: 'var(--code-editor-active-line)',
    },
  },
  { dark: false },
);

export function getEditorTheme(resolved: ResolvedAppTheme): Extension {
  return resolved === 'dark' ? oneDark : lightTheme;
}
