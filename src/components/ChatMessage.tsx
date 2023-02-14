import { Component } from "solid-js";
import { Message } from "../tmi";

interface ChatMessageProps {
  cm: Message;
}

const ChatMessage: Component<ChatMessageProps> = (props) => {
  return (
    <div class="w-full my-2 p-3 text-lg hover:bg-zinc-600">
      <span class="font-bold text-black">{props.cm.user}</span>:{" "}
      <span class="text-gray-300">{props.cm.message}</span>
    </div>
  );
};

export default ChatMessage;
