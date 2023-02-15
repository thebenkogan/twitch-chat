import { useParams } from "@solidjs/router";
import {
  Component,
  createEffect,
  For,
  on,
  createSignal,
  Show,
  onMount,
  onCleanup,
} from "solid-js";
import ChatMessage from "./components/ChatMessage";
import ResumeScroll from "./components/ResumeScroll";
import { useMessages, startChat } from "./tmi";

const Chat: Component = () => {
  const { channel } = useParams<{ channel: string }>();
  const [shouldScroll, setShouldScroll] = createSignal(true);
  const messages = useMessages(shouldScroll);
  let bottom: HTMLDivElement;

  onMount(() => {
    const client = startChat(channel);
    onCleanup(() => {
      client.disconnect();
      client.removeAllListeners();
    });
  });

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

export default Chat;
