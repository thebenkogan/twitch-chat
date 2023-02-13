import { Component, createEffect, For, on } from "solid-js";
import useMessages from "./tmi";

const App: Component = () => {
  const messages = useMessages();
  let bottom: HTMLDivElement;

  createEffect(on(messages, (v) => bottom.scrollIntoView()));

  return (
    <>
      <For each={messages()}>{(m) => <div class="p-3">{m.message}</div>}</For>
      <div ref={bottom!} class="h-0"></div>
    </>
  );
};

export default App;
