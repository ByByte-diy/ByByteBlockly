/**
 * Zone.js flags — must load before zone.js (see angular.json polyfills order).
 * Blockly manages its own pointer/focus lifecycle; patching these events causes
 * FocusManager errors and flyout dispose races in Angular apps.
 */
(window as any).__zone_symbol__UNPATCHED_EVENTS = [
  'scroll',
  'mousemove',
  'mousedown',
  'mouseup',
  'click',
  'pointerdown',
  'pointerup',
  'pointermove',
  'touchstart',
  'touchend',
];
