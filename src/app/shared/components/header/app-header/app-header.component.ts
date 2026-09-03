import {
  Component,
  HostListener,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';

const MORE_ICON = "url('assets/icons/header/more.svg')";

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent {
  readonly moreIcon = MORE_ICON;
  overflowOpen = false;

  @ViewChild('overflowRoot', { read: ElementRef, static: true })
  private overflowRoot!: ElementRef<HTMLElement>;

  constructor(private readonly cdr: ChangeDetectorRef) {}

  toggleOverflow(event: MouseEvent): void {
    event.stopPropagation();
    this.overflowOpen = !this.overflowOpen;
    this.cdr.detectChanges();
  }

  closeOverflow(): void {
    this.overflowOpen = false;
    this.cdr.detectChanges();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (
      this.overflowOpen &&
      !this.overflowRoot.nativeElement.contains(event.target as Node)
    ) {
      this.closeOverflow();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeOverflow();
  }
}
