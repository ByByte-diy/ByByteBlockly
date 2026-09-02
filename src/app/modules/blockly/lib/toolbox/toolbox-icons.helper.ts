/**
 * Applies SVG icons to Blockly toolbox categories via <img> tags.
 */
import {
  CATEGORY_ICON_FILES,
  extractCategoryMsgKey,
} from '../../constants/category-icons.const';

function resolveIconFile(iconHost: HTMLElement, container: Element): string | undefined {
  const fromClass = Array.from(iconHost.classList).find((cls) =>
    cls.startsWith('toolbox-cat-icon--')
  );
  if (fromClass) {
    return fromClass.replace('toolbox-cat-icon--', '');
  }

  const fromId = container.id.match(/cat-icon-([a-z0-9-]+)/i);
  if (fromId) {
    return fromId[1];
  }

  return undefined;
}

function iconPathForFile(file: string): string {
  return `assets/icons/categories/${file}.svg`;
}

const HOVER_FG_LIGHT = 'toolbox-cat-hover-light';
const HOVER_FG_DARK = 'toolbox-cat-hover-dark';

function parseRgb(color: string): [number, number, number] | null {
  const rgb = color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (rgb) {
    return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  }

  const hex = color.match(/^#?([0-9a-f]{6})$/i);
  if (hex) {
    const value = hex[1];
    return [
      parseInt(value.slice(0, 2), 16),
      parseInt(value.slice(2, 4), 16),
      parseInt(value.slice(4, 6), 16),
    ];
  }

  return null;
}

function isLightColour(color: string): boolean {
  const rgb = parseRgb(color);
  if (!rgb) {
    return true;
  }

  const [r, g, b] = rgb.map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });

  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.55;
}

/** Blockly stores category hue on the row border — reuse it for hover fill. */
function applyCategoryHoverStyle(container: Element): void {
  const row = container.querySelector('.blocklyToolboxCategory') as HTMLElement | null;
  if (!row) {
    return;
  }

  const colour = getComputedStyle(row).borderLeftColor;
  if (!colour || colour === 'transparent' || colour === 'rgba(0, 0, 0, 0)') {
    return;
  }

  if (row.dataset.catColor === colour) {
    return;
  }

  row.dataset.catColor = colour;
  row.style.setProperty('--cat-color', colour);

  row.classList.remove(HOVER_FG_LIGHT, HOVER_FG_DARK);
  row.classList.add(isLightColour(colour) ? HOVER_FG_LIGHT : HOVER_FG_DARK);
}

function hasCorrectIcon(imgHost: HTMLElement, iconPath: string): boolean {
  if (imgHost.dataset.iconSrc !== iconPath) {
    return false;
  }
  const img = imgHost.querySelector('img.toolbox-cat-img') as HTMLImageElement | null;
  return img?.getAttribute('src') === iconPath;
}

/** Insert <img> icons into toolbox category rows. */
export function enhanceToolboxIcons(root: ParentNode = document): void {
  root.querySelectorAll('.blocklyToolboxCategoryContainer').forEach((container) => {
    applyCategoryHoverStyle(container);

    const rowContents = container.querySelector('.blocklyTreeRowContentContainer');
    if (!rowContents) {
      return;
    }

    const iconHost = rowContents.querySelector(
      '.blocklyToolboxCategoryIcon, .toolbox-cat-icon'
    ) as HTMLElement | null;
    const label = rowContents.querySelector(
      '.blocklyToolboxCategoryLabel'
    ) as HTMLElement | null;
    if (!iconHost || !label) {
      return;
    }

    const iconFile = resolveIconFile(iconHost, container);
    if (!iconFile) {
      return;
    }

    const iconPath = iconPathForFile(iconFile);
    if (hasCorrectIcon(iconHost, iconPath)) {
      return;
    }

    iconHost.dataset.iconSrc = iconPath;
    iconHost.classList.add('toolbox-cat-icon');

    const existingImg = iconHost.querySelector('img.toolbox-cat-img') as HTMLImageElement | null;
    if (existingImg) {
      existingImg.src = iconPath;
      existingImg.alt = label.textContent?.trim() ?? '';
      return;
    }

    iconHost.textContent = '';

    const img = document.createElement('img');
    img.src = iconPath;
    img.alt = label.textContent?.trim() ?? '';
    img.className = 'toolbox-cat-img';
    iconHost.appendChild(img);
  });
}

/**
 * Schedule icon enhancement outside Blockly focus/flyout callbacks.
 * Intentionally avoids MutationObserver — DOM writes during flyout updates break dispose().
 */
export function scheduleToolboxIcons(toolboxRoot: HTMLElement): void {
  setTimeout(() => enhanceToolboxIcons(toolboxRoot), 0);
}

/** Resolve icon asset path from category BKY name. */
export function resolveCategoryIconPath(categoryName: string): string | undefined {
  const msgKey = extractCategoryMsgKey(categoryName);
  if (!msgKey) {
    return undefined;
  }
  const file = CATEGORY_ICON_FILES[msgKey];
  return file ? iconPathForFile(file) : undefined;
}
