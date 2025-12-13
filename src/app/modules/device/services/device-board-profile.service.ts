import { Injectable } from "@angular/core";
import {
  IBoardProfile,
  IBoardDropdownConfig,
  IBoardFilterCriteria,
  DropdownBoardOptionT,
} from "../types/device-board-profile.type";
import {
  BOARD_PROFILES,
  DEFAULT_BOARD_PROFILE,
  boardProfileExists,
} from "../constants/device-profiles.const";

/**
 * Service for working with board profiles
 * Provides access to pin configurations, serial speeds, etc.
 */
@Injectable({
  providedIn: "root",
})
export class BoardProfileService {
  /**
   * Get the full board profile by ID
   */
  getProfile(boardId: string): IBoardProfile {
    if (!boardProfileExists(boardId)) {
      console.warn(`Board profile not found for ID: ${boardId}, using default (uno)`); // prettier-ignore
      return DEFAULT_BOARD_PROFILE;
    }
    return BOARD_PROFILES[boardId];
  }

  /**
   * Get the simplified dropdown configuration for UI
   */
  getDropdownConfig(boardId: string): IBoardDropdownConfig {
    const profile = this.getProfile(boardId);
    return {
      allPins: profile.dropdownAllPins,
      digitalPins: profile.dropdownDigital,
      pwmPins: profile.dropdownPWM,
      analogPins: profile.dropdownAnalog,
      interruptPins: profile.interrupt,
      serialBaudRates: profile.serial,
      serialPorts: profile.serialPin,
    };
  }

  /**
   * Get the list of all pins for dropdown
   */
  getAllPins(boardId: string): DropdownBoardOptionT[] {
    return this.getProfile(boardId).dropdownAllPins;
  }

  /**
   * Get the list of digital pins
   */
  getDigitalPins(boardId: string): DropdownBoardOptionT[] {
    return this.getProfile(boardId).dropdownDigital;
  }

  /**
   * Get the list of PWM pins
   */
  getPWMPins(boardId: string): DropdownBoardOptionT[] {
    return this.getProfile(boardId).dropdownPWM;
  }

  /**
   * Get the list of analog pins
   */
  getAnalogPins(boardId: string): DropdownBoardOptionT[] {
    return this.getProfile(boardId).dropdownAnalog;
  }

  /**
   * Get the list of pins with interrupt support
   */
  getInterruptPins(boardId: string): DropdownBoardOptionT[] {
    return this.getProfile(boardId).interrupt;
  }

  /**
   * Get the list of serial speeds
   */
  getSerialBaudRates(boardId: string): DropdownBoardOptionT[] {
    return this.getProfile(boardId).serial;
  }

  /**
   * Get the list of serial ports
   */
  getSerialPorts(boardId: string): DropdownBoardOptionT[] {
    return this.getProfile(boardId).serialPin;
  }

  /**
   * Get the built-in LED pin
   */
  getBuiltinLED(boardId: string): number {
    return this.getProfile(boardId).BUILTIN_LED;
  }

  /**
   * Get the arguments for loading (arduino-cli)
   */
  getUploadArgs(boardId: string): string {
    return this.getProfile(boardId).upload_arg;
  }

  /**
   * Get the loading speed
   */
  getUploadSpeed(boardId: string): string {
    return this.getProfile(boardId).speed;
  }

  /**
   * Check if the board supports Python
   */
  supportsPython(boardId: string): boolean {
    return this.getProfile(boardId).prog === "python";
  }

  /**
   * Check if the board supports Arduino C++
   */
  supportsArduino(boardId: string): boolean {
    return this.getProfile(boardId).prog === "arduino";
  }

  /**
   * Filter boards by criteria
   */
  filterBoards(criteria: IBoardFilterCriteria): IBoardProfile[] {
    return Object.values(BOARD_PROFILES).filter((profile) => {
      if (criteria.prog && profile.prog !== criteria.prog) {
        return false;
      }
      if (criteria.voltage && profile.voltage !== criteria.voltage) {
        return false;
      }
      if (criteria.minInout && parseInt(profile.inout) < criteria.minInout) {
        return false;
      }
      if (criteria.hasPWM && profile.dropdownPWM.length === 0) {
        return false;
      }
      if (criteria.hasAnalog && profile.dropdownAnalog.length === 0) {
        return false;
      }
      return true;
    });
  }

  /**
   * Get all available profiles
   */
  getAllProfiles(): IBoardProfile[] {
    return Object.values(BOARD_PROFILES);
  }

  /**
   * Check if a profile exists for the board
   */
  hasProfile(boardId: string): boolean {
    return boardProfileExists(boardId);
  }

  /**
   * Export the profile as JSON for debugging
   */
  exportProfile(boardId: string): string {
    return JSON.stringify(this.getProfile(boardId), null, 2);
  }
}
