import * as Blockly from "blockly";

const SVG_NS = "http://www.w3.org/2000/svg";
const LED_ON_COLOR = "#2196F3";
const LED_OFF_COLOR = "#ffffff";
/** Hex colour emitted for an ON pixel (NeoMatrix draw codegen). */
export const MATRIX_LED_ON_HEX = "2196F3";
const LED_RADIUS = 10;
export const MATRIX_LED_CELL_SIZE = 24;
/** Width of the row index column (must match header corner cell). */
export const MATRIX_ROW_LABEL_WIDTH = 18;
const LED_CELL_SIZE = MATRIX_LED_CELL_SIZE;

type BoolString = "TRUE" | "FALSE";
type CheckboxBool = BoolString | boolean;

/** 8×8 matrix cell drawn as SVG circles: white off, blue on. */
export class FieldMatrixLed extends Blockly.Field<CheckboxBool> {
  override SERIALIZABLE = true;
  override value_: boolean | null = false;

  private ledCircle_: SVGCircleElement | null = null;

  constructor(value: CheckboxBool = "FALSE") {
    super(Blockly.Field.SKIP_SETUP);
    this.setValue(value);
  }

  override initView(): void {
    if (!this.fieldGroup_) {
      return;
    }

    this.borderRect_ = document.createElementNS(SVG_NS, "rect");
    this.borderRect_.setAttribute("x", "0");
    this.borderRect_.setAttribute("y", "0");
    this.borderRect_.setAttribute("width", String(LED_CELL_SIZE));
    this.borderRect_.setAttribute("height", String(LED_CELL_SIZE));
    this.borderRect_.setAttribute("fill", "transparent");
    this.borderRect_.setAttribute("stroke", "none");
    this.borderRect_.classList.add("blocklyFieldRect");
    this.fieldGroup_.appendChild(this.borderRect_);

    this.ledCircle_ = document.createElementNS(SVG_NS, "circle");
    this.ledCircle_.setAttribute("cx", String(LED_CELL_SIZE / 2));
    this.ledCircle_.setAttribute("cy", String(LED_CELL_SIZE / 2));
    this.ledCircle_.setAttribute("r", String(LED_RADIUS));
    this.ledCircle_.classList.add("blocklyMatrixLedDot");
    this.fieldGroup_.appendChild(this.ledCircle_);

    this.fieldGroup_.classList.add("blocklyField");
    this.fieldGroup_.classList.add("blocklyMatrixLedField");

    this.size_.width = LED_CELL_SIZE;
    this.size_.height = LED_CELL_SIZE;
    this.updateLedVisual_();
  }

  protected override showEditor_(): void {
    this.setValue(!this.value_);
  }

  protected override doClassValidation_(newValue?: unknown): BoolString | null {
    if (newValue === true || newValue === "TRUE") {
      return "TRUE";
    }
    if (newValue === false || newValue === "FALSE") {
      return "FALSE";
    }
    return null;
  }

  protected override doValueUpdate_(newValue: BoolString): void {
    this.value_ = newValue === "TRUE";
    this.updateLedVisual_();
  }

  override getValue(): BoolString {
    return this.value_ ? "TRUE" : "FALSE";
  }

  getValueBoolean(): boolean | null {
    return this.value_;
  }

  override getText(): string {
    return String(this.value_);
  }

  override saveState(): boolean {
    return !!this.value_;
  }

  override render_(): void {
    this.size_.width = LED_CELL_SIZE;
    this.size_.height = LED_CELL_SIZE;
    this.positionBorderRect_();
    this.updateLedVisual_();
  }

  private updateLedVisual_(): void {
    if (!this.ledCircle_) {
      return;
    }
    const on = !!this.value_;
    this.ledCircle_.setAttribute("fill", on ? LED_ON_COLOR : LED_OFF_COLOR);
    this.ledCircle_.setAttribute("stroke", on ? "none" : "rgba(0, 0, 0, 0.18)");
    this.ledCircle_.setAttribute("stroke-width", on ? "0" : "1");
  }
}

FieldMatrixLed.prototype.DEFAULT_VALUE = false;

export function createMatrixLedField(): FieldMatrixLed {
  return new FieldMatrixLed("FALSE");
}

type GridLabelAlign = "center" | "end";

/** Fixed-width label cell for matrix row/column numbering. */
export class FieldMatrixGridLabel extends Blockly.FieldLabel {
  constructor(
    text: string,
    private readonly cellWidth: number,
    private readonly align: GridLabelAlign = "center"
  ) {
    super(text);
  }

  override render_(): void {
    if (this.textContent_) {
      this.textContent_.nodeValue = this.getDisplayText_();
    }
    this.size_.width = this.cellWidth;
    this.size_.height = MATRIX_LED_CELL_SIZE;
    this.positionText_();
  }

  private positionText_(): void {
    if (!this.textElement_) {
      return;
    }
    const y = this.size_.height / 2;
    if (this.align === "end") {
      this.textElement_.setAttribute("text-anchor", "end");
      this.textElement_.setAttribute("x", String(this.cellWidth - 2));
    } else {
      this.textElement_.setAttribute("text-anchor", "middle");
      this.textElement_.setAttribute("x", String(this.cellWidth / 2));
    }
    this.textElement_.setAttribute("y", String(y));
    if (this.getConstants()?.FIELD_TEXT_BASELINE_CENTER) {
      this.textElement_.setAttribute("dominant-baseline", "central");
    }
  }
}

export function createMatrixCornerLabel(): FieldMatrixGridLabel {
  return new FieldMatrixGridLabel("", MATRIX_ROW_LABEL_WIDTH);
}

export function createMatrixColumnLabel(column: number | string): FieldMatrixGridLabel {
  return new FieldMatrixGridLabel(String(column), MATRIX_LED_CELL_SIZE, "center");
}

export function createMatrixRowLabel(row: number | string): FieldMatrixGridLabel {
  return new FieldMatrixGridLabel(String(row), MATRIX_ROW_LABEL_WIDTH, "end");
}
