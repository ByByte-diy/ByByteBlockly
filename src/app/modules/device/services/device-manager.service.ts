import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ISerial } from '@core/interfaces';
import { IBoard } from '@app/modules/device/types/device-board.type';
import { BOARDS } from '@app/modules/device/constants/device-boards.const';
import { ISerialPortInfo } from '@app/core/models/serial-port.model';

/**
 * Service for managing devices (boards and ports)
 */
@Injectable({
  providedIn: 'root'
})
export class DeviceManagerService {
  private selectedBoardSubject = new BehaviorSubject<IBoard | null>(null);
  private selectedPortSubject = new BehaviorSubject<ISerialPortInfo | null>(null);
  private availablePortsSubject = new BehaviorSubject<ISerialPortInfo[]>([]);

  /**
   * Observable selected board
   */
  public selectedBoard$: Observable<IBoard | null> = this.selectedBoardSubject.asObservable();

  /**
   * Observable selected port
   */
  public selectedPort$: Observable<ISerialPortInfo | null> = this.selectedPortSubject.asObservable();

  /**
   * Observable available ports
   */
  public availablePorts$: Observable<ISerialPortInfo[]> = this.availablePortsSubject.asObservable();

  constructor(
    private serialService: ISerial,
    private injector: Injector
  ) {
    // Load saved board from localStorage
    this.loadSavedBoard();
  }

  /**
   * Get list of all available boards
   */
  getAvailableBoards(): IBoard[] {
    return Object.values(BOARDS);
  }

  /**
   * Set selected board
   */
  selectBoard(board: IBoard): void {
    this.selectedBoardSubject.next(board);
    this.saveBoardToStorage(board);
    
    // Update current board for Blockly blocks
    try {
      // Lazy load BlocksLoaderService to avoid circular dependency
      const blocksLoader = this.injector.get('BlocksLoaderService' as any, null);
      if (blocksLoader && typeof blocksLoader.updateCurrentBoard === 'function') {
        blocksLoader.updateCurrentBoard(board.id);
      }
      
      // Also update global window.BlocklyHelpers
      const win = window as any;
      if (win.BlocklyHelpers && win.BlocklyHelpers.setCurrentBoardId) {
        win.BlocklyHelpers.setCurrentBoardId(board.id);
      }
    } catch (err) {
      // Ignore if BlocksLoaderService not available yet
    }
  }

  /**
   * Get current selected board
   */
  getSelectedBoard(): IBoard | null {
    return this.selectedBoardSubject.value;
  }

  /**
   * Set selected port
   */
  selectPort(port: ISerialPortInfo): void {
    this.selectedPortSubject.next(port);
    this.savePortToStorage(port);
  }

  /**
   * Get current selected port
   */
  getSelectedPort(): ISerialPortInfo | null {
    return this.selectedPortSubject.value;
  }

  /**
   * Update list of available ports
   */
  async refreshPorts(): Promise<void> {
    try {
      const ports = await this.serialService.listPorts();
      this.availablePortsSubject.next(ports);

      // If saved port exists, try to find it
      const savedPort = this.getSelectedPort();
      if (savedPort) {
        const foundPort = ports.find(p => p.path === savedPort.path);
        if (foundPort) {
          this.selectedPortSubject.next(foundPort);
        } else {
          // Port is no longer available
          this.selectedPortSubject.next(null);
        }
      }

      // If port is not selected and there are available ports, select the first one
      if (!this.getSelectedPort() && ports.length > 0) {
        // Do not automatically select 'request-new-port'
        if (ports[0].path !== 'request-new-port') {
          this.selectPort(ports[0]);
        }
      }
    } catch (err) {
      console.error('Error refreshing ports:', err);
      this.availablePortsSubject.next([]);
    }
  }

  /**
   * Request user to select port (Web Serial API)
   * IMPORTANT: Must be called from click handler!
   */
  async requestPort(): Promise<void> {
    try {
      // Check if this is Web Serial Service with requestPort method
      if (typeof (this.serialService as any).requestPort === 'function') {
        const portInfo = await (this.serialService as any).requestPort();
        
        // Update list of ports
        await this.refreshPorts();
        
        // Select new port
        this.selectPort(portInfo);
      } else {
        // For Electron just update the list
        await this.refreshPorts();
      }
    } catch (err: any) {
      console.error('Error requesting port:', err);
      throw new Error(err.message || 'Failed to select device');
    }
  }

  /**
   * Check if board and port are selected
   */
  isDeviceReady(): boolean {
    return this.selectedBoardSubject.value !== null && 
           this.selectedPortSubject.value !== null;
  }

  /**
   * Save board to localStorage
   */
  private saveBoardToStorage(board: IBoard): void {
    try {
      localStorage.setItem('selectedBoard', board.id);
      localStorage.setItem('card', board.id); // For backward compatibility with old code
    } catch (err) {
      console.error('Error saving board to storage:', err);
    }
  }

  /**
   * Save port to localStorage
   */
  private savePortToStorage(port: ISerialPortInfo): void {
    try {
      localStorage.setItem('selectedPort', port.path);
      localStorage.setItem('com', port.path); // For backward compatibility with old code
    } catch (err) {
      console.error('Error saving port to storage:', err);
    }
  }

  /**
   * Load saved board from localStorage
   */
  private loadSavedBoard(): void {
    try {
      const savedBoardId = localStorage.getItem('selectedBoard') || localStorage.getItem('card');
      if (savedBoardId) {
        const board = Object.values(BOARDS).find(b => b.id === savedBoardId);
        if (board) {
          this.selectedBoardSubject.next(board);
        }
      }

      // If board is not found, select Arduino Uno by default
      if (!this.selectedBoardSubject.value) {
        this.selectBoard(BOARDS.UNO);
      }

      const savedPort = localStorage.getItem('selectedPort') || localStorage.getItem('com');
      if (savedPort && savedPort !== 'com') {
        this.selectedPortSubject.next({ path: savedPort });
      }
    } catch (err) {
      console.error('Error loading saved board:', err);
      this.selectBoard(BOARDS.UNO);
    }
  }
}
