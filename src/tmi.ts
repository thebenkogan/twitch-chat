import { Accessor, createSignal } from "solid-js";
import tmi from "tmi.js";

const MESSAGE_LIMIT = 100;

const client = new tmi.Client({
  channels: ["xQc"],
});

client.connect();

type Message = {
  user: string;
  message: string;
};

function useMessages(getSync: Accessor<boolean>) {
  const [syncedMessages, setSyncedMessages] = createSignal<Message[]>([]);
  const [displayMessages, setDisplayMessages] = createSignal<Message[]>([]);

  client.on("message", (channel, tags, message, self) => {
    const new_messages =
      syncedMessages().length >= MESSAGE_LIMIT
        ? syncedMessages().slice(1)
        : syncedMessages().slice();
    new_messages.push({ user: tags["display-name"]!, message });
    setSyncedMessages(new_messages);
    if (getSync()) setDisplayMessages(new_messages);
  });

  return displayMessages;
}

export default useMessages;