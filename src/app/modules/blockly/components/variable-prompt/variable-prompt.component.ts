import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import * as Blockly from "blockly";
import { Subscription } from "rxjs";
import {
  VariablePromptService,
  VariablePromptViewState,
} from "../../services/variable-prompt.service";

@Component({
  selector: "app-variable-prompt",
  templateUrl: "./variable-prompt.component.html",
  styleUrls: ["./variable-prompt.component.scss"],
})
export class VariablePromptComponent implements OnInit, OnDestroy {
  @ViewChild("nameInput") nameInput?: ElementRef<HTMLInputElement>;

  state: VariablePromptViewState = {
    visible: false,
    mode: "prompt",
    title: "",
    defaultValue: "",
    errorMessage: null,
  };

  inputValue = "";

  private subscription: Subscription | null = null;

  constructor(private variablePrompt: VariablePromptService) {}

  ngOnInit(): void {
    this.subscription = this.variablePrompt.state$.subscribe((state) => {
      this.state = state;
      if (state.visible && state.mode === "prompt") {
        this.inputValue = state.defaultValue;
        setTimeout(() => this.nameInput?.nativeElement?.focus(), 0);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onSubmit(event?: Event): void {
    event?.preventDefault();
    if (this.state.mode === "prompt") {
      this.variablePrompt.submitPrompt(this.inputValue);
    }
  }

  onCancel(): void {
    if (this.state.mode === "prompt") {
      this.variablePrompt.cancelPrompt();
    } else {
      this.variablePrompt.confirmNo();
    }
  }

  onConfirmYes(): void {
    this.variablePrompt.confirmYes();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains("variable-prompt-backdrop")) {
      this.onCancel();
    }
  }

  onInputKeydown(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      event.preventDefault();
      this.onCancel();
    }
  }

  get promptOkLabel(): string {
    return Blockly.Msg["VARIABLE_PROMPT_OK"] || "OK";
  }

  get promptCancelLabel(): string {
    return Blockly.Msg["VARIABLE_PROMPT_CANCEL"] || "Cancel";
  }

  get confirmYesLabel(): string {
    return Blockly.Msg["YES"] || "Yes";
  }

  get confirmNoLabel(): string {
    return Blockly.Msg["NO"] || "No";
  }
}
