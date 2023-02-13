import { Component, createEffect, For, on, createSignal } from "solid-js";
import useMessages from "./tmi";

const App: Component = () => {
  const [shouldScroll, setShouldScroll] = createSignal(true);
  const messages = useMessages(shouldScroll);
  let bottom: HTMLDivElement;

  createEffect(on(messages, (v) => shouldScroll() && bottom.scrollIntoView()));

  return (
    <div onWheel={(e) => setShouldScroll(e.deltaY > 0)}>
      <For each={messages()}>{(m) => <div class="p-3">{m.message}</div>}</For>
      <div ref={bottom!} class="h-0"></div>
    </div>
  );
};

export default App;
