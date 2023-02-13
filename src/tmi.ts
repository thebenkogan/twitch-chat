import { createSignal } from "solid-js";
import tmi from "tmi.js";

const client = new tmi.Client({
  channels: ["KaiCenat"],
});

client.connect();

type Message = {
  user: string;
  message: string;
};

function useMessages() {
  const [messages, setMessages] = createSignal<Message[]>([]);

  client.on("message", (channel, tags, message, self) => {
    setMessages((messages) => [
      ...messages,
      { user: tags["display-name"]!, message },
    ]);
  });

  return messages;
}

export default useMessages;
