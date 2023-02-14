import { Component, createEffect, For, on, createSignal, Show } from "solid-js";
import ChatMessage from "./components/ChatMessage";
import ResumeScroll from "./components/ResumeScroll";
import useMessages from "./tmi";

const App: Component = () => {
  const [shouldScroll, setShouldScroll] = createSignal(true);
  const messages = useMessages(shouldScroll);
  let bottom: HTMLDivElement;

  createEffect(on(messages, (v) => shouldScroll() && bottom.scrollIntoView()));

  return (
    <div onWheel={(e) => e.deltaY < 0 && setShouldScroll(false)}>
      <For each={messages()}>{(cm) => <ChatMessage cm={cm} />}</For>
      <Show when={!shouldScroll()}>
        <ResumeScroll onClick={() => setShouldScroll(true)} />
      </Show>
      <div ref={bottom!} class="h-0"></div>
    </div>
  );
};

export default App;
