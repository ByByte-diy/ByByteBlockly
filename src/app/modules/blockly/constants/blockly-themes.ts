/**
 * Blockly workspace themes (light / dark) based on Zelos.
 * @see https://developers.google.com/blockly/guides/configure/web/themes
 */
import * as Blockly from 'blockly';

export type ResolvedAppTheme = 'light' | 'dark';

export const BYBYTE_BLOCKLY_LIGHT_THEME = Blockly.Theme.defineTheme('bybyteLight', {
  name: 'bybyteLight',
  base: Blockly.Themes.Zelos,
  componentStyles: {
    workspaceBackgroundColour: '#f9f9f9',
    toolboxBackgroundColour: '#ececec',
    toolboxForegroundColour: '#3c4043',
    flyoutBackgroundColour: '#ececec',
    flyoutForegroundColour: '#3c4043',
    flyoutOpacity: 0.95,
    scrollbarColour: '#c1c1c1',
    scrollbarOpacity: 0.5,
    insertionMarkerColour: '#000000',
    insertionMarkerOpacity: 0.25,
    cursorColour: '#000000',
  },
});

export const BYBYTE_BLOCKLY_DARK_THEME = Blockly.Theme.defineTheme('bybyteDark', {
  name: 'bybyteDark',
  base: Blockly.Themes.Zelos,
  componentStyles: {
    workspaceBackgroundColour: '#1e1e1e',
    toolboxBackgroundColour: '#2b2b2b',
    toolboxForegroundColour: '#e8eaed',
    flyoutBackgroundColour: '#2d2d2d',
    flyoutForegroundColour: '#e8eaed',
    flyoutOpacity: 0.98,
    scrollbarColour: '#5f6368',
    scrollbarOpacity: 0.6,
    insertionMarkerColour: '#ffffff',
    insertionMarkerOpacity: 0.25,
    cursorColour: '#e8eaed',
  },
});

export function getBlocklyTheme(resolved: ResolvedAppTheme): Blockly.Theme {
  return resolved === 'dark'
    ? BYBYTE_BLOCKLY_DARK_THEME
    : BYBYTE_BLOCKLY_LIGHT_THEME;
}

export const BLOCKLY_GRID_COLOURS: Record<ResolvedAppTheme, string> = {
  light: '#cccccc',
  dark: '#444444',
};
