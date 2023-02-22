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
import { Client } from "tmi.js";
import ChatMessage from "./components/ChatMessage";
import Loading from "./components/Loading";
import ResumeScroll from "./components/ResumeScroll";
import { useMessages, startChat } from "./tmi";

const Chat: Component = () => {
  const { channel } = useParams<{ channel: string }>();
  const [shouldScroll, setShouldScroll] = createSignal(true);
  const [client, setClient] = createSignal<Client>();
  const messages = useMessages(shouldScroll);
  let bottom: HTMLDivElement;
  let prevClientY: number;

  onMount(async () => setClient(await startChat(channel)));

  onCleanup(() => {
    client()?.disconnect();
    client()?.removeAllListeners();
  });

  createEffect(on(messages, (v) => shouldScroll() && bottom?.scrollIntoView()));

  return (
    <Show when={!!client()} fallback={<Loading channel={channel} />}>
      <div
        onTouchStart={(e) => (prevClientY = e.touches[0].clientY)}
        onTouchMove={(e) =>
          Math.sign(e.touches[0].clientY - prevClientY) === 1 &&
          setShouldScroll(false)
        }
        onWheel={(e) => e.deltaY < 0 && setShouldScroll(false)}
      >
        <For each={messages()}>{(cm) => <ChatMessage cm={cm} />}</For>
        <Show when={!shouldScroll()}>
          <ResumeScroll onClick={() => setShouldScroll(true)} />
        </Show>
        <div ref={bottom!} class="h-0"></div>
      </div>
    </Show>
  );
};

export default Chat;
