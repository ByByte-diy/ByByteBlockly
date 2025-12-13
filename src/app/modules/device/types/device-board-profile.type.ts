/**
 * Dropdown option for dropdown fields (pins, baud rates, etc.)
 */
export type DropdownBoardOptionT = [string, string];

/**
 * Full configuration of the board for Blockly blocks
 */
export interface IBoardProfile {
  /** ID of the board (must match Board.id) */
  id: string;
  
  /** Human-readable name */
  description: string;
  
  /** Number of built-in LED */
  BUILTIN_LED: number;
  
  /** Path to the board image */
  picture: string;
  
  /** All available pins */
  dropdownAllPins: DropdownBoardOptionT[];
  
  /** Only digital pins */
  dropdownDigital: DropdownBoardOptionT[];
  
  /** PWM pins */
  dropdownPWM: DropdownBoardOptionT[];
  
  /** Analog pins */
  dropdownAnalog: DropdownBoardOptionT[];
  
  /** Pins with interrupt support */
  interrupt: DropdownBoardOptionT[];
  
  /** Available serial port baud rates */
  serial: DropdownBoardOptionT[];
  
  /** Configuration of serial ports */
  serialPin: DropdownBoardOptionT[];
  
  /** Build ID for the compiler */
  build: string;
  
  /** Arguments for loading (arduino-cli) */
  upload_arg: string;
  
  /** Processor type */
  cpu: string;
  
  /** Loading speed (baud rate) */
  speed: string;
  
  /** Programming language (arduino/python) */
  prog: 'arduino' | 'python';
  
  /** Type of USB port */
  usb: string;
  
  /** Operating voltage */
  voltage: string;
  
  /** Number of input/output ports */
  inout: string;
  
  /** Additional pins (optional, for special boards) */
  dropdownMCPPins?: DropdownBoardOptionT[];
  
  /** Touch-sensitive pins (optional, for ESP32) */
  touch?: DropdownBoardOptionT[];
}

/**
 * Simplified configuration for dropdown in UI
 */
export interface IBoardDropdownConfig {
  allPins: DropdownBoardOptionT[];
  digitalPins: DropdownBoardOptionT[];
  pwmPins: DropdownBoardOptionT[];
  analogPins: DropdownBoardOptionT[];
  interruptPins: DropdownBoardOptionT[];
  serialBaudRates: DropdownBoardOptionT[];
  serialPorts: DropdownBoardOptionT[];
}

/**
 * Helper type for filtering boards by characteristics
 */
export interface IBoardFilterCriteria {
  prog?: 'arduino' | 'python';
  minInout?: number;
  voltage?: string;
  hasPWM?: boolean;
  hasAnalog?: boolean;
}

