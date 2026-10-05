import { isPlatformBrowser } from '@angular/common';
import { Injectable, NgZone, PLATFORM_ID, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/** Unique ids for header dropdowns / popovers (only one open at a time). */
export const HEADER_POPOVER_IDS = {
  language: 'lang-switcher',
  file: 'file-menu',
  device: 'device-selector',
  upload: 'upload-panel',
  theme: 'theme-toggle',
  overflow: 'header-overflow',
} as const;

export type HeaderPopoverId = (typeof HEADER_POPOVER_IDS)[keyof typeof HEADER_POPOVER_IDS];

@Injectable({ providedIn: 'root' })
export class HeaderPopoverService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);
  private readonly activeId = new BehaviorSubject<HeaderPopoverId | null>(null);
  private readonly roots = new Map<HeaderPopoverId, HTMLElement>();
  private suppressOutsideClose = false;
  private listenerAttached = false;

  readonly activeId$ = this.activeId.asObservable();

  registerRoot(id: HeaderPopoverId, element: HTMLElement): void {
    this.roots.set(id, element);
    this.attachGlobalListeners();
  }

  unregisterRoot(id: HeaderPopoverId): void {
    this.roots.delete(id);

    if (this.activeId.value === id) {
      this.activeId.next(null);
    }

    if (this.roots.size === 0) {
      this.detachGlobalListeners();
    }
  }

  toggle(id: HeaderPopoverId): void {
    this.armOutsideCloseSuppression();
    this.activeId.next(this.activeId.value === id ? null : id);
  }

  open(id: HeaderPopoverId): void {
    this.armOutsideCloseSuppression();
    this.activeId.next(id);
  }

  close(id?: HeaderPopoverId): void {
    if (!id || this.activeId.value === id) {
      this.activeId.next(null);
    }
  }

  closeAll(): void {
    this.activeId.next(null);
  }

  isOpen(id: HeaderPopoverId): boolean {
    return this.activeId.value === id;
  }

  /** Ignore the document click that follows a trigger toggle/open. */
  private armOutsideCloseSuppression(): void {
    this.suppressOutsideClose = true;
    queueMicrotask(() => {
      this.suppressOutsideClose = false;
    });
  }

  private attachGlobalListeners(): void {
    if (this.listenerAttached || !isPlatformBrowser(this.platformId)) {
      return;
    }

    this.listenerAttached = true;
    this.ngZone.runOutsideAngular(() => {
      document.addEventListener('click', this.onDocumentClick);
      document.addEventListener('keydown', this.onDocumentKeydown);
    });
  }

  private detachGlobalListeners(): void {
    if (!this.listenerAttached || !isPlatformBrowser(this.platformId)) {
      return;
    }

    document.removeEventListener('click', this.onDocumentClick);
    document.removeEventListener('keydown', this.onDocumentKeydown);
    this.listenerAttached = false;
  }

  private readonly onDocumentClick = (event: MouseEvent): void => {
    if (this.suppressOutsideClose) {
      return;
    }

    const active = this.activeId.value;
    if (!active) {
      return;
    }

    const root = this.roots.get(active);
    const target = event.target;
    if (!root || (target instanceof Node && root.contains(target))) {
      return;
    }

    this.ngZone.run(() => this.close(active));
  };

  private readonly onDocumentKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Escape' || !this.activeId.value) {
      return;
    }

    this.ngZone.run(() => this.closeAll());
  };
}
