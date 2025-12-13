

/**
 * Global helpers for Blockly blocks
 * Provide access to board profiles without Angular DI
 */

import { BoardProfileService } from "@app/modules/device/services/device-board-profile.service";
import { IBoardProfile, DropdownBoardOptionT } from "@app/modules/device/types/device-board-profile.type";

let boardProfileService: BoardProfileService | null = null;
let currentBoardId: string = 'uno';

/**
 * Initialize global helpers with BoardProfileService
 * Called from blocks-loader.service.ts
 */
export function initializeBlocklyGlobals(service: BoardProfileService, boardId: string = 'uno'): void {
  boardProfileService = service;
  currentBoardId = boardId;
  
  // Export to window for access from Blockly blocks
  (window as any).BlocklyHelpers = {
    getProfile: getProfile,
    getAllPins: getAllPins,
    getDigitalPins: getDigitalPins,
    getPWMPins: getPWMPins,
    getAnalogPins: getAnalogPins,
    getInterruptPins: getInterruptPins,
    getSerialBaudRates: getSerialBaudRates,
    getBuiltinLED: getBuiltinLED,
    getCurrentBoardId: getCurrentBoardId,
    setCurrentBoardId: setCurrentBoardId
  };
}

/**
 * Set the current board
 */
export function setCurrentBoardId(boardId: string): void {
  currentBoardId = boardId;
}

/**
 * Get the ID of the current board
 */
export function getCurrentBoardId(): string {
  return currentBoardId;
}

/**
 * Get the profile of the current board
 */
export function getProfile(): IBoardProfile {
  if (!boardProfileService) {
    throw new Error('BoardProfileService not initialized! Call initializeBlocklyGlobals first.');
  }
  return boardProfileService.getProfile(currentBoardId);
}

/**
 * Get all pins for dropdown
 */
export function getAllPins(boardId?: string): DropdownBoardOptionT[] {
  if (!boardProfileService) {
    return [['2', '2']]; // Fallback
  }
  return boardProfileService.getAllPins(boardId || currentBoardId);
}

/**
 * Get the list of digital pins
 */
export function getDigitalPins(boardId?: string): DropdownBoardOptionT[] {
  if (!boardProfileService) {
    return [['2', '2']];
  }
  return boardProfileService.getDigitalPins(boardId || currentBoardId);
}

/**
 * Get the list of PWM pins
 */
export function getPWMPins(boardId?: string): DropdownBoardOptionT[] {
  if (!boardProfileService) {
    return [['3', '3']];
  }
  return boardProfileService.getPWMPins(boardId || currentBoardId);
}

/**
 * Get the list of analog pins
 */
export function getAnalogPins(boardId?: string): DropdownBoardOptionT[] {
  if (!boardProfileService) {
    return [['A0', 'A0']];
  }
  return boardProfileService.getAnalogPins(boardId || currentBoardId);
}

/**
 * Get the list of pins with interrupt support
 */
export function getInterruptPins(boardId?: string): DropdownBoardOptionT[] {
  if (!boardProfileService) {
    return [['2', '2']];
  }
  return boardProfileService.getInterruptPins(boardId || currentBoardId);
}

/**
 * Get the list of serial speeds
 */
export function getSerialBaudRates(boardId?: string): DropdownBoardOptionT[] {
  if (!boardProfileService) {
    return [['9600', '9600']];
  }
  return boardProfileService.getSerialBaudRates(boardId || currentBoardId);
}

/**
 * Get the number of built-in LED
 */
export function getBuiltinLED(boardId?: string): number {
  if (!boardProfileService) {
    return 13;
  }
  return boardProfileService.getBuiltinLED(boardId || currentBoardId);
}

/**
 * Backward compatibility: emulation of the old profile object
 * Used by old blocks that are not migrated
 */
export function getLegacyProfile(): any {
  const profile = getProfile();
  return {
    description: profile.description,
    BUILTIN_LED: profile.BUILTIN_LED,
    dropdownAllPins: profile.dropdownAllPins,
    dropdownDigital: profile.dropdownDigital,
    dropdownPWM: profile.dropdownPWM,
    dropdownAnalog: profile.dropdownAnalog,
    interrupt: profile.interrupt,
    serial: profile.serial,
    serialPin: profile.serialPin,
    build: profile.build,
    upload_arg: profile.upload_arg,
    cpu: profile.cpu,
    speed: profile.speed,
    prog: profile.prog,
    usb: profile.usb,
    voltage: profile.voltage,
    inout: profile.inout
  };
}

/**
 * Export the profile as a global variable for backward compatibility
 */
export function exportLegacyProfileGlobal(): void {
  const win = window as any;
  
  // Proxy for dynamic access to profile[boardId]
  win.profile = new Proxy({}, {
    get: (_target, boardId: string): IBoardProfile => {
      if (!boardProfileService) return {} as IBoardProfile;
      const profile = boardProfileService.getProfile(boardId);
      return {
        description: profile.description,
        BUILTIN_LED: profile.BUILTIN_LED,
        dropdownAllPins: profile.dropdownAllPins,
        dropdownDigital: profile.dropdownDigital,
        dropdownPWM: profile.dropdownPWM,
        dropdownAnalog: profile.dropdownAnalog,
        interrupt: profile.interrupt,
        serial: profile.serial,
        serialPin: profile.serialPin,
        build: profile.build,
        upload_arg: profile.upload_arg,
        cpu: profile.cpu,
        speed: profile.speed,
        prog: profile.prog,
        usb: profile.usb,
        voltage: profile.voltage,
        inout: profile.inout
      } as IBoardProfile;
    }
  });
}

