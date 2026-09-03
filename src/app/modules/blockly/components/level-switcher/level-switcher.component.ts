import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import * as Blockly from 'blockly';
import { BlockLevelE } from '../../types/block.types';
import { ToolboxLevelService } from '../../services/toolbox-level.service';

interface LevelOption {
  level: BlockLevelE;
  labelKey: keyof typeof Blockly.Msg;
  shortLabel: string;
}

@Component({
  selector: 'app-level-switcher',
  template: `
    <div class="level-switcher" role="group" [attr.aria-label]="label">
      <div class="level-switcher__buttons">
        @for (option of options; track option.level) {
          <button
            type="button"
            class="level-switcher__btn"
            [class.level-switcher__btn--active]="current === option.level"
            [attr.aria-pressed]="current === option.level"
            [attr.title]="getLabel(option.labelKey)"
            (click)="selectLevel(option.level)"
          >
            {{ option.shortLabel }}
          </button>
        }
      </div>
    </div>
  `,
  styleUrls: ['./level-switcher.component.scss'],
})
export class LevelSwitcherComponent implements OnInit, OnDestroy {
  private readonly toolboxLevel = inject(ToolboxLevelService);
  private readonly destroy$ = new Subject<void>();

  protected readonly options: LevelOption[] = [
    { level: BlockLevelE.BEGINNER, labelKey: 'LEVEL_BEGINNER' as keyof typeof Blockly.Msg, shortLabel: '1' },
    { level: BlockLevelE.INTERMEDIATE, labelKey: 'LEVEL_MIDDLE' as keyof typeof Blockly.Msg, shortLabel: '2' },
    { level: BlockLevelE.ADVANCED, labelKey: 'LEVEL_PRO' as keyof typeof Blockly.Msg, shortLabel: '3' },
  ];

  protected current = BlockLevelE.BEGINNER;
  protected label = '';

  ngOnInit(): void {
    this.current = this.toolboxLevel.getLevel();
    this.refreshLabels();

    this.toolboxLevel.level$
      .pipe(takeUntil(this.destroy$))
      .subscribe((level) => {
        this.current = level;
      });

    window.addEventListener('language-changed', this.onLanguageChanged);
  }

  ngOnDestroy(): void {
    window.removeEventListener('language-changed', this.onLanguageChanged);
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected getLabel(key: keyof typeof Blockly.Msg): string {
    return (Blockly.Msg[key] as string) || String(key);
  }

  protected async selectLevel(level: BlockLevelE): Promise<void> {
    await this.toolboxLevel.setLevel(level);
  }

  private readonly onLanguageChanged = (): void => {
    this.refreshLabels();
  };

  private refreshLabels(): void {
    this.label = (Blockly.Msg['LEVEL_LABEL'] as string) || 'Level:';
  }
}
