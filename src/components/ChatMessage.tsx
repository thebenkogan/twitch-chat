import { Component } from "solid-js";
import { Message } from "../tmi";

interface ChatMessageProps {
  cm: Message;
}

const ChatMessage: Component<ChatMessageProps> = (props) => {
  const userTextColor = props.cm.userColor;
  return (
    <div class="w-full p-3 text-lg hover:bg-zinc-600">
      <span style={{ color: userTextColor }} class="font-bold">
        {props.cm.user}
      </span>
      : <span class="text-gray-300">{props.cm.message}</span>
    </div>
  );
};

export default ChatMessage;
