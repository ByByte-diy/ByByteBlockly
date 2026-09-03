import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header-icon-button',
  template: `
    <button
      type="button"
      class="header-icon-btn"
      [class.header-icon-btn--active]="active"
      [disabled]="disabled"
      [attr.title]="title"
      [attr.aria-label]="ariaLabel || title"
      [attr.aria-pressed]="active ? true : null"
    >
      <ng-content></ng-content>
    </button>
  `,
})
export class HeaderIconButtonComponent {
  @Input() active = false;
  @Input() disabled = false;
  @Input() title = '';
  @Input() ariaLabel = '';
}
