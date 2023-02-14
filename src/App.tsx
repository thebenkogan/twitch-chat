import { Component, createEffect, For, on, createSignal, Show } from "solid-js";
import useMessages from "./tmi";

const App: Component = () => {
  const [shouldScroll, setShouldScroll] = createSignal(true);
  const messages = useMessages(shouldScroll);
  let bottom: HTMLDivElement;

  createEffect(on(messages, (v) => shouldScroll() && bottom.scrollIntoView()));

  return (
    <div onWheel={(e) => e.deltaY < 0 && setShouldScroll(false)}>
      <For each={messages()}>{(m) => <div class="p-3">{m.message}</div>}</For>
      <Show when={!shouldScroll()}>
        <button
          onClick={() => setShouldScroll(true)}
          class="p-3 fixed bottom-0 left-1/2 -translate-x-1/2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-5 rounded"
        >
          Resume Scrolling
        </button>
      </Show>
      <div ref={bottom!} class="h-0"></div>
    </div>
  );
};

export default App;
