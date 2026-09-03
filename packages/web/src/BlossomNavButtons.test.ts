import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "./BlossomNext";
import "./BlossomPrev";

class StubResizeObserver {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}
(globalThis as { ResizeObserver?: unknown }).ResizeObserver ??=
  StubResizeObserver;

describe.each([
  { tag: "blossom-next", fallback: "Next" },
  { tag: "blossom-prev", fallback: "Previous" },
] as const)("$tag content", ({ tag, fallback }) => {
  let control: HTMLElement;

  beforeEach(() => {
    control = document.createElement(tag);
    control.setAttribute("for", "missing-carousel");
  });

  afterEach(() => {
    control.remove();
  });

  it("uses the default label when empty", () => {
    document.body.appendChild(control);

    const button = control.querySelector<HTMLButtonElement>(":scope > button");
    expect(control.querySelectorAll("button")).toHaveLength(1);
    expect(button?.textContent).toBe(fallback);
  });

  it("falls back to the default label for whitespace-only children", () => {
    control.append("  \n  ");
    document.body.appendChild(control);

    const button = control.querySelector<HTMLButtonElement>(":scope > button");
    expect(button?.textContent).toBe(fallback);
  });

  it("moves SVG children into the inner button", () => {
    control.innerHTML = `<svg data-icon></svg>`;
    document.body.appendChild(control);

    const button = control.querySelector<HTMLButtonElement>(":scope > button");
    expect(button?.querySelector("svg[data-icon]")).not.toBeNull();
    expect(control.querySelectorAll("button")).toHaveLength(1);
  });

  it("reuses the generated button on reconnect instead of nesting", () => {
    control.innerHTML = `<svg data-icon></svg>`;
    document.body.appendChild(control);

    const firstButton = control.querySelector<HTMLButtonElement>(":scope > button");
    expect(firstButton).not.toBeNull();

    control.remove();
    document.body.appendChild(control);

    expect(control.querySelectorAll("button")).toHaveLength(1);
    expect(control.querySelectorAll("button button")).toHaveLength(0);
    expect(control.querySelector(":scope > button")).toBe(firstButton);
    expect(firstButton?.querySelector("svg[data-icon]")).not.toBeNull();
  });
});
