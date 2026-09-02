import { COMMANDS } from "@blossom-carousel/navigation";
import { connectNavigation, getForId } from "./navigation";

const HTMLElementBase: typeof HTMLElement =
  typeof HTMLElement === "undefined"
    ? (class {} as unknown as typeof HTMLElement)
    : HTMLElement;

export class BlossomPrev extends HTMLElementBase {
  private cleanup?: () => void;
  private button?: HTMLButtonElement;

  connectedCallback(): void {
    const forId = getForId(this);
    this.button = document.createElement("button");
    this.button.type = "button";
    this.button.setAttribute("command", COMMANDS.prev);
    this.button.setAttribute("commandfor", forId);
    this.button.setAttribute("aria-controls", forId);
    this.button.setAttribute("aria-label", "Previous slide");
    
    const content = this.childNodes.length > 0
      ? Array.from(this.childNodes)
      : [document.createTextNode("Previous")];
    
    this.button.replaceChildren(...content);
    this.replaceChildren(this.button);

    this.cleanup = connectNavigation(forId, (state) => {
      if (this.button) this.button.disabled = !state.canPrev;
    });
  }

  disconnectedCallback(): void {
    this.cleanup?.();
  }
}

if (
  typeof customElements !== "undefined" &&
  !customElements.get("blossom-prev")
) {
  customElements.define("blossom-prev", BlossomPrev);
}
