import {
  observeNavigationState,
  registerCommands,
  type NavigationState,
} from "@blossom-carousel/navigation";

export function connectNavigation(
  forId: string,
  onUpdate: (state: NavigationState) => void,
): () => void {
  if (!forId) return () => {};

  const scroller = document.getElementById(forId);
  if (!scroller) return () => {};

  const unregister = registerCommands(scroller);
  const unobserve = observeNavigationState(scroller, onUpdate);

  return () => {
    unregister();
    unobserve();
  };
}

export function getForId(element: HTMLElement): string {
  return element.getAttribute("for") ?? "";
}

function isAuthorContent(node: Node): boolean {
  if (node.nodeType === Node.ELEMENT_NODE) return true;
  return node.nodeType === Node.TEXT_NODE && Boolean(node.textContent?.trim());
}

/** Reuses a generated or author-provided button so reconnects stay idempotent. */
export function ensureNavButton(
  host: HTMLElement,
  fallbackLabel: string,
): HTMLButtonElement {
  const existing = host.querySelector(":scope > button");
  if (existing instanceof HTMLButtonElement) {
    return existing;
  }

  const button = document.createElement("button");
  button.type = "button";
  const content = Array.from(host.childNodes).filter(isAuthorContent);
  if (content.length > 0) {
    button.replaceChildren(...content);
  } else {
    button.textContent = fallbackLabel;
  }
  host.replaceChildren(button);
  return button;
}
