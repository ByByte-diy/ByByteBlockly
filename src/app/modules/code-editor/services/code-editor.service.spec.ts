import { NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BlocklyService } from '../../blockly/services/blockly.service';
import { CodeEditorService } from './code-editor.service';

const mockNgZone = {
  run: (fn: () => void) => fn(),
} as NgZone;

describe('CodeEditorService', () => {
  let blocklyService: { code$: BehaviorSubject<string> };
  let service: CodeEditorService;

  beforeEach(() => {
    localStorage.clear();
    blocklyService = {
      code$: new BehaviorSubject<string>(''),
    };
    service = new CodeEditorService(blocklyService as unknown as BlocklyService, mockNgZone);
  });

  afterEach(() => {
    service.ngOnDestroy();
    localStorage.clear();
  });

  it('auto-syncs generated code when not dirty', () => {
    const values: string[] = [];
    service.editorContent$.subscribe((value) => values.push(value));

    blocklyService.code$.next('void setup() {}');

    expect(values.at(-1)).toBe('void setup() {}');
    expect(service.getEffectiveCode()).toBe('void setup() {}');
    expect(service.isManuallyEdited()).toBe(false);
  });

  it('does not overwrite editor content when dirty', () => {
    blocklyService.code$.next('generated v1');
    service.setEditedCode('manual edit');

    blocklyService.code$.next('generated v2');

    expect(service.getEffectiveCode()).toBe('manual edit');
    expect(service.isManuallyEdited()).toBe(true);
  });

  it('resetToGenerated clears dirty state and restores generated code', () => {
    blocklyService.code$.next('generated v2');
    service.setEditedCode('manual edit');

    service.resetToGenerated();

    expect(service.isManuallyEdited()).toBe(false);
    expect(service.getEffectiveCode()).toBe('generated v2');
  });

  it('persists panel open state in localStorage', () => {
    expect(service.isPanelOpen()).toBe(false);

    service.setPanelOpen(true);
    expect(localStorage.getItem('code-panel-open')).toBe('1');

    const reopened = new CodeEditorService(blocklyService as unknown as BlocklyService, mockNgZone);
    expect(reopened.isPanelOpen()).toBe(true);
    reopened.ngOnDestroy();
  });

  it('togglePanel switches open state and emits panelOpenChange$', () => {
    const emissions: boolean[] = [];
    service.panelOpenChange$.subscribe((open) => emissions.push(open));

    service.togglePanel();
    expect(service.isPanelOpen()).toBe(true);
    expect(emissions).toEqual([true]);

    service.togglePanel();
    expect(service.isPanelOpen()).toBe(false);
    expect(emissions).toEqual([true, false]);
  });

  it('persists panel width in localStorage', () => {
    service.setPanelWidth(520);

    expect(service.getPanelWidth()).toBe(520);
    expect(localStorage.getItem('code-panel-width')).toBe('520');

    const reopened = new CodeEditorService(blocklyService as unknown as BlocklyService, mockNgZone);
    expect(reopened.getPanelWidth()).toBe(520);
    reopened.ngOnDestroy();
  });

  it('clamps panel width between min and max', () => {
    expect(service.clampPanelWidth(100)).toBe(280);
    expect(service.clampPanelWidth(9999, 1000)).toBe(650);
  });

  it('copyToClipboard writes effective code', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    blocklyService.code$.next('generated');
    service.setEditedCode('edited');

    await service.copyToClipboard();

    expect(writeText).toHaveBeenCalledWith('edited');
  });
});
