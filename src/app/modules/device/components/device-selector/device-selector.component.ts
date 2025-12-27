import { Component, OnInit, inject } from "@angular/core";
import { DeviceManagerService } from "../../services/device-manager.service";
import { IBoard } from "@app/modules/device/types/device-board.type";
import { ISerialPortInfo } from "@app/core/models/serial-port.model";

/**
 * Component for selecting a board and a serial port
 */
@Component({
  selector: "app-device-selector",
  templateUrl: "./device-selector.component.html",
  styleUrls: ["./device-selector.component.scss"],
})
export class DeviceSelectorComponent implements OnInit {
  boards: IBoard[] = [];
  ports: ISerialPortInfo[] = [];
  selectedBoard: IBoard | null = null;
  selectedPort: ISerialPortInfo | null = null;
  isRefreshing: boolean = false;

  constructor(private deviceManager: DeviceManagerService) {
    this.selectedBoard = this.deviceManager.getSelectedBoard();
  }

  ngOnInit(): void {
    // Load the list of boards
    this.boards = this.deviceManager.getAvailableBoards();
    this.selectedBoard ||= this.deviceManager.getSelectedBoard();

    // Subscribe to changes
    this.deviceManager.selectedBoard$.subscribe((board) => {
      this.selectedBoard = board;
    });

    this.deviceManager.selectedPort$.subscribe((port) => {
      this.selectedPort = port;
    });

    this.deviceManager.availablePorts$.subscribe((ports) => {
      this.ports = ports;
    });

    // Load the ports
    this.refreshPorts();
  }

  /**
   * Handler for board change
   */
  onBoardChange(boardId: string): void {
    const board = this.deviceManager.getBoardById(boardId);
    if (!board) return;
    this.deviceManager.selectBoard(board);
  }

  /**
   * Handler for port change
   */
  onPortChange(portPath: string): void {
    const port = this.ports.find((p) => p.path === portPath);
    if (port) {
      this.deviceManager.selectPort(port);
    }
  }

  /**
   * Refresh the list of ports
   */
  async refreshPorts(): Promise<void> {
    this.isRefreshing = true;
    try {
      await this.deviceManager.refreshPorts();
    } catch (err) {
      console.error("Error refreshing ports:", err);
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Request the user to select a device (for Web Serial API)
   * Important: Called from the button click!
   */
  async requestNewPort(): Promise<void> {
    this.isRefreshing = true;
    try {
      await this.deviceManager.requestPort();
      alert("Device selected successfully!");
    } catch (err: any) {
      console.error("Error requesting port:", err);
      alert(err.message || "Failed to select device. Please try again.");
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Check if the "Connect Device" button is needed
   */
  needsPortRequest(): boolean {
    return (
      this.ports.length === 1 && this.ports[0]?.path === "request-new-port"
    );
  }
}
