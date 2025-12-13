import { Injectable } from "@angular/core";
import * as Blockly from "blockly";
import { initializeArduinoGenerator } from "../lib/generators/arduino-generator";
import { getDefaultToolbox } from "../constants";
import { BoardProfileService } from "../../device/services/device-board-profile.service";
import {
  initializeBlocklyGlobals,
  exportLegacyProfileGlobal,
} from "../../device/helpers/device-board-globals.helper";
import { initializeAllBlocks } from "../definitions";

let currentBoardId: string = "uno";

/**
 * Service for loading blocks and generators of Blockly
 */
@Injectable({
  providedIn: "root",
})
export class BlocksLoaderService {
  private _loaded = false;

  constructor(private _boardProfileService: BoardProfileService) {}

  /**
   * Checks if the blocks are loaded
   */
  get isLoaded(): boolean {
    return this._loaded;
  }

  /**
   * Load all blocks and generators
   */
  async loadAllBlocks(): Promise<void> {
    if (this._loaded) return;

    const win = window as any;

    // Set npm Blockly globally
    if (!win.Blockly) win.Blockly = Blockly;

    // Initialize Arduino generator
    initializeArduinoGenerator();

    // Initialize Blockly globals with BoardProfileService
    const currentBoardId = localStorage.getItem("card") || "uno";
    initializeBlocklyGlobals(this._boardProfileService, currentBoardId);

    // Export legacy profile object for backward compatibility with old blocks
    exportLegacyProfileGlobal();

    // Initialize all blocks (Generic + Logic + Math)
    initializeAllBlocks();


    // Set default localStorage values
    if (!localStorage.getItem("prog")) {
      localStorage.setItem("prog", "arduino");
    }
    if (!localStorage.getItem("card")) {
      localStorage.setItem("card", "uno");
    }

    this._loaded = true;
  }

  /**
   * Update the current board for Blockly globals
   */
  updateCurrentBoard(boardId: string): void {
    const win = window as any;
    if (win.BlocklyHelpers && win.BlocklyHelpers.setCurrentBoardId) {
      win.BlocklyHelpers.setCurrentBoardId(boardId);
    }
    localStorage.setItem("card", boardId);
  }

  /**
   * Load the toolbox configuration for the specified board
   * Dynamically generates toolbox from BlockRegistry using ToolboxBuilder
   */
  async loadToolbox(boardId: string): Promise<any> {
    try {
      // Import ToolboxBuilder dynamically to avoid circular dependencies
      const { ToolboxBuilder } = await import("../lib/builders/toolbox-builder");

      // Generate toolbox dynamically based on board type
      const toolbox = ToolboxBuilder.forBoard(boardId, {
        includeStandardBlocks: true,
        includeAdvancedBlocks: false,
      });

      return toolbox;
    } catch (err) {
      console.error("Failed to generate toolbox:", err);
      return getDefaultToolbox(); // Return default toolbox from registry
    }
  }
}
