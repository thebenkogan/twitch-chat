import { Component, JSX } from "solid-js";
import { Message, EmoteRange } from "../tmi";

const getEmoteLink = (emoteId: string) =>
  `https://static-cdn.jtvnw.net/emoticons/v1/${emoteId}/1.0`;

interface ChatMessageProps {
  cm: Message;
}

function generateEmoteMessage(
  message: string,
  emotes: Record<string, EmoteRange[]>
) {
  // get sorted list of emote ranges with associated ids
  let orderedEmotes = Object.entries(emotes)
    .flatMap(([id, rs]) => rs.map((r) => [id, r] as const))
    .sort(([, { start: s1 }], [, { start: s2 }]) => (s1 > s2 ? 1 : -1));

  const fragments: (string | JSX.Element)[] = [];

  // iterate through ordered emotes and extract emote/message fragments
  let offset = 0;
  let messageTrim = message;
  for (const [id, { start, end }] of orderedEmotes) {
    const fragment = messageTrim.substring(0, start - offset);
    fragments.push(fragment);
    fragments.push(<img class="inline" src={getEmoteLink(id)} />);
    messageTrim = messageTrim.substring(end - offset + 1);
    offset += fragment.length + (end - start) + 1;
  }
  fragments.push(messageTrim);

  return fragments;
}

const ChatMessage: Component<ChatMessageProps> = (props) => {
  const message = props.cm.emotes
    ? generateEmoteMessage(props.cm.message, props.cm.emotes!)
    : props.cm.message;

  const userTextColor = props.cm.userColor;
  return (
    <div class="w-full p-3 text-lg text-gray-300 hover:bg-zinc-600">
      <span style={{ color: userTextColor }} class="font-bold">
        {props.cm.user}
      </span>
      : {message}
    </div>
  );
};

export default ChatMessage;
