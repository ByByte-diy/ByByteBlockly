/**
 * Toolbox category tree UX: expand chevrons and nested depth styling.
 */

const boundToolboxRoots = new WeakSet<HTMLElement>();

function isCollapsibleContainer(container: Element): boolean {
  return container.hasAttribute("aria-expanded");
}

/** Add chevrons and depth classes to toolbox category rows. */
export function enhanceToolboxCategories(root: ParentNode = document): void {
  root
    .querySelectorAll('.blocklyToolboxCategoryContainer[role="treeitem"]')
    .forEach((container) => {
      const row = container.querySelector(
        ".blocklyToolboxCategory"
      ) as HTMLElement | null;
      const rowContents = container.querySelector(
        ".blocklyTreeRowContentContainer"
      ) as HTMLElement | null;
      if (!row || !rowContents) {
        return;
      }

      const collapsible = isCollapsibleContainer(container);
      row.classList.toggle("toolbox-cat--collapsible", collapsible);

      if (collapsible) {
        let chevron = rowContents.querySelector(
          ".toolbox-cat-chevron"
        ) as HTMLElement | null;
        if (!chevron) {
          chevron = document.createElement("span");
          chevron.className = "toolbox-cat-chevron";
          chevron.setAttribute("aria-hidden", "true");
          rowContents.appendChild(chevron);
        }
        const expanded = container.getAttribute("aria-expanded") === "true";
        row.classList.toggle("toolbox-cat--expanded", expanded);
      } else {
        row.classList.remove("toolbox-cat--expanded");
        rowContents.querySelector(".toolbox-cat-chevron")?.remove();
      }

      const level = container.getAttribute("aria-level");
      if (level) {
        row.dataset.toolboxLevel = level;
        row.classList.toggle("toolbox-cat--nested", level !== "1");
      }
    });
}

export function scheduleToolboxCategories(toolboxRoot: HTMLElement): void {
  setTimeout(() => enhanceToolboxCategories(toolboxRoot), 0);

  if (!boundToolboxRoots.has(toolboxRoot)) {
    boundToolboxRoots.add(toolboxRoot);
    toolboxRoot.addEventListener("click", () => {
      setTimeout(() => enhanceToolboxCategories(toolboxRoot), 0);
    });
  }
}
