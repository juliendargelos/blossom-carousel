import { afterEach, describe, expect, it } from "vitest";
import { createApp, defineComponent, h, nextTick, ref, type App, type Ref } from "vue";
import { useNavigation, type NavigationState } from "./index";

const INITIAL: NavigationState = {
  activeIndex: -1,
  count: 0,
  canPrev: false,
  canNext: false,
};

function mountNavigation(
  forId: Parameters<typeof useNavigation>[0],
): { app: App; state: Ref<NavigationState> } {
  let state!: Ref<NavigationState>;
  const Root = defineComponent({
    setup() {
      state = useNavigation(forId);
      return () => h("div");
    },
  });

  const el = document.createElement("div");
  document.body.appendChild(el);
  const app = createApp(Root);
  app.mount(el);
  return { app, state };
}

describe("useNavigation public API", () => {
  const apps: App[] = [];

  afterEach(() => {
    for (const app of apps) app.unmount();
    apps.length = 0;
    document.body.replaceChildren();
  });

  it("is exported from the package entry", () => {
    expect(typeof useNavigation).toBe("function");
  });

  it("accepts a plain string id", async () => {
    const { app, state } = mountNavigation("missing-carousel");
    apps.push(app);
    await nextTick();

    expect(state.value).toEqual(INITIAL);
  });

  it("accepts undefined without wrapping a ref", async () => {
    const { app, state } = mountNavigation(undefined);
    apps.push(app);
    await nextTick();

    expect(state.value).toEqual(INITIAL);
  });

  it("reattaches when a ref id changes", async () => {
    const forId = ref<string | undefined>("first");
    const { app, state } = mountNavigation(forId);
    apps.push(app);
    await nextTick();

    expect(state.value).toEqual(INITIAL);

    forId.value = undefined;
    await nextTick();
    expect(state.value).toEqual(INITIAL);
  });
});
