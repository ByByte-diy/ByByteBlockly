import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ISerial } from '@core/interfaces';
import { IBoard } from '@app/modules/device/types/device-board.type';
import { BOARDS } from '@app/modules/device/constants/device-boards.const';
import { ISerialPortInfo } from '@app/core/models/serial-port.model';
import { BlocksLoaderService } from '@app/modules/blockly/services/blocks-loader.service';

/**
 * Default board
 */
export const DEFAULT_BOARD = BOARDS.uno;

/**
 * Service for managing devices (boards and ports)
 */
@Injectable({
  providedIn: 'root'
})
export class DeviceManagerService {
  private selectedBoardSubject = new BehaviorSubject<IBoard>(DEFAULT_BOARD);
  private selectedPortSubject = new BehaviorSubject<ISerialPortInfo | null>(null);
  private availablePortsSubject = new BehaviorSubject<ISerialPortInfo[]>([]);

  /**
   * Observable selected board
   */
  public selectedBoard$: Observable<IBoard> = this.selectedBoardSubject.asObservable();

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

  getBoardById(id: string): IBoard | undefined { 
    return BOARDS[id];
  }

  /**
   * Set selected board
   */
  selectBoard(board: IBoard): void {
    if (!board) return;
    this.selectedBoardSubject.next(board);
    this.saveBoardToStorage(board);
    
    // Update current board for Blockly blocks
    try {
      // Lazy load BlocksLoaderService to avoid circular dependency
      const blocksLoader = this.injector.get(BlocksLoaderService);
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
  getSelectedBoard(): IBoard {
    return this.selectedBoardSubject.value || DEFAULT_BOARD;
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
    if (!board) return;
    try {
      localStorage.setItem('selectedBoard', board.id);
      localStorage.setItem('card', board.id); // For backward compatibility with old code
      const profileProg = (window as { profile?: Record<string, { prog?: string }> })
        .profile?.[board.id]?.prog;
      if (profileProg) {
        localStorage.setItem('prog', profileProg);
      }
    } catch (err) {
      console.error('Error saving board to storage:', err);
    }
  }

  /**
   * Save port to localStorage
   */
  private savePortToStorage(port: ISerialPortInfo): void {
    if (!port) return;
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
          return; // Board loaded successfully
        }
      }

      // Always select Arduino Uno by default if no saved board or saved board not found
      this.selectedBoardSubject.next(DEFAULT_BOARD);
      this.saveBoardToStorage(DEFAULT_BOARD);

      const savedPort = localStorage.getItem('selectedPort') || localStorage.getItem('com');
      if (savedPort && savedPort !== 'com') {
        this.selectedPortSubject.next({ path: savedPort });
      }
    } catch (err) {
      console.error('Error loading saved board:', err);
      // Ensure board is always set
      this.selectedBoardSubject.next(DEFAULT_BOARD);
      this.saveBoardToStorage(DEFAULT_BOARD);
    }
  }
}
