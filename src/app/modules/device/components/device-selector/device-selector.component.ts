import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  HostListener,
  inject,
} from '@angular/core';
import { DeviceManagerService } from '../../services/device-manager.service';
import { IBoard } from '@app/modules/device/types/device-board.type';
import { ISerialPortInfo } from '@app/core/models/serial-port.model';

const CHIP_ICON = "url('assets/icons/header/chip.svg')";

@Component({
  selector: 'app-device-selector',
  templateUrl: './device-selector.component.html',
  styleUrls: ['./device-selector.component.scss'],
})
export class DeviceSelectorComponent implements OnInit {
  readonly chipIcon = CHIP_ICON;
  open = false;

  boards: IBoard[] = [];
  ports: ISerialPortInfo[] = [];
  selectedBoard: IBoard | null = null;
  selectedPort: ISerialPortInfo | null = null;
  isRefreshing = false;

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly deviceManager = inject(DeviceManagerService);

  get boardLabel(): string {
    return this.selectedBoard?.name?.trim() || 'Board';
  }

  toggle(event: MouseEvent): void {
    event.stopPropagation();
    this.open = !this.open;
    this.cdr.detectChanges();
  }

  close(): void {
    this.open = false;
    this.cdr.detectChanges();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.open && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  ngOnInit(): void {
    this.boards = this.deviceManager.getAvailableBoards();
    this.selectedBoard = this.deviceManager.getSelectedBoard();

    this.deviceManager.selectedBoard$.subscribe((board) => {
      this.selectedBoard = board;
      this.cdr.markForCheck();
    });

    this.deviceManager.selectedPort$.subscribe((port) => {
      this.selectedPort = port;
      this.cdr.markForCheck();
    });

    this.deviceManager.availablePorts$.subscribe((ports) => {
      this.ports = ports;
      this.cdr.markForCheck();
    });

    this.refreshPorts();
  }

  onBoardChange(boardId: string): void {
    const board = this.deviceManager.getBoardById(boardId);
    if (!board) return;
    this.deviceManager.selectBoard(board);
  }

  onPortChange(portPath: string): void {
    const port = this.ports.find((p) => p.path === portPath);
    if (port) {
      this.deviceManager.selectPort(port);
    }
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

  async requestNewPort(): Promise<void> {
    this.isRefreshing = true;
    this.cdr.markForCheck();
    try {
      await this.deviceManager.requestPort();
      alert('Device selected successfully!');
    } catch (err: any) {
      console.error('Error requesting port:', err);
      alert(err.message || 'Failed to select device. Please try again.');
    } finally {
      this.isRefreshing = false;
      this.cdr.markForCheck();
    }
  }

  needsPortRequest(): boolean {
    return this.ports.length === 1 && this.ports[0]?.path === 'request-new-port';
  }
}
