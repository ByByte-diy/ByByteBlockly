import { Injectable, NgZone } from "@angular/core";
import * as Blockly from "blockly";
import { BehaviorSubject } from "rxjs";
import {
  normalizeVariableName,
  validateVariableName,
} from "../lib/variables/variable-name.validator";

export interface VariablePromptViewState {
  visible: boolean;
  mode: "prompt" | "confirm";
  title: string;
  defaultValue: string;
  errorMessage: string | null;
}

const HIDDEN_STATE: VariablePromptViewState = {
  visible: false,
  mode: "prompt",
  title: "",
  defaultValue: "",
  errorMessage: null,
};

@Injectable({
  providedIn: "root",
})
export class VariablePromptService {
  readonly state$ = new BehaviorSubject<VariablePromptViewState>(HIDDEN_STATE);

  private promptResolve: ((value: string | null) => void) | null = null;
  private confirmResolve: ((value: boolean) => void) | null = null;
  private workspace: Blockly.Workspace | null = null;
  private allowExistingName: string | null = null;
  private dialogsInstalled = false;

  constructor(private ngZone: NgZone) { }

  /** Wire Blockly.dialog prompt/confirm to Angular modals. */
  installBlocklyDialogs(): void {
    if (this.dialogsInstalled) return;

    Blockly.dialog.setPrompt((message, defaultValue, callback) => {
      this.ngZone.run(() => {
        this.openPrompt(message, defaultValue).then(callback);
      });
    });

    Blockly.dialog.setConfirm((message, callback) => {
      this.ngZone.run(() => {
        this.openConfirm(message).then(callback);
      });
    });

    this.dialogsInstalled = true;
  }

  openPrompt(
    title: string,
    defaultValue = "",
    workspace?: Blockly.Workspace | null
  ): Promise<string | null> {
    this.closePending();

    this.workspace = workspace ?? Blockly.common.getMainWorkspace() ?? null;
    this.allowExistingName = defaultValue || null;

    return new Promise((resolve) => {
      this.promptResolve = resolve;
      this.state$.next({
        visible: true,
        mode: "prompt",
        title,
        defaultValue,
        errorMessage: null,
      });
    });
  }

  openConfirm(message: string): Promise<boolean> {
    this.closePending();

    return new Promise((resolve) => {
      this.confirmResolve = resolve;
      this.state$.next({
        visible: true,
        mode: "confirm",
        title: message,
        defaultValue: "",
        errorMessage: null,
      });
    });
  }

  submitPrompt(rawValue: string): void {
    const name = normalizeVariableName(rawValue);
    const error = validateVariableName(name, this.workspace, {
      allowExistingName: this.allowExistingName ?? undefined,
    });

    if (error) {
      this.patchState({ errorMessage: error });
      return;
    }

    this.finishPrompt(name);
  }

  cancelPrompt(): void {
    this.finishPrompt(null);
  }

  confirmYes(): void {
    this.finishConfirm(true);
  }

  confirmNo(): void {
    this.finishConfirm(false);
  }

  private finishPrompt(value: string | null): void {
    const resolve = this.promptResolve;
    this.promptResolve = null;
    this.workspace = null;
    this.allowExistingName = null;
    this.state$.next(HIDDEN_STATE);
    resolve?.(value);
  }

  private finishConfirm(value: boolean): void {
    const resolve = this.confirmResolve;
    this.confirmResolve = null;
    this.state$.next(HIDDEN_STATE);
    resolve?.(value);
  }

  private closePending(): void {
    if (this.promptResolve) {
      this.finishPrompt(null);
    }
    if (this.confirmResolve) {
      this.finishConfirm(false);
    }
  }

  private patchState(partial: Partial<VariablePromptViewState>): void {
    this.state$.next({ ...this.state$.value, ...partial });
  }
}
