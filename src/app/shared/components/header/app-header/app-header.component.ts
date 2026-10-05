import {
  Component,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  HEADER_POPOVER_IDS,
  HeaderPopoverService,
} from '@core/services/header-popover.service';

const MORE_ICON = "url('assets/icons/header/more.svg')";

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
})
export class AppHeaderComponent implements OnInit, OnDestroy {
  readonly moreIcon = MORE_ICON;
  overflowOpen = false;

  @ViewChild('overflowRoot', { read: ElementRef, static: true })
  private overflowRoot!: ElementRef<HTMLElement>;

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly headerPopover = inject(HeaderPopoverService);
  private readonly popoverId = HEADER_POPOVER_IDS.overflow;
  private popoverSubscription?: Subscription;

  ngOnInit(): void {
    this.headerPopover.registerRoot(this.popoverId, this.overflowRoot.nativeElement);

    this.popoverSubscription = this.headerPopover.activeId$.subscribe((id) => {
      this.overflowOpen = id === this.popoverId;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.headerPopover.unregisterRoot(this.popoverId);
    this.popoverSubscription?.unsubscribe();
  }

  toggleOverflow(event: MouseEvent): void {
    event.stopPropagation();
    this.headerPopover.toggle(this.popoverId);
  }

  closeOverflow(): void {
    this.headerPopover.close(this.popoverId);
  }

}
