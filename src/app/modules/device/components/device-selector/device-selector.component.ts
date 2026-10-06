import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef,
  ElementRef,
  inject,
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  HEADER_POPOVER_IDS,
  HeaderPopoverService,
} from '@core/services/header-popover.service';
import { ISerial } from '@core/interfaces';
import { DeviceManagerService } from '../../services/device-manager.service';
import { IBoard } from '@app/modules/device/types/device-board.type';
import { ISerialPortInfo } from '@app/core/models/serial-port.model';
import { formatSerialPortLabel } from '@core/utils/serial-port-display.util';
import {
  WEB_SERIAL_REQUEST_NEW_PATH,
  WebSerialRequestError,
  getWebSerialEnvironmentHintKey,
  isConnectableWebSerialPath,
} from '@platform/web/web-serial';

const CHIP_ICON = "url('assets/icons/header/chip.svg')";
const REFRESH_ICON = "url('assets/icons/header/refresh.svg')";

@Component({
  selector: 'app-device-selector',
  templateUrl: './device-selector.component.html',
  styleUrls: ['./device-selector.component.scss'],
})
export class DeviceSelectorComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly chipIcon = CHIP_ICON;
  readonly refreshIcon = REFRESH_ICON;
  open = false;

  boards: IBoard[] = [];
  ports: ISerialPortInfo[] = [];
  selectedBoard: IBoard | null = null;
  selectedPort: ISerialPortInfo | null = null;
  isRefreshing = false;
  portErrorKey = '';
  readonly environmentHintKey = getWebSerialEnvironmentHintKey();

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly deviceManager = inject(DeviceManagerService);
  private readonly serialService = inject(ISerial);
  private readonly headerPopover = inject(HeaderPopoverService);
  private readonly popoverId = HEADER_POPOVER_IDS.device;
  private readonly subscriptions = new Subscription();

  get boardLabel(): string {
    return this.selectedBoard?.name?.trim() || 'Board';
  }

  get realPorts(): ISerialPortInfo[] {
    return this.ports.filter((port) => isConnectableWebSerialPath(port.path));
  }

  portLabel(port: ISerialPortInfo): string {
    return formatSerialPortLabel(port);
  }

  toggle(event: MouseEvent): void {
    event.stopPropagation();
    this.headerPopover.toggle(this.popoverId);
  }

  close(): void {
    this.headerPopover.close(this.popoverId);
  }

  ngAfterViewInit(): void {
    this.headerPopover.registerRoot(this.popoverId, this.elementRef.nativeElement);
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.headerPopover.activeId$.subscribe((id) => {
        this.open = id === this.popoverId;
        this.cdr.detectChanges();
      }),
    );

    this.boards = this.deviceManager.getAvailableBoards();
    this.selectedBoard = this.deviceManager.getSelectedBoard();

    this.subscriptions.add(
      this.deviceManager.selectedBoard$.subscribe((board) => {
        this.selectedBoard = board;
        this.cdr.markForCheck();
      }),
    );

    this.subscriptions.add(
      this.deviceManager.selectedPort$.subscribe((port) => {
        this.selectedPort = port;
        this.cdr.markForCheck();
      }),
    );

    this.subscriptions.add(
      this.deviceManager.availablePorts$.subscribe((ports) => {
        this.ports = ports;
        this.cdr.markForCheck();
      }),
    );

    this.refreshPorts();
  }

  onBoardChange(boardId: string): void {
    const board = this.deviceManager.getBoardById(boardId);
    if (!board) return;
    this.deviceManager.selectBoard(board);
  }

  onPortChange(portPath: string): void {
    if (portPath === WEB_SERIAL_REQUEST_NEW_PATH) {
      void this.requestNewPort();
      return;
    }

    const port = this.realPorts.find((p) => p.path === portPath);
    if (port) {
      this.deviceManager.selectPort(port);
    }
  }

  hasRealPorts(): boolean {
    return this.realPorts.length > 0;
  }

  async refreshPorts(): Promise<void> {
    this.isRefreshing = true;
    this.cdr.markForCheck();
    try {
      await this.deviceManager.refreshPorts();
    } catch (err) {
      console.error('Error refreshing ports:', err);
    } finally {
      this.isRefreshing = false;
      this.cdr.markForCheck();
    }
  }

  requestNewPort(): void {
    this.portErrorKey = '';
    this.isRefreshing = true;
    this.cdr.markForCheck();

    const beginPortSelection = (
      this.serialService as { beginPortSelection?: () => Promise<ISerialPortInfo> }
    ).beginPortSelection;

    if (typeof beginPortSelection !== 'function') {
      void this.fallbackRequestPort();
      return;
    }

    // Must invoke requestPort synchronously in the click handler (Web Serial user gesture).
    const selection = beginPortSelection.call(this.serialService);

    selection
      .then(async (portInfo) => {
        await this.deviceManager.refreshPorts();
        this.deviceManager.selectPort(portInfo);
      })
      .catch((err: unknown) => {
        if (!(err instanceof WebSerialRequestError) || err.reason !== 'cancelled') {
          console.error('Error requesting port:', err);
        }
        this.portErrorKey = this.resolvePortErrorKey(err);
      })
      .finally(() => {
        this.isRefreshing = false;
        this.cdr.markForCheck();
      });
  }

  private async fallbackRequestPort(): Promise<void> {
    try {
      await this.deviceManager.requestPort();
    } catch (err: unknown) {
      console.error('Error requesting port:', err);
      this.portErrorKey = this.resolvePortErrorKey(err);
    } finally {
      this.isRefreshing = false;
      this.cdr.markForCheck();
    }
  }

  private resolvePortErrorKey(err: unknown): string {
    if (err instanceof WebSerialRequestError) {
      return err.i18nKey;
    }
    return 'ui.web_serial_request_failed';
  }

  ngOnDestroy(): void {
    this.headerPopover.unregisterRoot(this.popoverId);
    this.subscriptions.unsubscribe();
  }
}
