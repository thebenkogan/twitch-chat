import { Accessor, createEffect, createSignal, on } from "solid-js";
import tmi from "tmi.js";

const MESSAGE_LIMIT = 100;

const client = new tmi.Client({
  channels: ["KaiCenat"],
});

client.connect();

export type EmoteRange = {
  start: number;
  end: number;
};

export type Message = {
  user: string;
  userColor: string;
  message: string;
  emotes?: Record<string, EmoteRange[]>;
};

function getEmotes(
  rawEmotes: Record<string, string[]>
): Record<string, EmoteRange[]> {
  const emotes: Record<string, EmoteRange[]> = {};
  for (const [emoteId, ranges] of Object.entries(rawEmotes)) {
    emotes[emoteId] = ranges.map((range) => {
      const [start, end] = range.split("-");
      return { start: Number(start), end: Number(end) };
    });
  }
  return emotes;
}

function useMessages(getSync: Accessor<boolean>) {
  const [syncedMessages, setSyncedMessages] = createSignal<Message[]>([]);
  const [displayMessages, setDisplayMessages] = createSignal<Message[]>([]);

  // immediately sync display messages (don't wait for next message)
  createEffect(
    on(getSync, (gs) => gs && setDisplayMessages(syncedMessages()), {
      defer: true,
    })
  );

  client.on("message", (channel, tags, message, self) => {
    const new_messages =
      syncedMessages().length >= MESSAGE_LIMIT
        ? syncedMessages().slice(1)
        : syncedMessages().slice();
    new_messages.push({
      user: tags["display-name"]!,
      userColor: tags["color"] ?? "#000000",
      message,
      emotes: !!tags["emotes"] ? getEmotes(tags["emotes"]) : undefined,
    });
    setSyncedMessages(new_messages);
    if (getSync()) setDisplayMessages(new_messages);
  });

  return displayMessages;
}

export default useMessages;
