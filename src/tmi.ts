import { createSignal } from "solid-js";
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

function useMessages() {
  const [messages, setMessages] = createSignal<Message[]>([]);

  client.on("message", (channel, tags, message, self) => {
    setMessages((messages) => {
      const new_messages =
        messages.length >= MESSAGE_LIMIT ? messages.slice(1) : messages.slice();
      new_messages.push({ user: tags["display-name"]!, message });
      return new_messages;
    });
  });

  return messages;
}

export default useMessages;
